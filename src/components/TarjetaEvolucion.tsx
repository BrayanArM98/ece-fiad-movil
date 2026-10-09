import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Adjunto } from '@/models/Adjunto';
import type { Evolucion } from '@/models/Evolucion';
import { colores } from '@/theme/colores';
import { formatearFechaCompleta } from '@/utils/fechas';

interface TarjetaEvolucionProps {
  evolucion: Evolucion;
  fotos: Adjunto[];
  expandida: boolean;
  onPress: () => void;
  onVerFoto: (uri: string) => void;
}

/**
 * Evolución dentro del historial (F03). Al expandirla muestra sus notas
 * y sus fotografías (F05).
 */
export function TarjetaEvolucion({ evolucion, fotos, expandida, onPress, onVerFoto }: TarjetaEvolucionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded: expandida }}
      style={styles.tarjeta}
    >
      <View style={styles.encabezado}>
        <View style={styles.titulo}>
          <Text style={styles.fecha}>{formatearFechaCompleta(new Date(evolucion.fecha))}</Text>
          <Text style={styles.doctor}>
            Dr(a). {evolucion.nombreDoctor} · {evolucion.nombreEspecialidad}
          </Text>
        </View>
        {fotos.length > 0 ? (
          <View style={styles.indicadorFotos}>
            <Ionicons name="image-outline" size={16} color={colores.textoSecundario} />
            <Text style={styles.textoIndicador}>{fotos.length}</Text>
          </View>
        ) : null}
        <Ionicons name={expandida ? 'chevron-up' : 'chevron-down'} size={20} color={colores.textoSecundario} />
      </View>

      <Text style={styles.etiqueta}>Diagnóstico</Text>
      <Text style={styles.texto}>{evolucion.diagnostico}</Text>

      <Text style={styles.etiqueta}>Tratamiento</Text>
      <Text style={styles.texto}>{evolucion.tratamiento}</Text>

      {expandida ? (
        <>
          <Text style={styles.etiqueta}>Notas</Text>
          <Text style={[styles.texto, !evolucion.notas && styles.vacio]}>{evolucion.notas || 'Sin notas'}</Text>

          {fotos.length > 0 ? (
            <>
              <Text style={styles.etiqueta}>Fotografías</Text>
              <View style={styles.fotos}>
                {fotos.map((foto, indice) => (
                  <Pressable
                    key={foto.id}
                    onPress={() => onVerFoto(foto.uri)}
                    accessibilityRole="imagebutton"
                    accessibilityLabel={`Ver foto ${indice + 1}`}
                  >
                    <Image source={{ uri: foto.uri }} style={styles.miniatura} contentFit="cover" />
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 16,
  },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  titulo: { flex: 1, gap: 2 },
  fecha: { fontSize: 16, fontWeight: '700', color: colores.texto },
  doctor: { fontSize: 13, color: colores.textoSecundario },
  indicadorFotos: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  textoIndicador: { fontSize: 13, color: colores.textoSecundario },
  etiqueta: { fontSize: 12, fontWeight: '700', color: colores.primario, marginTop: 10, textTransform: 'uppercase' },
  texto: { fontSize: 15, lineHeight: 21, color: colores.texto, marginTop: 2 },
  vacio: { color: colores.textoSecundario, fontStyle: 'italic' },
  fotos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  miniatura: { width: 80, height: 80, borderRadius: 8 },
});
