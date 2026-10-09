import { router } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { TarjetaCita } from '@/components/TarjetaCita';
import { colores } from '@/theme/colores';
import { useAgendaViewModel } from '@/viewmodels/useAgendaViewModel';

/**
 * Pestaña Agenda: citas de hoy del médico (specs/features/F02-agenda-del-dia.md).
 * Estados: cargando, con datos, lista vacía y error.
 */
export default function AgendaScreen() {
  const vm = useAgendaViewModel();

  if (vm.estado === 'cargando') {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  if (vm.estado === 'error') {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>No se pudo cargar tu agenda</Text>
        <Boton titulo="Reintentar" onPress={vm.reintentar} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={vm.citas}
      keyExtractor={(cita) => String(cita.id)}
      renderItem={({ item }) => (
        <TarjetaCita
          cita={item}
          onPress={() => router.push({ pathname: '/medico/cita/[citaId]', params: { citaId: String(item.id) } })}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.fecha}>{vm.fechaHoy}</Text>
          <Text style={styles.resumen}>
            {vm.resumen.total} {vm.resumen.total === 1 ? 'cita' : 'citas'} · {vm.resumen.pendientes}{' '}
            {vm.resumen.pendientes === 1 ? 'pendiente' : 'pendientes'}
          </Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.vacio}>No tienes citas programadas para hoy</Text>}
      refreshControl={
        <RefreshControl refreshing={vm.refrescando} onRefresh={vm.refrescar} tintColor={colores.primario} />
      }
    />
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  mensaje: { fontSize: 16, color: colores.texto, textAlign: 'center' },
  lista: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16 },
  encabezado: { marginBottom: 16 },
  fecha: { fontSize: 22, fontWeight: '700', color: colores.texto },
  resumen: { fontSize: 15, color: colores.textoSecundario, marginTop: 4 },
  separador: { height: 12 },
  vacio: { fontSize: 16, color: colores.textoSecundario, textAlign: 'center', marginTop: 48 },
});
