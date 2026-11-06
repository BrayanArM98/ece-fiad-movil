import { usarApi } from '@/config/api';
import { comprobarRed, simulacion } from '@/config/simulacion';
import type { Cita, EstadoCita } from '@/models/Cita';
import type { Respuesta } from '@/models/Respuesta';
import { pedir } from '@/services/http';
import { obtenerCitasDeEjemplo } from '@/services/mocks/citasMock';
import { aFechaLocalIso } from '@/utils/fechas';

/**
 * Servicio de citas (specs/03-api.md):
 * GET /api/Citas, GET /api/Citas/{id} y PATCH /api/Citas/{id}/estado.
 * La API ya entrega solo las citas del médico o del paciente dueño del token;
 * los filtros de fecha reducen lo que viaja por la red.
 * Sin API configurada devuelve datos de ejemplo con la misma forma.
 */

export interface FiltroCitas {
  /** Desde el inicio de este día. */
  desde?: Date;
  /** Hasta el final de este día (la API incluye todo el día). */
  hasta?: Date;
}

/** Resultados que el médico puede registrar desde la app. */
export type ResultadoCita = Extract<EstadoCita, 'Confirmada' | 'Completada' | 'NoAsistio'>;

const TEXTO_ESTADO: Record<EstadoCita, string> = {
  Pendiente: 'Pendiente',
  Confirmada: 'Confirmada',
  Cancelada: 'Cancelada',
  Completada: 'Completada',
  NoAsistio: 'No asistió',
};

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

function inicioDelDia(fecha: Date): string {
  const dia = new Date(fecha);
  dia.setHours(0, 0, 0, 0);
  return aFechaLocalIso(dia).slice(0, 10);
}

// Estados registrados en el modo demostración: se conservan mientras la app está abierta
const estadosDeEjemplo = new Map<number, EstadoCita>();

function citasDeEjemplo(): Cita[] {
  return obtenerCitasDeEjemplo().map((cita) => {
    const estado = estadosDeEjemplo.get(cita.id);
    return estado ? { ...cita, estado, estadoTexto: TEXTO_ESTADO[estado] } : cita;
  });
}

export async function obtenerTodas(filtro: FiltroCitas = {}): Promise<Respuesta<Cita[]>> {
  comprobarRed();
  if (usarApi) {
    const respuesta = await pedir<Cita[]>('/api/Citas', {
      consulta: {
        desde: filtro.desde ? inicioDelDia(filtro.desde) : undefined,
        hasta: filtro.hasta ? inicioDelDia(filtro.hasta) : undefined,
      },
    });
    return __DEV__ && simulacion.sinCitas && respuesta.exitoso ? { ...respuesta, datos: [] } : respuesta;
  }

  // Simula la latencia de una llamada a la API
  await esperar(600);
  const citas = __DEV__ && simulacion.sinCitas ? [] : citasDeEjemplo();
  return { exitoso: true, mensaje: 'Operación exitosa', datos: citas };
}

export async function obtenerPorId(id: number): Promise<Respuesta<Cita>> {
  comprobarRed();
  if (usarApi) return pedir<Cita>(`/api/Citas/${id}`);

  await esperar(300);
  const cita = citasDeEjemplo().find((c) => c.id === id);
  if (!cita) {
    return { exitoso: false, mensaje: 'Cita no encontrada.', datos: null };
  }
  return { exitoso: true, mensaje: 'Operación exitosa', datos: cita };
}

/** El médico registra el resultado de una de sus citas. */
export async function cambiarEstado(id: number, estado: ResultadoCita): Promise<Respuesta<Cita>> {
  comprobarRed();
  if (usarApi) return pedir<Cita>(`/api/Citas/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } });

  await esperar(500);
  const cita = citasDeEjemplo().find((c) => c.id === id);
  if (!cita) return { exitoso: false, mensaje: 'Cita no encontrada.', datos: null };
  if (cita.estado === 'Cancelada') {
    return { exitoso: false, mensaje: 'No se puede cambiar el estado de una cita cancelada.', datos: null };
  }
  estadosDeEjemplo.set(id, estado);
  return {
    exitoso: true,
    mensaje: 'Estado de la cita actualizado.',
    datos: { ...cita, estado, estadoTexto: TEXTO_ESTADO[estado] },
  };
}
