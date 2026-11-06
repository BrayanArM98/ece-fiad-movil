import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

import type { Sesion } from '@/models/Sesion';
import { alExpirarToken, establecerToken } from '@/services/http';
import { borrarSesion } from '@/services/sesionStorage';

/**
 * Estado global de la sesión.
 * El layout raíz lo usa para decidir qué rutas están disponibles (specs/01-navigation.md).
 * La sesión activa vive en memoria; la copia para entrar con biometría está en sesionStorage (F01).
 * El token de la sesión se entrega al cliente HTTP para que lo envíe en cada petición.
 */
interface SesionContextValor {
  sesion: Sesion | null;
  abrirSesion: (sesion: Sesion) => void;
  cerrarSesion: () => void;
}

const SesionContext = createContext<SesionContextValor | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);

  function abrirSesion(nueva: Sesion) {
    establecerToken(nueva.token);
    setSesion(nueva);
  }

  function cerrarSesion() {
    establecerToken('');
    setSesion(null);
  }

  // Si la API rechaza el token (venció o se desactivó la cuenta), se regresa a Login
  useEffect(() => {
    alExpirarToken(() => {
      establecerToken('');
      borrarSesion();
      setSesion(null);
      Alert.alert('Tu sesión expiró', 'Vuelve a iniciar sesión con tu correo y contraseña.');
    });
    return () => alExpirarToken(null);
  }, []);

  return (
    <SesionContext.Provider value={{ sesion, abrirSesion, cerrarSesion }}>{children}</SesionContext.Provider>
  );
}

export function useSesion(): SesionContextValor {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider />');
  }
  return contexto;
}
