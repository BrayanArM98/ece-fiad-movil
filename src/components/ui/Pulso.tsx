import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/** Punto con una onda que se expande, para indicar algo "en vivo" (la siguiente cita, la hora actual). */
export function Pulso({ color, tamano = 8 }: { color: string; tamano?: number }) {
  const avance = useSharedValue(0);
  useEffect(() => {
    avance.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1, false);
  }, [avance]);
  const onda = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - avance.value),
    transform: [{ scale: 1 + avance.value * 1.8 }],
  }));

  return (
    <View style={{ width: tamano, height: tamano }}>
      <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: tamano, backgroundColor: color }, onda]} />
      <View style={[StyleSheet.absoluteFill, { borderRadius: tamano, backgroundColor: color }]} />
    </View>
  );
}
