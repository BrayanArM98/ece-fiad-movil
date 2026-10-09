/**
 * Fotografía asociada a una evolución (specs/02-data-model.md).
 * La API todavía no recibe imágenes, así que vive en el teléfono.
 */
export interface Adjunto {
  id: string; // generado en el teléfono
  idEvolucion: number;
  uri: string; // ruta local de la imagen
  fechaCaptura: string; // ISO 8601
}
