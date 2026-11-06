/**
 * Dirección de la API REST del sistema web ECE-FIAD (specs/03-api.md).
 * Por defecto es la API publicada en Azure (.env.development y .env.production).
 * En .env.local se puede apuntar a una API local o dejarla vacía para usar los datos de ejemplo.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

export const usarApi = API_URL.length > 0;
