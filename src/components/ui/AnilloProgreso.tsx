import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colores } from '@/theme/colores';

interface AnilloProgresoProps {
  /** De 0 a 1. */
  valor: number;
  tamano?: number;
  grosor?: number;
  color?: string;
  colorFondo?: string;
  children?: ReactNode;
}

/** Anillo de avance con el contenido centrado (por ejemplo "3/5"). */
export function AnilloProgreso({
  valor,
  tamano = 76,
  grosor = 8,
  color = colores.marea,
  colorFondo = colores.mareaSuave,
  children,
}: AnilloProgresoProps) {
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const avance = Math.min(Math.max(valor, 0), 1);

  return (
    <View style={{ width: tamano, height: tamano }}>
      <Svg width={tamano} height={tamano} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={tamano / 2} cy={tamano / 2} r={radio} stroke={colorFondo} strokeWidth={grosor} fill="none" />
        {avance > 0 ? (
          <Circle
            cx={tamano / 2}
            cy={tamano / 2}
            r={radio}
            stroke={color}
            strokeWidth={grosor}
            strokeLinecap="round"
            strokeDasharray={`${circunferencia} ${circunferencia}`}
            strokeDashoffset={circunferencia * (1 - avance)}
            fill="none"
          />
        ) : null}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.centro]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
});
