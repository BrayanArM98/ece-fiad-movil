import type { Cita, EstadoCita } from '@/models/Cita';

/**
 * Citas de ejemplo con la misma forma que la API.
 * Las fechas se calculan a partir de hoy para que la agenda siempre tenga datos al probarla.
 */
const TEXTO_ESTADO: Record<EstadoCita, string> = {
  Pendiente: 'Pendiente',
  Confirmada: 'Confirmada',
  Cancelada: 'Cancelada',
  Completada: 'Completada',
  NoAsistio: 'No asistió',
};

const DOCTORES: Record<number, string> = {
  1: 'Ana López',
  2: 'Carlos Méndez',
};

function fechaRelativa(diasDesdeHoy: number, hora: number, minutos: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasDesdeHoy);
  fecha.setHours(hora, minutos, 0, 0);
  return fecha.toISOString();
}

function crearCita(
  id: number,
  idDoctor: number,
  idPaciente: number,
  nombrePaciente: string,
  fechaHora: string,
  motivo: string,
  estado: EstadoCita
): Cita {
  return {
    id,
    idPaciente,
    idDoctor,
    nombrePaciente,
    nombreDoctor: DOCTORES[idDoctor],
    fechaHora,
    motivo,
    notas: '',
    estado,
    estadoTexto: TEXTO_ESTADO[estado],
    activo: true,
  };
}

export function obtenerCitasDeEjemplo(): Cita[] {
  return [
    // Hoy, médico 1 (la cuenta de prueba del médico)
    crearCita(1, 1, 1, 'Juan Pérez', fechaRelativa(0, 11, 30), 'Seguimiento de hipertensión', 'Confirmada'),
    crearCita(2, 1, 2, 'María González', fechaRelativa(0, 9, 0), 'Consulta general', 'Pendiente'),
    crearCita(3, 1, 3, 'Luis Ramírez', fechaRelativa(0, 10, 0), 'Revisión de estudios', 'Cancelada'),
    crearCita(4, 1, 4, 'Sofía Hernández', fechaRelativa(0, 16, 30), 'Dolor lumbar', 'Pendiente'),
    // Hoy, otro médico: no deben aparecer en la agenda del médico 1
    crearCita(5, 2, 5, 'Pedro Castillo', fechaRelativa(0, 9, 30), 'Control de diabetes', 'Confirmada'),
    crearCita(6, 2, 6, 'Lucía Torres', fechaRelativa(0, 12, 0), 'Consulta general', 'Pendiente'),
    // Ayer y mañana, médico 1: no deben aparecer en la agenda de hoy
    crearCita(7, 1, 2, 'María González', fechaRelativa(-1, 10, 0), 'Consulta general', 'Completada'),
    crearCita(8, 1, 1, 'Juan Pérez', fechaRelativa(1, 9, 0), 'Toma de presión', 'Pendiente'),
  ];
}
