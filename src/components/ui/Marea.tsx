import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colores, DEGRADADO_MAREA } from '@/theme/colores';

/**
 * Elementos de identidad "Marea" (specs/04-diseno.md): el degradado profundo,
 * los anillos de sonar y las olas que separan el encabezado del contenido.
 */

/** Olas en capas; la última toma el color del fondo para que el encabezado "desemboque" en la pantalla. */
export function Olas({ alto = 56, colorFinal = colores.papel }: { alto?: number; colorFinal?: string }) {
  return (
    <Svg width="100%" height={alto} viewBox="0 0 390 56" preserveAspectRatio="none" style={styles.olas}>
      <Path
        d="M0 22 C 60 6, 120 6, 190 20 S 320 38, 390 16 L390 56 L0 56 Z"
        fill="#FFFFFF"
        fillOpacity={0.08}
      />
      <Path
        d="M0 32 C 70 18, 140 40, 210 30 S 330 14, 390 30 L390 56 L0 56 Z"
        fill="#FFFFFF"
        fillOpacity={0.12}
      />
      <Path d="M0 44 C 80 30, 160 52, 240 42 S 350 32, 390 42 L390 56 L0 56 Z" fill={colorFinal} />
    </Svg>
  );
}

/** Anillos concéntricos que evocan un sonar o una gota sobre el agua. */
export function Anillos({ tamano = 260, style }: { tamano?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 260 260" style={style} pointerEvents="none">
      {[128, 100, 72, 44].map((r, i) => (
        <Circle key={r} cx={130} cy={130} r={r} stroke="#FFFFFF" strokeOpacity={0.05 + i * 0.03} strokeWidth={1.5} fill="none" />
      ))}
      <Circle cx={130} cy={130} r={18} fill="#FFFFFF" fillOpacity={0.06} />
    </Svg>
  );
}

/** Marca de ECE-FIAD: una cruz médica cuya barra horizontal es una ola. */
export function Logotipo({ tamano = 64 }: { tamano?: number }) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 64 64">
      <Rect x={0} y={0} width={64} height={64} rx={20} fill="#FFFFFF" fillOpacity={0.14} />
      <Rect x={0.75} y={0.75} width={62.5} height={62.5} rx={19.5} stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={1.5} fill="none" />
      <Rect x={26} y={13} width={12} height={38} rx={6} fill="#FFFFFF" />
      <Path
        d="M13 33.5 C 18 27.5, 23 27.5, 28 32 S 38 36.5, 43 31 S 49 28.5, 51 30.5"
        stroke={colores.mareaClara}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

interface EncabezadoMareaProps {
  children: ReactNode;
  /** Espacio extra bajo el contenido, para que una tarjeta se monte sobre las olas. */
  espacioInferior?: number;
  colorFinal?: string;
}

/** Encabezado con degradado, anillos y olas. Respeta el área segura superior. */
export function EncabezadoMarea({ children, espacioInferior = 0, colorFinal }: EncabezadoMareaProps) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={styles.encabezado}>
      <LinearGradient colors={DEGRADADO_MAREA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Anillos tamano={300} style={styles.anillos} />
      <View style={[styles.contenido, { paddingTop: top + 16, paddingBottom: 56 + espacioInferior }]}>{children}</View>
      <Olas colorFinal={colorFinal} />
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: { overflow: 'hidden', backgroundColor: colores.mareaProfunda },
  anillos: { position: 'absolute', top: -90, right: -110 },
  contenido: { paddingHorizontal: 20 },
  olas: { position: 'absolute', left: 0, right: 0, bottom: -1 },
});
