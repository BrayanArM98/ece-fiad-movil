import { API_URL } from '@/config/api';
import type { Respuesta } from '@/models/Respuesta';

/**
 * Cliente HTTP de la app (specs/03-api.md, "Reglas del cliente HTTP").
 * Todas las peticiones a la API pasan por aquí: agrega el token de la sesión,
 * aplica el tiempo límite y avisa cuando la API rechaza el token (401).
 */

/**
 * La API gratuita de Azure se duerme tras 20 minutos sin uso; al despertar, la API y la base de datos
 * pueden tardar alrededor de un minuto en responder la primera petición. Por eso el límite es amplio.
 */
export const TIEMPO_LIMITE_MS = 90_000;

export const MENSAJE_SIN_CONEXION = 'No se pudo conectar con el servidor. Revisa tu conexión a Internet.';
export const MENSAJE_TIEMPO_AGOTADO = 'El servidor tardó demasiado en responder. Intenta de nuevo en unos segundos.';

let tokenActual = '';
let alRechazarToken: (() => void) | null = null;

/** Lo llama SesionContext al abrir o cerrar la sesión. */
export function establecerToken(token: string): void {
  tokenActual = token;
}

/** SesionContext registra aquí cómo cerrar la sesión si el token ya no es válido. */
export function alExpirarToken(accion: (() => void) | null): void {
  alRechazarToken = accion;
}

// La API devuelve hasta 7 decimales en los segundos; el teléfono solo interpreta 3
const FECHA_CON_FRACCION_LARGA = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\d+/;

export function leerJson(texto: string): unknown {
  return JSON.parse(texto, (_clave, valor) =>
    typeof valor === 'string' ? valor.replace(FECHA_CON_FRACCION_LARGA, '$1') : valor
  );
}

function esRespuesta(valor: unknown): valor is Respuesta<unknown> {
  return typeof valor === 'object' && valor !== null && typeof (valor as Respuesta<unknown>).exitoso === 'boolean';
}

const MENSAJES_POR_CODIGO: Record<number, string> = {
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'Tu cuenta no tiene permiso para ver esta información.',
  429: 'Demasiados intentos. Espera un minuto e intenta de nuevo.',
};

/** Convierte el cuerpo y el código HTTP en la envoltura Respuesta<T> que usan los servicios. */
export function interpretarRespuesta<T>(estado: number, texto: string): Respuesta<T> {
  let cuerpo: unknown = null;
  try {
    cuerpo = texto ? leerJson(texto) : null;
  } catch {
    // Cuerpo que no es JSON: se trata como error del servidor
  }

  if (esRespuesta(cuerpo)) {
    return {
      exitoso: cuerpo.exitoso,
      mensaje: cuerpo.mensaje ?? '',
      datos: (cuerpo.datos ?? null) as T | null,
      codigo: estado,
    };
  }

  return {
    exitoso: false,
    mensaje:
      MENSAJES_POR_CODIGO[estado] ?? `El servidor no pudo atender la solicitud (error ${estado}). Intenta más tarde.`,
    datos: null,
    codigo: estado,
  };
}

interface Opciones {
  metodo?: 'GET' | 'POST' | 'PATCH';
  cuerpo?: unknown;
  /** Filtros que se agregan a la ruta como ?clave=valor. Los vacíos se omiten. */
  consulta?: Record<string, string | number | undefined>;
  /** El inicio de sesión no lleva token ni cierra la sesión con un 401. */
  sinToken?: boolean;
}

function armarRuta(ruta: string, consulta?: Opciones['consulta']): string {
  if (!consulta) return ruta;
  const partes = Object.entries(consulta)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([clave, valor]) => `${encodeURIComponent(clave)}=${encodeURIComponent(String(valor))}`);
  return partes.length ? `${ruta}?${partes.join('&')}` : ruta;
}

/**
 * Hace la petición y devuelve la envoltura de la API.
 * Lanza un error si no hay conexión o se agota el tiempo límite, igual que un servicio sin Internet.
 */
export async function pedir<T>(
  ruta: string,
  { metodo = 'GET', cuerpo, consulta, sinToken }: Opciones = {}
): Promise<Respuesta<T>> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS);

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${armarRuta(ruta, consulta)}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(!sinToken && tokenActual ? { Authorization: `Bearer ${tokenActual}` } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: control.signal,
    });
  } catch (error) {
    const agotado = control.signal.aborted || (error instanceof Error && error.name === 'AbortError');
    throw new Error(agotado ? MENSAJE_TIEMPO_AGOTADO : MENSAJE_SIN_CONEXION);
  } finally {
    clearTimeout(temporizador);
  }

  const resultado = interpretarRespuesta<T>(respuesta.status, await respuesta.text());

  // Token vencido o revocado: se cierra la sesión y la app regresa a Login
  if (respuesta.status === 401 && !sinToken && tokenActual) {
    alRechazarToken?.();
  }
  return resultado;
}

/**
 * Despierta la API sin esperar la respuesta. Login lo llama al abrirse para que el servidor
 * de Azure ya esté listo cuando el usuario termine de escribir su contraseña.
 */
export function despertarServidor(): void {
  if (!API_URL) return;
  fetch(`${API_URL}/salud`, { headers: { Accept: 'application/json' } }).catch(() => {});
}
