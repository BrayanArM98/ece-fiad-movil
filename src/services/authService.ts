import { usarApi } from '@/config/api';
import type { Respuesta } from '@/models/Respuesta';
import type { Sesion } from '@/models/Sesion';
import { pedir } from '@/services/http';

/**
 * Servicio de autenticación (specs/features/F01-inicio-sesion-biometria.md).
 * Con la API configurada valida contra POST /api/Auth/login y guarda el token que devuelve.
 * Sin API, valida contra las cuentas de ejemplo para poder presentar la app sin servidor.
 */

/** Usuario que devuelve la API dentro de la sesión. */
interface UsuarioApi {
  id: number;
  email: string;
  nombreCompleto: string;
  rol: 'Administrador' | 'Recepcionista' | 'Medico' | 'Paciente';
  idDoctor: number | null;
  idPaciente: number | null;
}

interface SesionApi {
  token: string;
  expiraUtc: string;
  usuario: UsuarioApi;
}

export const MENSAJE_CREDENCIALES = 'Correo o contraseña incorrectos';
export const MENSAJE_SOLO_WEB = 'Esta app es para médicos y pacientes. El personal administrativo usa ECE-FIAD Web.';

/** Convierte la respuesta de la API en la sesión de la app. */
export function aSesion({ token, expiraUtc, usuario }: SesionApi): Sesion | null {
  if (usuario.rol !== 'Medico' && usuario.rol !== 'Paciente') return null;
  return {
    nombre: usuario.nombreCompleto,
    correo: usuario.email,
    rol: usuario.rol === 'Medico' ? 'medico' : 'paciente',
    idDoctor: usuario.idDoctor ?? undefined,
    idPaciente: usuario.idPaciente ?? undefined,
    token,
    expiraUtc,
    biometriaActiva: false,
  };
}

async function iniciarConApi(correo: string, contrasena: string): Promise<Respuesta<Sesion>> {
  const respuesta = await pedir<SesionApi>('/api/Auth/login', {
    metodo: 'POST',
    cuerpo: { email: correo.trim().toLowerCase(), contrasena },
    sinToken: true,
  });

  if (respuesta.codigo === 401) return { exitoso: false, mensaje: MENSAJE_CREDENCIALES, datos: null };
  if (!respuesta.exitoso || !respuesta.datos) {
    return { exitoso: false, mensaje: respuesta.mensaje || MENSAJE_CREDENCIALES, datos: null };
  }

  const sesion = aSesion(respuesta.datos);
  if (!sesion) return { exitoso: false, mensaje: MENSAJE_SOLO_WEB, datos: null };
  return { exitoso: true, mensaje: 'Sesión iniciada', datos: sesion };
}

// ===== Modo demostración (sin API) =====

/** Las sesiones de ejemplo no vencen. */
const SIN_VENCIMIENTO = '2099-12-31T23:59:59Z';

const CUENTAS_EJEMPLO: { correo: string; contrasena: string; sesion: Sesion }[] = [
  {
    correo: 'medico@ecefiad.mx',
    contrasena: 'medico123',
    sesion: {
      nombre: 'Dra. Ana López',
      correo: 'medico@ecefiad.mx',
      rol: 'medico',
      idDoctor: 1,
      token: '',
      expiraUtc: SIN_VENCIMIENTO,
      biometriaActiva: false,
    },
  },
  {
    correo: 'paciente@ecefiad.mx',
    contrasena: 'paciente123',
    sesion: {
      nombre: 'Juan Pérez',
      correo: 'paciente@ecefiad.mx',
      rol: 'paciente',
      idPaciente: 1,
      token: '',
      expiraUtc: SIN_VENCIMIENTO,
      biometriaActiva: false,
    },
  },
];

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

async function iniciarConEjemplos(correo: string, contrasena: string): Promise<Respuesta<Sesion>> {
  await esperar(400);
  const cuenta = CUENTAS_EJEMPLO.find(
    (c) => c.correo === correo.trim().toLowerCase() && c.contrasena === contrasena
  );
  if (!cuenta) return { exitoso: false, mensaje: MENSAJE_CREDENCIALES, datos: null };
  return { exitoso: true, mensaje: 'Sesión iniciada', datos: cuenta.sesion };
}

/** Lanza un error si no hay conexión con el servidor. */
export function iniciarSesion(correo: string, contrasena: string): Promise<Respuesta<Sesion>> {
  return usarApi ? iniciarConApi(correo, contrasena) : iniciarConEjemplos(correo, contrasena);
}
