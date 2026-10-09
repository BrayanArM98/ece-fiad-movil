import { StyleSheet, Text, View } from 'react-native';

import type { Paciente } from '@/models/Paciente';
import { colores } from '@/theme/colores';
import { calcularEdad, nombreCompleto, textoGrupoSanguineo } from '@/utils/pacientes';

/**
 * Encabezado del historial: nombre, edad y grupo sanguíneo (F03).
 */
export function EncabezadoPaciente({ paciente }: { paciente: Paciente }) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.nombre}>{nombreCompleto(paciente)}</Text>
      <View style={styles.datos}>
        <Text style={styles.dato}>{calcularEdad(paciente.fechaNacimiento)} años</Text>
        <Text style={styles.separador}>·</Text>
        <Text style={styles.dato}>Grupo sanguíneo {textoGrupoSanguineo(paciente.grupoSanguineo)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 4 },
  nombre: { fontSize: 22, fontWeight: '700', color: colores.texto },
  datos: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  dato: { fontSize: 15, color: colores.textoSecundario },
  separador: { fontSize: 15, color: colores.textoSecundario },
});
