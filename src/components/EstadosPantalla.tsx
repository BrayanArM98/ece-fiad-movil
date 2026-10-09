import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores } from '@/theme/colores';

/**
 * Estados comunes de las pantallas (cargando, error, mensaje),
 * definidos en la sección "Estados de la pantalla" de cada spec.
 */
export function Cargando() {
  return (
    <View style={styles.centrado}>
      <ActivityIndicator size="large" color={colores.primario} />
    </View>
  );
}

interface MensajeProps {
  mensaje: string;
  accion?: { titulo: string; onPress: () => void };
}

export function MensajePantalla({ mensaje, accion }: MensajeProps) {
  return (
    <View style={styles.centrado}>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {accion ? <Boton titulo={accion.titulo} onPress={accion.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  mensaje: { fontSize: 16, lineHeight: 22, color: colores.texto, textAlign: 'center' },
});
