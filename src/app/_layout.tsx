import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SesionProvider, useSesion } from '@/context/SesionContext';
import { colores } from '@/theme/colores';
import { ARCHIVOS_FUENTES } from '@/theme/tema';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Layout raíz. Carga las fuentes de la marca y separa la zona de acceso de la zona principal
 * por rol (specs/01-navigation.md). Las rutas protegidas solo existen cuando su condición se cumple:
 * al cerrar sesión desaparecen del historial y el botón "atrás" no regresa a datos clínicos.
 */
export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts(ARCHIVOS_FUENTES);
  const listo = fuentesListas || !!errorFuentes;

  useEffect(() => {
    if (listo) SplashScreen.hideAsync().catch(() => {});
  }, [listo]);

  // Sin fuentes la primera pantalla "saltaría" al cambiar de tipografía
  if (!listo) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colores.papel }}>
      <SesionProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SesionProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { sesion } = useSesion();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.papel } }}>
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
