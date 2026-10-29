import { usarApi } from '@/config/api';
import { comprobarRed, simulacion } from '@/config/simulacion';
import type { Cita } from '@/models/Cita';
import type { Respuesta } from '@/models/Respuesta';
import { pedir } from '@/services/http';
import { obtenerCitasDeEjemplo } from '@/services/mocks/citasMock';

/**
 * Servicio de citas: GET /api/Citas y GET /api/Citas/{id} (specs/03-api.md).
 * Sin API configurada devuelve datos de ejemplo con la misma forma.
 * La API no filtra por médico ni fecha (specs/02-data-model.md), así que devuelve todas.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerTodas(): Promise<Respuesta<Cita[]>> {
  comprobarRed();

  if (usarApi) {
    const respuesta = await pedir<Cita[]>('/api/Citas');
    return __DEV__ && simulacion.sinCitas && respuesta.exitoso ? { ...respuesta, datos: [] } : respuesta;
  }

  // Simula la latencia de una llamada a la API
  await esperar(600);
  const citas = __DEV__ && simulacion.sinCitas ? [] : obtenerCitasDeEjemplo();
  return { exitoso: true, mensaje: 'Operación exitosa', datos: citas };
}

export async function obtenerPorId(id: number): Promise<Respuesta<Cita>> {
  comprobarRed();
  if (usarApi) return pedir<Cita>(`/api/Citas/${id}`);

  await esperar(300);
  const cita = obtenerCitasDeEjemplo().find((c) => c.id === id);
  if (!cita) {
    return { exitoso: false, mensaje: 'Cita no encontrada.', datos: null };
  }
  return { exitoso: true, mensaje: 'Operación exitosa', datos: cita };
}
