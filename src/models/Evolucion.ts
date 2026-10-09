/**
 * Evolución registrada en una consulta (specs/02-data-model.md).
 */
export interface Evolucion {
  id: number;
  idHistoriaClinica: number;
  idDoctor: number;
  nombrePaciente: string;
  nombreDoctor: string;
  nombreEspecialidad: string;
  fecha: string; // ISO 8601
  diagnostico: string;
  tratamiento: string;
  notas: string;
  activo: boolean;
}
