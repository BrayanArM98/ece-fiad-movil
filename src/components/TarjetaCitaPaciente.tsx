import { StyleSheet, Text, View } from 'react-native';

import { EtiquetaEstadoCita } from '@/components/EtiquetaEstadoCita';
import { colores } from '@/theme/colores';
import { etiquetaDia } from '@/utils/citasPaciente';
import { formatearFechaLarga, formatearHora } from '@/utils/fechas';
import type { CitaConEspecialidad } from '@/viewmodels/useMisCitasViewModel';

/**
 * Próxima cita del paciente: fecha, hora, doctor, especialidad y estado (F06).
 */
export function TarjetaCitaPaciente({ cita }: { cita: CitaConEspecialidad }) {
  const fecha = new Date(cita.fechaHora);
  const etiqueta = etiquetaDia(fecha, new Date());

  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezado}>
        <Text style={styles.fecha}>{formatearFechaLarga(fecha)}</Text>
        {etiqueta ? (
          <View style={styles.etiquetaDia}>
            <Text style={styles.textoEtiquetaDia}>{etiqueta}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.hora}>{formatearHora(fecha)}</Text>
      <Text style={styles.doctor}>Dr(a). {cita.nombreDoctor}</Text>
      {cita.nombreEspecialidad ? <Text style={styles.especialidad}>{cita.nombreEspecialidad}</Text> : null}
      <Text style={styles.motivo}>{cita.motivo}</Text>
      <View style={styles.estado}>
        <EtiquetaEstadoCita estado={cita.estado} texto={cita.estadoTexto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
    gap: 2,
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fecha: { fontSize: 15, fontWeight: '600', color: colores.textoSecundario },
  etiquetaDia: { backgroundColor: colores.primario, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  textoEtiquetaDia: { color: colores.superficie, fontSize: 12, fontWeight: '700' },
  hora: { fontSize: 26, fontWeight: '800', color: colores.primario },
  doctor: { fontSize: 16, fontWeight: '600', color: colores.texto, marginTop: 4 },
  especialidad: { fontSize: 14, color: colores.textoSecundario },
  motivo: { fontSize: 14, color: colores.texto, marginTop: 4 },
  estado: { marginTop: 8 },
});
