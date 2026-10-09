import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores } from '@/theme/colores';
import { usePerfilViewModel } from '@/viewmodels/usePerfilViewModel';

/**
 * Vista de la pestaña Perfil. La usan las pestañas del médico y del paciente.
 */
export function VistaPerfil() {
  const { nombre, rolTexto, cerrarSesion } = usePerfilViewModel();

  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.rol}>{rolTexto}</Text>
      </View>
      <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo, padding: 24, gap: 24 },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 20,
  },
  nombre: { fontSize: 20, fontWeight: '700', color: colores.texto },
  rol: { fontSize: 15, color: colores.textoSecundario, marginTop: 4 },
});
