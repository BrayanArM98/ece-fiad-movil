import { CircleAlert, Hospital, MapPin, Navigation, Phone } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, radios, sombras } from '@/theme/tema';
import { useClinicaViewModel, type EstadoClinica } from '@/viewmodels/useClinicaViewModel';

const ACERCAMIENTO = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

/**
 * Pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * Mapa a pantalla completa con una tarjeta flotante sobre la barra de pestañas.
 * Estados: buscando ubicación, con ubicación, sin permiso y sin señal.
 */
export default function ClinicaScreen() {
  const vm = useClinicaViewModel();
  const { top, bottom } = useSafeAreaInsets();
  const mapa = useRef<MapView>(null);
  const [mapaListo, setMapaListo] = useState(false);
  const [altoPanel, setAltoPanel] = useState(260);
  const baseDelPanel = ALTO_BARRA_PESTANAS + bottom;

  // Con la posición del paciente, el mapa se ajusta para que se vean ambos puntos sin quedar bajo la tarjeta
  useEffect(() => {
    if (mapaListo && vm.posicion) {
      mapa.current?.fitToCoordinates([vm.posicion, vm.clinica.coordenadas], {
        edgePadding: { top: top + 80, right: 60, bottom: baseDelPanel + altoPanel + 20, left: 60 },
        animated: true,
      });
    }
  }, [mapaListo, vm.posicion, vm.clinica.coordenadas, top, baseDelPanel, altoPanel]);

  return (
    <View style={styles.pantalla}>
      <MapView
        ref={mapa}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...vm.clinica.coordenadas, ...ACERCAMIENTO }}
        showsUserLocation={vm.estado === 'conUbicacion'}
        onMapReady={() => setMapaListo(true)}
        mapPadding={{ top: top + 56, right: 0, bottom: baseDelPanel + altoPanel, left: 0 }}
      >
        <Marker coordinate={vm.clinica.coordenadas} title={vm.clinica.nombre} description={vm.clinica.direccion}>
          <View style={styles.pin}>
            {/* Solo vistas, sin SVG: en Android los marcadores con SVG pueden quedar en blanco */}
            <View style={styles.cabezaPin}>
              <View style={styles.cruzVertical} />
              <View style={styles.cruzHorizontal} />
            </View>
            <View style={styles.puntaPin} />
          </View>
        </Marker>
      </MapView>

      <View style={[styles.chipSuperior, { top: top + 12 }, sombras.media]}>
        <MapPin size={15} color={colores.marea} />
        <Texto variante="etiqueta" color={colores.tinta}>
          Cómo llegar a tu clínica
        </Texto>
      </View>

      <Animated.View
        entering={FadeInUp.duration(500)}
        onLayout={(e) => setAltoPanel(e.nativeEvent.layout.height)}
        style={[styles.panel, { bottom: baseDelPanel + 8 }, sombras.alta]}
      >
        <View style={styles.cabecera}>
          <View style={styles.iconoClinica}>
            <Hospital size={22} color={colores.marea} />
          </View>
          <View style={styles.flex}>
            <Texto variante="titulo2">{vm.clinica.nombre}</Texto>
            <EstadoUbicacion estado={vm.estado} distancia={vm.distancia} />
          </View>
        </View>

        <View style={styles.datos}>
          <Fila icono={MapPin} texto={vm.clinica.direccion} />
          <Fila icono={Phone} texto={vm.clinica.telefono} />
        </View>

        <View style={styles.botones}>
          <View style={styles.flex}>
            <Boton titulo="Cómo llegar" icono={Navigation} onPress={vm.comoLlegar} ancho />
          </View>
          <View style={styles.flex}>
            <Boton titulo="Llamar" icono={Phone} variante="suave" onPress={vm.llamarClinica} ancho />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function Fila({ icono: Icono, texto }: { icono: typeof MapPin; texto: string }) {
  return (
    <View style={styles.fila}>
      <Icono size={16} color={colores.pizarra} />
      <Texto variante="secundario" color={colores.tinta} style={styles.flex}>
        {texto}
      </Texto>
    </View>
  );
}

function EstadoUbicacion({ estado, distancia }: { estado: EstadoClinica; distancia: string | null }) {
  if (estado === 'buscando') {
    return (
      <View style={styles.fila}>
        <ActivityIndicator size="small" color={colores.marea} />
        <Texto variante="secundario" color={colores.pizarra}>
          Buscando tu ubicación
        </Texto>
      </View>
    );
  }
  if (estado === 'conUbicacion' && distancia) {
    return (
      <View style={styles.distancia}>
        <Navigation size={13} color={colores.marea} />
        <Texto variante="etiqueta" color={colores.mareaProfunda}>
          A {distancia} de ti
        </Texto>
      </View>
    );
  }
  const mensaje =
    estado === 'sinSenal' ? 'No se pudo obtener tu ubicación' : 'Activa tu ubicación para ver qué tan lejos estás';
  return (
    <View style={styles.fila}>
      <CircleAlert size={15} color={colores.ambar} />
      <Texto variante="secundario" color={colores.pizarra} style={styles.flex}>
        {mensaje}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.mareaSuave },
  flex: { flex: 1 },
  pin: { alignItems: 'center' },
  cabezaPin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colores.marea,
    borderWidth: 3,
    borderColor: colores.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cruzVertical: { position: 'absolute', width: 6, height: 18, borderRadius: 3, backgroundColor: colores.blanco },
  cruzHorizontal: { position: 'absolute', width: 18, height: 6, borderRadius: 3, backgroundColor: colores.blanco },
  puntaPin: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colores.blanco,
  },
  chipSuperior: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radios.total,
    backgroundColor: colores.blanco,
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 18,
    gap: 14,
    borderRadius: radios.xl,
    backgroundColor: colores.blanco,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconoClinica: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datos: { gap: 8 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  distancia: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radios.total,
    backgroundColor: colores.mareaSuave,
  },
  botones: { flexDirection: 'row', gap: 10 },
});
