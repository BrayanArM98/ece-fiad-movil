import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Adjunto } from '@/models/Adjunto';
import type { HistorialPaciente } from '@/models/HistorialPaciente';
import type { Paciente } from '@/models/Paciente';
import { listarPorEvoluciones } from '@/services/adjuntosService';
import { obtenerPorPaciente } from '@/services/historialService';
import { obtenerPorId } from '@/services/pacientesService';

export type EstadoHistorial = 'cargando' | 'listo' | 'noEncontrado' | 'error';

/**
 * ViewModel del historial del paciente (specs/features/F03-historial-paciente.md).
 * Se recarga cada vez que la pantalla recibe el foco, para que al regresar de
 * Nueva evolución (F04) la evolución recién guardada aparezca primero.
 */
export function useHistorialViewModel(pacienteId: number) {
  const [estado, setEstado] = useState<EstadoHistorial>('cargando');
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historial, setHistorial] = useState<HistorialPaciente | null>(null);
  const [expandida, setExpandida] = useState<number | null>(null);
  const [fotos, setFotos] = useState<Record<number, Adjunto[]>>({});
  const [fotoAbierta, setFotoAbierta] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const [respuestaPaciente, respuestaHistorial] = await Promise.all([
        obtenerPorId(pacienteId),
        obtenerPorPaciente(pacienteId),
      ]);

      if (!respuestaPaciente.exitoso || !respuestaPaciente.datos) {
        setEstado('noEncontrado');
        return;
      }
      if (!respuestaHistorial.exitoso || !respuestaHistorial.datos) {
        setEstado('error');
        return;
      }

      setPaciente(respuestaPaciente.datos);
      setHistorial(respuestaHistorial.datos);
      // F05: fotografías guardadas en el teléfono para estas evoluciones
      setFotos(listarPorEvoluciones(respuestaHistorial.datos.evoluciones.map((e) => e.id)));
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  }, [pacienteId]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  async function reintentar() {
    setEstado('cargando');
    await cargar();
  }

  function alternarEvolucion(idEvolucion: number) {
    setExpandida((actual) => (actual === idEvolucion ? null : idEvolucion));
  }

  const alergias = historial?.historia?.alergias.trim() ?? '';

  return {
    estado,
    paciente,
    historial,
    alergiasTexto: alergias || 'Sin alergias registradas',
    tieneAlergias: alergias.length > 0,
    expandida,
    alternarEvolucion,
    fotosDe: (idEvolucion: number) => fotos[idEvolucion] ?? [],
    fotoAbierta,
    verFoto: setFotoAbierta,
    cerrarFoto: () => setFotoAbierta(null),
    reintentar,
  };
}
