import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import { colores } from '@/theme/colores';
import { useCitaDetalleViewModel } from '@/viewmodels/useCitaDetalleViewModel';

/**
 * Detalle de la cita: hora, paciente, motivo, notas y estado.
 * Es el punto de entrada al historial desde la agenda (specs/features/F03-historial-paciente.md).
 */
export default function CitaDetalleScreen() {
  const { citaId } = useLocalSearchParams<{ citaId: string }>();
  const vm = useCitaDetalleViewModel(Number(citaId));

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'noEncontrada') {
    return <MensajePantalla mensaje="Cita no encontrada" accion={{ titulo: 'Regresar', onPress: router.back }} />;
  }
  if (vm.estado === 'error' || !vm.cita) {
    return (
      <MensajePantalla
        mensaje="No se pudo cargar la cita"
        accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
      />
    );
  }

  const cita = vm.cita;

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.tarjeta}>
        <Text style={styles.hora}>{vm.horaTexto}</Text>
        <Text style={styles.fecha}>{vm.fechaTexto}</Text>
        <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Paciente</Text>
        <Text style={styles.valor}>{cita.nombrePaciente}</Text>

        <Text style={styles.etiqueta}>Motivo</Text>
        <Text style={styles.valor}>{cita.motivo}</Text>

        <Text style={styles.etiqueta}>Notas</Text>
        <Text style={[styles.valor, !cita.notas && styles.vacio]}>{cita.notas || 'Sin notas'}</Text>
      </View>

      <Boton
        titulo="Ver historial"
        onPress={() =>
          router.push({
            pathname: '/medico/historial/[pacienteId]',
            params: { pacienteId: String(cita.idPaciente) },
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 16 },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  hora: { fontSize: 32, fontWeight: '800', color: colores.primario },
  fecha: { fontSize: 16, color: colores.textoSecundario, marginBottom: 8 },
  etiqueta: { fontSize: 12, fontWeight: '700', color: colores.primario, marginTop: 8, textTransform: 'uppercase' },
  valor: { fontSize: 16, lineHeight: 22, color: colores.texto },
  vacio: { color: colores.textoSecundario, fontStyle: 'italic' },
});
