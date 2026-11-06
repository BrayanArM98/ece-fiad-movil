import { router } from 'expo-router';
import { CloudOff, Search, SearchX, UsersRound, X } from 'lucide-react-native';
import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MensajePantalla } from '@/components/EstadosPantalla';
import { FilaPaciente } from '@/components/FilaPaciente';
import { EsqueletoLista } from '@/components/ui/Esqueleto';
import { EncabezadoMarea } from '@/components/ui/Marea';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, fuentes, radios } from '@/theme/tema';
import { usePacientesViewModel } from '@/viewmodels/usePacientesViewModel';

/**
 * Pestaña Pacientes: pacientes activos ordenados por apellido, con búsqueda.
 * Es el segundo punto de entrada al historial (specs/features/F03-historial-paciente.md).
 */
export default function PacientesScreen() {
  const vm = usePacientesViewModel();
  const { bottom } = useSafeAreaInsets();

  const encabezado = (
    <EncabezadoMarea>
      <Texto variante="mayusculas" color="rgba(255,255,255,0.7)">
        {vm.estado === 'listo' ? `${vm.total} ${vm.total === 1 ? 'paciente activo' : 'pacientes activos'}` : 'Expedientes'}
      </Texto>
      <Texto variante="display" color={colores.blanco} style={styles.titulo}>
        Pacientes
      </Texto>
      <View style={styles.buscador}>
        <Search size={19} color="rgba(255,255,255,0.8)" />
        <TextInput
          value={vm.busqueda}
          onChangeText={vm.setBusqueda}
          placeholder="Buscar por nombre o documento"
          placeholderTextColor="rgba(255,255,255,0.6)"
          selectionColor={colores.blanco}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Buscar paciente"
          style={styles.entrada}
        />
        {vm.busqueda ? (
          <Pressable onPress={() => vm.setBusqueda('')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Borrar búsqueda">
            <X size={18} color={colores.blanco} />
          </Pressable>
        ) : null}
      </View>
    </EncabezadoMarea>
  );

  return (
    <FlatList
      style={styles.pantalla}
      contentContainerStyle={{ paddingBottom: ALTO_BARRA_PESTANAS + bottom + 16 }}
      data={vm.estado === 'listo' ? vm.pacientes : []}
      keyExtractor={(paciente) => String(paciente.id)}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <FilaPaciente
            paciente={item}
            onPress={() =>
              router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: String(item.id) } })
            }
          />
        </View>
      )}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        <View style={styles.item}>
          {vm.estado === 'cargando' ? (
            <EsqueletoLista cantidad={6} />
          ) : vm.estado === 'error' ? (
            <MensajePantalla
              enLinea
              icono={CloudOff}
              mensaje="No se pudieron cargar los pacientes"
              detalle="Revisa tu conexión e intenta de nuevo."
              accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
            />
          ) : vm.total === 0 ? (
            <MensajePantalla enLinea icono={UsersRound} mensaje="No hay pacientes activos" />
          ) : (
            <MensajePantalla
              enLinea
              icono={SearchX}
              mensaje="Sin resultados"
              detalle={`Ningún paciente coincide con "${vm.busqueda.trim()}".`}
            />
          )}
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={vm.refrescando}
          onRefresh={vm.refrescar}
          tintColor={colores.blanco}
          colors={[colores.marea]}
          progressViewOffset={40}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  titulo: { marginTop: 6, marginBottom: 18 },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: radios.m,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  entrada: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: fuentes.textoMedio,
    fontSize: 16,
    color: colores.blanco,
    paddingVertical: 0,
    outlineStyle: 'none',
  } as object,
  item: { paddingHorizontal: 20, marginBottom: 10 },
});
