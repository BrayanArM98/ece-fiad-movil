import { useEffect, useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import { guardar as guardarAdjuntos } from '@/services/adjuntosService';
import { obtenerFoto, type OrigenFoto } from '@/services/camaraService';
import { crear } from '@/services/evolucionesService';
import { obtenerPorId } from '@/services/pacientesService';
import { formatearFechaCompleta, formatearHora } from '@/utils/fechas';
import { nombreCompleto } from '@/utils/pacientes';
import { esValida, LIMITES_EVOLUCION, validarEvolucion } from '@/utils/validaciones';

const AVISO_PERMISO: Record<OrigenFoto, string> = {
  camara: 'Para tomar fotos, permite el acceso a la cámara en la configuración del teléfono.',
  galeria: 'Para elegir fotos, permite el acceso a la galería en la configuración del teléfono.',
};

/**
 * ViewModel del formulario de nueva evolución
 * (specs/features/F04-registrar-evolucion.md y F05-fotografia-evolucion.md).
 */
export function useNuevaEvolucionViewModel(historiaId: number, pacienteId: number) {
  const { sesion } = useSesion();

  const [nombrePaciente, setNombrePaciente] = useState('');
  const [fecha, setFecha] = useState(() => new Date());
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [notas, setNotas] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [avisoFotos, setAvisoFotos] = useState<string | null>(null);
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
  const hayCambios = (diagnostico.trim() || tratamiento.trim() || notas.trim()).length > 0 || fotos.length > 0;
  const puedeAgregarFoto = fotos.length < LIMITES_EVOLUCION.fotos && !enviando;

  async function agregarFoto(origen: OrigenFoto) {
    if (!puedeAgregarFoto) return;
    setAvisoFotos(null);
    try {
      const resultado = await obtenerFoto(origen);
      if (resultado.estado === 'ok') setFotos((actuales) => [...actuales, resultado.uri]);
      if (resultado.estado === 'sinPermiso') setAvisoFotos(AVISO_PERMISO[origen]);
      // 'cancelado': el médico regresa al formulario sin cambios
    } catch {
      setAvisoFotos('No se pudo obtener la fotografía.');
    }
  }

  function quitarFoto(uri: string) {
    setFotos((actuales) => actuales.filter((foto) => foto !== uri));
  }

  async function guardar(): Promise<boolean> {
    // Evita registrar dos veces la misma evolución con dos toques seguidos
    if (!puedeGuardar) return false;

    const erroresActuales = validarEvolucion(datos);
    if (!esValida(erroresActuales)) return false;

    setEnviando(true);
    setErrorEnvio(null);
    try {
      const respuesta = await crear(datos);
      if (!respuesta.exitoso || !respuesta.datos) {
        // Se conservan los datos y las fotos para que el médico corrija o reintente
        setErrorEnvio(respuesta.mensaje);
        return false;
      }

      // F05: las fotos solo se asocian si la evolución se guardó con éxito
      if (fotos.length > 0) {
        await guardarAdjuntos(respuesta.datos.id, fotos);
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
    fotos,
    avisoFotos,
    puedeAgregarFoto,
    agregarFoto,
    quitarFoto,
    errorFecha: errores.fecha,
    errorEnvio,
    enviando,
    puedeGuardar,
    // F04: confirmar antes de salir si hay datos capturados sin guardar
    debeConfirmarSalida: hayCambios && !guardada,
    guardar,
  };
}
