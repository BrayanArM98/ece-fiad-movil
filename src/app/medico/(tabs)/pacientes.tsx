import { router } from 'expo-router';

import { Boton } from '@/components/Boton';
import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Pestaña Pacientes. Se reemplaza al implementar specs/features/F03-historial-paciente.md.
 */
export default function PacientesScreen() {
  return (
    <PantallaProvisional
      titulo="Pacientes"
      feature="F03"
      descripcion="Aquí se mostrarán los pacientes activos en orden alfabético."
    >
      <Boton
        titulo="Abrir el historial de un paciente de ejemplo"
        onPress={() =>
          router.push({ pathname: '/medico/historial/[pacienteId]', params: { pacienteId: '1' } })
        }
      />
    </PantallaProvisional>
  );
}
