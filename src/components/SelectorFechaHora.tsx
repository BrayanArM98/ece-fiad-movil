import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarClock, ChevronRight } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

import { Presionable } from '@/components/ui/Presionable';
import { Texto } from '@/components/ui/Texto';
import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';

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
      <Texto variante="etiqueta" color={colores.pizarra}>
        {etiqueta}
        <Texto variante="etiqueta" color={colores.coral}>
          {' '}*
        </Texto>
      </Texto>
      {Platform.OS === 'ios' ? (
        <View style={[styles.caja, !!error && styles.cajaError]}>
          <CalendarClock size={20} color={colores.marea} />
          <DateTimePicker
            value={valor}
            mode="datetime"
            display="compact"
            maximumDate={new Date()}
            locale="es-MX"
            accentColor={colores.marea}
            onValueChange={(_evento, fecha) => onCambiar(fecha)}
          />
        </View>
      ) : (
        <Presionable
          onPress={abrirEnAndroid}
          accessibilityRole="button"
          accessibilityLabel={`${etiqueta}: ${texto}`}
          style={[styles.caja, !!error && styles.cajaError]}
        >
          <CalendarClock size={20} color={colores.marea} />
          <Texto variante="cuerpoFuerte" style={styles.texto}>
            {texto}
          </Texto>
          <ChevronRight size={18} color={colores.niebla} />
        </Presionable>
      )}
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
  caja: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colores.papel,
    borderWidth: 1.5,
    borderColor: colores.linea,
    borderRadius: radios.m,
    paddingHorizontal: 16,
  },
  cajaError: { borderColor: colores.coral },
  texto: { flex: 1 },
});
