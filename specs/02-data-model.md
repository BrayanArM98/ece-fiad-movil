# Modelo de datos

## Origen de los datos

Las entidades clínicas son las mismas que expone la API REST del sistema de la clínica. La app no inventa campos nuevos para ellas: usa la misma forma que devuelve la API, para que cambiar de datos de ejemplo a datos reales no obligue a modificar pantallas. Cómo se conecta la app a la API está en `03-api.md`.

Todas las respuestas de la API llegan con esta envoltura:

```ts
Respuesta<T> {
  exitoso: boolean
  mensaje: string
  datos: T
}
```

## Entidades clínicas (vienen de la API)

```ts
Paciente {
  id: number
  nombres: string
  apellidos: string
  numeroDocumento: string
  tipoDocumento: string
  telefono?: string
  email: string
  fechaNacimiento: string      // ISO 8601
  genero: 'Masculino' | 'Femenino' | 'Otro' | 'PrefieroNoDecir'
  grupoSanguineo: string
  direccion?: string
  activo: boolean
}
```

```ts
Doctor {
  id: number
  nombres: string
  apellidos: string
  nombreCompleto: string
  email: string
  telefono: string
  horarioAtencion: string
  idEspecialidad: number
  nombreEspecialidad: string
}
```

```ts
Cita {
  id: number
  idPaciente: number
  idDoctor: number
  nombrePaciente: string
  nombreDoctor: string
  fechaHora: string            // ISO 8601
  motivo: string
  notas: string
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada' | 'NoAsistio'
  estadoTexto: string          // texto listo para mostrar, p. ej. "No asistió"
  activo: boolean
}
```

```ts
HistoriaClinica {
  id: number
  idPaciente: number
  nombrePaciente: string
  fechaApertura: string
  alergias: string
  antecedentesFamiliares: string
  antecedentesPersonales: string
  activo: boolean
}
```

```ts
Evolucion {
  id: number
  idHistoriaClinica: number
  idDoctor: number
  nombrePaciente: string
  nombreDoctor: string
  nombreEspecialidad: string
  fecha: string
  diagnostico: string
  tratamiento: string
  notas: string
}
```

```ts
HistorialPaciente {            // GET /api/historial/paciente/{idPaciente}
  tieneHistoria: boolean
  historia: HistoriaClinica | null
  evoluciones: Evolucion[]     // ordenadas de la más reciente a la más antigua
  totalEvoluciones: number
}
```

## Entidades propias de la app móvil

```ts
Sesion {                       // se arma con la respuesta de POST /api/Auth/login
  nombre: string
  correo: string
  rol: 'medico' | 'paciente'   // la API envía 'Medico' o 'Paciente'
  idDoctor?: number            // cuando rol = medico
  idPaciente?: number          // cuando rol = paciente
  token: string                // JWT de la API; vacío en el modo demostración
  expiraUtc: string            // vencimiento del token (8 horas)
  biometriaActiva: boolean
}
```

Las siguientes no existen en la API y se guardan en el teléfono.

```ts
Adjunto {
  id: string                   // generado en el teléfono
  idEvolucion: number
  uri: string                  // ruta local de la imagen
  fechaCaptura: string
}
```

```ts
RecordatorioProgramado {
  idCita: number
  tipo: 'diaAntes' | 'horaAntes'
  idNotificacion: string       // identificador que devuelve el sistema de notificaciones
  fechaAviso: string
}
```

```ts
Clinica {                      // ECE-FIAD en src/config/clinica.ts; las demás de OpenStreetMap
  id: string
  nombre: string
  tipo: 'propia' | 'hospital' | 'clinica'
  direccion?: string
  telefono?: string
  urgencias?: boolean
  coordenadas: { latitude: number, longitude: number }
}
```

## Dónde vive cada dato

| Dato | Dónde | Motivo |
|------|-------|--------|
| Entidades clínicas | API REST (datos de ejemplo en el modo demostración) | Fuente única de la clínica |
| Sesion | En memoria; en el almacenamiento seguro solo con biometría activa | Contiene el token de acceso |
| Adjunto | Archivos locales del teléfono | La API aún no recibe imágenes |
| RecordatorioProgramado | Archivo JSON en el teléfono | Evitar programar dos avisos para la misma cita |
| Clinica | ECE-FIAD en la configuración; hospitales cercanos en OpenStreetMap | La API no guarda datos de clínicas |

## Pendientes con la API

- No existe un endpoint para subir imágenes: los `Adjunto` quedan solo en el teléfono.
- No existen datos de clínicas (dirección, teléfono, coordenadas): la clínica ECE-FIAD se configura en la app y los hospitales cercanos vienen de OpenStreetMap.
- Resuelto: la API ya tiene inicio de sesión con roles (`POST /api/Auth/login`) y filtra las citas por el médico o paciente del token.
