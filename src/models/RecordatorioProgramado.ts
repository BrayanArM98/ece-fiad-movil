/**
 * Recordatorio de cita programado en el teléfono (specs/02-data-model.md).
 * Se guarda para no programar dos avisos iguales para la misma cita.
 */
export type TipoRecordatorio = 'diaAntes' | 'horaAntes';

export interface RecordatorioProgramado {
  idCita: number;
  tipo: TipoRecordatorio;
  idNotificacion: string; // identificador que devuelve el sistema de notificaciones
  fechaAviso: string; // ISO 8601
}
