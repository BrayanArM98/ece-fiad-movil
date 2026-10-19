import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { TarjetaCitaPaciente } from '@/components/TarjetaCitaPaciente';
import { colores } from '@/theme/colores';
import { useMisCitasViewModel } from '@/viewmodels/useMisCitasViewModel';

/**
 * Pestaña Mis citas (specs/features/F06-mis-citas-recordatorios.md).
 * Estados: cargando, con citas, lista vacía, error y avisos desactivados.
 */
export default function MisCitasScreen() {
  const vm = useMisCitasViewModel();

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'error') {
    return (
      <MensajePantalla mensaje="No se pudieron cargar tus citas" accion={{ titulo: 'Reintentar', onPress: vm.reintentar }} />
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={vm.citas}
      keyExtractor={(cita) => String(cita.id)}
      renderItem={({ item }) => <TarjetaCitaPaciente cita={item} />}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListHeaderComponent={<AvisoRecordatorios permiso={vm.permiso} onActivar={vm.activarRecordatorios} />}
      ListEmptyComponent={<Text style={styles.vacio}>No tienes citas próximas</Text>}
      refreshControl={
        <RefreshControl refreshing={vm.refrescando} onRefresh={vm.refrescar} tintColor={colores.primario} />
      }
    />
  );
}

function AvisoRecordatorios({ permiso, onActivar }: { permiso: string | null; onActivar: () => void }) {
  if (permiso === 'concedido' || permiso === null) return null;

  // Primera vez: se explica para qué sirven los avisos antes de pedir el permiso
  if (permiso === 'sinPreguntar') {
    return (
      <View style={styles.aviso}>
        <Ionicons name="notifications-outline" size={22} color={colores.primario} />
        <View style={styles.textoAviso}>
          <Text style={styles.tituloAviso}>Recordatorios de tus citas</Text>
          <Text style={styles.cuerpoAviso}>Te avisaremos un día antes y una hora antes de cada cita.</Text>
          <View style={styles.botonAviso}>
            <Boton titulo="Activar recordatorios" onPress={onActivar} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.aviso, styles.avisoNegado]}>
      <Ionicons name="notifications-off-outline" size={22} color={colores.error} />
      <Text style={[styles.cuerpoAviso, styles.textoAviso]}>
        Activa las notificaciones para recibir recordatorios. Puedes hacerlo en la configuración del teléfono.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16 },
  separador: { height: 12 },
  vacio: { fontSize: 16, color: colores.textoSecundario, textAlign: 'center', marginTop: 48 },
  aviso: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colores.primarioSuave,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  avisoNegado: { backgroundColor: '#FEF2F2' },
  textoAviso: { flex: 1, gap: 4 },
  tituloAviso: { fontSize: 16, fontWeight: '700', color: colores.texto },
  cuerpoAviso: { fontSize: 14, lineHeight: 20, color: colores.texto },
  botonAviso: { marginTop: 8 },
});
