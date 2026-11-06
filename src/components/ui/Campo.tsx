import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { forwardRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { fuentes, radios } from '@/theme/tema';

/** Instancia del campo, para enfocarlo desde la pantalla. */
export type RefCampo = ComponentRef<typeof TextInput>;

interface CampoProps extends Omit<TextInputProps, 'style'> {
  etiqueta: string;
  icono?: LucideIcon;
  /** Campo de contraseña con botón para mostrarla. */
  secreto?: boolean;
  error?: boolean;
}

/**
 * Campo de una línea con ícono, etiqueta y anillo de enfoque.
 */
export const Campo = forwardRef<RefCampo, CampoProps>(function Campo(
  { etiqueta, icono: Icono, secreto, error, onFocus, onBlur, ...props },
  ref
) {
  const [enfocado, setEnfocado] = useState(false);
  const [visible, setVisible] = useState(false);
  const colorIcono = error ? colores.coral : enfocado ? colores.marea : colores.niebla;

  return (
    <View style={styles.contenedor}>
      <Texto variante="etiqueta" color={colores.pizarra}>
        {etiqueta}
      </Texto>
      <View style={[styles.caja, enfocado && styles.cajaEnfocada, error && styles.cajaError]}>
        {Icono ? <Icono size={19} color={colorIcono} strokeWidth={2} /> : null}
        <TextInput
          ref={ref}
          {...props}
          accessibilityLabel={etiqueta}
          secureTextEntry={secreto && !visible}
          placeholderTextColor={colores.niebla}
          selectionColor={colores.marea}
          onFocus={(e) => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            onBlur?.(e);
          }}
          style={styles.entrada}
        />
        {secreto ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <EyeOff size={19} color={colores.pizarra} /> : <Eye size={19} color={colores.pizarra} />}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: radios.m,
    borderWidth: 1.5,
    borderColor: colores.linea,
    backgroundColor: colores.papel,
  },
  cajaEnfocada: { borderColor: colores.marea, backgroundColor: colores.blanco },
  cajaError: { borderColor: colores.coral, backgroundColor: colores.blanco },
  entrada: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: fuentes.textoMedio,
    fontSize: 16,
    color: colores.tinta,
    paddingVertical: 0,
    outlineStyle: 'none',
  } as object,
});
