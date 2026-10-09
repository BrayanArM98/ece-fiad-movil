import { router, useLocalSearchParams } from 'expo-router';

import { Boton } from '@/components/Boton';
import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Detalle de una cita. Recibe citaId desde la Agenda (specs/01-navigation.md).
 */
export default function CitaDetalleScreen() {
  const { citaId } = useLocalSearchParams<{ citaId: string }>();

  return (
    <PantallaProvisional
      titulo={`Cita #${citaId}`}
      feature="F03"
      descripcion="Aquí se mostrarán la hora, el paciente, el motivo, las notas y el estado de la cita."
    >
      <Boton
        titulo="Ver historial del paciente"
        onPress={() =>
          router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: '1' } })
        }
      />
    </PantallaProvisional>
  );
}
