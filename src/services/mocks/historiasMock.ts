import type { Evolucion } from '@/models/Evolucion';
import type { HistoriaClinica } from '@/models/HistoriaClinica';

/**
 * Historias clínicas y evoluciones de ejemplo con la forma de la API.
 * Casos cubiertos para probar F03:
 * - Juan Pérez (1): historia con alergia y varias evoluciones.
 * - María González (2): historia sin alergias y una evolución.
 * - Luis Ramírez (3): sin historia clínica.
 * - Sofía Hernández (4): historia sin evoluciones.
 */
function haceDias(dias: number, hora = 10): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  fecha.setHours(hora, 0, 0, 0);
  return fecha.toISOString();
}

export const HISTORIAS_EJEMPLO: HistoriaClinica[] = [
  {
    id: 1, idPaciente: 1, nombrePaciente: 'Juan Pérez', fechaApertura: haceDias(400),
    alergias: 'Penicilina',
    antecedentesPersonales: 'Hipertensión arterial diagnosticada en 2021.',
    antecedentesFamiliares: 'Padre con diabetes tipo 2.',
    activo: true,
  },
  {
    id: 2, idPaciente: 2, nombrePaciente: 'María González', fechaApertura: haceDias(200),
    alergias: '',
    antecedentesPersonales: 'Sin antecedentes relevantes.',
    antecedentesFamiliares: 'Madre con hipotiroidismo.',
    activo: true,
  },
  {
    id: 4, idPaciente: 4, nombrePaciente: 'Sofía Hernández', fechaApertura: haceDias(10),
    alergias: 'Ibuprofeno, mariscos',
    antecedentesPersonales: 'Asma leve en la infancia.',
    antecedentesFamiliares: 'Sin antecedentes relevantes.',
    activo: true,
  },
  {
    id: 5, idPaciente: 5, nombrePaciente: 'Pedro Castillo', fechaApertura: haceDias(800),
    alergias: '',
    antecedentesPersonales: 'Diabetes tipo 2.',
    antecedentesFamiliares: 'Hermano con cardiopatía.',
    activo: true,
  },
];

/**
 * Arreglo mutable: la creación de evoluciones (F04) agrega aquí mientras no hay API.
 */
export const EVOLUCIONES_EJEMPLO: Evolucion[] = [
  {
    id: 1, idHistoriaClinica: 1, idDoctor: 1, nombrePaciente: 'Juan Pérez', nombreDoctor: 'Ana López',
    nombreEspecialidad: 'Medicina general', fecha: haceDias(180),
    diagnostico: 'Hipertensión arterial descontrolada.',
    tratamiento: 'Losartán 50 mg cada 24 horas.',
    notas: 'Presión de 150/95 en consulta.', activo: true,
  },
  {
    id: 2, idHistoriaClinica: 1, idDoctor: 1, nombrePaciente: 'Juan Pérez', nombreDoctor: 'Ana López',
    nombreEspecialidad: 'Medicina general', fecha: haceDias(90),
    diagnostico: 'Hipertensión arterial en control.',
    tratamiento: 'Continuar con losartán 50 mg cada 24 horas.',
    notas: 'Presión de 130/85. Se recomienda reducir el consumo de sal.', activo: true,
  },
  {
    id: 3, idHistoriaClinica: 1, idDoctor: 2, nombrePaciente: 'Juan Pérez', nombreDoctor: 'Carlos Méndez',
    nombreEspecialidad: 'Cardiología', fecha: haceDias(30),
    diagnostico: 'Electrocardiograma sin alteraciones.',
    tratamiento: 'Sin cambios en el tratamiento.',
    notas: '', activo: true,
  },
  {
    id: 4, idHistoriaClinica: 2, idDoctor: 1, nombrePaciente: 'María González', nombreDoctor: 'Ana López',
    nombreEspecialidad: 'Medicina general', fecha: haceDias(1),
    diagnostico: 'Faringitis aguda.',
    tratamiento: 'Paracetamol 500 mg cada 8 horas por 3 días.',
    notas: 'Regresar si hay fiebre mayor a 38.5 °C.', activo: true,
  },
  {
    id: 5, idHistoriaClinica: 5, idDoctor: 2, nombrePaciente: 'Pedro Castillo', nombreDoctor: 'Carlos Méndez',
    nombreEspecialidad: 'Cardiología', fecha: haceDias(60),
    diagnostico: 'Control de riesgo cardiovascular.',
    tratamiento: 'Atorvastatina 20 mg cada 24 horas.',
    notas: '', activo: true,
  },
];
