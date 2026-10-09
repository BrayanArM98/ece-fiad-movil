import type { Cita } from '@/models/Cita';
import type { Respuesta } from '@/models/Respuesta';
import { obtenerCitasDeEjemplo } from '@/services/mocks/citasMock';

/**
 * Servicio de citas.
 * Mientras se conecta la API devuelve datos de ejemplo con la forma de GET /api/Citas.
 * La API no filtra por médico ni fecha (specs/02-data-model.md), así que devuelve todas.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerTodas(): Promise<Respuesta<Cita[]>> {
  // Simula la latencia de una llamada a la API
  await esperar(600);
  return { exitoso: true, mensaje: 'Operación exitosa', datos: obtenerCitasDeEjemplo() };
}

export async function obtenerPorId(id: number): Promise<Respuesta<Cita>> {
  await esperar(300);
  const cita = obtenerCitasDeEjemplo().find((c) => c.id === id);
  if (!cita) {
    return { exitoso: false, mensaje: 'Cita no encontrada.', datos: null };
  }
  return { exitoso: true, mensaje: 'Operación exitosa', datos: cita };
}
