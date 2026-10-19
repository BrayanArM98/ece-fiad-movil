import type { Clinica } from '@/models/Clinica';

/**
 * Ubicación de la clínica (specs/features/F07-ubicar-clinica.md).
 * La API no guarda datos de la clínica, por eso se configuran aquí.
 * Para cambiar el punto: en Google Maps, mantén presionado el lugar y copia sus coordenadas.
 */
export const CLINICA: Clinica = {
  nombre: 'Clínica ECE-FIAD',
  direccion: 'Carretera Transpeninsular Ensenada-Tijuana 3917, Playitas, Ensenada, B.C.',
  telefono: '6461234567', // número de ejemplo
  coordenadas: {
    latitude: 31.8661,
    longitude: -116.6631,
  },
};
