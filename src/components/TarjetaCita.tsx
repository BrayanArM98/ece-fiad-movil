import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import { Avatar } from '@/components/ui/Avatar';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import type { Cita } from '@/models/Cita';
import { COLOR_ESTADO, colores } from '@/theme/colores';
import { formatearHora } from '@/utils/fechas';

interface TarjetaCitaProps {
  cita: Cita;
  onPress: () => void;
  /** Posición en la línea de tiempo, para recortar el riel en los extremos. */
  primera?: boolean;
  ultima?: boolean;
  /** Es el siguiente paciente: el nodo se resalta. */
  destacada?: boolean;
}

const ALTO_NODO = 26;

/**
 * Cita en la línea de tiempo de la agenda (F02): hora, riel con un nodo del color del estado,
 * y tarjeta con paciente, motivo y estado. Las canceladas se muestran atenuadas y tachadas.
 */
export function TarjetaCita({ cita, onPress, primera, ultima, destacada }: TarjetaCitaProps) {
  const cancelada = cita.estado === 'Cancelada';
  const hora = formatearHora(new Date(cita.fechaHora));
  const { color } = COLOR_ESTADO[cita.estado];

  return (
    <View style={[styles.fila, cancelada && styles.atenuada]}>
      <View style={styles.columnaHora}>
        <Texto variante="titulo3" color={destacada ? colores.marea : colores.tinta} style={cancelada && styles.tachado}>
          {hora}
        </Texto>
      </View>

      <View style={styles.riel}>
        {primera ? null : <View style={[styles.linea, styles.lineaArriba]} />}
        {ultima ? null : <View style={[styles.linea, styles.lineaAbajo]} />}
        <View style={[styles.nodo, { borderColor: color }, destacada && styles.nodoDestacado]}>
          {destacada ? <View style={styles.nucleo} /> : null}
        </View>
      </View>

      <Tarjeta
        onPress={onPress}
        etiquetaAccesible={`Cita de ${cita.nombrePaciente} a las ${hora}, ${cita.estadoTexto}`}
        style={[styles.tarjeta, destacada && styles.tarjetaDestacada]}
      >
        <View style={styles.cabecera}>
          <Avatar nombre={cita.nombrePaciente} tamano={40} />
          <View style={styles.textos}>
            <Texto variante="cuerpoFuerte" numberOfLines={1} style={cancelada && styles.tachado}>
              {cita.nombrePaciente}
            </Texto>
            <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
              {cita.motivo}
            </Texto>
          </View>
          <ChevronRight size={18} color={colores.niebla} />
        </View>
        <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
      </Tarjeta>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'stretch' },
  atenuada: { opacity: 0.55 },
  columnaHora: { width: 50, paddingTop: 18 },
  riel: { width: 22, alignItems: 'center' },
  linea: { position: 'absolute', width: 2, left: 10, backgroundColor: colores.linea },
  lineaArriba: { top: 0, height: ALTO_NODO },
  lineaAbajo: { top: ALTO_NODO, bottom: 0 },
  nodo: {
    marginTop: 20,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    backgroundColor: colores.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodoDestacado: {
    marginTop: 16,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 6,
    borderColor: 'rgba(14,116,144,0.18)',
    backgroundColor: colores.marea,
  },
  nucleo: { width: 4, height: 4, borderRadius: 2, backgroundColor: colores.blanco },
  tarjeta: { flex: 1, gap: 12, marginBottom: 12, marginLeft: 6 },
  tarjetaDestacada: { borderColor: colores.mareaClara, borderWidth: 1 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textos: { flex: 1, gap: 2 },
  tachado: { textDecorationLine: 'line-through' },
});
