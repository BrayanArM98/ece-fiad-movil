import { CircleAlert, Hospital, LocateFixed, MapPin, Navigation, Phone, Siren, Stethoscope } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import type { TipoClinica } from '@/models/Clinica';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, fuentes, radios, sombras } from '@/theme/tema';
import {
  useClinicaViewModel,
  type ClinicaConDistancia,
  type EstadoClinica,
  type FiltroClinicas,
} from '@/viewmodels/useClinicaViewModel';

const ACERCAMIENTO = { latitudeDelta: 0.012, longitudeDelta: 0.012 };
const SEPARACION = 12;
const ALTO_TARJETA = 196;

const FILTROS: { valor: FiltroClinicas; titulo: string }[] = [
  { valor: 'todas', titulo: 'Todas' },
  { valor: 'hospital', titulo: 'Hospitales' },
  { valor: 'clinica', titulo: 'Clínicas' },
];

const COLOR_TIPO: Record<TipoClinica, string> = {
  propia: colores.marea,
  hospital: colores.coral,
  clinica: colores.verde,
};

/**
 * Pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * Mapa con la clínica ECE-FIAD y los hospitales y clínicas reales cercanos (OpenStreetMap).
 * Debajo, un carrusel de tarjetas: al deslizarlo el mapa se centra en cada lugar.
 * Estados: buscando ubicación, con ubicación, sin permiso y sin señal.
 */
