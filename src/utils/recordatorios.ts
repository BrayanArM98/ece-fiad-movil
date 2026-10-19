import type { Cita } from '@/models/Cita';
import type { TipoRecordatorio } from '@/models/RecordatorioProgramado';
import { formatearHora } from '@/utils/fechas';

export interface AvisoCita {
  idCita: number;
  tipo: TipoRecordatorio;
  fecha: Date;
  titulo: string;
  cuerpo: string;
}

const UNA_HORA = 60 * 60 * 1000;
const UN_DIA = 24 * UNA_HORA;

/**
 * Avisos de una cita (F06): un día antes y una hora antes.
 * No se devuelve ningún aviso cuya fecha ya pasó.
 */
export function calcularAvisos(cita: Cita, ahora: Date): AvisoCita[] {
  const fechaCita = new Date(cita.fechaHora);
  const hora = formatearHora(fechaCita);

  const avisos: AvisoCita[] = [
    {
      idCita: cita.id,
      tipo: 'diaAntes',
      fecha: new Date(fechaCita.getTime() - UN_DIA),
      titulo: 'Recordatorio de cita',
      cuerpo: `Mañana tienes cita con Dr(a). ${cita.nombreDoctor} a las ${hora}`,
    },
    {
      idCita: cita.id,
      tipo: 'horaAntes',
      fecha: new Date(fechaCita.getTime() - UNA_HORA),
      titulo: 'Tu cita es en una hora',
      cuerpo: `Tu cita con Dr(a). ${cita.nombreDoctor} es a las ${hora}`,
    },
  ];

  return avisos.filter((aviso) => aviso.fecha.getTime() > ahora.getTime());
}
