import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SesionProvider, useSesion } from '@/context/SesionContext';

/**
 * Layout raíz. Separa la zona de acceso de la zona principal y la zona principal por rol
 * (specs/01-navigation.md). Las rutas protegidas solo existen cuando su condición se cumple:
 * al cerrar sesión desaparecen del historial y el botón "atrás" no regresa a datos clínicos.
 */
export default function RootLayout() {
  return (
    <SesionProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SesionProvider>
  );
}

function RootNavigator() {
  const { sesion } = useSesion();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!sesion}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={sesion?.rol === 'medico'}>
        <Stack.Screen name="medico" />
      </Stack.Protected>

      <Stack.Protected guard={sesion?.rol === 'paciente'}>
        <Stack.Screen name="paciente" />
      </Stack.Protected>
    </Stack>
  );
}
