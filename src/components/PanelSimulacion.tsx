import { StyleSheet, Switch, Text, View } from 'react-native';

import { colores } from '@/theme/colores';
import { useSimulacionViewModel } from '@/viewmodels/useSimulacionViewModel';

/**
 * Interruptores del modo de prueba. Solo aparece en desarrollo.
 */
export function PanelSimulacion() {
  const vm = useSimulacionViewModel();
  if (!vm.disponible) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.titulo}>Modo de prueba</Text>
      <Text style={styles.ayuda}>Simula casos de error para validar los criterios de las specs.</Text>

      <Fila etiqueta="Simular falla de red" valor={vm.fallaDeRed} onCambiar={vm.cambiarFallaDeRed} />
      <Fila etiqueta="Simular agenda sin citas" valor={vm.sinCitas} onCambiar={vm.cambiarSinCitas} />
    </View>
  );
}

function Fila({ etiqueta, valor, onCambiar }: { etiqueta: string; valor: boolean; onCambiar: (v: boolean) => void }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Switch
        value={valor}
        onValueChange={onCambiar}
        trackColor={{ true: colores.primario, false: colores.borde }}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colores.texto },
  ayuda: { fontSize: 13, color: colores.textoSecundario, marginBottom: 4 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  etiqueta: { fontSize: 15, color: colores.texto, flex: 1 },
});
