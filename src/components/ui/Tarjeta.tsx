import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Presionable } from '@/components/ui/Presionable';
import { colores } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';

interface TarjetaProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  etiquetaAccesible?: string;
  elevada?: boolean;
}

/**
 * Superficie blanca con esquinas amplias y sombra teñida de marea.
 * Con onPress se vuelve tocable y responde con el resorte de Presionable.
 */
export function Tarjeta({ children, style, onPress, etiquetaAccesible, elevada }: TarjetaProps) {
  const estilo = [styles.tarjeta, elevada ? sombras.media : sombras.baja, style];
  if (!onPress) return <View style={estilo}>{children}</View>;
  return (
    <Presionable onPress={onPress} style={estilo} escala={0.98} accessibilityRole="button" accessibilityLabel={etiquetaAccesible}>
      {children}
    </Presionable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: radios.l,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.linea,
  },
});
