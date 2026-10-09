# Feature F02: Ver la agenda del día

## Objetivo

Permitir que el médico vea, al abrir la app, las citas que tiene programadas para hoy en orden de hora, para saber a quién atiende a continuación.

## Actor

Médico.

## Precondiciones

- El médico inició sesión (F01) y su sesión tiene `idDoctor`.

## Datos de entrada

- `idDoctor` de la sesión.
- Fecha actual del teléfono.

## Flujo principal

1. El médico entra a la pestaña Agenda (es la pestaña inicial de su rol).
2. El sistema muestra un indicador de carga.
3. El sistema obtiene las citas y conserva solo las del médico con fecha de hoy.
4. El sistema las ordena por hora, de la más temprana a la más tarde.
5. El sistema muestra cada cita con: hora, nombre del paciente, motivo y estado.
6. Arriba de la lista se muestra la fecha de hoy y un resumen: total de citas y cuántas siguen pendientes.
7. El médico toca una cita y la app abre CitaDetalle con el `citaId`.

## Flujos alternos

- **Actualizar:** el médico desliza la lista hacia abajo y el sistema vuelve a consultar las citas.
- **Citas canceladas:** aparecen en la lista con su estado marcado, al final y con menor énfasis, para que el médico sepa que ese horario quedó libre.

## Validaciones

- Solo se muestran citas cuyo `idDoctor` coincide con el de la sesión.
- "Hoy" se calcula con la zona horaria del teléfono, no con UTC.

## Estados de la pantalla

| Estado | Qué ve el médico |
|--------|------------------|
| Cargando | Indicador de carga en lugar de la lista |
| Con datos | Resumen del día y lista de citas |
| Lista vacía | Mensaje "No tienes citas programadas para hoy" |
| Error | Mensaje "No se pudo cargar tu agenda" y botón "Reintentar" |

## Casos de error

- Sin Internet o la API no responde: estado de error con botón "Reintentar".
- La sesión no tiene `idDoctor`: regresar a Login con el mensaje "Tu cuenta no está vinculada a un médico".

## Resultado esperado

El médico ve en una sola pantalla todas sus citas de hoy, ordenadas por hora, y puede entrar al detalle de cualquiera.

## Criterios de aceptación

- [x] Al iniciar sesión como médico, la primera pantalla es Agenda.
- [x] Con 3 citas de ejemplo de hoy para el médico y 2 de otro médico, la lista muestra exactamente 3.
- [x] Una cita de ayer o de mañana no aparece en la lista.
- [x] Las citas aparecen en orden de hora: la de 9:00 antes que la de 11:30.
- [x] Cada tarjeta muestra hora, nombre del paciente, motivo y estado.
- [x] El resumen muestra el total de citas y cuántas están en estado Pendiente o Confirmada.
- [x] Una cita Cancelada aparece al final de la lista y con su estado visible.
- [ ] Sin citas para hoy se muestra "No tienes citas programadas para hoy".
- [ ] Si el servicio falla, se muestra el error y "Reintentar" vuelve a consultar.
- [x] Deslizar hacia abajo recarga la lista.
- [x] Tocar una cita abre CitaDetalle con el `citaId` correcto.

## Tasks

- [x] Crear el tipo `Cita` en `src/models`.
- [x] Crear datos de ejemplo de citas en `src/services/mocks`.
- [x] Crear `citasService.obtenerTodas()` que devuelva los datos de ejemplo con la forma `Respuesta<Cita[]>`.
- [x] Crear el ViewModel `useAgendaViewModel` con el filtro por médico y fecha, el orden y el resumen.
- [x] Crear el componente `TarjetaCita`.
- [x] Crear la pantalla `AgendaScreen` con sus cuatro estados.
- [x] Conectar el toque de una tarjeta con la navegación a CitaDetalle.
- [ ] Probar los criterios de aceptación (faltan lista vacía y error, que los datos de ejemplo no producen).
