import { useEffect, useState } from 'react';

/**
 * Hora actual que se actualiza sola, para cuentas regresivas ("En 25 min")
 * y la marca de "ahora" en la agenda.
 */
export function useReloj(intervaloMs = 30_000): Date {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);
  return ahora;
}
