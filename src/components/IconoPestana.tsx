import Ionicons from '@expo/vector-icons/Ionicons';
import type { ColorValue } from 'react-native';

type NombreIcono = keyof typeof Ionicons.glyphMap;

/**
 * Ícono de una pestaña. Expo Router entrega el color como ColorValue y
 * Ionicons solo acepta texto, por eso se convierte aquí y no en cada layout.
 */
export function iconoPestana(nombre: NombreIcono) {
  return function IconoPestana({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={nombre} size={size} color={typeof color === 'string' ? color : undefined} />;
  };
}
