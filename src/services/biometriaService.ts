import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Huella o rostro del teléfono (specs/features/F01-inicio-sesion-biometria.md).
 */
export type ResultadoBiometria = 'ok' | 'cancelado' | 'fallido' | 'bloqueado';

/** El teléfono tiene sensor y al menos una huella o rostro registrado. */
export async function estaDisponible(): Promise<boolean> {
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

const CANCELACIONES = ['user_cancel', 'system_cancel', 'app_cancel', 'user_fallback'];
const BLOQUEOS = ['lockout', 'not_enrolled', 'not_available', 'passcode_not_set'];

export async function autenticar(): Promise<ResultadoBiometria> {
  try {
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar a ECE-FIAD',
      cancelLabel: 'Usar contraseña',
      // Sin PIN del teléfono como alternativa: la alternativa es la contraseña de la cuenta
      disableDeviceFallback: true,
    });

    if (resultado.success) return 'ok';
    if (CANCELACIONES.includes(resultado.error)) return 'cancelado';
    if (BLOQUEOS.includes(resultado.error)) return 'bloqueado';
    return 'fallido';
  } catch {
    return 'fallido';
  }
}
