import { ChevronRight, Droplet } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import type { Paciente } from '@/models/Paciente';
import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';
import { calcularEdad, nombreCompleto, textoGrupoSanguineo } from '@/utils/pacientes';

interface FilaPacienteProps {
  paciente: Paciente;
  onPress: () => void;
}

/**
 * Paciente en la lista de Pacientes (F03): avatar, nombre, edad, documento y grupo sanguíneo.
 */
export function FilaPaciente({ paciente, onPress }: FilaPacienteProps) {
  const nombre = nombreCompleto(paciente);
  const edad = calcularEdad(paciente.fechaNacimiento);

  return (
    <Tarjeta onPress={onPress} etiquetaAccesible={`${nombre}, ${edad} años. Abrir historial`} style={styles.fila}>
      <Avatar nombre={nombre} tamano={46} />
      <View style={styles.datos}>
        <Texto variante="cuerpoFuerte" numberOfLines={1}>
          {nombre}
        </Texto>
        <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
          {edad} años · {paciente.numeroDocumento}
        </Texto>
      </View>
      <View style={styles.sangre}>
        <Droplet size={12} color={colores.coral} fill={colores.coral} />
        <Texto variante="etiqueta" color={colores.coral}>
          {textoGrupoSanguineo(paciente.grupoSanguineo)}
        </Texto>
      </View>
      <ChevronRight size={18} color={colores.niebla} />
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  datos: { flex: 1, gap: 2 },
  sangre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radios.total,
    backgroundColor: colores.coralSuave,
  },
});
