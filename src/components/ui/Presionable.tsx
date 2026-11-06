import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

interface PresionableProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Cuánto se encoge al presionar (1 = nada). */
  escala?: number;
  /** Vibración ligera al tocar. */
  vibrar?: boolean;
}

/**
 * Superficie táctil con respuesta física: se encoge con un resorte y vibra levemente.
 * La base de botones y tarjetas tocables.
 */
export function Presionable({ children, style, escala = 0.97, vibrar = true, onPressIn, onPressOut, onPress, disabled, ...props }: PresionableProps) {
  const tamano = useSharedValue(1);
  const estilo = useAnimatedStyle(() => ({ transform: [{ scale: tamano.value }] }));

  return (
    <PressableAnimado
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        tamano.value = withSpring(escala, { damping: 18, stiffness: 420 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        tamano.value = withSpring(1, { damping: 14, stiffness: 300 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (vibrar && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={[style, estilo]}
    >
      {children}
    </PressableAnimado>
  );
}
