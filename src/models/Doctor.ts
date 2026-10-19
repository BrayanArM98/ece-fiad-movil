/**
 * Doctor, con la misma forma que devuelve la API (specs/02-data-model.md).
 */
export interface Doctor {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  horarioAtencion: string;
  idEspecialidad: number;
  nombreEspecialidad: string;
}
