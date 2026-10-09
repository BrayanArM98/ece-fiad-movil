/**
 * Datos para registrar una evolución: misma forma que CrearEvolucionDTO de la API.
 */
export interface CrearEvolucion {
  idHistoriaClinica: number;
  idDoctor: number;
  fecha: string; // ISO 8601
  diagnostico: string;
  tratamiento: string;
  notas: string;
}
