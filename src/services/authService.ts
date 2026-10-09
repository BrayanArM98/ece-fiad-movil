import type { Respuesta } from '@/models/Respuesta';
import type { Sesion } from '@/models/Sesion';

/**
 * Servicio de autenticación.
 *
 * La API todavía no tiene inicio de sesión (specs/02-data-model.md, "Pendientes con la API"),
 * así que por ahora las credenciales se validan contra cuentas de ejemplo.
 * Cuando exista el endpoint, solo cambia la implementación de iniciarSesion.
 */
interface CuentaEjemplo {
  correo: string;
  contrasena: string;
  sesion: Sesion;
}

const CUENTAS_EJEMPLO: CuentaEjemplo[] = [
  {
    correo: 'medico@ecefiad.mx',
    contrasena: 'medico123',
    sesion: { nombre: 'Dra. Ana López', rol: 'medico', idDoctor: 1, biometriaActiva: false },
  },
  {
    correo: 'paciente@ecefiad.mx',
    contrasena: 'paciente123',
    sesion: { nombre: 'Juan Pérez', rol: 'paciente', idPaciente: 1, biometriaActiva: false },
  },
];

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export async function iniciarSesion(correo: string, contrasena: string): Promise<Respuesta<Sesion>> {
  // Simula la latencia de una llamada a la API
  await esperar(400);

  const cuenta = CUENTAS_EJEMPLO.find(
    (c) => c.correo === correo.trim().toLowerCase() && c.contrasena === contrasena
  );

  if (!cuenta) {
    return { exitoso: false, mensaje: 'Correo o contraseña incorrectos', datos: null };
  }

  return { exitoso: true, mensaje: 'Sesión iniciada', datos: cuenta.sesion };
}
