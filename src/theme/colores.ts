import type { EstadoCita } from '@/models/Cita';

/**
 * Paleta "Marea", la misma identidad que ECE-FIAD Web (specs/04-diseno.md).
 * Los nombres antiguos (primario, fondo, texto…) se conservan como alias.
 */
const marea = {
  marea: '#0E7490',
  mareaProfunda: '#0B5568',
  mareaNoche: '#082F3A',
  mareaClara: '#5FB3C6',
  mareaSuave: '#E3EFF2',
  tinta: '#14262E',
  pizarra: '#5B6B73',
  niebla: '#93A3AA',
  papel: '#F4F7F8',
  linea: '#D9E3E7',
  blanco: '#FFFFFF',
  coral: '#C2412D',
  coralSuave: '#FBEAE7',
  ambar: '#B7791F',
  ambarSuave: '#FBF1DF',
  verde: '#2F855A',
  verdeSuave: '#E3F2EA',
};

export const colores = {
  ...marea,
  // Alias de la paleta anterior
  primario: marea.marea,
  primarioSuave: marea.mareaSuave,
  fondo: marea.papel,
  superficie: marea.blanco,
  texto: marea.tinta,
  textoSecundario: marea.pizarra,
  borde: marea.linea,
  error: marea.coral,
  deshabilitado: marea.niebla,
};

/** Colores de cada estado de cita, iguales a la agenda web. */
export const COLOR_ESTADO: Record<EstadoCita, { color: string; fondo: string }> = {
  Pendiente: { color: '#B7791F', fondo: '#FBF1DF' },
  Confirmada: { color: '#0E7490', fondo: '#E3EFF2' },
  Completada: { color: '#2F855A', fondo: '#E3F2EA' },
  NoAsistio: { color: '#B83280', fondo: '#FAE6F1' },
  Cancelada: { color: '#718096', fondo: '#EDF0F3' },
};

/** Degradado de los encabezados: de la marea nocturna a la marea. */
export const DEGRADADO_MAREA = [marea.mareaNoche, marea.mareaProfunda, marea.marea] as const;
