import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { radios, sombras } from '@/theme/tema';

type Variante = 'primario' | 'secundario' | 'suave' | 'claro' | 'fantasma' | 'peligro';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  tamano?: 'normal' | 'compacto';
  icono?: LucideIcon;
  /** El ícono va después del texto (por ejemplo una flecha). */
  iconoAlFinal?: boolean;
  deshabilitado?: boolean;
  cargando?: boolean;
  /** Ocupa todo el ancho disponible. */
  ancho?: boolean;
}

const ESTILO: Record<Variante, { fondo: string; texto: string; borde?: string }> = {
  primario: { fondo: colores.marea, texto: colores.blanco },
  secundario: { fondo: colores.blanco, texto: colores.marea, borde: colores.linea },
  suave: { fondo: colores.mareaSuave, texto: colores.mareaProfunda },
  claro: { fondo: 'rgba(255,255,255,0.16)', texto: colores.blanco, borde: 'rgba(255,255,255,0.28)' },
  fantasma: { fondo: 'transparent', texto: colores.marea },
  peligro: { fondo: colores.coralSuave, texto: colores.coral },
};

/**
 * Botón del sistema de diseño (specs/04-diseno.md).
 * Mismo uso que antes (titulo, onPress, variante), con ícono, tamaño y respuesta táctil.
 */
export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  tamano = 'normal',
  icono: Icono,
  iconoAlFinal,
  deshabilitado,
  cargando,
  ancho,
}: BotonProps) {
  const inactivo = deshabilitado || cargando;
  const estilo = ESTILO[variante];
  const compacto = tamano === 'compacto';
  const icono = Icono ? <Icono size={compacto ? 16 : 18} color={estilo.texto} strokeWidth={2.2} /> : null;

  return (
    <Presionable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !!inactivo, busy: !!cargando }}
      style={[
        styles.base,
        compacto && styles.compacto,
        { backgroundColor: estilo.fondo },
        estilo.borde ? { borderWidth: 1, borderColor: estilo.borde } : null,
        variante === 'primario' && !inactivo && sombras.baja,
        ancho && styles.ancho,
        inactivo && styles.inactivo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={estilo.texto} />
      ) : (
        <View style={styles.contenido}>
          {iconoAlFinal ? null : icono}
          <Texto variante={compacto ? 'etiqueta' : 'cuerpoFuerte'} color={estilo.texto} numberOfLines={1}>
            {titulo}
          </Texto>
          {iconoAlFinal ? icono : null}
        </View>
      )}
    </Presionable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radios.m,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compacto: { minHeight: 38, borderRadius: radios.s, paddingHorizontal: 14 },
  ancho: { alignSelf: 'stretch' },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inactivo: { opacity: 0.45 },
});
