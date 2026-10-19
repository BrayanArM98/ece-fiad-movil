import { useSesion } from '@/context/SesionContext';
import { cancelarTodos } from '@/services/recordatoriosService';

/**
 * ViewModel de la pestaña Perfil, compartida por médico y paciente.
 * Al cerrar sesión, el layout raíz retira las rutas protegidas y regresa a Login
 * (specs/01-navigation.md, regla 2). Si es paciente, antes se eliminan sus recordatorios (F06).
 */
export function usePerfilViewModel() {
  const { sesion, cerrarSesion } = useSesion();

  const rolTexto = sesion?.rol === 'medico' ? 'Médico' : 'Paciente';

  async function salir() {
    if (sesion?.rol === 'paciente') {
      await cancelarTodos().catch(() => {});
    }
    cerrarSesion();
  }

  return {
    nombre: sesion?.nombre ?? '',
    rolTexto,
    cerrarSesion: salir,
  };
}
