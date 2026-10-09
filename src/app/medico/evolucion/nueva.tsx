import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { CampoTexto } from '@/components/CampoTexto';
import { SelectorFechaHora } from '@/components/SelectorFechaHora';
import { colores } from '@/theme/colores';
import { LIMITES_EVOLUCION } from '@/utils/validaciones';
import { useNuevaEvolucionViewModel } from '@/viewmodels/useNuevaEvolucionViewModel';

/**
 * Formulario de nueva evolución (specs/features/F04-registrar-evolucion.md).
 * Las fotografías (F05) se agregan sobre este mismo formulario.
 */
export default function NuevaEvolucionScreen() {
  const { historiaId, pacienteId } = useLocalSearchParams<{ historiaId: string; pacienteId: string }>();
  const vm = useNuevaEvolucionViewModel(Number(historiaId), Number(pacienteId));
  const navigation = useNavigation();

  // F04: preguntar antes de descartar lo capturado al salir sin guardar
  usePreventRemove(vm.debeConfirmarSalida, ({ data }) => {
    Alert.alert('¿Descartar la evolución?', 'Los datos que capturaste se perderán.', [
      { text: 'Seguir editando', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  async function alGuardar() {
    const exito = await vm.guardar();
    if (exito) {
      Alert.alert('Evolución registrada', 'La evolución se agregó al historial del paciente.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        {vm.nombrePaciente ? (
          <View>
            <Text style={styles.etiquetaPaciente}>Paciente</Text>
            <Text style={styles.paciente}>{vm.nombrePaciente}</Text>
          </View>
        ) : null}

        <SelectorFechaHora
          etiqueta="Fecha"
          valor={vm.fecha}
          texto={vm.fechaTexto}
          onCambiar={vm.setFecha}
          error={vm.errorFecha}
        />

        <CampoTexto
          etiqueta="Diagnóstico"
          obligatorio
          valor={vm.diagnostico}
          onCambiar={vm.setDiagnostico}
          maximo={LIMITES_EVOLUCION.diagnostico}
          placeholder="Diagnóstico de la consulta"
        />

        <CampoTexto
          etiqueta="Tratamiento"
          obligatorio
          valor={vm.tratamiento}
          onCambiar={vm.setTratamiento}
          maximo={LIMITES_EVOLUCION.tratamiento}
          placeholder="Medicamentos, dosis e indicaciones"
        />

        <CampoTexto
          etiqueta="Notas"
          valor={vm.notas}
          onCambiar={vm.setNotas}
          maximo={LIMITES_EVOLUCION.notas}
          placeholder="Observaciones adicionales (opcional)"
        />

        {vm.errorEnvio ? <Text style={styles.errorEnvio}>{vm.errorEnvio}</Text> : null}

        <Boton
          titulo="Guardar"
          onPress={alGuardar}
          deshabilitado={!vm.puedeGuardar || !!vm.errorFecha}
          cargando={vm.enviando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 20, paddingBottom: 40 },
  etiquetaPaciente: { fontSize: 12, fontWeight: '700', color: colores.primario, textTransform: 'uppercase' },
  paciente: { fontSize: 20, fontWeight: '700', color: colores.texto },
  errorEnvio: { fontSize: 14, color: colores.error },
});
