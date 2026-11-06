import { Cake, Droplet, IdCard } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Tarjeta } from '@/components/ui/Tarjeta';
import { Texto } from '@/components/ui/Texto';
import type { Paciente } from '@/models/Paciente';
import { colores } from '@/theme/colores';
import { radios } from '@/theme/tema';
import { calcularEdad, nombreCompleto, textoGrupoSanguineo } from '@/utils/pacientes';

/**
 * Encabezado del historial: avatar, nombre, edad, grupo sanguíneo y documento (F03).
 */
export function EncabezadoPaciente({ paciente }: { paciente: Paciente }) {
  const nombre = nombreCompleto(paciente);
  return (
    <Tarjeta elevada style={styles.tarjeta}>
      <View style={styles.fila}>
        <Avatar nombre={nombre} tamano={60} />
        <View style={styles.textos}>
          <Texto variante="titulo2">{nombre}</Texto>
          <Texto variante="secundario" color={colores.pizarra} numberOfLines={1}>
            {paciente.email}
          </Texto>
        </View>
      </View>
      <View style={styles.datos}>
        <Dato icono={<Cake size={14} color={colores.marea} />} texto={`${calcularEdad(paciente.fechaNacimiento)} años`} />
        <Dato
          icono={<Droplet size={14} color={colores.coral} fill={colores.coral} />}
          texto={textoGrupoSanguineo(paciente.grupoSanguineo)}
          fondo={colores.coralSuave}
          color={colores.coral}
        />
        <Dato icono={<IdCard size={14} color={colores.marea} />} texto={paciente.numeroDocumento} />
      </View>
    </Tarjeta>
  );
}

function Dato({ icono, texto, fondo = colores.mareaSuave, color = colores.mareaProfunda }: { icono: React.ReactNode; texto: string; fondo?: string; color?: string }) {
  return (
    <View style={[styles.dato, { backgroundColor: fondo }]}>
      {icono}
      <Texto variante="etiqueta" color={color}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { padding: 18, gap: 14, borderRadius: radios.xl },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  textos: { flex: 1, gap: 2 },
  datos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radios.total,
  },
});
