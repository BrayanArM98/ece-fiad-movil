import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { fuentes } from '@/theme/tema';

/** Pares de fondo y texto; cada persona recibe siempre el mismo según su nombre. */
const TONOS = [
  { fondo: '#D5ECF1', texto: '#0B5568' },
  { fondo: '#FBE3DE', texto: '#9C3322' },
  { fondo: '#E6E1F5', texto: '#4C3D8F' },
  { fondo: '#DFF0E5', texto: '#25694A' },
  { fondo: '#FBEFD8', texto: '#8A5A12' },
  { fondo: '#F6DDEA', texto: '#8E2662' },
];

export function iniciales(nombre: string): string {
  const partes = nombre.replace(/^(Dra?\.|Dr\(a\)\.)\s*/i, '').trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

function tono(nombre: string) {
  let suma = 0;
  for (const letra of nombre) suma = (suma * 31 + letra.charCodeAt(0)) % 997;
  return TONOS[suma % TONOS.length];
}

interface AvatarProps {
  nombre: string;
  tamano?: number;
  /** Sobre fondos oscuros: círculo translúcido con texto blanco. */
  claro?: boolean;
}

export function Avatar({ nombre, tamano = 44, claro }: AvatarProps) {
  const { fondo, texto } = claro ? { fondo: 'rgba(255,255,255,0.18)', texto: '#FFFFFF' } : tono(nombre);
  return (
    <View
      style={[
        styles.avatar,
        { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: fondo },
        claro && styles.borde,
      ]}
      accessible={false}
    >
      <Texto style={{ fontFamily: fuentes.tituloNegrita, fontSize: tamano * 0.38, lineHeight: tamano * 0.46 }} color={texto}>
        {iniciales(nombre)}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  borde: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
});
