import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Cita, EstadoCita } from '@/models/Cita';
import { colores } from '@/theme/colores';
import { formatearHora } from '@/utils/fechas';

const COLOR_ESTADO: Record<EstadoCita, { fondo: string; texto: string }> = {
  Pendiente: { fondo: '#FEF3C7', texto: '#92400E' },
  Confirmada: { fondo: '#E0F2F7', texto: '#0E7490' },
  Completada: { fondo: '#DCFCE7', texto: '#166534' },
  Cancelada: { fondo: '#F1F5F9', texto: '#64748B' },
  NoAsistio: { fondo: '#FEE2E2', texto: '#991B1B' },
};

interface TarjetaCitaProps {
  cita: Cita;
  onPress: () => void;
}

/**
 * Tarjeta de una cita en la agenda: hora, paciente, motivo y estado (F02).
 */
export function TarjetaCita({ cita, onPress }: TarjetaCitaProps) {
  const cancelada = cita.estado === 'Cancelada';
  const colorEstado = COLOR_ESTADO[cita.estado];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Cita de ${cita.nombrePaciente} a las ${formatearHora(new Date(cita.fechaHora))}, ${cita.estadoTexto}`}
      style={({ pressed }) => [styles.tarjeta, cancelada && styles.cancelada, pressed && styles.presionada]}
    >
      <Text style={[styles.hora, cancelada && styles.textoTachado]}>
        {formatearHora(new Date(cita.fechaHora))}
      </Text>

      <View style={styles.detalle}>
        <Text style={styles.paciente} numberOfLines={1}>
          {cita.nombrePaciente}
        </Text>
        <Text style={styles.motivo} numberOfLines={1}>
          {cita.motivo}
        </Text>
        <View style={[styles.estado, { backgroundColor: colorEstado.fondo }]}>
          <Text style={[styles.textoEstado, { color: colorEstado.texto }]}>{cita.estadoTexto}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
  },
  cancelada: { opacity: 0.6 },
  presionada: { backgroundColor: colores.primarioSuave },
  hora: { fontSize: 18, fontWeight: '700', color: colores.primario, width: 56 },
  textoTachado: { textDecorationLine: 'line-through', color: colores.textoSecundario },
  detalle: { flex: 1, gap: 4 },
  paciente: { fontSize: 16, fontWeight: '600', color: colores.texto },
  motivo: { fontSize: 14, color: colores.textoSecundario },
  estado: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  textoEstado: { fontSize: 12, fontWeight: '600' },
});
