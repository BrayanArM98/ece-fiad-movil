import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VisorFotoProps {
  uri: string | null;
  onCerrar: () => void;
}

/**
 * Muestra una fotografía de la evolución en pantalla completa (F05).
 */
export function VisorFoto({ uri, onCerrar }: VisorFotoProps) {
  const { top } = useSafeAreaInsets();
  return (
    <Modal visible={uri !== null} transparent animationType="fade" onRequestClose={onCerrar} statusBarTranslucent>
      <View style={styles.fondo}>
        {uri ? <Image source={{ uri }} style={styles.imagen} contentFit="contain" transition={200} /> : null}
        <Pressable
          onPress={onCerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar foto"
          hitSlop={12}
          style={[styles.cerrar, { top: top + 16 }]}
        >
          <X size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(4, 20, 26, 0.96)', justifyContent: 'center' },
  imagen: { width: '100%', height: '100%' },
  cerrar: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
