import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Navigation, Stethoscope } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import { Avatar } from '@/components/ui/Avatar';
import { Pulso } from '@/components/ui/Pulso';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { fuentes, radios } from '@/theme/tema';
import { formatearFechaLarga, formatearHora } from '@/utils/fechas';
import { diaCorto, mesCorto, tiempoRelativo } from '@/utils/tiempo';
import type { CitaConEspecialidad } from '@/viewmodels/useMisCitasViewModel';

/** Bloque de calendario con el día en grande. */
function Calendario({ fecha, grande }: { fecha: Date; grande?: boolean }) {
  const tamano = grande ? 68 : 54;
  return (
    <View style={[styles.calendario, { width: tamano, height: tamano + 6 }]}>
      {grande ? (
        <LinearGradient colors={[colores.marea, colores.mareaProfunda]} style={StyleSheet.absoluteFill} />
      ) : null}
      <Texto variante="mayusculas" color={grande ? 'rgba(255,255,255,0.75)' : colores.marea}>
        {mesCorto(fecha)}
      </Texto>
      <Texto
        style={{ fontFamily: fuentes.display, fontSize: grande ? 30 : 22, lineHeight: grande ? 34 : 26 }}
        color={grande ? colores.blanco : colores.tinta}
      >
        {fecha.getDate()}
      </Texto>
      <Texto variante="etiqueta" color={grande ? 'rgba(255,255,255,0.75)' : colores.pizarra}>
        {diaCorto(fecha)}
      </Texto>
    </View>
  );
}

interface ProximaProps {
  cita: CitaConEspecialidad;
  ahora: Date;
  onComoLlegar: () => void;
}

/**
 * Próxima cita del paciente (F06): calendario, hora, cuenta regresiva, doctor y acceso a "Cómo llegar".
 */
export function TarjetaProximaCita({ cita, ahora, onComoLlegar }: ProximaProps) {
  const fecha = new Date(cita.fechaHora);
  const falta = tiempoRelativo(fecha, ahora);

  return (
    <Tarjeta elevada style={styles.proxima}>
      <View style={styles.cabecera}>
        <Calendario fecha={fecha} grande />
        <View style={styles.cuando}>
          <View style={styles.chipFalta}>
            <Pulso color={colores.coral} tamano={6} />
            <Texto variante="etiqueta" color={colores.coral}>
              {falta}
            </Texto>
          </View>
          <Texto variante="display" style={styles.hora}>
            {formatearHora(fecha)}
          </Texto>
          <Texto variante="secundario" color={colores.pizarra}>
            {formatearFechaLarga(fecha)}
          </Texto>
        </View>
      </View>

      <View style={styles.corte}>
        <View style={[styles.muesca, styles.muescaIzquierda]} />
        <View style={styles.punteado} />
        <View style={[styles.muesca, styles.muescaDerecha]} />
      </View>

      <View style={styles.doctor}>
        <Avatar nombre={cita.nombreDoctor} tamano={44} />
        <View style={styles.textos}>
          <Texto variante="cuerpoFuerte" numberOfLines={1}>
            Dr(a). {cita.nombreDoctor}
          </Texto>
          <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
            {cita.nombreEspecialidad || 'Consulta médica'}
          </Texto>
        </View>
        <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
      </View>

      <View style={styles.motivo}>
        <Stethoscope size={16} color={colores.marea} />
        <Texto variante="secundario" style={styles.textos}>
          {cita.motivo}
        </Texto>
      </View>

      <Boton titulo="Cómo llegar a la clínica" icono={Navigation} variante="suave" onPress={onComoLlegar} ancho />
    </Tarjeta>
  );
}

/** Cita posterior en la lista "Más adelante": calendario pequeño, hora, doctor y estado. */
export function TarjetaCitaPaciente({ cita }: { cita: CitaConEspecialidad }) {
  const fecha = new Date(cita.fechaHora);
  return (
    <Tarjeta style={styles.compacta}>
      <Calendario fecha={fecha} />
      <View style={styles.textos}>
        <View style={styles.filaHora}>
          <Clock size={14} color={colores.pizarra} />
          <Texto variante="etiqueta" color={colores.pizarra}>
            {formatearHora(fecha)}
          </Texto>
        </View>
        <Texto variante="cuerpoFuerte" numberOfLines={1}>
          Dr(a). {cita.nombreDoctor}
        </Texto>
        <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
          {cita.nombreEspecialidad ? `${cita.nombreEspecialidad} · ` : ''}
          {cita.motivo}
        </Texto>
        <View style={styles.estado}>
          <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
        </View>
      </View>
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  calendario: {
    borderRadius: radios.m,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.mareaSuave,
  },
  proxima: { padding: 20, gap: 16, borderRadius: radios.xl },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cuando: { flex: 1, gap: 2 },
  chipFalta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radios.total,
    backgroundColor: colores.coralSuave,
  },
  hora: { fontSize: 36, lineHeight: 40, marginTop: 2 },
  corte: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -20 },
  muesca: { width: 18, height: 18, borderRadius: 9, backgroundColor: colores.papel },
  muescaIzquierda: { marginLeft: -9 },
  muescaDerecha: { marginRight: -9 },
  punteado: { flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colores.linea, marginHorizontal: 6 },
  doctor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textos: { flex: 1, gap: 2 },
  motivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radios.m,
    backgroundColor: colores.papel,
  },
  compacta: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  filaHora: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  estado: { marginTop: 6 },
});
