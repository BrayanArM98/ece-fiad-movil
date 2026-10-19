import { comprobarRed } from '@/config/simulacion';
import type { Doctor } from '@/models/Doctor';
import type { Respuesta } from '@/models/Respuesta';
import { DOCTORES_EJEMPLO } from '@/services/mocks/doctoresMock';

/**
 * Servicio de doctores. Devuelve datos de ejemplo con la forma de GET /api/Doctores.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerTodos(): Promise<Respuesta<Doctor[]>> {
  await esperar(300);
  comprobarRed();
  return { exitoso: true, mensaje: 'Operación exitosa', datos: DOCTORES_EJEMPLO };
}
