import { comprobarRed } from '@/config/simulacion';
import type { HistorialPaciente } from '@/models/HistorialPaciente';
import type { Respuesta } from '@/models/Respuesta';
import { EVOLUCIONES_EJEMPLO, HISTORIAS_EJEMPLO } from '@/services/mocks/historiasMock';

/**
 * Servicio del historial clínico.
 * Reproduce la respuesta de GET /api/historial/paciente/{idPaciente}:
 * historia activa del paciente y sus evoluciones de la más reciente a la más antigua.
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function obtenerPorPaciente(idPaciente: number): Promise<Respuesta<HistorialPaciente>> {
  await esperar(500);
  comprobarRed();

  const historia = HISTORIAS_EJEMPLO.find((h) => h.idPaciente === idPaciente && h.activo) ?? null;

  if (!historia) {
    return {
      exitoso: true,
      mensaje: 'El paciente no tiene historia clínica activa.',
      datos: { tieneHistoria: false, historia: null, evoluciones: [], totalEvoluciones: 0 },
    };
  }

  const evoluciones = EVOLUCIONES_EJEMPLO.filter((e) => e.idHistoriaClinica === historia.id && e.activo).sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return {
    exitoso: true,
    mensaje: 'Historial obtenido correctamente.',
    datos: { tieneHistoria: true, historia, evoluciones, totalEvoluciones: evoluciones.length },
  };
}
