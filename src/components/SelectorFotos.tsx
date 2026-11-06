import { Image } from 'expo-image';
import { Camera, ImagePlus, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import type { OrigenFoto } from '@/services/camaraService';
import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';

interface SelectorFotosProps {
  fotos: string[];
  maximo: number;
  puedeAgregar: boolean;
  aviso?: string | null;
  onAgregar: (origen: OrigenFoto) => void;
  onQuitar: (uri: string) => void;
}

/**
 * Fotografías de la evolución (F05): miniaturas con botón para quitar
 * y dos accesos directos, cámara y galería.
 */
export function SelectorFotos({ fotos, maximo, puedeAgregar, aviso, onAgregar, onQuitar }: SelectorFotosProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Texto variante="etiqueta" color={colores.pizarra}>
          Fotografías
        </Texto>
        <Texto variante="etiqueta" color={colores.niebla}>
          {fotos.length}/{maximo}
        </Texto>
      </View>

      {fotos.length > 0 ? (
        <View style={styles.fila}>
          {fotos.map((uri, indice) => (
            <Animated.View
              key={uri}
              entering={FadeIn.duration(250)}
              exiting={FadeOut.duration(200)}
              layout={LinearTransition}
              style={styles.miniatura}
            >
              <Image source={{ uri }} style={styles.imagen} contentFit="cover" />
              <Pressable
                onPress={() => onQuitar(uri)}
                accessibilityRole="button"
                accessibilityLabel={`Quitar foto ${indice + 1}`}
                hitSlop={8}
                style={styles.quitar}
              >
                <X size={14} color={colores.blanco} strokeWidth={3} />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}

      <View style={styles.acciones}>
        <Accion icono={Camera} titulo="Tomar foto" habilitada={puedeAgregar} onPress={() => onAgregar('camara')} />
        <Accion icono={ImagePlus} titulo="Galería" habilitada={puedeAgregar} onPress={() => onAgregar('galeria')} />
      </View>

      {aviso ? (
        <Texto variante="secundario" color={colores.coral}>
          {aviso}
        </Texto>
      ) : null}
    </View>
  );
}

function Accion({ icono: Icono, titulo, habilitada, onPress }: { icono: typeof Camera; titulo: string; habilitada: boolean; onPress: () => void }) {
  return (
    <Presionable
      onPress={onPress}
      disabled={!habilitada}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !habilitada }}
      style={[styles.accion, !habilitada && styles.deshabilitada]}
    >
      <Icono size={20} color={colores.marea} />
      <Texto variante="cuerpoFuerte" color={colores.mareaProfunda}>
        {titulo}
      </Texto>
    </Presionable>
  );
}

const TAMANO = 88;

const styles = StyleSheet.create({
  contenedor: { gap: 10 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniatura: { width: TAMANO, height: TAMANO, borderRadius: radios.m, overflow: 'hidden' },
  imagen: { width: '100%', height: '100%' },
  quitar: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 47, 58, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acciones: { flexDirection: 'row', gap: 10 },
  accion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    borderRadius: radios.m,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colores.mareaClara,
    backgroundColor: colores.mareaSuave,
  },
  deshabilitada: { opacity: 0.4 },
});
