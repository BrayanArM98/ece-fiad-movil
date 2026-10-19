import * as Notifications from '@/services/notificacionesLocales';
import { Platform } from 'react-native';

/**
 * Notificaciones locales programadas en el teléfono (specs/features/F06-mis-citas-recordatorios.md).
 * Funcionan sin servidor y dentro de Expo Go.
 */
export type EstadoPermiso = 'concedido' | 'negado' | 'sinPreguntar';

const CANAL_ANDROID = 'recordatorios';

/** Muestra las notificaciones aunque la app esté abierta y crea el canal de Android. */
export async function configurar(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
      name: 'Recordatorios de citas',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

function traducir(permiso: Notifications.NotificationPermissionsStatus): EstadoPermiso {
  if (permiso.granted) return 'concedido';
  return permiso.canAskAgain ? 'sinPreguntar' : 'negado';
}

export async function consultarPermiso(): Promise<EstadoPermiso> {
  return traducir(await Notifications.getPermissionsAsync());
}

export async function solicitarPermiso(): Promise<EstadoPermiso> {
  return traducir(await Notifications.requestPermissionsAsync());
}

export async function programar(titulo: string, cuerpo: string, fecha: Date): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo, data: { ruta: '/paciente/mis-citas' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fecha, channelId: CANAL_ANDROID },
  });
}

export async function cancelar(idNotificacion: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(idNotificacion);
}

export async function cancelarTodas(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function contarProgramadas(): Promise<number> {
  return (await Notifications.getAllScheduledNotificationsAsync()).length;
}

/**
 * Avisa cuando el usuario toca una notificación: la que abrió la app (si estaba cerrada)
 * y las que toque mientras está abierta. Devuelve la función para dejar de escuchar.
 */
export function alTocarNotificacion(accion: () => void): () => void {
  if (Notifications.getLastNotificationResponse()) {
    accion();
    Notifications.clearLastNotificationResponse();
  }

  const suscripcion = Notifications.addNotificationResponseReceivedListener(() => {
    accion();
    Notifications.clearLastNotificationResponse();
  });
  return () => suscripcion.remove();
}
