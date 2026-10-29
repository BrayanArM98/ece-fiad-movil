/**
 * Dirección de la API REST del sistema web ECE-FIAD (specs/03-api.md).
 * Se define en .env.local (EXPO_PUBLIC_API_URL). Sin ella, la app usa los datos de ejemplo.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

export const usarApi = API_URL.length > 0;
