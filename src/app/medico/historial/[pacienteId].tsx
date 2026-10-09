import { router, useLocalSearchParams } from 'expo-router';

import { Boton } from '@/components/Boton';
import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Historial del paciente. Se llega desde CitaDetalle o desde Pacientes (specs/01-navigation.md).
 */
export default function HistorialPacienteScreen() {
  const { pacienteId } = useLocalSearchParams<{ pacienteId: string }>();

  return (
    <PantallaProvisional
      titulo={`Paciente #${pacienteId}`}
      feature="F03"
      descripcion="Aquí se mostrarán los antecedentes, las alergias y las evoluciones del paciente."
    >
      <Boton
        titulo="Nueva evolución"
        onPress={() =>
          router.push({ pathname: '/medico/evolucion/nueva', params: { historiaId: '1', pacienteId } })
        }
      />
    </PantallaProvisional>
  );
}
