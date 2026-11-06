import type { Cita } from '@/models/Cita';
import { esMismoDia } from '@/utils/fechas';

export interface ResumenAgenda {
  total: number;
  pendientes: number; // Pendiente o Confirmada
  atendidas: number; // Completada o No asistió
  /** Avance del día de 0 a 1: atendidas entre las citas no canceladas. */
  avance: number;
}

/** Minutos que una cita sigue contando como "en curso" después de su hora. */
const MINUTOS_EN_CURSO = 30;

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

const porAtender = (cita: Cita) => cita.estado === 'Pendiente' || cita.estado === 'Confirmada';

export function calcularResumen(citas: Cita[]): ResumenAgenda {
  const vigentes = citas.filter((cita) => cita.estado !== 'Cancelada');
  const atendidas = vigentes.filter((cita) => cita.estado === 'Completada' || cita.estado === 'NoAsistio').length;
  return {
    total: citas.length,
    pendientes: citas.filter(porAtender).length,
    atendidas,
    avance: vigentes.length ? atendidas / vigentes.length : 0,
  };
}

/**
 * Siguiente paciente: la primera cita por atender que aún no termina
 * (empezó hace menos de 30 minutos o está por venir). Si todas ya pasaron, la más reciente por atender.
 */
export function siguienteCita(agenda: Cita[], ahora: Date): Cita | null {
  const limite = ahora.getTime() - MINUTOS_EN_CURSO * 60_000;
  const porAtenderHoy = agenda.filter(porAtender);
  return (
    porAtenderHoy.find((cita) => new Date(cita.fechaHora).getTime() >= limite) ??
    porAtenderHoy[porAtenderHoy.length - 1] ??
    null
  );
}

/** Índice de la primera cita vigente posterior a "ahora", donde se dibuja la marca de la hora actual. */
export function indiceAhora(agenda: Cita[], ahora: Date): number {
  const vigentes = agenda.filter((cita) => cita.estado !== 'Cancelada');
  const indice = vigentes.findIndex((cita) => new Date(cita.fechaHora).getTime() > ahora.getTime());
  return indice === -1 ? vigentes.length : indice;
}
