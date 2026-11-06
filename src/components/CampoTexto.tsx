import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { fuentes, radios } from '@/theme/tema';

interface CampoTextoProps {
  etiqueta: string;
  valor: string;
  onCambiar: (texto: string) => void;
  maximo: number;
  obligatorio?: boolean;
  placeholder?: string;
  error?: string;
}

/**
 * Campo de texto de varias líneas con contador de caracteres.
 * maxLength impide escribir más del límite (F04, validaciones).
 */
export function CampoTexto({ etiqueta, valor, onCambiar, maximo, obligatorio, placeholder, error }: CampoTextoProps) {
  const [enfocado, setEnfocado] = useState(false);
  const cercaDelLimite = valor.length >= maximo * 0.9;

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Texto variante="etiqueta" color={colores.pizarra}>
          {etiqueta}
          {obligatorio ? <Texto variante="etiqueta" color={colores.coral}> *</Texto> : null}
        </Texto>
        <Texto variante="etiqueta" color={cercaDelLimite ? colores.ambar : colores.niebla}>
          {valor.length}/{maximo}
        </Texto>
      </View>
      <TextInput
        style={[styles.campo, enfocado && styles.enfocado, !!error && styles.campoError]}
        value={valor}
        onChangeText={onCambiar}
        maxLength={maximo}
        multiline
        placeholder={placeholder}
        placeholderTextColor={colores.niebla}
        selectionColor={colores.marea}
        textAlignVertical="top"
        accessibilityLabel={etiqueta}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
      />
      {error ? (
        <Texto variante="secundario" color={colores.coral}>
          {error}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  campo: {
    minHeight: 104,
    backgroundColor: colores.papel,
    borderWidth: 1.5,
    borderColor: colores.linea,
    borderRadius: radios.m,
    padding: 14,
    fontFamily: fuentes.texto,
    fontSize: 16,
    lineHeight: 22,
    color: colores.tinta,
    outlineStyle: 'none',
  } as object,
  enfocado: { borderColor: colores.marea, backgroundColor: colores.blanco },
  campoError: { borderColor: colores.coral },
});
