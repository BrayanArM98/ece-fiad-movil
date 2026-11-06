import type { Clinica } from '@/models/Clinica';

/**
 * Ubicaciones de la pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * La API no guarda datos de clínicas, por eso se configuran aquí.
 * Para cambiar un punto: en Google Maps, mantén presionado el lugar y copia sus coordenadas.
 */

/** La clínica ECE-FIAD, en la Facultad de Ingeniería, Arquitectura y Diseño de la UABC. */
export const CLINICA: Clinica = {
  id: 'ece-fiad',
  nombre: 'Clínica ECE-FIAD',
  tipo: 'propia',
  direccion: 'Carretera Transpeninsular Ensenada-Tijuana 3917, Playitas, Ensenada, B.C.',
  coordenadas: { latitude: 31.8661, longitude: -116.6631 },
};

/**
 * Hospitales y clínicas reales de Ensenada, tomados de OpenStreetMap (noviembre de 2026).
 * Se muestran si no se puede consultar OpenStreetMap en ese momento (sin Internet o servicio saturado).
 */
export const CLINICAS_RESPALDO: Clinica[] = [
  {
    id: 'osm-hospital-general-ensenada',
    nombre: 'Hospital General de Ensenada',
    tipo: 'hospital',
    urgencias: true,
    coordenadas: { latitude: 31.82452, longitude: -116.60027 },
  },
  {
    id: 'osm-imss-hgz-8',
    nombre: 'IMSS Hospital General de Zona No. 8',
    tipo: 'hospital',
    direccion: 'Avenida Reforma s/n, Ensenada',
    urgencias: true,
    coordenadas: { latitude: 31.85714, longitude: -116.60557 },
  },
  {
    id: 'osm-issstecali',
    nombre: 'Hospital ISSSTECALI',
    tipo: 'hospital',
    direccion: 'Calle de las Rocas 254, Ensenada',
    telefono: '+526461763401',
    urgencias: true,
    coordenadas: { latitude: 31.85576, longitude: -116.61661 },
  },
  {
    id: 'osm-issste-ensenada',
    nombre: 'Clínica Hospital ISSSTE Ensenada',
    tipo: 'hospital',
    coordenadas: { latitude: 31.85015, longitude: -116.60758 },
  },
  {
    id: 'osm-imss-umf-25',
    nombre: 'IMSS Unidad de Medicina Familiar No. 25',
    tipo: 'clinica',
    direccion: 'Calle Primera y Justo Sierra, Ensenada',
    coordenadas: { latitude: 31.8632, longitude: -116.59211 },
  },
  {
    id: 'osm-cruz-roja-ensenada',
    nombre: 'Cruz Roja Mexicana',
    tipo: 'hospital',
    coordenadas: { latitude: 31.8733, longitude: -116.6354 },
  },
  {
    id: 'osm-centro-salud-chapultepec',
    nombre: 'Centro de Salud Chapultepec',
    tipo: 'clinica',
    direccion: 'Calle Benito Juárez, Chapultepec, Ensenada',
    coordenadas: { latitude: 31.78221, longitude: -116.59813 },
  },
];

/** Radio de búsqueda de clínicas cercanas, en metros. */
export const RADIO_BUSQUEDA_METROS = 8_000;
