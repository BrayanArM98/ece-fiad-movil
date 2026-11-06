import { Text, type TextProps } from 'react-native';

import { colores } from '@/theme/colores';
import { tipografia, type VarianteTexto } from '@/theme/tema';

interface TextoProps extends TextProps {
  variante?: VarianteTexto;
  color?: string;
  centrado?: boolean;
}

/**
 * Texto con la tipografía del sistema de diseño (specs/04-diseno.md).
 * Todas las pantallas usan este componente en lugar de Text con estilos sueltos.
 */
export function Texto({ variante = 'cuerpo', color = colores.tinta, centrado, style, ...props }: TextoProps) {
  return (
    <Text
      {...props}
      style={[tipografia[variante], { color }, centrado && { textAlign: 'center' }, style]}
    />
  );
}
