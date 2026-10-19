/**
 * Funciones de notificaciones LOCALES de expo-notifications, importadas una por una.
 *
 * El punto de entrada del paquete (`import * from 'expo-notifications'`) también carga el
 * módulo de suscripción a temas de las notificaciones push remotas (ExpoTopicSubscriptionModule).
 * Ese módulo nativo no existe en Expo Go para Android y la app falla al abrir.
 * Como F06 solo usa notificaciones programadas en el teléfono, se importa únicamente lo necesario.
 */
export { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
export { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
export { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
export { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
export type { NotificationPermissionsStatus } from 'expo-notifications/build/NotificationPermissions.types';
export { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
export { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
export { cancelAllScheduledNotificationsAsync } from 'expo-notifications/build/cancelAllScheduledNotificationsAsync';
export { getAllScheduledNotificationsAsync } from 'expo-notifications/build/getAllScheduledNotificationsAsync';
export { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
export {
  addNotificationResponseReceivedListener,
  clearLastNotificationResponse,
  getLastNotificationResponse,
} from 'expo-notifications/build/NotificationsEmitter';
