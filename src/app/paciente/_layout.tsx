import { router } from 'expo-router';
import Tabs from 'expo-router/js-tabs';
import { CalendarHeart, CircleUserRound, MapPinned } from 'lucide-react-native';
import { useEffect } from 'react';

import { BarraPestanas } from '@/components/ui/BarraPestanas';
import { alTocarNotificacion, configurar } from '@/services/notificacionesService';
import { colores } from '@/theme/colores';

const ICONOS = { 'mis-citas': CalendarHeart, clinica: MapPinned, perfil: CircleUserRound };

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
      tabBar={(props) => <BarraPestanas {...props} iconos={ICONOS} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colores.papel } }}
    >
      <Tabs.Screen name="mis-citas" options={{ title: 'Mis citas' }} />
      <Tabs.Screen name="clinica" options={{ title: 'Clínica' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
