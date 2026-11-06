import { CloudOff, type LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';

/**
 * Estados comunes de las pantallas (cargando, error, vacío),
 * definidos en la sección "Estados de la pantalla" de cada spec.
 */
export function Cargando() {
  return (
    <View style={styles.centrado}>
      <ActivityIndicator size="large" color={colores.marea} />
    </View>
  );
}

interface MensajeProps {
  mensaje: string;
  detalle?: string;
  icono?: LucideIcon;
  accion?: { titulo: string; onPress: () => void };
  /** Dentro de una lista: sin ocupar toda la pantalla. */
  enLinea?: boolean;
}

/** Ilustración circular con el ícono, mensaje y una acción opcional. */
export function MensajePantalla({ mensaje, detalle, icono: Icono = CloudOff, accion, enLinea }: MensajeProps) {
  return (
    <View style={enLinea ? styles.enLinea : styles.centrado}>
      <View style={styles.halo}>
        <View style={styles.circulo}>
          <Icono size={30} color={colores.marea} strokeWidth={1.8} />
        </View>
      </View>
      <View style={styles.textos}>
        <Texto variante="titulo3" centrado>
          {mensaje}
        </Texto>
        {detalle ? (
          <Texto variante="secundario" color={colores.pizarra} centrado>
            {detalle}
          </Texto>
        ) : null}
      </View>
      {accion ? <Boton titulo={accion.titulo} onPress={accion.onPress} variante="suave" tamano="compacto" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    backgroundColor: colores.papel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  enLinea: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 16 },
  halo: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(14,116,144,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colores.mareaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { gap: 6, maxWidth: 280 },
});
