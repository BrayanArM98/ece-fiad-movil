import {
  CalendarDays,
  Clock,
  Droplet,
  Fingerprint,
  HeartPulse,
  IdCard,
  LogOut,
  Mail,
  Phone,
  Server,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { PanelSimulacion } from '@/components/PanelSimulacion';
import { Avatar } from '@/components/ui/Avatar';
import { Esqueleto } from '@/components/ui/Esqueleto';
import { EncabezadoMarea } from '@/components/ui/Marea';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { ALTO_BARRA_PESTANAS, radios } from '@/theme/tema';
import { usePerfilViewModel, type DatoPerfil } from '@/viewmodels/usePerfilViewModel';

const ICONO_DATO: Record<DatoPerfil['clave'], LucideIcon> = {
  especialidad: Stethoscope,
  horario: Clock,
  telefono: Phone,
  nacimiento: CalendarDays,
  sangre: Droplet,
  documento: IdCard,
  direccion: IdCard,
};

/**
 * Vista de la pestaña Perfil. La usan las pestañas del médico y del paciente.
 */
export function VistaPerfil() {
  const vm = usePerfilViewModel();
  const { bottom } = useSafeAreaInsets();
  const IconoRol = vm.esMedico ? Stethoscope : HeartPulse;

  function confirmarSalida() {
    Alert.alert('¿Cerrar sesión?', 'Tendrás que volver a entrar con tu correo y contraseña.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: vm.cerrarSesion },
    ]);
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={{ paddingBottom: ALTO_BARRA_PESTANAS + bottom + 16 }}
      showsVerticalScrollIndicator={false}
    >
      <EncabezadoMarea espacioInferior={8}>
        <View style={styles.identidad}>
          <View style={styles.aro}>
            <Avatar nombre={vm.nombre} tamano={84} />
          </View>
          <Texto variante="titulo1" color={colores.blanco} centrado>
            {vm.nombre}
          </Texto>
          <View style={styles.chipRol}>
            <IconoRol size={14} color={colores.blanco} />
            <Texto variante="etiqueta" color={colores.blanco}>
              {vm.rolTexto}
            </Texto>
          </View>
        </View>
      </EncabezadoMarea>

      <View style={styles.cuerpo}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.seccion}>
          <Texto variante="mayusculas" color={colores.niebla}>
            {vm.esMedico ? 'Datos profesionales' : 'Mis datos'}
          </Texto>
          <Tarjeta style={styles.lista}>
            <Fila icono={Mail} titulo="Correo" valor={vm.correo} />
            {vm.datos === null
              ? [0, 1, 2].map((i) => (
                  <View key={i}>
                    <View style={styles.divisor} />
                    <View style={styles.fila}>
                      <Esqueleto ancho={38} alto={38} radio={12} />
                      <View style={styles.textosFila}>
                        <Esqueleto ancho="40%" alto={10} />
                        <Esqueleto ancho="70%" alto={14} style={styles.espacio} />
                      </View>
                    </View>
                  </View>
                ))
              : vm.datos.map((dato) => (
                  <View key={dato.clave}>
                    <View style={styles.divisor} />
                    <Fila icono={ICONO_DATO[dato.clave]} titulo={dato.titulo} valor={dato.valor} />
                  </View>
                ))}
          </Tarjeta>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.seccion}>
          <Texto variante="mayusculas" color={colores.niebla}>
            Seguridad
          </Texto>
          <Tarjeta style={styles.lista}>
            <Fila
              icono={Fingerprint}
              titulo="Entrar con huella o rostro"
              valor={vm.biometriaActiva ? 'Activado' : 'Desactivado'}
              activo={vm.biometriaActiva}
            />
            <View style={styles.divisor} />
            <Fila icono={Server} titulo="Servidor" valor={vm.origenDatos} />
          </Tarjeta>
        </Animated.View>

        <Boton titulo="Cerrar sesión" icono={LogOut} variante="peligro" onPress={confirmarSalida} ancho />

        <PanelSimulacion />
      </View>
    </ScrollView>
  );
}

function Fila({ icono: Icono, titulo, valor, activo }: { icono: LucideIcon; titulo: string; valor: string; activo?: boolean }) {
  return (
    <View style={styles.fila} accessible accessibilityLabel={`${titulo}: ${valor}`}>
      <View style={styles.iconoFila}>
        <Icono size={18} color={colores.marea} />
      </View>
      <View style={styles.textosFila}>
        <Texto variante="secundario" color={colores.pizarra}>
          {titulo}
        </Texto>
        <Texto variante="cuerpoFuerte" color={activo ? colores.verde : colores.tinta} numberOfLines={2}>
          {valor}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.papel },
  identidad: { alignItems: 'center', gap: 10 },
  aro: { padding: 4, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 4 },
  chipRol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radios.total,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  cuerpo: { paddingHorizontal: 20, gap: 20 },
  seccion: { gap: 8 },
  lista: { paddingVertical: 4 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  iconoFila: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosFila: { flex: 1 },
  espacio: { marginTop: 6 },
  divisor: { height: 1, backgroundColor: colores.linea, marginLeft: 52 },
});
