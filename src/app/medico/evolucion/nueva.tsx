import { useLocalSearchParams } from 'expo-router';

import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Formulario de nueva evolución. Recibe historiaId y pacienteId (specs/01-navigation.md).
 */
export default function NuevaEvolucionScreen() {
  const { historiaId, pacienteId } = useLocalSearchParams<{ historiaId: string; pacienteId: string }>();

  return (
    <PantallaProvisional
      titulo="Nueva evolución"
      feature="F04"
      descripcion={`Aquí se capturarán el diagnóstico, el tratamiento, las notas y las fotografías (F05) de la historia #${historiaId} del paciente #${pacienteId}.`}
    />
  );
}
