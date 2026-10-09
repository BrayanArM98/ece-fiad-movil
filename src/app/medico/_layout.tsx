import { Stack } from 'expo-router';

import { colores } from '@/theme/colores';

/**
 * Zona del médico (specs/01-navigation.md, MedicoTabs).
 * Las pestañas van en (tabs); las pantallas de detalle se apilan encima de ellas.
 */
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function MedicoLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colores.primario,
        headerTitleStyle: { color: colores.texto },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cita/[citaId]" options={{ title: 'Detalle de la cita' }} />
      <Stack.Screen name="historial/[pacienteId]" options={{ title: 'Historial del paciente' }} />
      <Stack.Screen name="evolucion/nueva" options={{ title: 'Nueva evolución' }} />
    </Stack>
  );
}
