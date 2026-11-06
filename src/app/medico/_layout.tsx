import { Stack } from 'expo-router';

import { colores } from '@/theme/colores';
import { fuentes } from '@/theme/tema';

/**
 * Zona del médico (specs/01-navigation.md, MedicoTabs).
 * Las pestañas van en (tabs); las pantallas de detalle se apilan encima de ellas
 * con un encabezado color marea que continúa la identidad de las pestañas.
 */
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function MedicoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.mareaProfunda },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontFamily: fuentes.tituloNegrita, fontSize: 17, color: colores.blanco },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colores.papel },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cita/[citaId]" options={{ title: 'Detalle de la cita' }} />
      <Stack.Screen name="historial/[pacienteId]" options={{ title: 'Historial del paciente' }} />
      <Stack.Screen name="evolucion/nueva" options={{ title: 'Nueva evolución' }} />
    </Stack>
  );
}
