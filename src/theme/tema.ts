import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans';
import {
  SchibstedGrotesk_600SemiBold,
  SchibstedGrotesk_700Bold,
  SchibstedGrotesk_800ExtraBold,
} from '@expo-google-fonts/schibsted-grotesk';
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

import { colores } from '@/theme/colores';

/**
 * Tokens de diseño (specs/04-diseno.md).
 * Schibsted Grotesk para títulos y cifras, Public Sans para el texto.
 * Cada peso es una familia distinta, así que nunca se usa fontWeight con estas fuentes.
 */
export const ARCHIVOS_FUENTES = {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
  SchibstedGrotesk_600SemiBold,
  SchibstedGrotesk_700Bold,
  SchibstedGrotesk_800ExtraBold,
};

export const fuentes = {
  texto: 'PublicSans_400Regular',
  textoMedio: 'PublicSans_500Medium',
  textoSemi: 'PublicSans_600SemiBold',
  textoNegrita: 'PublicSans_700Bold',
  titulo: 'SchibstedGrotesk_600SemiBold',
  tituloNegrita: 'SchibstedGrotesk_700Bold',
  display: 'SchibstedGrotesk_800ExtraBold',
};

export const tipografia = {
  display: { fontFamily: fuentes.display, fontSize: 34, lineHeight: 38, letterSpacing: -0.8 },
  titulo1: { fontFamily: fuentes.tituloNegrita, fontSize: 26, lineHeight: 31, letterSpacing: -0.5 },
  titulo2: { fontFamily: fuentes.tituloNegrita, fontSize: 20, lineHeight: 25, letterSpacing: -0.3 },
  titulo3: { fontFamily: fuentes.titulo, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  cuerpo: { fontFamily: fuentes.texto, fontSize: 15, lineHeight: 22 },
  cuerpoFuerte: { fontFamily: fuentes.textoSemi, fontSize: 15, lineHeight: 22 },
  secundario: { fontFamily: fuentes.texto, fontSize: 13, lineHeight: 18 },
  etiqueta: { fontFamily: fuentes.textoSemi, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
  mayusculas: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  cifra: { fontFamily: fuentes.display, fontSize: 28, lineHeight: 32, letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export type VarianteTexto = keyof typeof tipografia;

export const espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32 };

export const radios = { s: 10, m: 14, l: 20, xl: 28, total: 999 };

/** Sombra suave teñida de marea; en Android se usa elevation. */
function sombra(altura: number, opacidad: number, radio: number): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation: Math.round(altura * 1.5), shadowColor: colores.mareaNoche },
    web: { boxShadow: `0px ${altura}px ${radio}px rgba(8, 47, 58, ${opacidad})` } as ViewStyle,
    default: {
      shadowColor: colores.mareaNoche,
      shadowOffset: { width: 0, height: altura },
      shadowOpacity: opacidad,
      shadowRadius: radio,
    },
  })!;
}

export const sombras = {
  baja: sombra(2, 0.06, 6),
  media: sombra(8, 0.1, 20),
  alta: sombra(16, 0.18, 32),
};

/** Alto que ocupa la barra de pestañas flotante; las listas dejan este margen abajo. */
export const ALTO_BARRA_PESTANAS = 92;
