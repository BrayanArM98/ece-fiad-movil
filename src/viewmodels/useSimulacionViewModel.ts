import { useEffect, useState } from 'react';

import { simulacion } from '@/config/simulacion';
import { useSesion } from '@/context/SesionContext';
import { contarProgramadas, programar, solicitarPermiso } from '@/services/notificacionesService';

/**
 * ViewModel del modo de prueba. Refleja en pantalla los valores de config/simulacion.ts
 * y, para el paciente, permite revisar los recordatorios programados (F06).
 */
export function useSimulacionViewModel() {
  const { sesion } = useSesion();
  const esPaciente = sesion?.rol === 'paciente';

  const [fallaDeRed, setFallaDeRed] = useState(simulacion.fallaDeRed);
  const [sinCitas, setSinCitas] = useState(simulacion.sinCitas);
  const [programados, setProgramados] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function actualizarProgramados() {
    setProgramados(await contarProgramadas().catch(() => null));
  }

  useEffect(() => {
    if (esPaciente) actualizarProgramados();
  }, [esPaciente]);

  async function enviarPrueba() {
    const permiso = await solicitarPermiso();
    if (permiso !== 'concedido') {
      setMensaje('Sin permiso de notificaciones.');
      return;
    }
    await programar('Recordatorio de prueba', 'Toca para abrir Mis citas', new Date(Date.now() + 10_000));
    setMensaje('Llegará en 10 segundos. Puedes salir de la app para verlo.');
    await actualizarProgramados();
  }

  return {
    disponible: __DEV__,
    esPaciente,
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
    programados,
    actualizarProgramados,
    enviarPrueba,
    mensaje,
  };
}
