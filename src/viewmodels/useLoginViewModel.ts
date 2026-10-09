import { useState } from 'react';

import { useSesion } from '@/context/SesionContext';
import { iniciarSesion } from '@/services/authService';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ViewModel de la pantalla Login (specs/features/F01-inicio-sesion-biometria.md).
 * Contiene el estado del formulario y la lógica; la pantalla solo lo muestra.
 */
export function useLoginViewModel() {
  const { abrirSesion } = useSesion();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // F01: "Entrar" deshabilitado mientras falte el correo válido o la contraseña
  const puedeEnviar = FORMATO_CORREO.test(correo.trim()) && contrasena.length > 0 && !cargando;

  async function entrar(): Promise<boolean> {
    if (!puedeEnviar) return false;

    setCargando(true);
    setError(null);

    const respuesta = await iniciarSesion(correo, contrasena);
    setCargando(false);

    if (!respuesta.exitoso || !respuesta.datos) {
      // Los campos se conservan para que el usuario corrija
      setError(respuesta.mensaje);
      return false;
    }

    const sesion = respuesta.datos;
    const vinculada =
      (sesion.rol === 'medico' && sesion.idDoctor) || (sesion.rol === 'paciente' && sesion.idPaciente);

    if (!vinculada) {
      setError('Tu cuenta no está vinculada a un expediente');
      return false;
    }

    abrirSesion(sesion);
    return true;
  }

  return {
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    cargando,
    error,
    puedeEnviar,
    entrar,
  };
}
