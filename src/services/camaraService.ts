import * as ImagePicker from 'expo-image-picker';

/**
 * Captura de imágenes con la cámara o la galería (specs/features/F05-fotografia-evolucion.md).
 * La calidad 0.6 comprime la imagen para no ocupar demasiado espacio.
 */
export type OrigenFoto = 'camara' | 'galeria';

export type ResultadoFoto =
  | { estado: 'ok'; uri: string }
  | { estado: 'cancelado' }
  | { estado: 'sinPermiso' };

const OPCIONES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.6,
};

export async function obtenerFoto(origen: OrigenFoto): Promise<ResultadoFoto> {
  const permiso =
    origen === 'camara'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permiso.granted) return { estado: 'sinPermiso' };

  const resultado =
    origen === 'camara'
      ? await ImagePicker.launchCameraAsync(OPCIONES)
      : await ImagePicker.launchImageLibraryAsync(OPCIONES);

  if (resultado.canceled || !resultado.assets?.length) return { estado: 'cancelado' };
  return { estado: 'ok', uri: resultado.assets[0].uri };
}
