import { useSesion } from '@/context/SesionContext';

/**
 * ViewModel de la pestaña Perfil, compartida por médico y paciente.
 * Al cerrar sesión, el layout raíz retira las rutas protegidas y regresa a Login
 * (specs/01-navigation.md, regla 2).
 */
export function usePerfilViewModel() {
  const { sesion, cerrarSesion } = useSesion();

  const rolTexto = sesion?.rol === 'medico' ? 'Médico' : 'Paciente';

  return {
    nombre: sesion?.nombre ?? '',
    rolTexto,
    cerrarSesion,
  };
}
