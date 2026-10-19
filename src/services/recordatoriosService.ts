import type { Cita } from '@/models/Cita';
import type { RecordatorioProgramado } from '@/models/RecordatorioProgramado';
import { cancelar, cancelarTodas, programar } from '@/services/notificacionesService';
import { escribirJson, leerJson } from '@/utils/almacenJson';
import { calcularAvisos } from '@/utils/recordatorios';

/**
 * Reglas de los recordatorios (specs/features/F06-mis-citas-recordatorios.md):
 * - dos avisos por cita: un día antes y una hora antes;
 * - nunca se programa un aviso cuya fecha ya pasó;
 * - una cita nunca tiene avisos duplicados;
 * - si una cita se cancela o cambia de hora, sus avisos anteriores se eliminan.
 */
const ARCHIVO = 'recordatorios';

const mismaClave = (a: { idCita: number; tipo: string }, b: { idCita: number; tipo: string }) =>
  a.idCita === b.idCita && a.tipo === b.tipo;

/** Deja programados exactamente los avisos que corresponden a las citas vigentes. */
export async function sincronizar(citasVigentes: Cita[], ahora: Date = new Date()): Promise<RecordatorioProgramado[]> {
  const guardados = leerJson<RecordatorioProgramado[]>(ARCHIVO, []);
  const deseados = citasVigentes.flatMap((cita) => calcularAvisos(cita, ahora));

  const resultado: RecordatorioProgramado[] = [];

  // 1. Conservar los que siguen siendo correctos; cancelar los demás (cita cancelada, otra hora o aviso pasado)
  for (const guardado of guardados) {
    const sigueVigente = deseados.some(
      (aviso) => mismaClave(aviso, guardado) && aviso.fecha.toISOString() === guardado.fechaAviso
    );
    if (sigueVigente) {
      resultado.push(guardado);
    } else {
      await cancelar(guardado.idNotificacion).catch(() => {});
    }
  }

  // 2. Programar los que faltan
  for (const aviso of deseados) {
    if (resultado.some((r) => mismaClave(r, aviso))) continue;
    const idNotificacion = await programar(aviso.titulo, aviso.cuerpo, aviso.fecha);
    resultado.push({ idCita: aviso.idCita, tipo: aviso.tipo, idNotificacion, fechaAviso: aviso.fecha.toISOString() });
  }

  escribirJson(ARCHIVO, resultado);
  return resultado;
}

/** Al cerrar sesión se eliminan todos los recordatorios. */
export async function cancelarTodos(): Promise<void> {
  await cancelarTodas();
  escribirJson<RecordatorioProgramado[]>(ARCHIVO, []);
}
