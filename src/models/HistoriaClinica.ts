/**
 * Historia clínica de un paciente (specs/02-data-model.md).
 */
export interface HistoriaClinica {
  id: number;
  idPaciente: number;
  nombrePaciente: string;
  fechaApertura: string; // ISO 8601
  alergias: string;
  antecedentesFamiliares: string;
  antecedentesPersonales: string;
  activo: boolean;
}
