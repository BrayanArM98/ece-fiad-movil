import { esMismoDia } from '@/utils/fechas';

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

/** "Buenos días" / "Buenas tardes" / "Buenas noches" según la hora del teléfono. */
export function saludo(ahora: Date): string {
  const hora = ahora.getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Quita el prefijo "Dr." o "Dra." y deja nombre y primer apellido: "Ana López". */
export function nombreCorto(nombreCompleto: string): string {
  const partes = nombreCompleto.replace(/^(Dra?\.|Dr\(a\)\.)\s*/i, '').trim().split(/\s+/);
  return partes.slice(0, 2).join(' ');
}

export function primerNombre(nombreCompleto: string): string {
  return nombreCorto(nombreCompleto).split(' ')[0] ?? '';
}

/** "nov" */
export function mesCorto(fecha: Date): string {
  return MESES_CORTOS[fecha.getMonth()];
}

/** "vie" */
export function diaCorto(fecha: Date): string {
  return DIAS_CORTOS[fecha.getDay()];
}

/**
 * Tiempo relativo para la cita que sigue: "Ahora", "En 25 min", "En 2 h 10 min", "Hace 5 min".
 * Más allá de hoy: "Mañana" o "En 3 días".
 */
export function tiempoRelativo(fecha: Date, ahora: Date): string {
  const minutos = Math.round((fecha.getTime() - ahora.getTime()) / 60_000);
  if (Math.abs(minutos) < 1) return 'Ahora';
  if (minutos < 0) {
    const pasados = -minutos;
    return pasados < 60 ? `Hace ${pasados} min` : `Hace ${Math.floor(pasados / 60)} h`;
  }
  if (esMismoDia(fecha, ahora)) {
    if (minutos < 60) return `En ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto ? `En ${horas} h ${resto} min` : `En ${horas} h`;
  }
  const dias = diasEntre(ahora, fecha);
  return dias === 1 ? 'Mañana' : `En ${dias} días`;
}

/** Días calendario entre dos fechas (0 = mismo día). */
export function diasEntre(desde: Date, hasta: Date): number {
  const a = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate());
  const b = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}
