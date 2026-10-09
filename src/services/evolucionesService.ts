import type { CrearEvolucion } from '@/models/CrearEvolucion';
import type { Evolucion } from '@/models/Evolucion';
import type { Respuesta } from '@/models/Respuesta';
import { DOCTORES_EJEMPLO } from '@/services/mocks/doctoresMock';
import { EVOLUCIONES_EJEMPLO, HISTORIAS_EJEMPLO } from '@/services/mocks/historiasMock';
import { esValida, validarEvolucion } from '@/utils/validaciones';

/**
 * Servicio de evoluciones.
 * Reproduce POST /api/Evoluciones: valida como la API y devuelve la evolución creada.
 * Mientras no hay API, la guarda en los datos de ejemplo (se pierde al cerrar la app).
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function crear(datos: CrearEvolucion): Promise<Respuesta<Evolucion>> {
  await esperar(700);

  const errores = validarEvolucion(datos);
  if (!esValida(errores)) {
    return { exitoso: false, mensaje: `Datos inválidos: ${Object.values(errores).join(' | ')}`, datos: null };
  }

  const historia = HISTORIAS_EJEMPLO.find((h) => h.id === datos.idHistoriaClinica);
  if (!historia) {
    return { exitoso: false, mensaje: 'La historia clínica no existe.', datos: null };
  }

  const doctor = DOCTORES_EJEMPLO[datos.idDoctor];
  const nueva: Evolucion = {
    id: Math.max(0, ...EVOLUCIONES_EJEMPLO.map((e) => e.id)) + 1,
    idHistoriaClinica: datos.idHistoriaClinica,
    idDoctor: datos.idDoctor,
    nombrePaciente: historia.nombrePaciente,
    nombreDoctor: doctor?.nombre ?? '',
    nombreEspecialidad: doctor?.especialidad ?? '',
    fecha: datos.fecha,
    diagnostico: datos.diagnostico.trim(),
    tratamiento: datos.tratamiento.trim(),
    notas: datos.notas.trim(),
    activo: true,
  };

  EVOLUCIONES_EJEMPLO.push(nueva);
  return { exitoso: true, mensaje: 'Evolución creada exitosamente.', datos: nueva };
}
