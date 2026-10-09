import type { GrupoSanguineo, Paciente } from '@/models/Paciente';

const TEXTO_GRUPO_SANGUINEO: Record<GrupoSanguineo, string> = {
  APositivo: 'A+',
  ANegativo: 'A-',
  BPositivo: 'B+',
  BNegativo: 'B-',
  ABPositivo: 'AB+',
  ABNegativo: 'AB-',
  OPositivo: 'O+',
  ONegativo: 'O-',
};

/** Convierte el valor de la API ("OPositivo") al texto clínico ("O+"). */
export function textoGrupoSanguineo(grupo: GrupoSanguineo): string {
  return TEXTO_GRUPO_SANGUINEO[grupo];
}

export function nombreCompleto(paciente: Pick<Paciente, 'nombres' | 'apellidos'>): string {
  return `${paciente.nombres} ${paciente.apellidos}`;
}

/** Edad en años cumplidos a la fecha indicada (F03, validaciones). */
export function calcularEdad(fechaNacimiento: string, hoy: Date = new Date()): number {
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad -= 1;
  return edad;
}

/** Orden alfabético por apellido y luego por nombre, respetando acentos (F03). */
export function ordenarPorApellido(pacientes: Paciente[]): Paciente[] {
  return [...pacientes].sort(
    (a, b) =>
      a.apellidos.localeCompare(b.apellidos, 'es', { sensitivity: 'base' }) ||
      a.nombres.localeCompare(b.nombres, 'es', { sensitivity: 'base' })
  );
}
