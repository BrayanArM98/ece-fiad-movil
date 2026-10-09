import { useCallback, useEffect, useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import type { Cita } from '@/models/Cita';
import { obtenerTodas } from '@/services/citasService';
import { calcularResumen, prepararAgenda, type ResumenAgenda } from '@/utils/agenda';
import { formatearFechaLarga } from '@/utils/fechas';

export type EstadoAgenda = 'cargando' | 'listo' | 'error';

/**
 * ViewModel de la Agenda del día (specs/features/F02-agenda-del-dia.md).
 * Obtiene las citas, aplica las reglas de la agenda y expone los estados de la pantalla.
 */
export function useAgendaViewModel() {
  const { sesion, cerrarSesion } = useSesion();
  const idDoctor = sesion?.idDoctor;

  const [estado, setEstado] = useState<EstadoAgenda>('cargando');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [resumen, setResumen] = useState<ResumenAgenda>({ total: 0, pendientes: 0 });
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    if (!idDoctor) return;

    const respuesta = await obtenerTodas();

    if (!respuesta.exitoso || !respuesta.datos) {
      setEstado('error');
      return;
    }

    const agenda = prepararAgenda(respuesta.datos, idDoctor, new Date());
    setCitas(agenda);
    setResumen(calcularResumen(agenda));
    setEstado('listo');
  }, [idDoctor]);

  useEffect(() => {
    // F02, casos de error: una cuenta sin idDoctor no puede ver una agenda
    if (!idDoctor) {
      cerrarSesion();
      return;
    }
    cargar().catch(() => setEstado('error'));
  }, [idDoctor, cargar, cerrarSesion]);

  async function reintentar() {
    setEstado('cargando');
    await cargar().catch(() => setEstado('error'));
  }

  async function refrescar() {
    setRefrescando(true);
    await cargar().catch(() => setEstado('error'));
    setRefrescando(false);
  }

  return {
    estado,
    citas,
    resumen,
    fechaHoy: formatearFechaLarga(new Date()),
    refrescando,
    reintentar,
    refrescar,
  };
}
