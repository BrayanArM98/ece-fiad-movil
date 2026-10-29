import * as SecureStore from 'expo-secure-store';

import type { Sesion } from '@/models/Sesion';

/**
 * Sesión guardada en el almacenamiento seguro del teléfono (specs/features/F01-inicio-sesion-biometria.md).
 * Solo se guarda cuando el usuario activa la biometría; nunca se usa almacenamiento normal.
 */
const CLAVE = 'ece-fiad.sesion';

export async function guardarSesion(sesion: Sesion): Promise<void> {
  await SecureStore.setItemAsync(CLAVE, JSON.stringify(sesion));
}

export async function leerSesion(): Promise<Sesion | null> {
  try {
    const texto = await SecureStore.getItemAsync(CLAVE);
    if (!texto) return null;

    const sesion = JSON.parse(texto) as Sesion;
    if (sesion.rol !== 'medico' && sesion.rol !== 'paciente') throw new Error('Sesión inválida');
    return sesion;
  } catch {
    // Un valor dañado no debe impedir entrar con contraseña
    await borrarSesion();
    return null;
  }
}

export async function borrarSesion(): Promise<void> {
  await SecureStore.deleteItemAsync(CLAVE).catch(() => {});
}
