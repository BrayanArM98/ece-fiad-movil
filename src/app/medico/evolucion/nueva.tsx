import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { CircleAlert, Save } from 'lucide-react-native';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { CampoTexto } from '@/components/CampoTexto';
import { SelectorFechaHora } from '@/components/SelectorFechaHora';
import { SelectorFotos } from '@/components/SelectorFotos';
import { Avatar } from '@/components/ui/Avatar';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';
import { LIMITES_EVOLUCION } from '@/utils/validaciones';
import { useNuevaEvolucionViewModel } from '@/viewmodels/useNuevaEvolucionViewModel';

/**
 * Formulario de nueva evolución (specs/features/F04-registrar-evolucion.md).
 * Incluye las fotografías de la evolución (specs/features/F05-fotografia-evolucion.md).
 */
export default function NuevaEvolucionScreen() {
  const { historiaId, pacienteId } = useLocalSearchParams<{ historiaId: string; pacienteId: string }>();
  const vm = useNuevaEvolucionViewModel(Number(historiaId), Number(pacienteId));
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

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
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banda} />
        <Tarjeta elevada style={styles.paciente}>
          <Avatar nombre={vm.nombrePaciente || 'Paciente'} tamano={46} />
          <View style={styles.flex}>
            <Texto variante="mayusculas" color={colores.niebla}>
              Paciente
            </Texto>
            <Texto variante="titulo3" numberOfLines={1}>
              {vm.nombrePaciente || 'Cargando…'}
            </Texto>
          </View>
        </Tarjeta>

        <Tarjeta style={styles.formulario}>
          <SelectorFechaHora
            etiqueta="Fecha de la consulta"
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
        </Tarjeta>

        <Tarjeta style={styles.formulario}>
          <SelectorFotos
            fotos={vm.fotos}
            maximo={LIMITES_EVOLUCION.fotos}
            puedeAgregar={vm.puedeAgregarFoto}
            aviso={vm.avisoFotos}
            onAgregar={vm.agregarFoto}
            onQuitar={vm.quitarFoto}
          />
        </Tarjeta>

        {vm.errorEnvio ? (
          <View style={styles.error} accessibilityRole="alert">
            <CircleAlert size={18} color={colores.coral} />
            <Texto variante="secundario" color={colores.coral} style={styles.flex}>
              {vm.errorEnvio}
            </Texto>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.pie, { paddingBottom: bottom + 12 }, sombras.media]}>
        <Boton
          titulo="Guardar evolución"
          icono={Save}
          onPress={alGuardar}
          deshabilitado={!vm.puedeGuardar || !!vm.errorFecha}
          cargando={vm.enviando}
          ancho
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  flex: { flex: 1 },
  contenido: { padding: 20, paddingTop: 12, gap: 14, paddingBottom: 32 },
  banda: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: colores.mareaProfunda,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  paciente: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radios.xl },
  formulario: { gap: 18, padding: 18 },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: radios.m, backgroundColor: colores.coralSuave },
  pie: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colores.blanco,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.linea,
  },
});
