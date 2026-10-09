/**
 * Sesión del usuario en el teléfono.
 * Ver specs/02-data-model.md y specs/features/F01-inicio-sesion-biometria.md.
 */
export type Rol = 'medico' | 'paciente';

export interface Sesion {
  nombre: string;
  rol: Rol;
  idDoctor?: number; // cuando rol = medico
  idPaciente?: number; // cuando rol = paciente
  biometriaActiva: boolean;
}
