import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { FilaPaciente } from '@/components/FilaPaciente';
import { colores } from '@/theme/colores';
import { usePacientesViewModel } from '@/viewmodels/usePacientesViewModel';

/**
 * Pestaña Pacientes: pacientes activos ordenados por apellido.
 * Es el segundo punto de entrada al historial (specs/features/F03-historial-paciente.md).
 */
export default function PacientesScreen() {
  const vm = usePacientesViewModel();

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'error') {
    return (
      <MensajePantalla
        mensaje="No se pudieron cargar los pacientes"
        accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
      />
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={vm.pacientes}
      keyExtractor={(paciente) => String(paciente.id)}
      renderItem={({ item }) => (
        <FilaPaciente
          paciente={item}
          onPress={() =>
            router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: String(item.id) } })
          }
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListEmptyComponent={<Text style={styles.vacio}>No hay pacientes activos</Text>}
      refreshControl={
        <RefreshControl refreshing={vm.refrescando} onRefresh={vm.refrescar} tintColor={colores.primario} />
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16 },
  separador: { height: 12 },
  vacio: { fontSize: 16, color: colores.textoSecundario, textAlign: 'center', marginTop: 48 },
});
