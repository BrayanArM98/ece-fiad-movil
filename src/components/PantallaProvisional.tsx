import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colores } from '@/theme/colores';

interface PantallaProvisionalProps {
  titulo: string;
  feature: string; // ID de la spec que implementará esta pantalla, p. ej. "F02"
  descripcion: string;
  children?: ReactNode;
}

/**
 * Pantalla temporal para validar la navegación (specs/01-navigation.md)
 * antes de implementar cada feature. Indica qué spec la va a reemplazar.
 */
export function PantallaProvisional({ titulo, feature, descripcion, children }: PantallaProvisionalProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.etiqueta}>
        <Text style={styles.textoEtiqueta}>{feature}</Text>
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>
      {children ? <View style={styles.acciones}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: 24,
    justifyContent: 'center',
  },
  etiqueta: {
    alignSelf: 'flex-start',
    backgroundColor: colores.primarioSuave,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  textoEtiqueta: { color: colores.primario, fontWeight: '700', fontSize: 13 },
  titulo: { fontSize: 24, fontWeight: '700', color: colores.texto, marginBottom: 8 },
  descripcion: { fontSize: 16, lineHeight: 22, color: colores.textoSecundario },
  acciones: { marginTop: 24, gap: 12 },
});
