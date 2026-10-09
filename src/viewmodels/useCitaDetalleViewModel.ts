import { useCallback, useEffect, useState } from 'react';

import type { Cita } from '@/models/Cita';
import { obtenerPorId } from '@/services/citasService';
import { formatearFechaLarga, formatearHora } from '@/utils/fechas';

export type EstadoCitaDetalle = 'cargando' | 'listo' | 'noEncontrada' | 'error';

/**
 * ViewModel del detalle de la cita, punto de entrada al historial desde la agenda (F03).
 */
export function useCitaDetalleViewModel(citaId: number) {
  const [estado, setEstado] = useState<EstadoCitaDetalle>('cargando');
  const [cita, setCita] = useState<Cita | null>(null);

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      const respuesta = await obtenerPorId(citaId);
      if (!respuesta.exitoso || !respuesta.datos) {
        setEstado('noEncontrada');
        return;
      }
      setCita(respuesta.datos);
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  }, [citaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const fecha = cita ? new Date(cita.fechaHora) : null;

  return {
    estado,
    cita,
    fechaTexto: fecha ? formatearFechaLarga(fecha) : '',
    horaTexto: fecha ? formatearHora(fecha) : '',
    reintentar: cargar,
  };
}
