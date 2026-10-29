import { Tabs } from 'expo-router';

import { iconoPestana } from '@/components/IconoPestana';
import { colores } from '@/theme/colores';

/**
 * Pestañas del médico: Agenda · Pacientes · Perfil (specs/01-navigation.md).
 */
export default function MedicoTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
        headerTitleStyle: { color: colores.texto },
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          headerTitle: 'Agenda del día',
          tabBarIcon: iconoPestana('calendar-outline'),
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Pacientes',
          tabBarIcon: iconoPestana('people-outline'),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: iconoPestana('person-circle-outline'),
        }}
      />
    </Tabs>
  );
}
