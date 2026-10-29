import { usarApi } from '@/config/api';
import { comprobarRed } from '@/config/simulacion';
import type { CrearEvolucion } from '@/models/CrearEvolucion';
import type { Evolucion } from '@/models/Evolucion';
import type { Respuesta } from '@/models/Respuesta';
import { pedir } from '@/services/http';
import { DOCTORES_EJEMPLO } from '@/services/mocks/doctoresMock';
import { EVOLUCIONES_EJEMPLO, HISTORIAS_EJEMPLO } from '@/services/mocks/historiasMock';
import { esValida, validarEvolucion } from '@/utils/validaciones';

/**
 * Servicio de evoluciones: POST /api/Evoluciones (specs/03-api.md).
 * Sin API configurada valida como la API y guarda la evolución en los datos de ejemplo
 * (se pierde al cerrar la app).
 */
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function crear(datos: CrearEvolucion): Promise<Respuesta<Evolucion>> {
  comprobarRed();
  if (usarApi) return pedir<Evolucion>('/api/Evoluciones', { metodo: 'POST', cuerpo: { ...datos, activo: true } });

  await esperar(700);

  const errores = validarEvolucion(datos);
  if (!esValida(errores)) {
    return { exitoso: false, mensaje: `Datos inválidos: ${Object.values(errores).join(' | ')}`, datos: null };
  }

  const historia = HISTORIAS_EJEMPLO.find((h) => h.id === datos.idHistoriaClinica);
  if (!historia) {
    return { exitoso: false, mensaje: 'La historia clínica no existe.', datos: null };
  }

  const doctor = DOCTORES_EJEMPLO.find((d) => d.id === datos.idDoctor);
  const nueva: Evolucion = {
    // Id único entre sesiones para que las fotos guardadas (F05) no se asocien a otra evolución
    id: Date.now(),
    idHistoriaClinica: datos.idHistoriaClinica,
    idDoctor: datos.idDoctor,
    nombrePaciente: historia.nombrePaciente,
    nombreDoctor: doctor?.nombreCompleto ?? '',
    nombreEspecialidad: doctor?.nombreEspecialidad ?? '',
    fecha: datos.fecha,
    diagnostico: datos.diagnostico.trim(),
    tratamiento: datos.tratamiento.trim(),
    notas: datos.notas.trim(),
    activo: true,
  };

  EVOLUCIONES_EJEMPLO.push(nueva);
  return { exitoso: true, mensaje: 'Evolución creada exitosamente.', datos: nueva };
}
