import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import type { Cita } from '@/models/Cita';
import { colores } from '@/theme/colores';
import { formatearHora } from '@/utils/fechas';

interface TarjetaCitaProps {
  cita: Cita;
  onPress: () => void;
}

/**
 * Tarjeta de una cita en la agenda: hora, paciente, motivo y estado (F02).
 */
export function TarjetaCita({ cita, onPress }: TarjetaCitaProps) {
  const cancelada = cita.estado === 'Cancelada';
  const hora = formatearHora(new Date(cita.fechaHora));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Cita de ${cita.nombrePaciente} a las ${hora}, ${cita.estadoTexto}`}
      style={({ pressed }) => [styles.tarjeta, cancelada && styles.cancelada, pressed && styles.presionada]}
    >
      <Text style={[styles.hora, cancelada && styles.textoTachado]}>{hora}</Text>

      <View style={styles.detalle}>
        <Text style={styles.paciente} numberOfLines={1}>
          {cita.nombrePaciente}
        </Text>
        <Text style={styles.motivo} numberOfLines={1}>
          {cita.motivo}
        </Text>
        <View style={styles.estado}>
          <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
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
  estado: { marginTop: 4 },
});
