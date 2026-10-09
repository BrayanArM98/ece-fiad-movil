/**
 * Envoltura con la que responde la API del expediente clínico.
 * Ver specs/02-data-model.md.
 */
export interface Respuesta<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T | null;
}
