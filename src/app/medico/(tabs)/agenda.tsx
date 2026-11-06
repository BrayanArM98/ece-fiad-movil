import { router } from 'expo-router';
import { CalendarCheck2, CloudOff } from 'lucide-react-native';
import { Fragment } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MensajePantalla } from '@/components/EstadosPantalla';
import { TarjetaCita } from '@/components/TarjetaCita';
import { TarjetaSiguienteCita } from '@/components/TarjetaSiguienteCita';
import { AnilloProgreso } from '@/components/ui/AnilloProgreso';
import { Avatar } from '@/components/ui/Avatar';
import { Esqueleto, EsqueletoLista } from '@/components/ui/Esqueleto';
import { EncabezadoMarea } from '@/components/ui/Marea';
import { Pulso } from '@/components/ui/Pulso';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import type { Cita } from '@/models/Cita';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, radios } from '@/theme/tema';
import { useAgendaViewModel } from '@/viewmodels/useAgendaViewModel';

const abrirCita = (cita: Cita) =>
  router.push({ pathname: '/medico/cita/[citaId]', params: { citaId: String(cita.id) } });
const abrirHistorial = (cita: Cita) =>
  router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: String(cita.idPaciente) } });

/**
 * Pestaña Agenda: citas de hoy del médico (specs/features/F02-agenda-del-dia.md).
 * Encabezado con saludo, avance del día, siguiente paciente y línea de tiempo.
 * Estados: cargando, con datos, lista vacía y error.
 */
export default function AgendaScreen() {
  const vm = useAgendaViewModel();
  const { bottom } = useSafeAreaInsets();

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
      <EncabezadoMarea espacioInferior={56}>
        <View style={styles.saludo}>
          <View style={styles.textosSaludo}>
            <Texto variante="mayusculas" color="rgba(255,255,255,0.7)">
              {vm.fechaHoy}
            </Texto>
            <Texto variante="titulo3" color="rgba(255,255,255,0.85)" style={styles.espacioSaludo}>
              {vm.saludo},
            </Texto>
            <Texto variante="display" color={colores.blanco} numberOfLines={1} adjustsFontSizeToFit>
              {vm.nombre}
            </Texto>
          </View>
          <Avatar nombre={vm.nombreCompleto} tamano={50} claro />
        </View>
      </EncabezadoMarea>

      <View style={styles.cuerpo}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.montada}>
          <ResumenDia vm={vm} />
        </Animated.View>

        {vm.estado === 'cargando' ? (
          <EsqueletoLista cantidad={3} />
        ) : vm.estado === 'error' ? (
          <MensajePantalla
            enLinea
            icono={CloudOff}
            mensaje="No se pudo cargar tu agenda"
            detalle="Revisa tu conexión e intenta de nuevo."
            accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
          />
        ) : vm.resumen.total === 0 ? (
          <MensajePantalla
            enLinea
            icono={CalendarCheck2}
            mensaje="No tienes citas programadas para hoy"
            detalle="Desliza hacia abajo para actualizar si la recepción te agenda una."
          />
        ) : (
          <>
            {vm.siguiente ? (
              <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.seccion}>
                <TarjetaSiguienteCita
                  cita={vm.siguiente}
                  hora={vm.siguienteHora}
                  falta={vm.siguienteFalta}
                  onVerCita={() => abrirCita(vm.siguiente!)}
                  onVerHistorial={() => abrirHistorial(vm.siguiente!)}
                />
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.seccion}>
              <TituloSeccion
                titulo="Tu día"
                detalle={`${vm.vigentes.length} ${vm.vigentes.length === 1 ? 'cita' : 'citas'}`}
              />
              {vm.vigentes.map((cita, i) => (
                <Fragment key={cita.id}>
                  {i === vm.indiceAhora ? <MarcaAhora hora={vm.horaActual} /> : null}
                  <TarjetaCita
                    cita={cita}
                    primera={i === 0}
                    ultima={i === vm.vigentes.length - 1}
                    destacada={cita.id === vm.siguiente?.id}
                    onPress={() => abrirCita(cita)}
                  />
                </Fragment>
              ))}
              {vm.indiceAhora === vm.vigentes.length && vm.vigentes.length > 0 ? (
                <MarcaAhora hora={vm.horaActual} />
              ) : null}
            </Animated.View>

            {vm.canceladas.length > 0 ? (
              <View style={styles.seccion}>
                <TituloSeccion titulo="Canceladas" detalle={String(vm.canceladas.length)} />
                {vm.canceladas.map((cita, i) => (
                  <TarjetaCita
                    key={cita.id}
                    cita={cita}
                    primera={i === 0}
                    ultima={i === vm.canceladas.length - 1}
                    onPress={() => abrirCita(cita)}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

/** Tarjeta montada sobre las olas: anillo de avance y tres cifras del día. */
function ResumenDia({ vm }: { vm: ReturnType<typeof useAgendaViewModel> }) {
  const cargando = vm.estado === 'cargando';
  const vigentes = vm.vigentes.length;
  return (
    <Tarjeta elevada style={styles.resumen}>
      <AnilloProgreso valor={vm.resumen.avance} tamano={78} grosor={9}>
        {cargando ? (
          <Esqueleto ancho={30} alto={16} />
        ) : (
          <>
            <Texto variante="titulo2" style={styles.cifraAnillo}>
              {Math.round(vm.resumen.avance * 100)}%
            </Texto>
          </>
        )}
      </AnilloProgreso>
      <View style={styles.cifras}>
        <Cifra valor={vigentes} etiqueta="Citas" cargando={cargando} />
        <View style={styles.divisor} />
        <Cifra valor={vm.resumen.pendientes} etiqueta="Pendientes" cargando={cargando} color={colores.ambar} />
        <View style={styles.divisor} />
        <Cifra valor={vm.resumen.atendidas} etiqueta="Atendidas" cargando={cargando} color={colores.verde} />
      </View>
    </Tarjeta>
  );
}

function Cifra({ valor, etiqueta, cargando, color = colores.tinta }: { valor: number; etiqueta: string; cargando: boolean; color?: string }) {
  return (
    <View style={styles.cifra} accessible accessibilityLabel={`${etiqueta}: ${valor}`}>
      {cargando ? <Esqueleto ancho={24} alto={26} /> : <Texto variante="cifra" color={color}>{valor}</Texto>}
      <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
        {etiqueta}
      </Texto>
    </View>
  );
}

/** Línea coral que marca la hora actual entre las citas. */
function MarcaAhora({ hora }: { hora: string }) {
  return (
    <View style={styles.ahora} accessibilityLabel={`Ahora, ${hora}`}>
      <View style={styles.chipAhora}>
        <Pulso color={colores.coral} tamano={6} />
        <Texto variante="etiqueta" color={colores.coral}>
          {hora}
        </Texto>
      </View>
      <View style={styles.lineaAhora} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  saludo: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  textosSaludo: { flex: 1 },
  espacioSaludo: { marginTop: 14 },
  cuerpo: { paddingHorizontal: 20 },
  montada: { marginTop: -84, marginBottom: 24 },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 18, borderRadius: radios.xl },
  cifraAnillo: { fontSize: 18 },
  cifras: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cifra: { flex: 1, alignItems: 'center', gap: 2 },
  divisor: { width: 1, height: 34, backgroundColor: colores.linea },
  seccion: { marginBottom: 24 },
  ahora: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: -2 },
  chipAhora: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radios.total,
    backgroundColor: colores.coralSuave,
  },
  lineaAhora: { flex: 1, height: 1.5, backgroundColor: colores.coral, opacity: 0.5 },
});
