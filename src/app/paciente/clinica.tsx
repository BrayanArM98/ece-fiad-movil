import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Boton } from '@/components/Boton';
import { colores } from '@/theme/colores';
import { useClinicaViewModel, type EstadoClinica } from '@/viewmodels/useClinicaViewModel';

const ACERCAMIENTO = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const MARGEN_MAPA = { top: 80, right: 60, bottom: 80, left: 60 };

/**
 * Pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * Estados: buscando ubicación, con ubicación, sin permiso y sin señal.
 */
export default function ClinicaScreen() {
  const vm = useClinicaViewModel();
  const mapa = useRef<MapView>(null);
  const [mapaListo, setMapaListo] = useState(false);

  // Con la posición del paciente, el mapa se ajusta para que se vean ambos puntos
  useEffect(() => {
    if (mapaListo && vm.posicion) {
      mapa.current?.fitToCoordinates([vm.posicion, vm.clinica.coordenadas], {
        edgePadding: MARGEN_MAPA,
        animated: true,
      });
    }
  }, [mapaListo, vm.posicion, vm.clinica.coordenadas]);

  return (
    <View style={styles.pantalla}>
      <MapView
        ref={mapa}
        style={styles.mapa}
        initialRegion={{ ...vm.clinica.coordenadas, ...ACERCAMIENTO }}
        showsUserLocation={vm.estado === 'conUbicacion'}
        onMapReady={() => setMapaListo(true)}
      >
        <Marker coordinate={vm.clinica.coordenadas} title={vm.clinica.nombre} description={vm.clinica.direccion} />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.nombre}>{vm.clinica.nombre}</Text>
        <Fila icono="location-outline" texto={vm.clinica.direccion} />
        <Fila icono="call-outline" texto={vm.clinica.telefono} />
        <EstadoUbicacion estado={vm.estado} distancia={vm.distancia} />

        <View style={styles.botones}>
          <View style={styles.boton}>
            <Boton titulo="Cómo llegar" onPress={vm.comoLlegar} />
          </View>
          <View style={styles.boton}>
            <Boton titulo="Llamar" variante="secundario" onPress={vm.llamarClinica} />
          </View>
        </View>
      </View>
    </View>
  );
}

function Fila({ icono, texto }: { icono: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={styles.fila}>
      <Ionicons name={icono} size={18} color={colores.textoSecundario} />
      <Text style={styles.textoFila}>{texto}</Text>
    </View>
  );
}

function EstadoUbicacion({ estado, distancia }: { estado: EstadoClinica; distancia: string | null }) {
  if (estado === 'buscando') {
    return (
      <View style={styles.fila}>
        <ActivityIndicator size="small" color={colores.primario} />
        <Text style={styles.textoFila}>Buscando tu ubicación</Text>
      </View>
    );
  }

  if (estado === 'conUbicacion' && distancia) {
    return (
      <View style={styles.fila}>
        <Ionicons name="navigate-outline" size={18} color={colores.primario} />
        <Text style={[styles.textoFila, styles.distancia]}>A {distancia} de ti</Text>
      </View>
    );
  }

  const mensaje =
    estado === 'sinSenal' ? 'No se pudo obtener tu ubicación' : 'Activa tu ubicación para ver qué tan lejos estás';
  return (
    <View style={[styles.fila, styles.aviso]}>
      <Ionicons name="alert-circle-outline" size={18} color={colores.textoSecundario} />
      <Text style={styles.textoFila}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  mapa: { flex: 1 },
  panel: {
    backgroundColor: colores.superficie,
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  nombre: { fontSize: 18, fontWeight: '700', color: colores.texto },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoFila: { flex: 1, fontSize: 14, lineHeight: 20, color: colores.texto },
  distancia: { fontWeight: '600', color: colores.primario },
  aviso: { backgroundColor: colores.fondo, borderRadius: 8, padding: 10 },
  botones: { flexDirection: 'row', gap: 12, marginTop: 4 },
  boton: { flex: 1 },
});
