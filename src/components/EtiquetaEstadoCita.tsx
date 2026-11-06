import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import type { EstadoCita } from '@/models/Cita';
import { COLOR_ESTADO } from '@/theme/colores';
import { radios } from '@/theme/tema';

interface EtiquetaEstadoCitaProps {
  estado: EstadoCita;
  texto: string;
}

/** Insignia del estado de la cita: punto de color y texto, con los colores de la agenda web. */
export function EtiquetaEstadoCita({ estado, texto }: EtiquetaEstadoCitaProps) {
  const { color, fondo } = COLOR_ESTADO[estado];
  return (
    <View style={[styles.etiqueta, { backgroundColor: fondo }]} accessibilityLabel={`Estado: ${texto}`}>
      <View style={[styles.punto, { backgroundColor: color }]} />
      <Texto variante="etiqueta" color={color}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radios.total,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  punto: { width: 6, height: 6, borderRadius: 3 },
});
