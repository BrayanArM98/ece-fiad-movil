/**
 * Modo de prueba para validar los casos de error de las specs con datos de ejemplo,
 * que nunca fallan por sí solos. Solo se puede activar en desarrollo (Perfil → Modo de prueba).
 * Al conectar la API, estos casos se producen de verdad y este archivo deja de usarse.
 */
export const simulacion = {
  fallaDeRed: false, // todos los servicios fallan como si no hubiera Internet
  sinCitas: false, // el servicio de citas responde una lista vacía
};

export function comprobarRed(): void {
  if (__DEV__ && simulacion.fallaDeRed) {
    throw new Error('Sin conexión (simulada)');
  }
}
