import * as Location from 'expo-location';

import type { Coordenadas } from '@/models/Clinica';

/**
 * Ubicación del teléfono (specs/features/F07-ubicar-clinica.md).
 * Solo se pide la ubicación mientras la app está abierta, nunca en segundo plano.
 */
export type ResultadoUbicacion =
  | { estado: 'ok'; coordenadas: Coordenadas }
  | { estado: 'sinPermiso' }
  | { estado: 'sinSenal' };

export const TIEMPO_LIMITE_MS = 10_000;

function esperar(ms: number): Promise<null> {
  return new Promise((resolver) => setTimeout(() => resolver(null), ms));
}

/**
 * Pide el permiso (la primera vez muestra el diálogo del sistema; después solo lo consulta)
 * y obtiene la posición actual. Si el GPS no responde a tiempo, el resultado es "sinSenal".
 */
export async function obtenerUbicacion(): Promise<ResultadoUbicacion> {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) return { estado: 'sinPermiso' };

  try {
    const posicion = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      esperar(TIEMPO_LIMITE_MS),
    ]);
    if (!posicion) return { estado: 'sinSenal' };

    const { latitude, longitude } = posicion.coords;
    return { estado: 'ok', coordenadas: { latitude, longitude } };
  } catch {
    // GPS apagado o sin señal
    return { estado: 'sinSenal' };
  }
}
