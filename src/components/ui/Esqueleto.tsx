import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';

interface EsqueletoProps {
  ancho?: DimensionValue;
  alto?: number;
  radio?: number;
  style?: StyleProp<ViewStyle>;
}

/** Bloque que late suavemente mientras llegan los datos. */
export function Esqueleto({ ancho = '100%', alto = 14, radio = 8, style }: EsqueletoProps) {
  const opacidad = useSharedValue(0.55);
  useEffect(() => {
    opacidad.value = withRepeat(withTiming(1, { duration: 750, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [opacidad]);
  const animado = useAnimatedStyle(() => ({ opacity: opacidad.value }));

  return <Animated.View style={[{ width: ancho, height: alto, borderRadius: radio, backgroundColor: colores.linea }, animado, style]} />;
}

/** Tarjeta de carga con la silueta de una cita o un paciente. */
export function EsqueletoTarjeta() {
  return (
    <View style={styles.tarjeta}>
      <Esqueleto ancho={44} alto={44} radio={22} />
      <View style={styles.lineas}>
        <Esqueleto ancho="60%" alto={14} />
        <Esqueleto ancho="85%" alto={12} />
        <Esqueleto ancho={72} alto={20} radio={10} />
      </View>
    </View>
  );
}

export function EsqueletoLista({ cantidad = 4 }: { cantidad?: number }) {
  return (
    <View style={styles.lista} accessibilityLabel="Cargando" accessibilityRole="progressbar">
      {Array.from({ length: cantidad }, (_, i) => (
        <EsqueletoTarjeta key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: radios.l,
    backgroundColor: colores.blanco,
  },
  lineas: { flex: 1, gap: 10 },
  lista: { gap: 12 },
});
