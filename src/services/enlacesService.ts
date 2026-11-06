import { Linking, Platform } from 'react-native';

import type { Coordenadas } from '@/models/Clinica';

/**
 * Abre otras aplicaciones del teléfono (specs/features/F07-ubicar-clinica.md):
 * la app de mapas con la ruta y el marcador telefónico.
 * Regresan false si el teléfono no pudo abrir la app.
 */
export function urlRuta({ latitude, longitude }: Coordenadas, nombre?: string): string {
  const destino = `${latitude},${longitude}`;
  if (Platform.OS === 'ios') {
    const etiqueta = nombre ? `&q=${encodeURIComponent(nombre)}` : '';
    return `maps:?daddr=${destino}${etiqueta}`;
  }
  // Google Maps abre directamente la ruta desde la ubicación actual
  return `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`;
}

async function abrir(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export function abrirRuta(destino: Coordenadas, nombre?: string): Promise<boolean> {
  return abrir(urlRuta(destino, nombre));
}

export function llamar(telefono: string): Promise<boolean> {
  return abrir(`tel:${telefono.replace(/[^\d+]/g, '')}`);
}
