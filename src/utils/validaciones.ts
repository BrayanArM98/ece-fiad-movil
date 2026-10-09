import type { CrearEvolucion } from '@/models/CrearEvolucion';

/**
 * Límites de la evolución. Son los mismos que valida la API (CrearEvolucionValidator),
 * para que el médico vea el error en el teléfono antes de enviar (F04).
 */
export const LIMITES_EVOLUCION = {
  diagnostico: 500,
  tratamiento: 500,
  notas: 1000,
  fotos: 3, // F05: máximo de fotografías por evolución
};

export interface ErroresEvolucion {
  fecha?: string;
  diagnostico?: string;
  tratamiento?: string;
  notas?: string;
}

export function validarEvolucion(datos: CrearEvolucion, ahora: Date = new Date()): ErroresEvolucion {
  const errores: ErroresEvolucion = {};

  const fecha = new Date(datos.fecha);
  if (Number.isNaN(fecha.getTime())) {
    errores.fecha = 'La fecha es obligatoria';
  } else if (fecha.getTime() > ahora.getTime()) {
    errores.fecha = 'La fecha no puede ser futura';
  }

  if (!datos.diagnostico.trim()) {
    errores.diagnostico = 'El diagnóstico es obligatorio';
  } else if (datos.diagnostico.length > LIMITES_EVOLUCION.diagnostico) {
    errores.diagnostico = 'El diagnóstico no puede superar los 500 caracteres';
  }

  if (!datos.tratamiento.trim()) {
    errores.tratamiento = 'El tratamiento es obligatorio';
  } else if (datos.tratamiento.length > LIMITES_EVOLUCION.tratamiento) {
    errores.tratamiento = 'El tratamiento no puede superar los 500 caracteres';
  }

  if (datos.notas.length > LIMITES_EVOLUCION.notas) {
    errores.notas = 'Las notas no pueden superar los 1000 caracteres';
  }

  return errores;
}

export function esValida(errores: ErroresEvolucion): boolean {
  return Object.keys(errores).length === 0;
}
