import { useCallback, useEffect, useState } from 'react';

import type { Paciente } from '@/models/Paciente';
import { obtenerActivos } from '@/services/pacientesService';
import { ordenarPorApellido } from '@/utils/pacientes';

export type EstadoPacientes = 'cargando' | 'listo' | 'error';

/**
 * ViewModel de la pestaña Pacientes: pacientes activos en orden alfabético por apellido (F03).
 */
export function usePacientesViewModel() {
  const [estado, setEstado] = useState<EstadoPacientes>('cargando');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const respuesta = await obtenerActivos();
      if (!respuesta.exitoso || !respuesta.datos) {
        setEstado('error');
        return;
      }
      // El servicio ya devuelve solo activos; el filtro se repite por si la API cambia
      setPacientes(ordenarPorApellido(respuesta.datos.filter((p) => p.activo)));
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function reintentar() {
    setEstado('cargando');
    await cargar();
  }

  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  return { estado, pacientes, refrescando, reintentar, refrescar };
}
