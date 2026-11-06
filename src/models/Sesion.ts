/**
 * Sesión del usuario en el teléfono.
 * Ver specs/02-data-model.md y specs/features/F01-inicio-sesion-biometria.md.
 */
export type Rol = 'medico' | 'paciente';

export interface Sesion {
  nombre: string;
  correo: string;
  rol: Rol;
  idDoctor?: number; // cuando rol = medico
  idPaciente?: number; // cuando rol = paciente
  /** Token de acceso que devuelve POST /api/Auth/login. Vacío con los datos de ejemplo. */
  token: string;
  /** Fecha de expiración del token (UTC, ISO 8601). */
  expiraUtc: string;
  biometriaActiva: boolean;
}

/** El token ya venció (o vence en menos de un minuto). */
export function sesionExpirada(sesion: Pick<Sesion, 'expiraUtc'>, ahora: Date = new Date()): boolean {
  const expira = new Date(sesion.expiraUtc).getTime();
  return Number.isNaN(expira) || expira - ahora.getTime() < 60_000;
}
