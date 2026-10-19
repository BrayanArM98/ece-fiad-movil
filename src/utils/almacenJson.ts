import { Directory, File, Paths } from 'expo-file-system';

/**
 * Guarda y lee datos pequeños de la app como archivos JSON en el teléfono.
 */
function archivo(nombre: string): File {
  const carpeta = new Directory(Paths.document, 'datos');
  if (!carpeta.exists) carpeta.create({ intermediates: true });
  return new File(carpeta, `${nombre}.json`);
}

export function leerJson<T>(nombre: string, valorInicial: T): T {
  const destino = archivo(nombre);
  if (!destino.exists) return valorInicial;
  try {
    return JSON.parse(destino.textSync()) as T;
  } catch {
    return valorInicial;
  }
}

export function escribirJson<T>(nombre: string, valor: T): void {
  const destino = archivo(nombre);
  if (!destino.exists) destino.create();
  destino.write(JSON.stringify(valor));
}
