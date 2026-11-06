import { CLINICAS_RESPALDO } from '@/config/clinica';
import type { Clinica, Coordenadas, TipoClinica } from '@/models/Clinica';

/**
 * Hospitales y clínicas reales cerca de un punto (specs/features/F07-ubicar-clinica.md).
 * Se consultan en vivo en OpenStreetMap con la API pública Overpass, que no requiere clave.
 * Si ningún servidor responde, se usa la lista de respaldo de config/clinica.ts.
 */

export type OrigenClinicas = 'openstreetmap' | 'respaldo';

export interface ResultadoClinicas {
  clinicas: Clinica[];
  origen: OrigenClinicas;
}

/** Servidores públicos de Overpass; si el primero está saturado se prueba el siguiente. */
const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const TIEMPO_LIMITE_MS = 12_000;
const MAXIMO_RESULTADOS = 60;

interface ElementoOsm {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export function armarConsulta({ latitude, longitude }: Coordenadas, radio: number): string {
  const zona = `(around:${Math.round(radio)},${latitude.toFixed(5)},${longitude.toFixed(5)})`;
  return (
    `[out:json][timeout:20];(` +
    `nwr["amenity"~"^(hospital|clinic|doctors)$"]["name"]${zona};` +
    `nwr["healthcare"~"^(hospital|clinic|centre)$"]["name"]${zona};` +
    `);out center tags;`
  );
}

// Elementos de OSM que comparten etiqueta de hospital pero no son un lugar de atención
const EXCLUIR = /estacionamiento|parking|farmacia/i;

/** Convierte la respuesta de Overpass en clínicas, sin duplicados ni elementos sin coordenadas. */
export function convertirElementos(elementos: ElementoOsm[]): Clinica[] {
  const vistos = new Set<string>();
  const clinicas: Clinica[] = [];

  for (const elemento of elementos) {
    const tags = elemento.tags ?? {};
    const nombre = (tags['name:es'] ?? tags.name ?? '').trim();
    const latitude = elemento.lat ?? elemento.center?.lat;
    const longitude = elemento.lon ?? elemento.center?.lon;
    if (!nombre || latitude === undefined || longitude === undefined || EXCLUIR.test(nombre)) continue;

    const clave = nombre.toLowerCase();
    if (vistos.has(clave)) continue;
    vistos.add(clave);

    const esHospital = tags.amenity === 'hospital' || tags.healthcare === 'hospital';
    const tipo: TipoClinica = esHospital ? 'hospital' : 'clinica';
    const calle = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');
    const direccion = [calle, tags['addr:suburb'], tags['addr:city']].filter(Boolean).join(', ');

    clinicas.push({
      id: `osm-${elemento.type}-${elemento.id}`,
      nombre,
      tipo,
      direccion: direccion || undefined,
      telefono: tags.phone ?? tags['contact:phone'] ?? undefined,
      urgencias: tags.emergency === 'yes',
      coordenadas: { latitude, longitude },
    });
  }
  return clinicas;
}

async function consultar(servidor: string, consulta: string): Promise<ElementoOsm[]> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS);
  try {
    const respuesta = await fetch(servidor, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: `data=${encodeURIComponent(consulta)}`,
      signal: control.signal,
    });
    if (!respuesta.ok) throw new Error(`Overpass respondió ${respuesta.status}`);
    const cuerpo = (await respuesta.json()) as { elements?: ElementoOsm[] };
    return cuerpo.elements ?? [];
  } finally {
    clearTimeout(temporizador);
  }
}

// Overpass permite pocas consultas por minuto desde el mismo teléfono: se reutiliza el último resultado
const VIGENCIA_CACHE_MS = 10 * 60_000;
let cache: { clave: string; momento: number; resultado: ResultadoClinicas } | null = null;

export async function buscarCercanas(centro: Coordenadas, radio: number): Promise<ResultadoClinicas> {
  // Cerca de 1 km de precisión: moverse unas calles no repite la consulta
  const clave = `${centro.latitude.toFixed(2)},${centro.longitude.toFixed(2)},${radio}`;
  if (cache && cache.clave === clave && Date.now() - cache.momento < VIGENCIA_CACHE_MS) return cache.resultado;

  const consulta = armarConsulta(centro, radio);
  for (const servidor of SERVIDORES) {
    try {
      const elementos = await consultar(servidor, consulta);
      const resultado: ResultadoClinicas = {
        clinicas: convertirElementos(elementos).slice(0, MAXIMO_RESULTADOS),
        origen: 'openstreetmap',
      };
      cache = { clave, momento: Date.now(), resultado };
      return resultado;
    } catch {
      // Se intenta con el siguiente servidor
    }
  }
  return { clinicas: CLINICAS_RESPALDO, origen: 'respaldo' };
}
