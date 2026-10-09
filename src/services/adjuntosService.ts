import { Directory, File, Paths } from 'expo-file-system';

import type { Adjunto } from '@/models/Adjunto';

/**
 * Almacén de fotografías en el teléfono (specs/features/F05-fotografia-evolucion.md, "Decisiones").
 * Las imágenes se copian a la carpeta de documentos de la app y un índice JSON
 * relaciona cada imagen con su evolución. Subirlas al servidor queda como trabajo futuro.
 */
const NOMBRE_CARPETA = 'adjuntos';

function carpeta(): Directory {
  const directorio = new Directory(Paths.document, NOMBRE_CARPETA);
  if (!directorio.exists) directorio.create({ intermediates: true });
  return directorio;
}

function archivoIndice(): File {
  return new File(carpeta(), 'indice.json');
}

function leerIndice(): Adjunto[] {
  const indice = archivoIndice();
  if (!indice.exists) return [];
  try {
    return JSON.parse(indice.textSync()) as Adjunto[];
  } catch {
    return [];
  }
}

function escribirIndice(adjuntos: Adjunto[]): void {
  const indice = archivoIndice();
  if (!indice.exists) indice.create();
  indice.write(JSON.stringify(adjuntos));
}

/** Copia las fotos temporales de la cámara a la carpeta de la app y las asocia a la evolución. */
export async function guardar(idEvolucion: number, urisTemporales: string[]): Promise<Adjunto[]> {
  const destino = carpeta();
  const fechaCaptura = new Date().toISOString();

  const nuevos: Adjunto[] = [];
  for (const [indice, uri] of urisTemporales.entries()) {
    const id = `${idEvolucion}-${Date.now()}-${indice}`;
    const copia = new File(destino, `${id}.jpg`);
    await new File(uri).copy(copia);
    nuevos.push({ id, idEvolucion, uri: copia.uri, fechaCaptura });
  }

  escribirIndice([...leerIndice(), ...nuevos]);
  return nuevos;
}

/** Devuelve las fotos agrupadas por evolución. */
export function listarPorEvoluciones(idsEvolucion: number[]): Record<number, Adjunto[]> {
  const ids = new Set(idsEvolucion);
  const agrupados: Record<number, Adjunto[]> = {};
  for (const adjunto of leerIndice()) {
    if (!ids.has(adjunto.idEvolucion)) continue;
    (agrupados[adjunto.idEvolucion] ??= []).push(adjunto);
  }
  return agrupados;
}
