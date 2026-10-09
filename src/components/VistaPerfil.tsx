import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { PanelSimulacion } from '@/components/PanelSimulacion';
import { colores } from '@/theme/colores';
import { usePerfilViewModel } from '@/viewmodels/usePerfilViewModel';

/**
 * Vista de la pestaña Perfil. La usan las pestañas del médico y del paciente.
 */
export function VistaPerfil() {
  const { nombre, rolTexto, cerrarSesion } = usePerfilViewModel();

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.rol}>{rolTexto}</Text>
      </View>
      <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
      <PanelSimulacion />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 24, gap: 24 },
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
