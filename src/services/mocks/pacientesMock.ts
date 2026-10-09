import type { Paciente } from '@/models/Paciente';

/**
 * Pacientes de ejemplo con la forma de la API.
 * Los id coinciden con los de las citas de ejemplo (citasMock.ts).
 */
export const PACIENTES_EJEMPLO: Paciente[] = [
  {
    id: 1, nombres: 'Juan', apellidos: 'Pérez', numeroDocumento: 'PEJU800312', tipoDocumento: 'Cedula',
    telefono: '646 123 4501', email: 'juan.perez@correo.mx', fechaNacimiento: '1980-03-12T00:00:00',
    genero: 'Masculino', grupoSanguineo: 'OPositivo', activo: true,
  },
  {
    id: 2, nombres: 'María', apellidos: 'González', numeroDocumento: 'GOMA920725', tipoDocumento: 'Cedula',
    telefono: '646 123 4502', email: 'maria.gonzalez@correo.mx', fechaNacimiento: '1992-07-25T00:00:00',
    genero: 'Femenino', grupoSanguineo: 'APositivo', activo: true,
  },
  {
    id: 3, nombres: 'Luis', apellidos: 'Ramírez', numeroDocumento: 'RALU751103', tipoDocumento: 'Cedula',
    telefono: '646 123 4503', email: 'luis.ramirez@correo.mx', fechaNacimiento: '1975-11-03T00:00:00',
    genero: 'Masculino', grupoSanguineo: 'BNegativo', activo: true,
  },
  {
    id: 4, nombres: 'Sofía', apellidos: 'Hernández', numeroDocumento: 'HESO010218', tipoDocumento: 'Cedula',
    telefono: '646 123 4504', email: 'sofia.hernandez@correo.mx', fechaNacimiento: '2001-02-18T00:00:00',
    genero: 'Femenino', grupoSanguineo: 'ABPositivo', activo: true,
  },
  {
    id: 5, nombres: 'Pedro', apellidos: 'Castillo', numeroDocumento: 'CAPE680930', tipoDocumento: 'Cedula',
    telefono: '646 123 4505', email: 'pedro.castillo@correo.mx', fechaNacimiento: '1968-09-30T00:00:00',
    genero: 'Masculino', grupoSanguineo: 'OPositivo', activo: true,
  },
  {
    id: 6, nombres: 'Lucía', apellidos: 'Torres', numeroDocumento: 'TOLU990614', tipoDocumento: 'Pasaporte',
    telefono: '646 123 4506', email: 'lucia.torres@correo.mx', fechaNacimiento: '1999-06-14T00:00:00',
    genero: 'Femenino', grupoSanguineo: 'ONegativo', activo: true,
  },
  {
    // Inactivo: no debe aparecer en la lista de Pacientes
    id: 7, nombres: 'Roberto', apellidos: 'Díaz', numeroDocumento: 'DIRO600101', tipoDocumento: 'Cedula',
    telefono: '646 123 4507', email: 'roberto.diaz@correo.mx', fechaNacimiento: '1960-01-01T00:00:00',
    genero: 'Masculino', grupoSanguineo: 'APositivo', activo: false,
  },
];
