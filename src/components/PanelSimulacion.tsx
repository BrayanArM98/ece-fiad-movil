import { FlaskConical } from 'lucide-react-native';
import { StyleSheet, Switch, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Texto } from '@/components/ui/Texto';
import { API_URL, usarApi } from '@/config/api';
import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';
import { useSimulacionViewModel } from '@/viewmodels/useSimulacionViewModel';

/**
 * Interruptores del modo de prueba. Solo aparece en desarrollo.
 */
export function PanelSimulacion() {
  const vm = useSimulacionViewModel();
  if (!vm.disponible) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.cabecera}>
        <FlaskConical size={18} color={colores.ambar} />
        <Texto variante="cuerpoFuerte">Modo de prueba</Texto>
      </View>
      <Texto variante="secundario" color={colores.pizarra}>
        Simula casos de error para validar los criterios de las specs. Origen de los datos:{' '}
        {usarApi ? `API (${API_URL})` : 'datos de ejemplo'}.
      </Texto>
      <Fila etiqueta="Simular falla de red" valor={vm.fallaDeRed} onCambiar={vm.cambiarFallaDeRed} />
      <Fila etiqueta="Simular sin citas" valor={vm.sinCitas} onCambiar={vm.cambiarSinCitas} />
      {vm.esPaciente ? (
        <View style={styles.recordatorios}>
          <Texto variante="secundario">Recordatorios programados: {vm.programados ?? '—'}</Texto>
          <Boton titulo="Actualizar conteo" variante="secundario" tamano="compacto" onPress={vm.actualizarProgramados} />
          <Boton
            titulo="Enviar recordatorio de prueba (10 s)"
            variante="secundario"
            tamano="compacto"
            onPress={vm.enviarPrueba}
          />
          {vm.mensaje ? (
            <Texto variante="secundario" color={colores.pizarra}>
              {vm.mensaje}
            </Texto>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function Fila({ etiqueta, valor, onCambiar }: { etiqueta: string; valor: boolean; onCambiar: (v: boolean) => void }) {
  return (
    <View style={styles.fila}>
      <Texto variante="cuerpo" style={styles.etiqueta}>
        {etiqueta}
      </Texto>
      <Switch
        value={valor}
        onValueChange={onCambiar}
        trackColor={{ true: colores.marea, false: colores.linea }}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1.5,
    borderColor: colores.linea,
    borderStyle: 'dashed',
    borderRadius: radios.l,
    padding: 16,
    gap: 8,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  etiqueta: { flex: 1 },
  recordatorios: { gap: 8, marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colores.linea },
});
