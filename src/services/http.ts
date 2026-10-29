import { API_URL } from '@/config/api';
import type { Respuesta } from '@/models/Respuesta';

/**
 * Cliente HTTP de la app (specs/03-api.md, "Reglas del cliente HTTP").
 * Todas las peticiones a la API pasan por aquí.
 */
export const TIEMPO_LIMITE_MS = 10_000;

// La API devuelve hasta 7 decimales en los segundos; el teléfono solo interpreta 3
const FECHA_CON_FRACCION_LARGA = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\d+/;

export function leerJson(texto: string): unknown {
  return JSON.parse(texto, (_clave, valor) =>
    typeof valor === 'string' ? valor.replace(FECHA_CON_FRACCION_LARGA, '$1') : valor
  );
}

function esRespuesta(valor: unknown): valor is Respuesta<unknown> {
  return typeof valor === 'object' && valor !== null && typeof (valor as Respuesta<unknown>).exitoso === 'boolean';
}

/** Convierte el cuerpo y el código HTTP en la envoltura Respuesta<T> que usan los servicios. */
export function interpretarRespuesta<T>(estado: number, texto: string): Respuesta<T> {
  let cuerpo: unknown = null;
  try {
    cuerpo = texto ? leerJson(texto) : null;
  } catch {
    // Cuerpo que no es JSON: se trata como error del servidor
  }

  if (esRespuesta(cuerpo)) {
    return { exitoso: cuerpo.exitoso, mensaje: cuerpo.mensaje ?? '', datos: (cuerpo.datos ?? null) as T | null };
  }

  return {
    exitoso: false,
    mensaje: `El servidor no pudo atender la solicitud (error ${estado}). Intenta más tarde.`,
    datos: null,
  };
}

interface Opciones {
  metodo?: 'GET' | 'POST';
  cuerpo?: unknown;
}

/**
 * Hace la petición y devuelve la envoltura de la API.
 * Lanza un error si no hay conexión o se agota el tiempo límite, igual que un servicio sin Internet.
 */
export async function pedir<T>(ruta: string, { metodo = 'GET', cuerpo }: Opciones = {}): Promise<Respuesta<T>> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: control.signal,
    });
    return interpretarRespuesta<T>(respuesta.status, await respuesta.text());
  } catch {
    throw new Error('Sin conexión con el servidor');
  } finally {
    clearTimeout(temporizador);
  }
}
