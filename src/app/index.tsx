import { Redirect } from 'expo-router';

import { useSesion } from '@/context/SesionContext';

/**
 * Punto de entrada: envía a cada usuario a la pestaña inicial de su rol
 * (specs/01-navigation.md, "Rutas y parámetros").
 */
export default function Index() {
  const { sesion } = useSesion();

  if (!sesion) return <Redirect href="/login" />;
  if (sesion.rol === 'medico') return <Redirect href="/medico/agenda" />;
  return <Redirect href="/paciente/mis-citas" />;
}
