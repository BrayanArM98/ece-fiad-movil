import type { Coordenadas } from '@/models/Clinica';

const RADIO_TIERRA_METROS = 6_371_000;

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

/** Distancia en línea recta entre dos puntos, en metros (fórmula de Haversine). */
export function calcularDistancia(a: Coordenadas, b: Coordenadas): number {
  const dLat = aRadianes(b.latitude - a.latitude);
  const dLon = aRadianes(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.latitude)) * Math.cos(aRadianes(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_METROS * Math.asin(Math.sqrt(h));
}

/**
 * Formato de la spec F07: metros por debajo de 1 km y kilómetros con un decimal a partir de 1 km.
 * Ejemplos: 500 → "500 m", 2400 → "2.4 km".
 */
export function formatearDistancia(metros: number): string {
  const redondeados = Math.round(metros);
  if (redondeados < 1000) return `${redondeados} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}
