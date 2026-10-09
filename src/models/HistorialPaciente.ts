import type { Evolucion } from '@/models/Evolucion';
import type { HistoriaClinica } from '@/models/HistoriaClinica';

/**
 * Respuesta de GET /api/historial/paciente/{idPaciente} (specs/02-data-model.md).
 */
export interface HistorialPaciente {
  tieneHistoria: boolean;
  historia: HistoriaClinica | null;
  evoluciones: Evolucion[]; // de la más reciente a la más antigua
  totalEvoluciones: number;
}
