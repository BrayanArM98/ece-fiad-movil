import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Sesion } from '@/models/Sesion';

/**
 * Estado global de la sesión.
 * El layout raíz lo usa para decidir qué rutas están disponibles (specs/01-navigation.md).
 * Por ahora la sesión vive en memoria; guardarla en almacenamiento seguro es una task de F01.
 */
interface SesionContextValor {
  sesion: Sesion | null;
  abrirSesion: (sesion: Sesion) => void;
  cerrarSesion: () => void;
}

const SesionContext = createContext<SesionContextValor | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);

  const valor: SesionContextValor = {
    sesion,
    abrirSesion: (nueva) => setSesion(nueva),
    cerrarSesion: () => setSesion(null),
  };

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion(): SesionContextValor {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider />');
  }
  return contexto;
}
