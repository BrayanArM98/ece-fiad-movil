/**
 * Datos de la clínica (specs/02-data-model.md).
 * Las coordenadas usan los nombres en inglés porque es la forma que reciben
 * y devuelven expo-location y react-native-maps.
 */
export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export interface Clinica {
  nombre: string;
  direccion: string;
  telefono: string;
  coordenadas: Coordenadas;
}
