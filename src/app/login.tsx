import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, CircleAlert, Fingerprint, HeartPulse, Lock, Mail, Stethoscope, TriangleAlert } from 'lucide-react-native';
import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { Avatar } from '@/components/ui/Avatar';
import { Campo, type RefCampo } from '@/components/ui/Campo';
import { Anillos, Logotipo, Olas } from '@/components/ui/Marea';
import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import { colores, DEGRADADO_MAREA } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';
import { primerNombre } from '@/utils/tiempo';
import { useLoginViewModel } from '@/viewmodels/useLoginViewModel';

const CUENTAS_DEMO = [
  { titulo: 'Médico', correo: 'medico@ecefiad.mx', icono: Stethoscope },
  { titulo: 'Paciente', correo: 'paciente@ecefiad.mx', icono: HeartPulse },
];

/**
 * Pantalla Login (specs/features/F01-inicio-sesion-biometria.md).
 * Solo muestra el estado del ViewModel: acceso con huella o rostro si hay una sesión guardada,
 * y siempre el formulario de correo y contraseña.
 */
export default function LoginScreen() {
  const vm = useLoginViewModel(() => router.replace('/'));
  const { top, bottom } = useSafeAreaInsets();
  const campoContrasena = useRef<RefCampo>(null);

  function usarCuenta(correo: string) {
    vm.setCorreo(correo);
    campoContrasena.current?.focus();
  }

  return (
    <KeyboardAvoidingView style={styles.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.contenido, { paddingBottom: bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.heroe, { paddingTop: top + 48 }]}>
          <LinearGradient colors={DEGRADADO_MAREA} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
          <Anillos tamano={360} style={styles.anillosArriba} />
          <Anillos tamano={220} style={styles.anillosAbajo} />

          <Animated.View entering={FadeInDown.duration(600)} style={styles.marca}>
            <Logotipo tamano={68} />
            <Texto variante="display" color={colores.blanco} style={styles.nombreApp}>
              ECE-FIAD
            </Texto>
            <Texto variante="cuerpo" color="rgba(255,255,255,0.78)" centrado>
              Tu expediente clínico electrónico,{'\n'}siempre contigo.
            </Texto>
          </Animated.View>
          <Olas alto={64} colorFinal={colores.blanco} />
        </View>

        <Animated.View entering={FadeInUp.delay(150).duration(600)} style={styles.formulario}>
          {vm.sesionGuardada ? (
            <View style={styles.biometria}>
              <Avatar nombre={vm.sesionGuardada.nombre} tamano={52} />
              <Texto variante="titulo2" centrado>
                Hola de nuevo, {primerNombre(vm.sesionGuardada.nombre)}
              </Texto>
              <Presionable
                onPress={vm.entrarConBiometria}
                disabled={vm.verificando}
                escala={0.92}
                accessibilityRole="button"
                accessibilityLabel="Entrar con huella o rostro"
                style={[styles.botonHuella, sombras.media, vm.verificando && styles.inactivo]}
              >
                <LinearGradient colors={[colores.marea, colores.mareaProfunda]} style={StyleSheet.absoluteFill} />
                <Fingerprint size={36} color={colores.blanco} strokeWidth={1.8} />
              </Presionable>
              <Texto variante="secundario" color={colores.pizarra}>
                {vm.verificando ? 'Verificando…' : 'Toca para entrar con huella o rostro'}
              </Texto>
              <View style={styles.separador}>
                <View style={styles.lineaSeparador} />
                <Texto variante="etiqueta" color={colores.niebla}>
                  o con tu contraseña
                </Texto>
                <View style={styles.lineaSeparador} />
              </View>
            </View>
          ) : (
            <View style={styles.encabezadoForm}>
              <Texto variante="titulo1">Inicia sesión</Texto>
              <Texto variante="cuerpo" color={colores.pizarra}>
                Usa la cuenta que te dio la clínica.
              </Texto>
            </View>
          )}

          {vm.aviso ? <Aviso icono="advertencia" texto={vm.aviso} /> : null}

          <Campo
            etiqueta="Correo"
            icono={Mail}
            value={vm.correo}
            onChangeText={vm.setCorreo}
            placeholder="nombre@ecefiad.mx"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => campoContrasena.current?.focus()}
            error={!!vm.error}
          />
          <Campo
            ref={campoContrasena}
            etiqueta="Contraseña"
            icono={Lock}
            secreto
            value={vm.contrasena}
            onChangeText={vm.setContrasena}
            placeholder="Tu contraseña"
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={vm.entrar}
            error={!!vm.error}
          />

          {vm.error ? <Aviso icono="error" texto={vm.error} /> : null}

          <View style={styles.boton}>
            <Boton
              titulo="Entrar"
              icono={ArrowRight}
              iconoAlFinal
              onPress={vm.entrar}
              deshabilitado={!vm.puedeEnviar}
              cargando={vm.cargando}
              ancho
            />
            {vm.lento ? (
              <Texto variante="secundario" color={colores.pizarra} centrado style={styles.lento}>
                Despertando el servidor… la primera vez del día puede tardar hasta un minuto.
              </Texto>
            ) : null}
          </View>

          <View style={styles.demo}>
            <Texto variante="mayusculas" color={colores.niebla} centrado>
              Cuentas de demostración
            </Texto>
            <View style={styles.chips}>
              {CUENTAS_DEMO.map(({ titulo, correo, icono: Icono }) => (
                <Presionable
                  key={correo}
                  onPress={() => usarCuenta(correo)}
                  accessibilityRole="button"
                  accessibilityLabel={`Usar la cuenta de ${titulo.toLowerCase()}`}
                  style={[styles.chip, vm.correo === correo && styles.chipActivo]}
                >
                  <Icono size={16} color={colores.marea} />
                  <Texto variante="etiqueta" color={colores.mareaProfunda}>
                    {titulo}
                  </Texto>
                </Presionable>
              ))}
            </View>
          </View>

          <Texto variante="secundario" color={colores.niebla} centrado style={styles.pie}>
            FIAD · UABC
          </Texto>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Aviso({ icono, texto }: { icono: 'error' | 'advertencia'; texto: string }) {
  const esError = icono === 'error';
  const Icono = esError ? CircleAlert : TriangleAlert;
  const color = esError ? colores.coral : colores.ambar;
  return (
    <View
      style={[styles.aviso, { backgroundColor: esError ? colores.coralSuave : colores.ambarSuave }]}
      accessibilityRole="alert"
    >
      <Icono size={18} color={color} />
      <Texto variante="secundario" color={color} style={styles.textoAviso}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.blanco },
  contenido: { flexGrow: 1 },
  heroe: { overflow: 'hidden', paddingBottom: 84, backgroundColor: colores.mareaProfunda },
  anillosArriba: { position: 'absolute', top: -140, right: -150 },
  anillosAbajo: { position: 'absolute', bottom: -40, left: -110 },
  marca: { alignItems: 'center', gap: 10, paddingHorizontal: 24 },
  nombreApp: { marginTop: 8, fontSize: 38, lineHeight: 42 },
  formulario: { flex: 1, paddingHorizontal: 24, gap: 18, marginTop: -8 },
  encabezadoForm: { gap: 4, marginBottom: 2 },
  biometria: { alignItems: 'center', gap: 12 },
  botonHuella: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  inactivo: { opacity: 0.6 },
  separador: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', marginTop: 8 },
  lineaSeparador: { flex: 1, height: 1, backgroundColor: colores.linea },
  aviso: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: radios.m },
  textoAviso: { flex: 1 },
  boton: { marginTop: 4 },
  lento: { marginTop: 10 },
  demo: { gap: 10, marginTop: 8 },
  chips: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radios.total,
    backgroundColor: colores.mareaSuave,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActivo: { borderColor: colores.marea },
  pie: { marginTop: 'auto', paddingTop: 16 },
});
