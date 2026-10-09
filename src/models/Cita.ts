/**
 * Cita médica, con la misma forma que devuelve la API (specs/02-data-model.md).
 */
export type EstadoCita = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada' | 'NoAsistio';

export interface Cita {
  id: number;
  idPaciente: number;
  idDoctor: number;
  nombrePaciente: string;
  nombreDoctor: string;
  fechaHora: string; // ISO 8601
  motivo: string;
  notas: string;
  estado: EstadoCita;
  estadoTexto: string;
  activo: boolean;
}
