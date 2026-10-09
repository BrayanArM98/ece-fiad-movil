# Feature F03: Consultar el historial de un paciente

## Objetivo

Que el médico revise, antes o durante la consulta, los antecedentes del paciente y lo que se le hizo en consultas anteriores, sin depender de una computadora.

## Actor

Médico.

## Precondiciones

- El médico inició sesión (F01).

## Datos de entrada

- `pacienteId`, que llega desde CitaDetalle o desde la lista de Pacientes.

## Puntos de entrada

- **Desde la agenda:** Agenda → CitaDetalle → botón "Ver historial". CitaDetalle muestra hora, paciente, motivo, notas y estado de la cita.
- **Desde Pacientes:** la pestaña Pacientes muestra los pacientes activos en orden alfabético por apellido; tocar uno abre su historial.

## Flujo principal

1. El médico llega a HistorialPaciente con un `pacienteId`.
2. El sistema muestra un indicador de carga.
3. El sistema obtiene el historial del paciente (`GET /api/historial/paciente/{idPaciente}`).
4. El sistema muestra, en este orden:
   - encabezado: nombre completo, edad y grupo sanguíneo;
   - **alergias**, resaltadas para que no pasen desapercibidas;
   - antecedentes personales y familiares;
   - lista de evoluciones de la más reciente a la más antigua, cada una con fecha, doctor, especialidad, diagnóstico y tratamiento.
5. Tocar una evolución la expande para mostrar sus notas y sus fotografías (F05).
6. El botón "Nueva evolución" lleva a NuevaEvolucion (F04).

## Validaciones

- La edad se calcula a partir de `fechaNacimiento` y la fecha actual.
- Si `alergias` está vacío se muestra "Sin alergias registradas", nunca un espacio en blanco.

## Estados de la pantalla

| Estado | Qué ve el médico |
|--------|------------------|
| Cargando | Indicador de carga |
| Con historia y evoluciones | Encabezado, antecedentes y lista de evoluciones |
| Con historia sin evoluciones | Antecedentes y "Este paciente aún no tiene evoluciones registradas" |
| Sin historia clínica | "Este paciente no tiene historia clínica. Se crea desde el sistema web." y sin botón "Nueva evolución" |
| Error | "No se pudo cargar el historial" y botón "Reintentar" |

## Casos de error

- Sin Internet o la API no responde: estado de error con "Reintentar".
- El paciente no existe: "Paciente no encontrado" y botón para regresar.

## Resultado esperado

El médico ve en una sola pantalla los antecedentes y todas las consultas previas del paciente, y puede registrar la de hoy.

## Criterios de aceptación

- [ ] Desde CitaDetalle, "Ver historial" abre el historial del paciente de esa cita.
- [ ] La pestaña Pacientes muestra solo pacientes activos, ordenados por apellido.
- [ ] El encabezado muestra nombre, edad correcta y grupo sanguíneo.
- [ ] Las alergias se muestran con un estilo distinto al resto de los antecedentes.
- [ ] Sin alergias se lee "Sin alergias registradas".
- [ ] Las evoluciones aparecen de la más reciente a la más antigua.
- [ ] Un paciente sin historia muestra el mensaje y no muestra "Nueva evolución".
- [ ] Si el servicio falla, "Reintentar" vuelve a consultar.

## Tasks

- [ ] Crear los tipos `Paciente`, `HistoriaClinica`, `Evolucion` y `HistorialPaciente`.
- [ ] Crear datos de ejemplo de pacientes, historias y evoluciones.
- [ ] Crear `pacientesService.obtenerActivos()` e `historialService.obtenerPorPaciente(id)`.
- [ ] Crear `CitaDetalleScreen` con el botón "Ver historial".
- [ ] Crear el ViewModel y la pantalla de la lista de Pacientes.
- [ ] Crear el ViewModel `useHistorialViewModel` con el cálculo de edad.
- [ ] Crear los componentes `EncabezadoPaciente` y `TarjetaEvolucion`.
- [ ] Crear `HistorialPacienteScreen` con sus cinco estados.
- [ ] Probar los criterios de aceptación.
