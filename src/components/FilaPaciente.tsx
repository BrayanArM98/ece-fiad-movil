import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Paciente } from '@/models/Paciente';
import { colores } from '@/theme/colores';
import { calcularEdad, nombreCompleto } from '@/utils/pacientes';

interface FilaPacienteProps {
  paciente: Paciente;
  onPress: () => void;
}

/**
 * Fila de la lista de Pacientes (F03).
 */
export function FilaPaciente({ paciente, onPress }: FilaPacienteProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
    >
      <View style={styles.datos}>
        <Text style={styles.nombre}>{nombreCompleto(paciente)}</Text>
        <Text style={styles.detalle}>
          {calcularEdad(paciente.fechaNacimiento)} años · {paciente.numeroDocumento}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoSecundario} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
  },
  presionada: { backgroundColor: colores.primarioSuave },
  datos: { flex: 1, gap: 2 },
  nombre: { fontSize: 16, fontWeight: '600', color: colores.texto },
  detalle: { fontSize: 14, color: colores.textoSecundario },
});
