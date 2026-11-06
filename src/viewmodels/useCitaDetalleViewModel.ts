import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import type { Cita } from '@/models/Cita';
import { cambiarEstado, obtenerPorId, type ResultadoCita } from '@/services/citasService';
import { formatearFechaLarga, formatearHora } from '@/utils/fechas';
import { tiempoRelativo } from '@/utils/tiempo';

export type EstadoCitaDetalle = 'cargando' | 'listo' | 'noEncontrada' | 'error';

/**
 * ViewModel del detalle de la cita (F02 y F03): datos de la cita, acceso al historial
 * y registro del resultado (confirmar, completada o no asistió) con PATCH /api/Citas/{id}/estado.
 */
export function useCitaDetalleViewModel(citaId: number) {
  const [estado, setEstado] = useState<EstadoCitaDetalle>('cargando');
  const [cita, setCita] = useState<Cita | null>(null);
  const [guardando, setGuardando] = useState<ResultadoCita | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      const respuesta = await obtenerPorId(citaId);
      if (!respuesta.exitoso || !respuesta.datos) {
        setEstado(respuesta.codigo && respuesta.codigo >= 500 ? 'error' : 'noEncontrada');
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

  async function registrar(resultado: ResultadoCita) {
    if (!cita || guardando) return;
    setGuardando(resultado);
    setErrorAccion(null);
    try {
      const respuesta = await cambiarEstado(cita.id, resultado);
      if (!respuesta.exitoso) {
        setErrorAccion(respuesta.mensaje || 'No se pudo actualizar la cita.');
        return;
      }
      setCita(respuesta.datos ?? { ...cita, estado: resultado });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      setErrorAccion('No se pudo actualizar la cita. Revisa tu conexión.');
    } finally {
      setGuardando(null);
    }
  }

  const fecha = cita ? new Date(cita.fechaHora) : null;
  const porAtender = cita?.estado === 'Pendiente' || cita?.estado === 'Confirmada';

  return {
    estado,
    cita,
    fechaTexto: fecha ? formatearFechaLarga(fecha) : '',
    horaTexto: fecha ? formatearHora(fecha) : '',
    faltaTexto: fecha ? tiempoRelativo(fecha, new Date()) : '',
    /** Solo una cita pendiente se puede confirmar. */
    puedeConfirmar: cita?.estado === 'Pendiente',
    /** Completada y No asistió solo aplican a citas por atender. */
    puedeRegistrarResultado: porAtender,
    guardando,
    errorAccion,
    registrar,
    reintentar: cargar,
  };
}
