import { useCallback, useEffect, useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import type { Cita } from '@/models/Cita';
import { obtenerTodas } from '@/services/citasService';
import { obtenerTodos as obtenerDoctores } from '@/services/doctoresService';
import { consultarPermiso, solicitarPermiso, type EstadoPermiso } from '@/services/notificacionesService';
import { sincronizar } from '@/services/recordatoriosService';
import { prepararCitasPaciente } from '@/utils/citasPaciente';

export type EstadoMisCitas = 'cargando' | 'listo' | 'error';

export interface CitaConEspecialidad extends Cita {
  nombreEspecialidad: string;
}

/**
 * ViewModel de Mis citas (specs/features/F06-mis-citas-recordatorios.md).
 * Muestra las próximas citas del paciente y mantiene sus recordatorios programados.
 */
export function useMisCitasViewModel() {
  const { sesion } = useSesion();
  const idPaciente = sesion?.idPaciente;

  const [estado, setEstado] = useState<EstadoMisCitas>('cargando');
  const [citas, setCitas] = useState<CitaConEspecialidad[]>([]);
  const [permiso, setPermiso] = useState<EstadoPermiso | null>(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    if (!idPaciente) return;
    try {
      const [respuestaCitas, respuestaDoctores, estadoPermiso] = await Promise.all([
        obtenerTodas(),
        obtenerDoctores(),
        consultarPermiso(),
      ]);

      if (!respuestaCitas.exitoso || !respuestaCitas.datos) {
        setEstado('error');
        return;
      }

      const especialidades = new Map((respuestaDoctores.datos ?? []).map((d) => [d.id, d.nombreEspecialidad]));
      const proximas = prepararCitasPaciente(respuestaCitas.datos, idPaciente, new Date()).map((cita) => ({
        ...cita,
        nombreEspecialidad: especialidades.get(cita.idDoctor) ?? '',
      }));

      setCitas(proximas);
      setPermiso(estadoPermiso);
      setEstado('listo');

      // Con permiso, los recordatorios se ajustan a las citas actuales
      if (estadoPermiso === 'concedido') await sincronizar(proximas);
    } catch {
      setEstado('error');
    }
  }, [idPaciente]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function activarRecordatorios() {
    const nuevoPermiso = await solicitarPermiso();
    setPermiso(nuevoPermiso);
    if (nuevoPermiso === 'concedido') await sincronizar(citas).catch(() => {});
  }

  async function reintentar() {
    setEstado('cargando');
    await cargar();
  }

  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  return { estado, citas, permiso, refrescando, activarRecordatorios, reintentar, refrescar };
}
