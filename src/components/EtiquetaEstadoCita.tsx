import { StyleSheet, Text, View } from 'react-native';

import type { EstadoCita } from '@/models/Cita';

const COLOR_ESTADO: Record<EstadoCita, { fondo: string; texto: string }> = {
  Pendiente: { fondo: '#FEF3C7', texto: '#92400E' },
  Confirmada: { fondo: '#E0F2F7', texto: '#0E7490' },
  Completada: { fondo: '#DCFCE7', texto: '#166534' },
  Cancelada: { fondo: '#F1F5F9', texto: '#64748B' },
  NoAsistio: { fondo: '#FEE2E2', texto: '#991B1B' },
};

interface EtiquetaEstadoCitaProps {
  estado: EstadoCita;
  texto: string;
}

export function EtiquetaEstadoCita({ estado, texto }: EtiquetaEstadoCitaProps) {
  const color = COLOR_ESTADO[estado];
  return (
    <View style={[styles.etiqueta, { backgroundColor: color.fondo }]}>
      <Text style={[styles.texto, { color: color.texto }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  texto: { fontSize: 12, fontWeight: '600' },
});
