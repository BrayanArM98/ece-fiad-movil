import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';

import { alTocarNotificacion, configurar } from '@/services/notificacionesService';
import { colores } from '@/theme/colores';

/**
 * Pestañas del paciente: Mis citas · Clínica · Perfil (specs/01-navigation.md).
 * Al tocar un recordatorio se abre Mis citas (F06).
 */
export default function PacienteTabsLayout() {
  useEffect(() => {
    configurar().catch(() => {});
    return alTocarNotificacion(() => router.navigate('/paciente/mis-citas'));
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
        headerTitleStyle: { color: colores.texto },
      }}
    >
      <Tabs.Screen
        name="mis-citas"
        options={{
          title: 'Mis citas',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clinica"
        options={{
          title: 'Clínica',
          tabBarIcon: ({ color, size }) => <Ionicons name="location-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
