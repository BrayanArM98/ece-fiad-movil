import { usarApi } from '@/config/api';
import { comprobarRed } from '@/config/simulacion';
import type { Paciente } from '@/models/Paciente';
import type { Respuesta } from '@/models/Respuesta';
import { pedir } from '@/services/http';
import { PACIENTES_EJEMPLO } from '@/services/mocks/pacientesMock';

/**
 * Servicio de pacientes.
 * GET /api/Pacientes/activos y GET /api/Pacientes/{id} (specs/03-api.md).
 * Sin API configurada devuelve datos de ejemplo con la misma forma.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerActivos(): Promise<Respuesta<Paciente[]>> {
  comprobarRed();
  if (usarApi) return pedir<Paciente[]>('/api/Pacientes/activos');

  await esperar(500);
  return {
    exitoso: true,
    mensaje: 'Pacientes activos obtenidos correctamente.',
    datos: PACIENTES_EJEMPLO.filter((paciente) => paciente.activo),
  };
}

export async function obtenerPorId(id: number): Promise<Respuesta<Paciente>> {
  comprobarRed();
  if (usarApi) return pedir<Paciente>(`/api/Pacientes/${id}`);

  await esperar(300);
  const paciente = PACIENTES_EJEMPLO.find((p) => p.id === id);
  if (!paciente) {
    return { exitoso: false, mensaje: 'Paciente no encontrado', datos: null };
  }
  return { exitoso: true, mensaje: 'Operación exitosa', datos: paciente };
}
