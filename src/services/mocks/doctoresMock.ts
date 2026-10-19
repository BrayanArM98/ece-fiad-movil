import type { Doctor } from '@/models/Doctor';

/**
 * Doctores de ejemplo con la forma de GET /api/Doctores.
 * El id 1 corresponde a la cuenta de prueba del médico.
 */
export const DOCTORES_EJEMPLO: Doctor[] = [
  {
    id: 1, nombres: 'Ana', apellidos: 'López', nombreCompleto: 'Ana López', email: 'ana.lopez@ecefiad.mx',
    telefono: '646 100 2001', horarioAtencion: 'Lunes a viernes, 9:00 a 17:00',
    idEspecialidad: 1, nombreEspecialidad: 'Medicina general',
  },
  {
    id: 2, nombres: 'Carlos', apellidos: 'Méndez', nombreCompleto: 'Carlos Méndez', email: 'carlos.mendez@ecefiad.mx',
    telefono: '646 100 2002', horarioAtencion: 'Lunes a jueves, 10:00 a 18:00',
    idEspecialidad: 2, nombreEspecialidad: 'Cardiología',
  },
];
