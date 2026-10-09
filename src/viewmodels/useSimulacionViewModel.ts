import { useState } from 'react';

import { simulacion } from '@/config/simulacion';

/**
 * ViewModel del modo de prueba. Refleja en pantalla los valores de config/simulacion.ts.
 */
export function useSimulacionViewModel() {
  const [fallaDeRed, setFallaDeRed] = useState(simulacion.fallaDeRed);
  const [sinCitas, setSinCitas] = useState(simulacion.sinCitas);

  return {
    disponible: __DEV__,
    fallaDeRed,
    cambiarFallaDeRed: (valor: boolean) => {
      simulacion.fallaDeRed = valor;
      setFallaDeRed(valor);
    },
    sinCitas,
    cambiarSinCitas: (valor: boolean) => {
      simulacion.sinCitas = valor;
      setSinCitas(valor);
    },
  };
}
