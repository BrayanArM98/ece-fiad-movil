import { router, useLocalSearchParams } from 'expo-router';
import { CloudOff, FilePlus2, FileQuestion, ShieldAlert, ShieldCheck, UserRoundX, Users, UserRound } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EncabezadoPaciente } from '@/components/EncabezadoPaciente';
import { Cargando, MensajePantalla } from '@/components/EstadosPantalla';
import { TarjetaEvolucion } from '@/components/TarjetaEvolucion';
import { Presionable } from '@/components/ui/Presionable';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { VisorFoto } from '@/components/VisorFoto';
import { colores } from '@/theme/colores';
import { fuentes, radios, sombras } from '@/theme/tema';
import { useHistorialViewModel } from '@/viewmodels/useHistorialViewModel';

/**
 * Historial del paciente (specs/features/F03-historial-paciente.md).
 * Estados: cargando, con historia y evoluciones, con historia sin evoluciones,
 * sin historia clínica y error.
 */
export default function HistorialPacienteScreen() {
  const { pacienteId } = useLocalSearchParams<{ pacienteId: string }>();
  const vm = useHistorialViewModel(Number(pacienteId));
  const { bottom } = useSafeAreaInsets();

  if (vm.estado === 'cargando') return <Cargando />;
  if (vm.estado === 'noEncontrado') {
    return (
      <MensajePantalla
        icono={UserRoundX}
        mensaje="Paciente no encontrado"
        accion={{ titulo: 'Regresar', onPress: router.back }}
      />
    );
  }
  if (vm.estado === 'error' || !vm.paciente || !vm.historial) {
    return (
      <MensajePantalla
        icono={CloudOff}
        mensaje="No se pudo cargar el historial"
        detalle="Revisa tu conexión e intenta de nuevo."
        accion={{ titulo: 'Reintentar', onPress: vm.reintentar }}
      />
    );
  }

  const { paciente, historial } = vm;
  const banda = <View style={styles.banda} />;

  if (!historial.tieneHistoria || !historial.historia) {
    return (
      <View style={styles.pantalla}>
        <View style={styles.contenido}>
          {banda}
          <EncabezadoPaciente paciente={paciente} />
          <MensajePantalla
            enLinea
            icono={FileQuestion}
            mensaje="Sin historia clínica"
            detalle="Este paciente no tiene historia clínica. Se abre desde ECE-FIAD Web."
          />
        </View>
      </View>
    );
  }

  const historia = historial.historia;
  const nuevaEvolucion = () =>
    router.push({
      pathname: '/medico/evolucion/nueva',
      params: { historiaId: String(historia.id), pacienteId: String(paciente.id) },
    });

  return (
    <View style={styles.pantalla}>
      <FlatList
        contentContainerStyle={[styles.contenido, { paddingBottom: bottom + 110 }]}
        data={historial.evoluciones}
        keyExtractor={(evolucion) => String(evolucion.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(350)}>
            <TarjetaEvolucion
              evolucion={item}
              fotos={vm.fotosDe(item.id)}
              expandida={vm.expandida === item.id}
              onPress={() => vm.alternarEvolucion(item.id)}
              onVerFoto={vm.verFoto}
            />
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListHeaderComponent={
          <View style={styles.cabecera}>
            {banda}
            <EncabezadoPaciente paciente={paciente} />

            <View
              style={[styles.alergias, vm.tieneAlergias ? styles.conAlergias : styles.sinAlergias]}
              accessibilityRole={vm.tieneAlergias ? 'alert' : undefined}
            >
              {vm.tieneAlergias ? (
                <ShieldAlert size={22} color={colores.coral} />
              ) : (
                <ShieldCheck size={22} color={colores.verde} />
              )}
              <View style={styles.flex}>
                <Texto variante="mayusculas" color={vm.tieneAlergias ? colores.coral : colores.verde}>
                  Alergias
                </Texto>
                <Texto variante="cuerpoFuerte" color={colores.tinta}>
                  {vm.alergiasTexto}
                </Texto>
              </View>
            </View>

            <Tarjeta style={styles.antecedentes}>
              <Antecedente
                icono={<UserRound size={16} color={colores.marea} />}
                titulo="Antecedentes personales"
                texto={historia.antecedentesPersonales}
              />
              <View style={styles.divisor} />
              <Antecedente
                icono={<Users size={16} color={colores.marea} />}
                titulo="Antecedentes familiares"
                texto={historia.antecedentesFamiliares}
              />
            </Tarjeta>

            <View style={styles.tituloEvoluciones}>
              <TituloSeccion
                titulo="Evoluciones"
                detalle={`${historial.totalEvoluciones} ${historial.totalEvoluciones === 1 ? 'registro' : 'registros'}`}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <MensajePantalla
            enLinea
            icono={FilePlus2}
            mensaje="Aún no hay evoluciones"
            detalle="Registra la primera con el botón de abajo."
          />
        }
      />

      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={[styles.flotante, { bottom: bottom + 20 }]}>
        <Presionable
          onPress={nuevaEvolucion}
          accessibilityRole="button"
          accessibilityLabel="Nueva evolución"
          style={[styles.botonFlotante, sombras.alta]}
        >
          <FilePlus2 size={20} color={colores.blanco} />
          <Texto style={styles.textoFlotante} color={colores.blanco}>
            Nueva evolución
          </Texto>
        </Presionable>
      </Animated.View>

      <VisorFoto uri={vm.fotoAbierta} onCerrar={vm.cerrarFoto} />
    </View>
  );
}

function Antecedente({ icono, titulo, texto }: { icono: React.ReactNode; titulo: string; texto: string }) {
  return (
    <View style={styles.antecedente}>
      <View style={styles.tituloAntecedente}>
        {icono}
        <Texto variante="etiqueta" color={colores.marea}>
          {titulo}
        </Texto>
      </View>
      <Texto variante="cuerpo" color={texto ? colores.tinta : colores.niebla}>
        {texto || 'Sin registrar'}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  flex: { flex: 1 },
  contenido: { padding: 20, paddingTop: 12, gap: 14 },
  banda: {
    position: 'absolute',
    top: -12,
    left: -20,
    right: -20,
    height: 82,
    backgroundColor: colores.mareaProfunda,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  cabecera: { gap: 14, marginBottom: 2 },
  alergias: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radios.l, borderWidth: 1 },
  conAlergias: { backgroundColor: colores.coralSuave, borderColor: '#F2C4BC' },
  sinAlergias: { backgroundColor: colores.verdeSuave, borderColor: '#C3E3D1' },
  antecedentes: { paddingVertical: 4 },
  antecedente: { gap: 4, paddingVertical: 12 },
  tituloAntecedente: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  divisor: { height: 1, backgroundColor: colores.linea },
  tituloEvoluciones: { marginTop: 10 },
  separador: { height: 12 },
  flotante: { position: 'absolute', alignSelf: 'center' },
  botonFlotante: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    height: 56,
    borderRadius: radios.total,
    backgroundColor: colores.marea,
  },
  textoFlotante: { fontFamily: fuentes.textoSemi, fontSize: 16 },
});
