import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Evolucion } from '@/models/Evolucion';
import { colores } from '@/theme/colores';
import { formatearFechaCompleta } from '@/utils/fechas';

interface TarjetaEvolucionProps {
  evolucion: Evolucion;
  expandida: boolean;
  onPress: () => void;
}

/**
 * Evolución dentro del historial (F03). Al expandirla muestra sus notas;
 * las fotografías se agregan con F05.
 */
export function TarjetaEvolucion({ evolucion, expandida, onPress }: TarjetaEvolucionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded: expandida }}
      style={styles.tarjeta}
    >
      <View style={styles.encabezado}>
        <View style={styles.titulo}>
          <Text style={styles.fecha}>{formatearFechaCompleta(new Date(evolucion.fecha))}</Text>
          <Text style={styles.doctor}>
            Dr(a). {evolucion.nombreDoctor} · {evolucion.nombreEspecialidad}
          </Text>
        </View>
        <Ionicons
          name={expandida ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colores.textoSecundario}
        />
      </View>

      <Text style={styles.etiqueta}>Diagnóstico</Text>
      <Text style={styles.texto}>{evolucion.diagnostico}</Text>

      <Text style={styles.etiqueta}>Tratamiento</Text>
      <Text style={styles.texto}>{evolucion.tratamiento}</Text>

      {expandida ? (
        <>
          <Text style={styles.etiqueta}>Notas</Text>
          <Text style={[styles.texto, !evolucion.notas && styles.vacio]}>
            {evolucion.notas || 'Sin notas'}
          </Text>
        </>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
  },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  titulo: { flex: 1, gap: 2 },
  fecha: { fontSize: 16, fontWeight: '700', color: colores.texto },
  doctor: { fontSize: 13, color: colores.textoSecundario },
  etiqueta: { fontSize: 12, fontWeight: '700', color: colores.primario, marginTop: 10, textTransform: 'uppercase' },
  texto: { fontSize: 15, lineHeight: 21, color: colores.texto, marginTop: 2 },
  vacio: { color: colores.textoSecundario, fontStyle: 'italic' },
});
