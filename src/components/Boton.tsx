import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colores } from '@/theme/colores';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  deshabilitado?: boolean;
  cargando?: boolean;
}

export function Boton({ titulo, onPress, variante = 'primario', deshabilitado, cargando }: BotonProps) {
  const inactivo = deshabilitado || cargando;
  const esPrimario = variante === 'primario';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactivo }}
      style={({ pressed }) => [
        styles.base,
        esPrimario ? styles.primario : styles.secundario,
        inactivo && styles.inactivo,
        pressed && !inactivo && styles.presionado,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={esPrimario ? colores.superficie : colores.primario} />
      ) : (
        <Text style={[styles.texto, esPrimario ? styles.textoPrimario : styles.textoSecundario]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: colores.primario },
  secundario: { backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.primario },
  inactivo: { opacity: 0.45 },
  presionado: { opacity: 0.8 },
  texto: { fontSize: 16, fontWeight: '600' },
  textoPrimario: { color: colores.superficie },
  textoSecundario: { color: colores.primario },
});
