import { router } from 'expo-router';
import { BellOff, BellRing, CalendarHeart, CloudOff } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { MensajePantalla } from '@/components/EstadosPantalla';
import { TarjetaCitaPaciente, TarjetaProximaCita } from '@/components/TarjetaCitaPaciente';
import { Avatar } from '@/components/ui/Avatar';
import { EsqueletoLista } from '@/components/ui/Esqueleto';
import { EncabezadoMarea } from '@/components/ui/Marea';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import type { EstadoPermiso } from '@/services/notificacionesService';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, radios } from '@/theme/tema';
import { useMisCitasViewModel } from '@/viewmodels/useMisCitasViewModel';

/**
 * Pestaña Mis citas (specs/features/F06-mis-citas-recordatorios.md).
 * Estados: cargando, con citas, lista vacía, error y avisos desactivados.
 */
export default function MisCitasScreen() {
  const vm = useMisCitasViewModel();
  const { bottom } = useSafeAreaInsets();
  const total = vm.citas.length;

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={{ paddingBottom: ALTO_BARRA_PESTANAS + bottom + 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={vm.refrescando}
          onRefresh={vm.refrescar}
          tintColor={colores.blanco}
          colors={[colores.marea]}
          progressViewOffset={40}
        />
      }
    >
      <EncabezadoMarea espacioInferior={vm.proxima ? 96 : 24}>
        <View style={styles.saludo}>
          <View style={styles.textosSaludo}>
            <Texto variante="mayusculas" color="rgba(255,255,255,0.7)">
              {vm.fechaHoy}
            </Texto>
            <Texto variante="display" color={colores.blanco} style={styles.nombre} numberOfLines={1}>
              Hola, {vm.nombre}
            </Texto>
            <Texto variante="cuerpo" color="rgba(255,255,255,0.8)">
              {vm.estado !== 'listo'
                ? 'Consultando tus citas…'
                : total === 0
                  ? 'No tienes citas próximas'
                  : total === 1
                    ? 'Tienes 1 cita próxima'
                    : `Tienes ${total} citas próximas`}
            </Texto>
          </View>
          <Avatar nombre={vm.nombreCompleto} tamano={50} claro />
        </View>
      </EncabezadoMarea>

      <View style={[styles.cuerpo, vm.proxima ? styles.montada : styles.normal]}>
        {vm.estado === 'cargando' ? (
          <EsqueletoLista cantidad={2} />
        ) : vm.estado === 'error' ? (
          <MensajePantalla
            enLinea
            icono={CloudOff}
            mensaje="No se pudieron cargar tus citas"
            detalle="Revisa tu conexión e intenta de nuevo."
            accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
          />
        ) : (
          <>
            {vm.proxima ? (
              <Animated.View entering={FadeInDown.duration(500)}>
                <TarjetaProximaCita
                  cita={vm.proxima}
                  ahora={vm.ahora}
                  onComoLlegar={() => router.navigate('/paciente/clinica')}
                />
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <AvisoRecordatorios permiso={vm.permiso} onActivar={vm.activarRecordatorios} />
            </Animated.View>

            {total === 0 ? (
              <MensajePantalla
                enLinea
                icono={CalendarHeart}
                mensaje="No tienes citas próximas"
                detalle="Cuando la clínica te agende una cita aparecerá aquí."
              />
            ) : null}

            {vm.siguientes.length > 0 ? (
              <Animated.View entering={FadeInDown.delay(180).duration(500)}>
                <TituloSeccion titulo="Más adelante" detalle={String(vm.siguientes.length)} />
                <View style={styles.lista}>
                  {vm.siguientes.map((cita) => (
                    <TarjetaCitaPaciente key={cita.id} cita={cita} />
                  ))}
                </View>
              </Animated.View>
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function AvisoRecordatorios({ permiso, onActivar }: { permiso: EstadoPermiso | null; onActivar: () => void }) {
  if (permiso === 'concedido' || permiso === null) return null;

  // Primera vez: se explica para qué sirven los avisos antes de pedir el permiso
  if (permiso === 'sinPreguntar') {
    return (
      <Tarjeta style={styles.aviso}>
        <View style={styles.iconoAviso}>
          <BellRing size={22} color={colores.marea} />
        </View>
        <View style={styles.textoAviso}>
          <Texto variante="cuerpoFuerte">Recordatorios de tus citas</Texto>
          <Texto variante="secundario" color={colores.pizarra}>
            Te avisaremos un día antes y una hora antes de cada cita.
          </Texto>
          <View style={styles.botonAviso}>
            <Boton titulo="Activar recordatorios" tamano="compacto" onPress={onActivar} />
          </View>
        </View>
      </Tarjeta>
    );
  }

  return (
    <View style={[styles.aviso, styles.avisoNegado]}>
      <View style={[styles.iconoAviso, { backgroundColor: colores.blanco }]}>
        <BellOff size={20} color={colores.coral} />
      </View>
      <Texto variante="secundario" color={colores.tinta} style={styles.textoAviso}>
        Activa las notificaciones para recibir recordatorios. Puedes hacerlo en la configuración del teléfono.
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  saludo: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  textosSaludo: { flex: 1, gap: 4 },
  nombre: { marginTop: 10 },
  cuerpo: { paddingHorizontal: 20, gap: 20 },
  montada: { marginTop: -118 },
  normal: { marginTop: 0 },
  lista: { gap: 12 },
  aviso: { flexDirection: 'row', gap: 14, padding: 16, borderRadius: radios.l },
  avisoNegado: { backgroundColor: colores.coralSuave, alignItems: 'center' },
  iconoAviso: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAviso: { flex: 1, gap: 4 },
  botonAviso: { marginTop: 8, alignSelf: 'flex-start' },
});
