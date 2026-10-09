import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colores } from '@/theme/colores';

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
  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.etiqueta}>
          {etiqueta}
          {obligatorio ? <Text style={styles.obligatorio}> *</Text> : null}
        </Text>
        <Text style={styles.contador}>
          {valor.length}/{maximo}
        </Text>
      </View>
      <TextInput
        style={[styles.campo, error && styles.campoError]}
        value={valor}
        onChangeText={onCambiar}
        maxLength={maximo}
        multiline
        placeholder={placeholder}
        placeholderTextColor={colores.deshabilitado}
        textAlignVertical="top"
        accessibilityLabel={etiqueta}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
  obligatorio: { color: colores.error },
  contador: { fontSize: 12, color: colores.textoSecundario },
  campo: {
    minHeight: 96,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    lineHeight: 22,
    color: colores.texto,
  },
  campoError: { borderColor: colores.error },
  error: { fontSize: 13, color: colores.error },
});
