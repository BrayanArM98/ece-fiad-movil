import { Linking, Platform } from 'react-native';

import type { Coordenadas } from '@/models/Clinica';

/**
 * Abre otras aplicaciones del teléfono (specs/features/F07-ubicar-clinica.md):
 * la app de mapas con la ruta y el marcador telefónico.
 * Regresan false si el teléfono no pudo abrir la app.
 */
export function urlRuta({ latitude, longitude }: Coordenadas): string {
  const destino = `${latitude},${longitude}`;
  return Platform.OS === 'ios'
    ? `maps:?daddr=${destino}`
    : `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
}

async function abrir(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export function abrirRuta(destino: Coordenadas): Promise<boolean> {
  return abrir(urlRuta(destino));
}

export function llamar(telefono: string): Promise<boolean> {
  return abrir(`tel:${telefono}`);
}
