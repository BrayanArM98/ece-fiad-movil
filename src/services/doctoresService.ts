import { usarApi } from '@/config/api';
import { comprobarRed } from '@/config/simulacion';
import type { Doctor } from '@/models/Doctor';
import type { Respuesta } from '@/models/Respuesta';
import { pedir } from '@/services/http';
import { DOCTORES_EJEMPLO } from '@/services/mocks/doctoresMock';

/**
 * Servicio de doctores: GET /api/Doctores (specs/03-api.md).
 * Sin API configurada devuelve datos de ejemplo con la misma forma.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerTodos(): Promise<Respuesta<Doctor[]>> {
  comprobarRed();
  if (usarApi) return pedir<Doctor[]>('/api/Doctores');

  await esperar(300);
  return { exitoso: true, mensaje: 'Operación exitosa', datos: DOCTORES_EJEMPLO };
}
