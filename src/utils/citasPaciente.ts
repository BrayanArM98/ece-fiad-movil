import type { Cita } from '@/models/Cita';
import { esMismoDia } from '@/utils/fechas';

/**
 * Reglas de Mis citas (specs/features/F06-mis-citas-recordatorios.md):
 * solo citas del paciente, de hoy en adelante y no canceladas, de la más próxima a la más lejana.
 */
export function prepararCitasPaciente(citas: Cita[], idPaciente: number, ahora: Date): Cita[] {
  const inicioDeHoy = new Date(ahora);
  inicioDeHoy.setHours(0, 0, 0, 0);

  return citas
    .filter(
      (cita) =>
        cita.idPaciente === idPaciente &&
        cita.estado !== 'Cancelada' &&
        new Date(cita.fechaHora).getTime() >= inicioDeHoy.getTime()
    )
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
}

/** "Hoy", "Mañana" o null para otras fechas. */
export function etiquetaDia(fecha: Date, ahora: Date): string | null {
  if (esMismoDia(fecha, ahora)) return 'Hoy';
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);
  if (esMismoDia(fecha, manana)) return 'Mañana';
  return null;
}
