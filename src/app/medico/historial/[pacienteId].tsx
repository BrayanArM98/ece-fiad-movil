import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EncabezadoPaciente } from '@/components/EncabezadoPaciente';
import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { TarjetaEvolucion } from '@/components/TarjetaEvolucion';
import { colores } from '@/theme/colores';
import { useHistorialViewModel } from '@/viewmodels/useHistorialViewModel';

/**
 * Historial del paciente (specs/features/F03-historial-paciente.md).
 * Estados: cargando, con historia y evoluciones, con historia sin evoluciones,
 * sin historia clínica y error.
 */
export default function HistorialPacienteScreen() {
  const { pacienteId } = useLocalSearchParams<{ pacienteId: string }>();
  const vm = useHistorialViewModel(Number(pacienteId));

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'noEncontrado') {
    return <MensajePantalla mensaje="Paciente no encontrado" accion={{ titulo: 'Regresar', onPress: router.back }} />;
  }
  if (vm.estado === 'error' || !vm.paciente || !vm.historial) {
    return (
      <MensajePantalla
        mensaje="No se pudo cargar el historial"
        accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
      />
    );
  }

  const { paciente, historial } = vm;

  if (!historial.tieneHistoria || !historial.historia) {
    return (
      <View style={styles.pantalla}>
        <View style={styles.contenido}>
          <EncabezadoPaciente paciente={paciente} />
          <View style={styles.aviso}>
            <Text style={styles.textoAviso}>
              Este paciente no tiene historia clínica. Se crea desde el sistema web.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const historia = historial.historia;

  return (
    <FlatList
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      data={historial.evoluciones}
      keyExtractor={(evolucion) => String(evolucion.id)}
      renderItem={({ item }) => (
        <TarjetaEvolucion
          evolucion={item}
          expandida={vm.expandida === item.id}
          onPress={() => vm.alternarEvolucion(item.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListHeaderComponent={
        <View style={styles.cabecera}>
          <EncabezadoPaciente paciente={paciente} />

          <View style={[styles.alergias, !vm.tieneAlergias && styles.sinAlergias]}>
            <Ionicons
              name={vm.tieneAlergias ? 'warning' : 'checkmark-circle-outline'}
              size={20}
              color={vm.tieneAlergias ? colores.error : colores.textoSecundario}
            />
            <View style={styles.textoAlergias}>
              <Text style={[styles.tituloAlergias, !vm.tieneAlergias && styles.tituloSinAlergias]}>Alergias</Text>
              <Text style={styles.valor}>{vm.alergiasTexto}</Text>
            </View>
          </View>

          <View style={styles.tarjeta}>
            <Text style={styles.etiqueta}>Antecedentes personales</Text>
            <Text style={styles.valor}>{historia.antecedentesPersonales || 'Sin registrar'}</Text>
            <Text style={styles.etiqueta}>Antecedentes familiares</Text>
            <Text style={styles.valor}>{historia.antecedentesFamiliares || 'Sin registrar'}</Text>
          </View>

          <View style={styles.tituloEvoluciones}>
            <Text style={styles.subtitulo}>Evoluciones ({historial.totalEvoluciones})</Text>
          </View>
          <Boton
            titulo="Nueva evolución"
            onPress={() =>
              router.push({
                pathname: '/medico/evolucion/nueva',
                params: { historiaId: String(historia.id), pacienteId: String(paciente.id) },
              })
            }
          />
        </View>
      }
      ListEmptyComponent={<Text style={styles.vacio}>Este paciente aún no tiene evoluciones registradas</Text>}
    />
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 16 },
  cabecera: { gap: 16, marginBottom: 16 },
  aviso: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
  },
  textoAviso: { fontSize: 15, lineHeight: 21, color: colores.texto },
  alergias: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
  },
  sinAlergias: { backgroundColor: colores.superficie, borderColor: colores.borde },
  textoAlergias: { flex: 1, gap: 2 },
  tituloAlergias: { fontSize: 12, fontWeight: '700', color: colores.error, textTransform: 'uppercase' },
  tituloSinAlergias: { color: colores.textoSecundario },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  etiqueta: { fontSize: 12, fontWeight: '700', color: colores.primario, marginTop: 4, textTransform: 'uppercase' },
  valor: { fontSize: 15, lineHeight: 21, color: colores.texto },
  tituloEvoluciones: { marginTop: 8 },
  subtitulo: { fontSize: 18, fontWeight: '700', color: colores.texto },
  separador: { height: 12 },
  vacio: { fontSize: 15, color: colores.textoSecundario, textAlign: 'center', marginTop: 16 },
});
