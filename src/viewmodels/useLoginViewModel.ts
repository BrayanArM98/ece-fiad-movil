import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { useSesion } from '@/context/SesionContext';
import { sesionExpirada, type Sesion } from '@/models/Sesion';
import { iniciarSesion } from '@/services/authService';
import { autenticar, estaDisponible } from '@/services/biometriaService';
import { despertarServidor } from '@/services/http';
import { borrarSesion, guardarSesion, leerSesion } from '@/services/sesionStorage';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_INTENTOS_BIOMETRIA = 3;
const AVISO_EXPIRADA = 'Tu sesión expiró. Entra con tu correo y contraseña.';
/** Si el servidor tarda más que esto, se avisa que está despertando (plan gratuito de Azure). */
const MS_SERVIDOR_LENTO = 6_000;

function preguntarBiometria(): Promise<boolean> {
  return new Promise((resolver) => {
    Alert.alert(
      'Entrar con huella o rostro',
      '¿Quieres usar tu huella o rostro para entrar la próxima vez?',
      [
        { text: 'Ahora no', style: 'cancel', onPress: () => resolver(false) },
        { text: 'Activar', onPress: () => resolver(true) },
      ],
      { cancelable: true, onDismiss: () => resolver(false) }
    );
  });
}

/**
 * ViewModel de la pantalla Login (specs/features/F01-inicio-sesion-biometria.md).
 * Primer acceso con correo y contraseña; accesos siguientes con huella o rostro.
 * `alIniciarSesion` lo usa la pantalla para navegar a la zona del rol.
 */
export function useLoginViewModel(alIniciarSesion: () => void) {
  const { abrirSesion } = useSesion();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sesionGuardada, setSesionGuardada] = useState<Sesion | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [lento, setLento] = useState(false);
  const intentosFallidos = useRef(0);

  // F01: "Entrar" deshabilitado mientras falte el correo válido o la contraseña
  const puedeEnviar = FORMATO_CORREO.test(correo.trim()) && contrasena.length > 0 && !cargando;

  async function verificarBiometria(sesion: Sesion) {
    setVerificando(true);
    setAviso(null);
    const resultado = await autenticar();
    setVerificando(false);

    if (resultado === 'ok') {
      // El token de la API dura 8 horas; si ya venció hay que entrar con contraseña
      if (sesionExpirada(sesion)) {
        await borrarSesion();
        setSesionGuardada(null);
        setAviso(AVISO_EXPIRADA);
        return;
      }
      abrirSesion(sesion);
      alIniciarSesion();
      return;
    }

    // Cancelar o "Usar contraseña": se queda en Login sin error
    if (resultado === 'cancelado') return;

    intentosFallidos.current = resultado === 'bloqueado' ? MAX_INTENTOS_BIOMETRIA : intentosFallidos.current + 1;

    if (intentosFallidos.current >= MAX_INTENTOS_BIOMETRIA) {
      setSesionGuardada(null);
      setAviso('No se reconoció tu huella o rostro. Entra con tu correo y contraseña.');
    } else {
      setAviso('No se reconoció tu huella o rostro. Intenta de nuevo.');
    }
  }

  // Accesos siguientes: si hay una sesión guardada con biometría, se pide al abrir la app
  useEffect(() => {
    despertarServidor();
    let activo = true;

    (async () => {
      const guardada = await leerSesion();
      if (!activo || !guardada?.biometriaActiva) return;

      // Si el usuario quitó sus huellas del teléfono, vuelve a entrar con contraseña
      if (!(await estaDisponible())) {
        await borrarSesion();
        return;
      }
      if (sesionExpirada(guardada)) {
        await borrarSesion();
        if (activo) setAviso(AVISO_EXPIRADA);
        return;
      }

      setSesionGuardada(guardada);
      verificarBiometria(guardada);
    })();

    return () => {
      activo = false;
    };
    // Solo al montar la pantalla
  }, []);

  function entrarConBiometria() {
    if (sesionGuardada && !verificando) verificarBiometria(sesionGuardada);
  }

  async function ofrecerBiometria(): Promise<boolean> {
    if (!(await estaDisponible())) return false;
    if (!(await preguntarBiometria())) return false;
    // Se pide una vez para confirmar que el usuario puede usarla
    return (await autenticar()) === 'ok';
  }

  async function entrar() {
    if (!puedeEnviar) return;

    setCargando(true);
    setError(null);
    setAviso(null);

    // Si el servidor tarda (está despertando), la pantalla lo avisa
    const temporizador = setTimeout(() => setLento(true), MS_SERVIDOR_LENTO);
    let respuesta: Awaited<ReturnType<typeof iniciarSesion>>;
    try {
      respuesta = await iniciarSesion(correo, contrasena);
    } catch (e) {
      respuesta = { exitoso: false, mensaje: e instanceof Error ? e.message : 'No se pudo conectar con el servidor.', datos: null };
    } finally {
      clearTimeout(temporizador);
      setLento(false);
    }

    if (!respuesta.exitoso || !respuesta.datos) {
      // Los campos se conservan para que el usuario corrija
      setError(respuesta.mensaje);
      setCargando(false);
      return;
    }

    const sesion = respuesta.datos;
    const vinculada =
      (sesion.rol === 'medico' && sesion.idDoctor) || (sesion.rol === 'paciente' && sesion.idPaciente);

    if (!vinculada) {
      setError('Tu cuenta no está vinculada a un expediente');
      setCargando(false);
      return;
    }

    let biometriaActiva = false;
    if (await ofrecerBiometria()) {
      try {
        await guardarSesion({ ...sesion, biometriaActiva: true });
        biometriaActiva = true;
      } catch {
        // Si no se pudo guardar, entra igual y la próxima vez usará la contraseña
      }
    } else {
      await borrarSesion();
    }

    setCargando(false);
    abrirSesion({ ...sesion, biometriaActiva });
    alIniciarSesion();
  }

  return {
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    cargando,
    lento,
    error,
    puedeEnviar,
    entrar,
    sesionGuardada,
    verificando,
    aviso,
    entrarConBiometria,
  };
}
