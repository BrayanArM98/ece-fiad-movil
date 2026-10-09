import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colores } from '@/theme/colores';

interface SelectorFechaHoraProps {
  etiqueta: string;
  valor: Date;
  texto: string;
  onCambiar: (fecha: Date) => void;
  error?: string;
}

/**
 * Selector de fecha y hora. No permite elegir días futuros; una hora futura en el día
 * de hoy la detecta la validación y se muestra como error (F04).
 */
export function SelectorFechaHora({ etiqueta, valor, texto, onCambiar, error }: SelectorFechaHoraProps) {
  function abrirEnAndroid() {
    // En Android se elige primero la fecha y luego la hora
    DateTimePickerAndroid.open({
      value: valor,
      mode: 'date',
      maximumDate: new Date(),
      onValueChange: (_evento, fecha) => {
        DateTimePickerAndroid.open({
          value: fecha,
          mode: 'time',
          is24Hour: true,
          onValueChange: (_e, fechaYHora) => onCambiar(fechaYHora),
        });
      },
    });
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>
        {etiqueta}
        <Text style={styles.obligatorio}> *</Text>
      </Text>

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={valor}
          mode="datetime"
          display="compact"
          maximumDate={new Date()}
          locale="es-MX"
          onValueChange={(_evento, fecha) => onCambiar(fecha)}
          style={styles.ios}
        />
      ) : (
        <Pressable
          onPress={abrirEnAndroid}
          accessibilityRole="button"
          accessibilityLabel={`${etiqueta}: ${texto}`}
          style={[styles.boton, error && styles.botonError]}
        >
          <Text style={styles.texto}>{texto}</Text>
          <Ionicons name="calendar-outline" size={20} color={colores.primario} />
        </Pressable>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
  obligatorio: { color: colores.error },
  ios: { alignSelf: 'flex-start' },
  boton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  botonError: { borderColor: colores.error },
  texto: { fontSize: 16, color: colores.texto },
  error: { fontSize: 13, color: colores.error },
});
