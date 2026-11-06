import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';

/** Título de una sección con un dato opcional a la derecha ("4 citas"). */
export function TituloSeccion({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <View style={styles.fila} accessibilityRole="header">
      <Texto variante="titulo2">{titulo}</Texto>
      {detalle ? (
        <Texto variante="etiqueta" color={colores.pizarra}>
          {detalle}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 },
});
