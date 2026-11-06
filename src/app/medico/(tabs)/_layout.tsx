import Tabs from 'expo-router/js-tabs';
import { CalendarDays, CircleUserRound, UsersRound } from 'lucide-react-native';

import { BarraPestanas } from '@/components/ui/BarraPestanas';
import { colores } from '@/theme/colores';

const ICONOS = { agenda: CalendarDays, pacientes: UsersRound, perfil: CircleUserRound };

/**
 * Pestañas del médico: Agenda · Pacientes · Perfil (specs/01-navigation.md).
 * Cada pestaña dibuja su propio encabezado; la barra flota sobre el contenido.
 */
export default function MedicoTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BarraPestanas {...props} iconos={ICONOS} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colores.papel } }}
    >
      <Tabs.Screen name="agenda" options={{ title: 'Agenda' }} />
      <Tabs.Screen name="pacientes" options={{ title: 'Pacientes' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
