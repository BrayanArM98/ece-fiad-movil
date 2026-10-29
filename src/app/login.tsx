import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores } from '@/theme/colores';
import { useLoginViewModel } from '@/viewmodels/useLoginViewModel';

/**
 * Pantalla Login (specs/features/F01-inicio-sesion-biometria.md).
 * Solo muestra el estado del ViewModel: acceso con huella o rostro si hay una sesión guardada,
 * y siempre el formulario de correo y contraseña.
 */
export default function LoginScreen() {
  const vm = useLoginViewModel(() => router.replace('/'));

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>ECE-FIAD</Text>
        <Text style={styles.subtitulo}>Expediente Clínico Electrónico</Text>
      </View>

      {vm.sesionGuardada ? (
        <View style={styles.biometria}>
          <Text style={styles.saludo}>Hola de nuevo, {vm.sesionGuardada.nombre}</Text>
          <Boton
            titulo="Entrar con huella o rostro"
            onPress={vm.entrarConBiometria}
            cargando={vm.verificando}
          />
          <Text style={styles.separador}>o usa tu correo y contraseña</Text>
        </View>
      ) : null}

      {vm.aviso ? <Text style={styles.aviso}>{vm.aviso}</Text> : null}

      <View style={styles.formulario}>
        <Text style={styles.etiqueta}>Correo</Text>
        <TextInput
          style={styles.campo}
          value={vm.correo}
          onChangeText={vm.setCorreo}
          placeholder="nombre@ecefiad.mx"
          placeholderTextColor={colores.deshabilitado}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Text style={styles.etiqueta}>Contraseña</Text>
        <TextInput
          style={styles.campo}
          value={vm.contrasena}
          onChangeText={vm.setContrasena}
          placeholder="Tu contraseña"
          placeholderTextColor={colores.deshabilitado}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          onSubmitEditing={vm.entrar}
        />

        {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}

        <Boton titulo="Entrar" onPress={vm.entrar} deshabilitado={!vm.puedeEnviar} cargando={vm.cargando} />
      </View>

      <Text style={styles.ayuda}>
        Cuentas de prueba:{'\n'}medico@ecefiad.mx / medico123{'\n'}paciente@ecefiad.mx / paciente123
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: 24,
    justifyContent: 'center',
  },
  encabezado: { marginBottom: 32 },
  titulo: { fontSize: 32, fontWeight: '800', color: colores.primario },
  subtitulo: { fontSize: 16, color: colores.textoSecundario, marginTop: 4 },
  biometria: { gap: 12, marginBottom: 16 },
  saludo: { fontSize: 16, fontWeight: '600', color: colores.texto },
  separador: { fontSize: 14, color: colores.textoSecundario, textAlign: 'center' },
  aviso: { fontSize: 14, color: colores.error, marginBottom: 12 },
  formulario: { gap: 8 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto, marginTop: 8 },
  campo: {
    minHeight: 48,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colores.texto,
  },
  error: { color: colores.error, fontSize: 14, marginTop: 4 },
  ayuda: {
    marginTop: 32,
    fontSize: 13,
    lineHeight: 20,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
});