export default function ClinicaScreen() {
  const vm = useClinicaViewModel();
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const mapa = useRef<MapView>(null);
  const carrusel = useRef<FlatList<ClinicaConDistancia>>(null);
  const [mapaListo, setMapaListo] = useState(false);
  const [encuadrado, setEncuadrado] = useState(false);

  const anchoTarjeta = width - 48;
  const baseDelPanel = ALTO_BARRA_PESTANAS + bottom;
  const altoPanel = ALTO_TARJETA + 56;

  // Al llegar las clínicas, el mapa encuadra al paciente (o la clínica) y los lugares más cercanos
  useEffect(() => {
    if (!mapaListo || vm.buscandoClinicas || encuadrado) return;
    const puntos = vm.clinicas.slice(0, 4).map((c) => c.coordenadas);
    if (vm.posicion) puntos.push(vm.posicion);
    mapa.current?.fitToCoordinates(puntos, {
      edgePadding: { top: top + 90, right: 50, bottom: baseDelPanel + altoPanel + 20, left: 50 },
      animated: true,
    });
    setEncuadrado(true);
  }, [mapaListo, vm.buscandoClinicas, vm.clinicas, vm.posicion, encuadrado, top, baseDelPanel, altoPanel]);

  function enfocar(clinica: ClinicaConDistancia) {
    mapa.current?.animateToRegion({ ...clinica.coordenadas, ...ACERCAMIENTO }, 450);
  }

  function alTocarMarcador(clinica: ClinicaConDistancia) {
    vm.seleccionar(clinica.id);
    const indice = vm.clinicas.findIndex((c) => c.id === clinica.id);
    if (indice >= 0) carrusel.current?.scrollToIndex({ index: indice, animated: true });
    enfocar(clinica);
  }

  function alDeslizar(desplazamiento: number) {
    const indice = Math.round(desplazamiento / (anchoTarjeta + SEPARACION));
    const clinica = vm.clinicas[Math.min(Math.max(indice, 0), vm.clinicas.length - 1)];
    if (clinica && clinica.id !== vm.seleccionada.id) {
      vm.seleccionar(clinica.id);
      enfocar(clinica);
    }
  }

  return (
    <View style={styles.pantalla}>
      <MapView
        ref={mapa}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...vm.seleccionada.coordenadas, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
        showsUserLocation={vm.estado === 'conUbicacion'}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onMapReady={() => setMapaListo(true)}
        mapPadding={{ top: top + 70, right: 0, bottom: baseDelPanel + altoPanel, left: 0 }}
      >
        {vm.clinicas.map((clinica) => (
          <Marker
            key={clinica.id}
            coordinate={clinica.coordenadas}
            title={clinica.nombre}
            description={clinica.distanciaTexto ? `A ${clinica.distanciaTexto}` : clinica.direccion}
            onPress={() => alTocarMarcador(clinica)}
            zIndex={clinica.id === vm.seleccionada.id ? 10 : clinica.tipo === 'propia' ? 5 : 1}
          >
            <Pin tipo={clinica.tipo} activo={clinica.id === vm.seleccionada.id} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.encabezado, { top: top + 10 }]} pointerEvents="box-none">
        <View style={[styles.chipTitulo, sombras.media]}>
          <MapPin size={16} color={colores.marea} />
          <Texto variante="cuerpoFuerte">Clínicas cerca de ti</Texto>
        </View>
        <EstadoUbicacion estado={vm.estado} buscandoClinicas={vm.buscandoClinicas} />
      </View>

      <Animated.View entering={FadeInUp.duration(500)} style={[styles.panel, { bottom: baseDelPanel + 6 }]}>
        <View style={styles.filtros}>
          {FILTROS.map(({ valor, titulo }) => (
            <Presionable
              key={valor}
              onPress={() => {
                vm.setFiltro(valor);
                vm.seleccionar('ece-fiad');
                carrusel.current?.scrollToOffset({ offset: 0, animated: true });
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: vm.filtro === valor }}
              style={[styles.filtro, vm.filtro === valor && styles.filtroActivo, sombras.baja]}
            >
              <Texto variante="etiqueta" color={vm.filtro === valor ? colores.blanco : colores.tinta}>
                {titulo}
              </Texto>
            </Presionable>
          ))}
          <View style={styles.flex} />
          <Text style={styles.atribucion}>© OpenStreetMap</Text>
        </View>

        <FlatList
          ref={carrusel}
          data={vm.clinicas}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={anchoTarjeta + SEPARACION}
          decelerationRate="fast"
          contentContainerStyle={styles.carrusel}
          ItemSeparatorComponent={() => <View style={{ width: SEPARACION }} />}
          getItemLayout={(_d, index) => ({
            length: anchoTarjeta + SEPARACION,
            offset: (anchoTarjeta + SEPARACION) * index,
            index,
          })}
          onMomentumScrollEnd={(e) => alDeslizar(e.nativeEvent.contentOffset.x)}
          renderItem={({ item }) => (
            <TarjetaClinica
              clinica={item}
              ancho={anchoTarjeta}
              activa={item.id === vm.seleccionada.id}
              onComoLlegar={() => vm.comoLlegar(item)}
              onLlamar={() => vm.llamar(item)}
            />
          )}
          ListFooterComponent={
            vm.buscandoClinicas ? (
              <View style={[styles.cargandoTarjeta, { width: anchoTarjeta * 0.6, marginLeft: SEPARACION }]}>
                <ActivityIndicator color={colores.marea} />
                <Texto variante="secundario" color={colores.pizarra} centrado>
                  Buscando hospitales y clínicas cercanas…
                </Texto>
              </View>
            ) : vm.totalCercanas === 0 ? (
              <View style={[styles.cargandoTarjeta, { width: anchoTarjeta * 0.6, marginLeft: SEPARACION }]}>
                <Texto variante="secundario" color={colores.pizarra} centrado>
                  No encontramos otros hospitales en 8 km.
                </Texto>
              </View>
            ) : undefined
          }
        />
      </Animated.View>
    </View>
  );
}

/** Marcador sin SVG (en Android los marcadores con SVG pueden quedar en blanco). */
function Pin({ tipo, activo }: { tipo: TipoClinica; activo: boolean }) {
  const color = COLOR_TIPO[tipo];
  const tamano = tipo === 'propia' || activo ? 40 : 30;
  return (
    <View style={styles.pin}>
      <View
        style={[
          styles.cabezaPin,
          { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: color },
          activo && styles.pinActivo,
        ]}
      >
        {tipo === 'hospital' ? (
          <Text style={[styles.letraPin, { fontSize: tamano * 0.45 }]}>H</Text>
        ) : (
          <>
            <View style={[styles.cruzV, { height: tamano * 0.45, width: tamano * 0.15 }]} />
            <View style={[styles.cruzH, { width: tamano * 0.45, height: tamano * 0.15 }]} />
          </>
        )}
      </View>
      <View style={styles.puntaPin} />
    </View>
  );
}

interface TarjetaClinicaProps {
  clinica: ClinicaConDistancia;
  ancho: number;
  activa: boolean;
  onComoLlegar: () => void;
  onLlamar: () => void;
}

function TarjetaClinica({ clinica, ancho, activa, onComoLlegar, onLlamar }: TarjetaClinicaProps) {
  const Icono = clinica.tipo === 'hospital' ? Hospital : Stethoscope;
  const color = COLOR_TIPO[clinica.tipo];
  const etiquetaTipo = clinica.tipo === 'propia' ? 'Tu clínica' : clinica.tipo === 'hospital' ? 'Hospital' : 'Clínica';

  return (
    <View style={[styles.tarjeta, { width: ancho }, activa ? sombras.alta : sombras.media, activa && styles.tarjetaActiva]}>
      <View style={styles.cabeceraTarjeta}>
        <View style={[styles.iconoTarjeta, { backgroundColor: `${color}1A` }]}>
          <Icono size={22} color={color} />
        </View>
        <View style={styles.flex}>
          <View style={styles.etiquetas}>
            <View style={[styles.insignia, { backgroundColor: `${color}1A` }]}>
              <Texto variante="etiqueta" color={color}>
                {etiquetaTipo}
              </Texto>
            </View>
            {clinica.urgencias ? (
              <View style={[styles.insignia, { backgroundColor: colores.coralSuave }]}>
                <Siren size={12} color={colores.coral} />
                <Texto variante="etiqueta" color={colores.coral}>
                  Urgencias
                </Texto>
              </View>
            ) : null}
          </View>
          <Texto variante="titulo3" numberOfLines={1}>
            {clinica.nombre}
          </Texto>
        </View>
      </View>

      <View style={styles.filaDato}>
        <Navigation size={14} color={colores.marea} />
        <Texto variante="etiqueta" color={colores.mareaProfunda}>
          {clinica.distanciaTexto ? `A ${clinica.distanciaTexto} de ti` : 'Activa tu ubicación para ver la distancia'}
        </Texto>
      </View>
      <View style={styles.filaDato}>
        <MapPin size={14} color={colores.pizarra} />
        <Texto variante="secundario" color={colores.pizarra} numberOfLines={1} style={styles.flex}>
          {clinica.direccion ?? 'Dirección no registrada en el mapa'}
        </Texto>
      </View>

      <View style={styles.botones}>
        <View style={styles.flex}>
          <Boton titulo="Cómo llegar" icono={Navigation} tamano="compacto" onPress={onComoLlegar} ancho />
        </View>
        {clinica.telefono ? (
          <View style={styles.flex}>
            <Boton titulo="Llamar" icono={Phone} variante="suave" tamano="compacto" onPress={onLlamar} ancho />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function EstadoUbicacion({ estado, buscandoClinicas }: { estado: EstadoClinica; buscandoClinicas: boolean }) {
  if (estado === 'buscando') {
    return (
      <View style={[styles.aviso, sombras.baja]}>
        <ActivityIndicator size="small" color={colores.marea} />
        <Texto variante="etiqueta">Buscando tu ubicación</Texto>
      </View>
    );
  }
  if (estado === 'conUbicacion') {
    return buscandoClinicas ? null : (
      <View style={[styles.aviso, sombras.baja]}>
        <LocateFixed size={14} color={colores.marea} />
        <Texto variante="etiqueta">Ordenadas por cercanía</Texto>
      </View>
    );
  }
  const mensaje =
    estado === 'sinSenal' ? 'No se pudo obtener tu ubicación' : 'Activa tu ubicación para ver qué tan lejos estás';
  return (
    <View style={[styles.aviso, sombras.baja]}>
      <CircleAlert size={14} color={colores.ambar} />
      <Texto variante="etiqueta" style={styles.flexTexto}>
        {mensaje}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.mareaSuave },
  flex: { flex: 1 },
  flexTexto: { flexShrink: 1 },
  encabezado: { position: 'absolute', left: 16, right: 16, alignItems: 'center', gap: 8 },
  chipTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radios.total,
    backgroundColor: colores.blanco,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radios.total,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  pin: { alignItems: 'center' },
  cabezaPin: { borderWidth: 3, borderColor: colores.blanco, alignItems: 'center', justifyContent: 'center' },
  pinActivo: { borderWidth: 4 },
  letraPin: { color: colores.blanco, fontFamily: fuentes.display },
  cruzV: { position: 'absolute', borderRadius: 2, backgroundColor: colores.blanco },
  cruzH: { position: 'absolute', borderRadius: 2, backgroundColor: colores.blanco },
  puntaPin: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colores.blanco,
  },
  panel: { position: 'absolute', left: 0, right: 0, gap: 10 },
  filtros: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24 },
  filtro: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radios.total,
    backgroundColor: colores.blanco,
  },
  filtroActivo: { backgroundColor: colores.marea },
  atribucion: {
    fontSize: 10,
    color: colores.pizarra,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  carrusel: { paddingHorizontal: 24, paddingBottom: 4 },
  tarjeta: {
    height: ALTO_TARJETA,
    padding: 16,
    gap: 10,
    borderRadius: radios.xl,
    backgroundColor: colores.blanco,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tarjetaActiva: { borderColor: colores.mareaClara },
  cabeceraTarjeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconoTarjeta: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  etiquetas: { flexDirection: 'row', gap: 6, marginBottom: 3 },
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radios.total,
  },
  filaDato: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botones: { flexDirection: 'row', gap: 10, marginTop: 'auto' },
  cargandoTarjeta: {
    height: ALTO_TARJETA,
    padding: 16,
    gap: 10,
    borderRadius: radios.xl,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
