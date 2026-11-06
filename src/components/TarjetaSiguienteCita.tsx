import { LinearGradient } from 'expo-linear-gradient';
import { CalendarSearch, FileText } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Avatar } from '@/components/ui/Avatar';
import { Anillos } from '@/components/ui/Marea';
import { Pulso } from '@/components/ui/Pulso';
import { Texto } from '@/components/ui/Texto';
import type { Cita } from '@/models/Cita';
import { colores } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';

interface TarjetaSiguienteCitaProps {
  cita: Cita;
  hora: string;
  falta: string;
  onVerCita: () => void;
  onVerHistorial: () => void;
}

/**
 * "Siguiente paciente" en la agenda del médico: tarjeta profunda con la hora en grande,
 * cuenta regresiva en vivo y accesos directos a la cita y al historial (F02, F03).
 */
export function TarjetaSiguienteCita({ cita, hora, falta, onVerCita, onVerHistorial }: TarjetaSiguienteCitaProps) {
  return (
    <View style={[styles.contenedor, sombras.media]}>
      <LinearGradient
        colors={[colores.mareaProfunda, colores.marea]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Anillos tamano={220} style={styles.anillos} />

      <View style={styles.cabecera}>
        <View style={styles.chip}>
          <Pulso color="#FFB4A6" tamano={7} />
          <Texto variante="etiqueta" color={colores.blanco}>
            {falta}
          </Texto>
        </View>
        <Texto variante="mayusculas" color="rgba(255,255,255,0.7)">
          Siguiente paciente
        </Texto>
      </View>

      <Texto variante="display" color={colores.blanco} style={styles.hora}>
        {hora}
      </Texto>

      <View style={styles.paciente}>
        <Avatar nombre={cita.nombrePaciente} tamano={46} claro />
        <View style={styles.textos}>
          <Texto variante="titulo3" color={colores.blanco} numberOfLines={1}>
            {cita.nombrePaciente}
          </Texto>
          <Texto variante="secundario" color="rgba(255,255,255,0.78)" numberOfLines={2}>
            {cita.motivo}
          </Texto>
        </View>
      </View>

      <View style={styles.acciones}>
        <View style={styles.accion}>
          <Boton titulo="Ver cita" icono={CalendarSearch} variante="claro" tamano="compacto" onPress={onVerCita} ancho />
        </View>
        <View style={styles.accion}>
          <Boton titulo="Historial" icono={FileText} variante="claro" tamano="compacto" onPress={onVerHistorial} ancho />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { borderRadius: radios.xl, padding: 20, overflow: 'hidden', backgroundColor: colores.marea, gap: 4 },
  anillos: { position: 'absolute', right: -70, bottom: -90 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radios.total,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  hora: { fontSize: 46, lineHeight: 52, marginTop: 10 },
  paciente: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  textos: { flex: 1, gap: 2 },
  acciones: { flexDirection: 'row', gap: 10, marginTop: 18 },
  accion: { flex: 1 },
});
