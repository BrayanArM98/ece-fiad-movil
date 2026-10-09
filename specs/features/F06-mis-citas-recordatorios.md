# Feature F06: Ver mis citas y recibir recordatorios

## Objetivo

Reducir las inasistencias: el paciente ve sus próximas citas y el teléfono le avisa antes de cada una, aunque no abra la app.

## Actor

Paciente.

## Precondiciones

- El paciente inició sesión (F01) y su sesión tiene `idPaciente`.

## Datos de entrada

- `idPaciente` de la sesión.
- Citas del paciente.

## Flujo principal

1. El paciente entra a la pestaña Mis citas (es la pestaña inicial de su rol).
2. La primera vez, el sistema explica para qué sirven los avisos y solicita el permiso de notificaciones.
3. El sistema obtiene las citas y conserva solo las del paciente con fecha a partir de hoy, excepto las canceladas.
4. El sistema las muestra ordenadas de la más próxima a la más lejana, con fecha, hora, doctor, especialidad y estado.
5. Para cada cita, el sistema programa dos recordatorios:
   - un día antes, a la misma hora: "Mañana tienes cita con {doctor} a las {hora}";
   - una hora antes: "Tu cita con {doctor} es en una hora".
6. Al tocar un recordatorio, la app abre Mis citas.

## Reglas de los recordatorios

- No se programa un recordatorio cuya fecha de aviso ya pasó.
- Una cita nunca tiene recordatorios duplicados (se consulta `RecordatorioProgramado` antes de programar).
- Si una cita se cancela o cambia de hora, sus recordatorios anteriores se eliminan y, si aplica, se programan de nuevo.
- Al cerrar sesión se eliminan todos los recordatorios programados.

## Estados de la pantalla

| Estado | Qué ve el paciente |
|--------|--------------------|
| Cargando | Indicador de carga |
| Con citas | Lista de próximas citas |
| Lista vacía | "No tienes citas próximas" |
| Error | "No se pudieron cargar tus citas" y botón "Reintentar" |
| Avisos desactivados | Aviso en la parte superior: "Activa las notificaciones para recibir recordatorios" |

## Casos de error

- Permiso de notificaciones negado: la lista funciona igual y se muestra el aviso de notificaciones desactivadas.
- Sin Internet: estado de error; los recordatorios ya programados siguen activos.

## Resultado esperado

El paciente conoce sus próximas citas y recibe dos avisos antes de cada una.

## Criterios de aceptación

- [ ] Al entrar como paciente, la primera pantalla es Mis citas.
- [ ] Solo aparecen citas del paciente de la sesión, de hoy en adelante y no canceladas.
- [ ] Las citas aparecen de la más próxima a la más lejana.
- [ ] Para una cita dentro de 2 días se programan exactamente 2 recordatorios.
- [ ] Para una cita dentro de 30 minutos no se programa ninguno de los dos.
- [ ] Abrir Mis citas dos veces no duplica recordatorios.
- [ ] Una cita cancelada pierde sus recordatorios.
- [ ] Con el permiso negado, la lista se muestra junto con el aviso de notificaciones desactivadas.
- [ ] Al tocar un recordatorio se abre Mis citas.

## Decisiones

- Los recordatorios son **notificaciones programadas en el teléfono** con `expo-notifications`. Funcionan sin un servidor de envío y dentro de Expo Go. Las notificaciones enviadas desde el servidor (push remoto), por ejemplo para avisar de una cancelación hecha por la clínica, quedan como trabajo futuro: requieren una compilación propia de la app y un endpoint en la API.

## Tasks

- [ ] Crear el tipo `RecordatorioProgramado`.
- [ ] Crear `notificacionesService` (permiso, programar, cancelar, cancelar todos).
- [ ] Crear `recordatoriosService` con las reglas de la sección anterior.
- [ ] Crear el ViewModel `useMisCitasViewModel`.
- [ ] Crear la pantalla `MisCitasScreen` con sus estados.
- [ ] Abrir Mis citas al tocar un recordatorio.
- [ ] Cancelar recordatorios al cerrar sesión.
- [ ] Probar los criterios de aceptación en un teléfono real.
