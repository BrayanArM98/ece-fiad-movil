import { router, useLocalSearchParams } from 'expo-router';
import {
  CalendarX2,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  CloudOff,
  FileText,
  NotebookPen,
  Stethoscope,
  UserX,
  type LucideIcon,
} from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Boton } from '@/components/Boton';
import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import { Avatar } from '@/components/ui/Avatar';
import { Presionable } from '@/components/ui/Presionable';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import type { ResultadoCita } from '@/services/citasService';
import { COLOR_ESTADO, colores } from '@/theme/colores';
import { radios } from '@/theme/tema';
import { useCitaDetalleViewModel } from '@/viewmodels/useCitaDetalleViewModel';

/**
 * Detalle de la cita: hora, paciente, motivo, notas y estado.
 * Es el punto de entrada al historial desde la agenda (specs/features/F03-historial-paciente.md)
 * y donde el médico registra el resultado de la consulta.
 */
export default function CitaDetalleScreen() {
  const { citaId } = useLocalSearchParams<{ citaId: string }>();
  const vm = useCitaDetalleViewModel(Number(citaId));

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'noEncontrada') {
    return (
      <MensajePantalla
        icono={CalendarX2}
        mensaje="Cita no encontrada"
        detalle="Puede que la hayan eliminado o que no pertenezca a tu agenda."
        accion={{ titulo: 'Regresar', onPress: router.back }}
      />
    );
  }
  if (vm.estado === 'error' || !vm.cita) {
    return (
      <MensajePantalla
        icono={CloudOff}
        mensaje="No se pudo cargar la cita"
        detalle="Revisa tu conexión e intenta de nuevo."
        accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
      />
    );
  }

  const cita = vm.cita;
  const abrirHistorial = () =>
    router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: String(cita.idPaciente) } });
  const atendida = cita.estado === 'Completada' || cita.estado === 'NoAsistio';

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
      <View style={styles.banda} />

      <Animated.View entering={FadeInDown.duration(400)}>
        <Tarjeta elevada style={styles.heroe}>
          <View style={styles.filaHora}>
            <View style={styles.flex}>
              <Texto variante="display" style={styles.hora}>
                {vm.horaTexto}
              </Texto>
              <Texto variante="secundario" color={colores.pizarra}>
                {vm.fechaTexto}
              </Texto>
              <Texto variante="etiqueta" color={colores.marea} style={styles.falta}>
                {vm.faltaTexto}
              </Texto>
            </View>
            <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
          </View>
        </Tarjeta>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(400)}>
        <Tarjeta style={styles.paciente}>
          <View style={styles.filaPaciente}>
            <Avatar nombre={cita.nombrePaciente} tamano={52} />
            <View style={styles.flex}>
              <Texto variante="mayusculas" color={colores.niebla}>
                Paciente
              </Texto>
              <Texto variante="titulo3">{cita.nombrePaciente}</Texto>
            </View>
          </View>
          <Boton titulo="Ver historial clínico" icono={FileText} variante="suave" onPress={abrirHistorial} ancho />
        </Tarjeta>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)}>
        <Tarjeta style={styles.detalles}>
          <Detalle icono={Stethoscope} titulo="Motivo" texto={cita.motivo} />
          <View style={styles.divisor} />
          <Detalle icono={NotebookPen} titulo="Notas de recepción" texto={cita.notas || 'Sin notas'} vacio={!cita.notas} />
        </Tarjeta>
      </Animated.View>

      {vm.puedeRegistrarResultado ? (
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.resultado}>
          <Texto variante="titulo2">Resultado de la consulta</Texto>
          <Texto variante="secundario" color={colores.pizarra}>
            Registra cómo terminó la cita; la recepción lo verá en la agenda web.
          </Texto>
          <View style={styles.opciones}>
            {vm.puedeConfirmar ? (
              <Opcion
                icono={CircleCheck}
                titulo="Confirmar"
                detalle="El paciente vendrá"
                estado="Confirmada"
                guardando={vm.guardando}
                onPress={() => vm.registrar('Confirmada')}
              />
            ) : null}
            <Opcion
              icono={CheckCheck}
              titulo="Atendida"
              detalle="Consulta completada"
              estado="Completada"
              guardando={vm.guardando}
              onPress={() => vm.registrar('Completada')}
            />
            <Opcion
              icono={UserX}
              titulo="No asistió"
              detalle="El paciente faltó"
              estado="NoAsistio"
              guardando={vm.guardando}
              onPress={() => vm.registrar('NoAsistio')}
            />
          </View>
          {vm.errorAccion ? (
            <View style={styles.error} accessibilityRole="alert">
              <CircleAlert size={18} color={colores.coral} />
              <Texto variante="secundario" color={colores.coral} style={styles.flex}>
                {vm.errorAccion}
              </Texto>
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {atendida ? (
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={[styles.cierre, { backgroundColor: COLOR_ESTADO[cita.estado].fondo }]}>
            {cita.estado === 'Completada' ? (
              <CheckCheck size={22} color={COLOR_ESTADO.Completada.color} />
            ) : (
              <UserX size={22} color={COLOR_ESTADO.NoAsistio.color} />
            )}
            <View style={styles.flex}>
              <Texto variante="cuerpoFuerte" color={COLOR_ESTADO[cita.estado].color}>
                {cita.estado === 'Completada' ? 'Consulta completada' : 'El paciente no asistió'}
              </Texto>
              {cita.estado === 'Completada' ? (
                <Texto variante="secundario" color={colores.tinta}>
                  Registra la evolución desde el historial del paciente.
                </Texto>
              ) : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

function Detalle({ icono: Icono, titulo, texto, vacio }: { icono: LucideIcon; titulo: string; texto: string; vacio?: boolean }) {
  return (
    <View style={styles.detalle}>
      <View style={styles.iconoDetalle}>
        <Icono size={18} color={colores.marea} />
      </View>
      <View style={styles.flex}>
        <Texto variante="secundario" color={colores.pizarra}>
          {titulo}
        </Texto>
        <Texto variante="cuerpo" color={vacio ? colores.niebla : colores.tinta}>
          {texto}
        </Texto>
      </View>
    </View>
  );
}

interface OpcionProps {
  icono: LucideIcon;
  titulo: string;
  detalle: string;
  estado: ResultadoCita;
  guardando: ResultadoCita | null;
  onPress: () => void;
}

/** Botón grande de resultado con el color del estado que registra. */
function Opcion({ icono: Icono, titulo, detalle, estado, guardando, onPress }: OpcionProps) {
  const { color, fondo } = COLOR_ESTADO[estado];
  const ocupado = guardando !== null;
  return (
    <Presionable
      onPress={onPress}
      disabled={ocupado}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}: ${detalle}`}
      style={[styles.opcion, ocupado && guardando !== estado && styles.inactiva]}
    >
      <View style={[styles.iconoOpcion, { backgroundColor: fondo }]}>
        {guardando === estado ? <ActivityIndicator color={color} /> : <Icono size={22} color={color} />}
      </View>
      <Texto variante="cuerpoFuerte" centrado>
        {titulo}
      </Texto>
      <Texto variante="secundario" color={colores.pizarra} centrado numberOfLines={2}>
        {detalle}
      </Texto>
    </Presionable>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  contenido: { padding: 20, paddingTop: 12, gap: 14, paddingBottom: 40 },
  banda: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: colores.mareaProfunda,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  flex: { flex: 1 },
  heroe: { padding: 20, borderRadius: radios.xl },
  filaHora: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  hora: { fontSize: 44, lineHeight: 50, color: colores.marea },
  falta: { marginTop: 4 },
  paciente: { gap: 14 },
  filaPaciente: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  detalles: { paddingVertical: 6 },
  detalle: { flexDirection: 'row', gap: 14, paddingVertical: 10 },
  iconoDetalle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divisor: { height: 1, backgroundColor: colores.linea, marginLeft: 52 },
  resultado: { gap: 6, marginTop: 8 },
  opciones: { flexDirection: 'row', gap: 10, marginTop: 10 },
  opcion: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: radios.l,
    backgroundColor: colores.blanco,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.linea,
  },
  inactiva: { opacity: 0.45 },
  iconoOpcion: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    marginTop: 6,
    borderRadius: radios.m,
    backgroundColor: colores.coralSuave,
  },
  cierre: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radios.l },
});
