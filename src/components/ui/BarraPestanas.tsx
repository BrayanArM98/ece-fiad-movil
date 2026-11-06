import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Presionable } from '@/components/ui/Presionable';
import { colores } from '@/theme/colores';
import { fuentes, radios, sombras } from '@/theme/tema';

interface BarraPestanasProps extends BottomTabBarProps {
  /** Ícono de cada pestaña según el nombre de su ruta. */
  iconos: Record<string, LucideIcon>;
}

const transicion = LinearTransition.springify().damping(18).stiffness(220);

/**
 * Barra de pestañas flotante (specs/04-diseno.md): una cápsula blanca sobre el contenido.
 * La pestaña activa se expande y muestra su nombre; las demás solo el ícono.
 */
export function BarraPestanas({ state, descriptors, emitter, navigateToTab, insets, iconos }: BarraPestanasProps) {
  return (
    <View style={[styles.contenedor, { bottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.barra} role="tablist">
        {state.routes.map((ruta, indice) => {
          const activa = indice === state.index;
          const { options } = descriptors[ruta.key];
          const titulo = typeof options.title === 'string' ? options.title : ruta.name;
          const Icono = iconos[ruta.name];

          function alPresionar() {
            const evento = emitter.emit({ type: 'tabPress', target: ruta.key, canPreventDefault: true });
            if (!activa && !evento.defaultPrevented) navigateToTab(ruta.key);
          }

          return (
            <Animated.View key={ruta.key} layout={transicion} style={activa ? styles.ranuraActiva : styles.ranura}>
              <Presionable
                onPress={alPresionar}
                escala={0.92}
                accessibilityRole="tab"
                accessibilityState={{ selected: activa }}
                accessibilityLabel={titulo}
                style={[styles.pestana, activa && styles.pestanaActiva]}
              >
                {Icono ? (
                  <Icono size={22} color={activa ? colores.blanco : colores.pizarra} strokeWidth={activa ? 2.3 : 1.9} />
                ) : null}
                {activa ? (
                  <Animated.Text entering={FadeIn.duration(220)} numberOfLines={1} style={styles.texto}>
                    {titulo}
                  </Animated.Text>
                ) : null}
              </Presionable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
  barra: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 6,
    padding: 7,
    borderRadius: radios.total,
    backgroundColor: colores.blanco,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.linea,
    ...sombras.alta,
  },
  ranura: { flex: 1 },
  ranuraActiva: { flex: 2.2 },
  pestana: {
    height: 52,
    borderRadius: radios.total,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pestanaActiva: { backgroundColor: colores.marea },
  texto: { fontFamily: fuentes.textoSemi, fontSize: 14, color: colores.blanco },
});
