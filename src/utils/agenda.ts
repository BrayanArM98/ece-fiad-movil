import type { Cita } from '@/models/Cita';
import { esMismoDia } from '@/utils/fechas';

export interface ResumenAgenda {
  total: number;
  pendientes: number; // Pendiente o Confirmada
}

/**
 * Reglas de la agenda (specs/features/F02-agenda-del-dia.md):
 * - solo citas del médico de la sesión;
 * - solo citas de hoy, en la zona horaria del teléfono;
 * - ordenadas por hora, con las canceladas al final.
 */
export function prepararAgenda(citas: Cita[], idDoctor: number, hoy: Date): Cita[] {
  const delDia = citas.filter(
    (cita) => cita.idDoctor === idDoctor && esMismoDia(new Date(cita.fechaHora), hoy)
  );

  const porHora = (a: Cita, b: Cita) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();

  const vigentes = delDia.filter((cita) => cita.estado !== 'Cancelada').sort(porHora);
  const canceladas = delDia.filter((cita) => cita.estado === 'Cancelada').sort(porHora);

  return [...vigentes, ...canceladas];
}

export function calcularResumen(citas: Cita[]): ResumenAgenda {
  return {
    total: citas.length,
    pendientes: citas.filter((cita) => cita.estado === 'Pendiente' || cita.estado === 'Confirmada').length,
  };
}
