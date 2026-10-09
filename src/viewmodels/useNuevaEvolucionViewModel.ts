import { useEffect, useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import { crear } from '@/services/evolucionesService';
import { obtenerPorId } from '@/services/pacientesService';
import { formatearFechaCompleta, formatearHora } from '@/utils/fechas';
import { nombreCompleto } from '@/utils/pacientes';
import { esValida, validarEvolucion } from '@/utils/validaciones';

/**
 * ViewModel del formulario de nueva evolución (specs/features/F04-registrar-evolucion.md).
 */
export function useNuevaEvolucionViewModel(historiaId: number, pacienteId: number) {
  const { sesion } = useSesion();

  const [nombrePaciente, setNombrePaciente] = useState('');
  const [fecha, setFecha] = useState(() => new Date());
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [guardada, setGuardada] = useState(false);

  useEffect(() => {
    obtenerPorId(pacienteId)
      .then((respuesta) => {
        if (respuesta.datos) setNombrePaciente(nombreCompleto(respuesta.datos));
      })
      .catch(() => {});
  }, [pacienteId]);

  const datos = {
    idHistoriaClinica: historiaId,
    idDoctor: sesion?.idDoctor ?? 0, // F04: el médico no se captura, viene de la sesión
    fecha: fecha.toISOString(),
    diagnostico,
    tratamiento,
    notas,
  };

  const errores = validarEvolucion(datos);
  const camposObligatoriosLlenos = diagnostico.trim().length > 0 && tratamiento.trim().length > 0;
  const puedeGuardar = camposObligatoriosLlenos && !enviando && !guardada;
  const hayCambios = (diagnostico.trim() || tratamiento.trim() || notas.trim()).length > 0;

  async function guardar(): Promise<boolean> {
    // Evita registrar dos veces la misma evolución con dos toques seguidos
    if (!puedeGuardar) return false;

    const erroresActuales = validarEvolucion(datos);
    if (!esValida(erroresActuales)) return false;

    setEnviando(true);
    setErrorEnvio(null);
    try {
      const respuesta = await crear(datos);
      if (!respuesta.exitoso) {
        // Se conserva lo capturado para que el médico corrija o reintente
        setErrorEnvio(respuesta.mensaje);
        return false;
      }
      setGuardada(true);
      return true;
    } catch {
      setErrorEnvio('No se pudo guardar. Revisa tu conexión.');
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return {
    nombrePaciente,
    fecha,
    setFecha,
    fechaTexto: `${formatearFechaCompleta(fecha)}, ${formatearHora(fecha)}`,
    diagnostico,
    setDiagnostico,
    tratamiento,
    setTratamiento,
    notas,
    setNotas,
    errorFecha: errores.fecha,
    errorEnvio,
    enviando,
    puedeGuardar,
    // F04: confirmar antes de salir si hay datos capturados sin guardar
    debeConfirmarSalida: hayCambios && !guardada,
    guardar,
  };
}
