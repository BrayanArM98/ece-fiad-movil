/**
 * Paciente, con la misma forma que devuelve la API (specs/02-data-model.md).
 * grupoSanguineo llega con el nombre del enum de la API, por ejemplo "OPositivo".
 */
export type GrupoSanguineo =
  | 'APositivo'
  | 'ANegativo'
  | 'BPositivo'
  | 'BNegativo'
  | 'ABPositivo'
  | 'ABNegativo'
  | 'OPositivo'
  | 'ONegativo';

export type Genero = 'Masculino' | 'Femenino' | 'Otro' | 'PrefieroNoDecir';

export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono?: string;
  email: string;
  fechaNacimiento: string; // ISO 8601
  genero: Genero;
  grupoSanguineo: GrupoSanguineo;
  direccion?: string;
  activo: boolean;
}
