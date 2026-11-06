/**
 * Clínicas y hospitales que muestra la pestaña Clínica (specs/02-data-model.md, F07).
 * Las coordenadas usan los nombres en inglés porque es la forma que reciben
 * y devuelven expo-location y react-native-maps.
 */
export interface Coordenadas {
  latitude: number;
  longitude: number;
}

/** propia = la clínica ECE-FIAD; hospital y clinica = lugares reales de OpenStreetMap. */
export type TipoClinica = 'propia' | 'hospital' | 'clinica';

export interface Clinica {
  id: string;
  nombre: string;
  tipo: TipoClinica;
  direccion?: string;
  telefono?: string;
  /** Atiende urgencias (etiqueta emergency=yes en OpenStreetMap). */
  urgencias?: boolean;
  coordenadas: Coordenadas;
}
