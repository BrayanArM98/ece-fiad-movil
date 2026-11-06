import { Image } from 'expo-image';
import { ChevronDown, Images, Pill, Stethoscope } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import type { Adjunto } from '@/models/Adjunto';
import type { Evolucion } from '@/models/Evolucion';
import { colores } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';
import { formatearFechaCompleta, formatearHora } from '@/utils/fechas';
import { diaCorto, mesCorto } from '@/utils/tiempo';

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
  const fecha = new Date(evolucion.fecha);

  return (
    <Animated.View layout={LinearTransition.springify().damping(20)} style={[styles.tarjeta, sombras.baja]}>
      <Presionable
        onPress={onPress}
        escala={0.99}
        accessibilityRole="button"
        accessibilityState={{ expanded: expandida }}
        accessibilityLabel={`Evolución del ${formatearFechaCompleta(fecha)}. ${expandida ? 'Ocultar' : 'Ver'} detalles`}
        style={styles.toque}
      >
        <View style={styles.encabezado}>
          <View style={styles.calendario}>
            <Texto variante="mayusculas" color={colores.marea}>
              {mesCorto(fecha)}
            </Texto>
            <Texto variante="titulo2">{fecha.getDate()}</Texto>
          </View>
          <View style={styles.titulo}>
            <Texto variante="cuerpoFuerte" numberOfLines={1}>
              Dr(a). {evolucion.nombreDoctor}
            </Texto>
            <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
              {evolucion.nombreEspecialidad} · {diaCorto(fecha)} {formatearHora(fecha)} · {fecha.getFullYear()}
            </Texto>
          </View>
          {fotos.length > 0 ? (
            <View style={styles.indicadorFotos}>
              <Images size={14} color={colores.mareaProfunda} />
              <Texto variante="etiqueta" color={colores.mareaProfunda}>
                {fotos.length}
              </Texto>
            </View>
          ) : null}
          <View style={expandida ? styles.girado : undefined}>
            <ChevronDown size={20} color={colores.niebla} />
          </View>
        </View>

        <Bloque icono={<Stethoscope size={15} color={colores.marea} />} titulo="Diagnóstico" texto={evolucion.diagnostico} />
        <Bloque icono={<Pill size={15} color={colores.marea} />} titulo="Tratamiento" texto={evolucion.tratamiento} recortar={!expandida} />
      </Presionable>

      {expandida ? (
        <Animated.View entering={FadeIn.duration(250)} style={styles.extra}>
          <View style={styles.notas}>
            <Texto variante="mayusculas" color={colores.niebla}>
              Notas
            </Texto>
            <Texto variante="cuerpo" color={evolucion.notas ? colores.tinta : colores.niebla}>
              {evolucion.notas || 'Sin notas'}
            </Texto>
          </View>
          {fotos.length > 0 ? (
            <View style={styles.galeria}>
              <Texto variante="mayusculas" color={colores.niebla}>
                Fotografías
              </Texto>
              <View style={styles.fotos}>
                {fotos.map((foto, indice) => (
                  <Pressable
                    key={foto.id}
                    onPress={() => onVerFoto(foto.uri)}
                    accessibilityRole="imagebutton"
                    accessibilityLabel={`Ver foto ${indice + 1}`}
                  >
                    <Image source={{ uri: foto.uri }} style={styles.miniatura} contentFit="cover" transition={200} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

function Bloque({ icono, titulo, texto, recortar }: { icono: React.ReactNode; titulo: string; texto: string; recortar?: boolean }) {
  return (
    <View style={styles.bloque}>
      <View style={styles.tituloBloque}>
        {icono}
        <Texto variante="etiqueta" color={colores.marea}>
          {titulo}
        </Texto>
      </View>
      <Texto variante="cuerpo" numberOfLines={recortar ? 2 : undefined}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: radios.l,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.linea,
    overflow: 'hidden',
  },
  toque: { padding: 16, gap: 12 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendario: {
    width: 48,
    height: 52,
    borderRadius: radios.s,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { flex: 1, gap: 2 },
  indicadorFotos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radios.total,
    backgroundColor: colores.mareaSuave,
  },
  girado: { transform: [{ rotate: '180deg' }] },
  bloque: { gap: 4 },
  tituloBloque: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  extra: { paddingHorizontal: 16, paddingBottom: 16, gap: 14 },
  notas: { gap: 4, padding: 12, borderRadius: radios.m, backgroundColor: colores.papel },
  galeria: { gap: 8 },
  fotos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  miniatura: { width: 84, height: 84, borderRadius: radios.s },
});
