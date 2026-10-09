import type { Paciente } from '@/models/Paciente';
import type { Respuesta } from '@/models/Respuesta';
import { PACIENTES_EJEMPLO } from '@/services/mocks/pacientesMock';

/**
 * Servicio de pacientes.
 * Devuelve datos de ejemplo con la forma de GET /api/Pacientes/activos y GET /api/Pacientes/{id}.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerActivos(): Promise<Respuesta<Paciente[]>> {
  await esperar(500);
  return {
    exitoso: true,
    mensaje: 'Pacientes activos obtenidos correctamente.',
    datos: PACIENTES_EJEMPLO.filter((paciente) => paciente.activo),
  };
}

export async function obtenerPorId(id: number): Promise<Respuesta<Paciente>> {
  await esperar(300);
  const paciente = PACIENTES_EJEMPLO.find((p) => p.id === id);
  if (!paciente) {
    return { exitoso: false, mensaje: 'Paciente no encontrado', datos: null };
  }
  return { exitoso: true, mensaje: 'Operación exitosa', datos: paciente };
}
