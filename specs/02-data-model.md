# Modelo de datos

## Origen de los datos

Las entidades clínicas son las mismas que expone la API REST del sistema de la clínica. La app no inventa campos nuevos para ellas: usa la misma forma que devuelve la API, para que cambiar de datos de ejemplo a datos reales no obligue a modificar pantallas.

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

Estas no existen todavía en la API. Se guardan en el teléfono hasta que la API las soporte.

```ts
Sesion {
  nombre: string
  rol: 'medico' | 'paciente'
  idDoctor?: number            // cuando rol = medico
  idPaciente?: number          // cuando rol = paciente
  biometriaActiva: boolean
}
```

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
  idNotificacion: string       // identificador que devuelve el sistema de notificaciones
  fechaAviso: string
}
```

## Dónde vive cada dato

| Dato | Dónde | Motivo |
|------|-------|--------|
| Entidades clínicas | API REST (datos de ejemplo mientras tanto) | Fuente única de la clínica |
| Sesion | Almacenamiento seguro del teléfono | Contiene datos de acceso |
| Adjunto | Archivos locales del teléfono | La API aún no recibe imágenes |
| RecordatorioProgramado | Almacenamiento local | Evitar programar dos avisos para la misma cita |

## Pendientes con la API

- No existe autenticación ni roles: `Sesion` se simula hasta que la API tenga inicio de sesión.
- No existe un endpoint para subir imágenes: los `Adjunto` quedan solo en el teléfono.
- No existe un filtro de citas por doctor y fecha: la agenda filtra en el teléfono la lista completa de citas.
