import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

interface VisorFotoProps {
  uri: string | null;
  onCerrar: () => void;
}

/**
 * Muestra una fotografía de la evolución en pantalla completa (F05).
 */
export function VisorFoto({ uri, onCerrar }: VisorFotoProps) {
  return (
    <Modal visible={uri !== null} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.fondo}>
        {uri ? <Image source={{ uri }} style={styles.imagen} contentFit="contain" /> : null}
        <Pressable
          onPress={onCerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar foto"
          hitSlop={12}
          style={styles.cerrar}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#000000', justifyContent: 'center' },
  imagen: { width: '100%', height: '100%' },
  cerrar: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
