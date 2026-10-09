import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores } from '@/theme/colores';
import { useLoginViewModel } from '@/viewmodels/useLoginViewModel';

/**
 * Pantalla Login (specs/features/F01-inicio-sesion-biometria.md).
 * Solo muestra el estado del ViewModel; la biometría se agrega en la implementación de F01.
 */
export default function LoginScreen() {
  const vm = useLoginViewModel();

  async function alEntrar() {
    const exito = await vm.entrar();
    if (exito) router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>ECE-FIAD</Text>
        <Text style={styles.subtitulo}>Expediente Clínico Electrónico</Text>
      </View>

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
          onSubmitEditing={alEntrar}
        />

        {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}

        <Boton titulo="Entrar" onPress={alEntrar} deshabilitado={!vm.puedeEnviar} cargando={vm.cargando} />
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
