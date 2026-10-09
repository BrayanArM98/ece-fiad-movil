import { router } from 'expo-router';

import { Boton } from '@/components/Boton';
import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Pestaña Agenda. Se reemplaza al implementar specs/features/F02-agenda-del-dia.md.
 */
export default function AgendaScreen() {
  return (
    <PantallaProvisional
      titulo="Agenda del día"
      feature="F02"
      descripcion="Aquí se mostrarán las citas de hoy del médico, ordenadas por hora."
    >
      <Boton
        titulo="Abrir una cita de ejemplo"
        onPress={() => router.push({ pathname: '/medico/cita/[citaId]', params: { citaId: '1' } })}
      />
    </PantallaProvisional>
  );
}
