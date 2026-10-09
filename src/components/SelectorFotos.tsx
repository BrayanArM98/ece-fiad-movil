import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { OrigenFoto } from '@/services/camaraService';
import { colores } from '@/theme/colores';

interface SelectorFotosProps {
  fotos: string[];
  maximo: number;
  puedeAgregar: boolean;
  aviso?: string | null;
  onAgregar: (origen: OrigenFoto) => void;
  onQuitar: (uri: string) => void;
}

/**
 * Miniaturas de las fotos de la evolución y botón para agregar más (F05).
 */
export function SelectorFotos({ fotos, maximo, puedeAgregar, aviso, onAgregar, onQuitar }: SelectorFotosProps) {
  function elegirOrigen() {
    Alert.alert('Agregar foto', undefined, [
      { text: 'Tomar foto', onPress: () => onAgregar('camara') },
      { text: 'Elegir de la galería', onPress: () => onAgregar('galeria') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.etiqueta}>Fotografías</Text>
        <Text style={styles.contador}>
          {fotos.length}/{maximo}
        </Text>
      </View>

      <View style={styles.fila}>
        {fotos.map((uri, indice) => (
          <View key={uri} style={styles.miniatura}>
            <Image source={{ uri }} style={styles.imagen} contentFit="cover" />
            <Pressable
              onPress={() => onQuitar(uri)}
              accessibilityRole="button"
              accessibilityLabel={`Quitar foto ${indice + 1}`}
              hitSlop={8}
              style={styles.quitar}
            >
              <Ionicons name="close" size={16} color={colores.superficie} />
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={elegirOrigen}
          disabled={!puedeAgregar}
          accessibilityRole="button"
          accessibilityLabel="Agregar foto"
          accessibilityState={{ disabled: !puedeAgregar }}
          style={[styles.miniatura, styles.agregar, !puedeAgregar && styles.deshabilitado]}
        >
          <Ionicons name="camera-outline" size={26} color={colores.primario} />
          <Text style={styles.textoAgregar}>Agregar foto</Text>
        </Pressable>
      </View>

      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
    </View>
  );
}

const TAMANO = 92;

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
  contador: { fontSize: 12, color: colores.textoSecundario },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniatura: { width: TAMANO, height: TAMANO, borderRadius: 10, overflow: 'hidden' },
  imagen: { width: '100%', height: '100%' },
  quitar: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agregar: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colores.primario,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deshabilitado: { opacity: 0.4 },
  textoAgregar: { fontSize: 12, color: colores.primario, fontWeight: '600' },
  aviso: { fontSize: 13, lineHeight: 19, color: colores.error },
});
