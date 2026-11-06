import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import type { Cita } from '@/models/Cita';
import { obtenerTodas } from '@/services/citasService';
import { calcularResumen, indiceAhora, prepararAgenda, siguienteCita } from '@/utils/agenda';
import { formatearFechaLarga, formatearHora } from '@/utils/fechas';
import { nombreCorto, saludo, tiempoRelativo } from '@/utils/tiempo';
import { useReloj } from '@/viewmodels/useReloj';

export type EstadoAgenda = 'cargando' | 'listo' | 'error';

/**
 * ViewModel de la Agenda del día (specs/features/F02-agenda-del-dia.md).
 * Obtiene las citas, aplica las reglas de la agenda y expone los estados de la pantalla,
 * además del siguiente paciente y el avance del día.
 */
export function useAgendaViewModel() {
  const { sesion, cerrarSesion } = useSesion();
  const idDoctor = sesion?.idDoctor;
  const ahora = useReloj();
  const [estado, setEstado] = useState<EstadoAgenda>('cargando');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    if (!idDoctor) return;
    const hoy = new Date();
    const respuesta = await obtenerTodas({ desde: hoy, hasta: hoy });
    if (!respuesta.exitoso || !respuesta.datos) {
      setEstado('error');
      return;
    }
    setCitas(prepararAgenda(respuesta.datos, idDoctor, new Date()));
    setEstado('listo');
  }, [idDoctor]);

  useEffect(() => {
    // F02, casos de error: una cuenta sin idDoctor no puede ver una agenda
    if (!idDoctor) {
      cerrarSesion();
      return;
    }
  }, [idDoctor, cerrarSesion]);

  // Se recarga al volver a la pestaña, por ejemplo después de registrar el resultado de una cita
  useFocusEffect(
    useCallback(() => {
      cargar().catch(() => setEstado('error'));
    }, [cargar])
  );

  async function reintentar() {
    setEstado('cargando');
    await cargar().catch(() => setEstado('error'));
  }

  async function refrescar() {
    setRefrescando(true);
    await cargar().catch(() => setEstado('error'));
    setRefrescando(false);
  }

  const siguiente = siguienteCita(citas, ahora);
  const vigentes = citas.filter((cita) => cita.estado !== 'Cancelada');

  return {
    estado,
    vigentes,
    canceladas: citas.filter((cita) => cita.estado === 'Cancelada'),
    resumen: calcularResumen(citas),
    siguiente,
    siguienteHora: siguiente ? formatearHora(new Date(siguiente.fechaHora)) : '',
    siguienteFalta: siguiente ? tiempoRelativo(new Date(siguiente.fechaHora), ahora) : '',
    indiceAhora: indiceAhora(citas, ahora),
    horaActual: formatearHora(ahora),
    ahora,
    saludo: saludo(ahora),
    nombre: nombreCorto(sesion?.nombre ?? ''),
    nombreCompleto: sesion?.nombre ?? '',
    fechaHoy: formatearFechaLarga(ahora),
    refrescando,
    reintentar,
    refrescar,
  };
}
