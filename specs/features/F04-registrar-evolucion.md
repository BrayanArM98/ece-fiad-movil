# Feature F04: Registrar la evolución de una consulta

## Objetivo

Que el médico registre el diagnóstico y el tratamiento al terminar la consulta, desde el teléfono, en lugar de anotarlo después de memoria.

## Actor

Médico.

## Precondiciones

- El médico inició sesión (F01).
- El paciente tiene historia clínica activa (se llega desde HistorialPaciente, F03).

## Datos de entrada

| Campo | Obligatorio | Regla | Valor inicial |
|-------|-------------|-------|---------------|
| `idHistoriaClinica` | Sí | Viene de la navegación | — |
| `idDoctor` | Sí | Viene de la sesión; no se captura | — |
| Fecha | Sí | No puede ser futura | Fecha y hora actuales |
| Diagnóstico | Sí | Máximo 500 caracteres | Vacío |
| Tratamiento | Sí | Máximo 500 caracteres | Vacío |
| Notas | No | Máximo 1000 caracteres | Vacío |
| Fotografías | No | Ver F05 | Ninguna |

Las reglas son las mismas que valida la API, para que el usuario vea el error en el teléfono antes de enviar.

## Flujo principal

1. En HistorialPaciente, el médico presiona "Nueva evolución".
2. El sistema muestra el formulario con el nombre del paciente arriba y la fecha actual.
3. El médico captura diagnóstico, tratamiento y, si quiere, notas.
4. El médico presiona "Guardar".
5. El sistema valida los datos.
6. El sistema envía la evolución (`POST /api/Evoluciones`) y muestra un indicador mientras espera.
7. Al recibir confirmación, el sistema muestra "Evolución registrada".
8. El sistema regresa a HistorialPaciente y la nueva evolución aparece al inicio de la lista.

## Validaciones

- "Guardar" permanece deshabilitado mientras diagnóstico o tratamiento estén vacíos.
- Cada campo de texto muestra un contador de caracteres y no permite exceder su máximo.
- Si la fecha es futura, el campo muestra "La fecha no puede ser futura".
- Mientras se envía, "Guardar" se deshabilita para no registrar dos veces la misma evolución.

## Casos de error

- La API rechaza los datos: se muestra el mensaje que devuelve la API y el formulario conserva lo capturado.
- Sin Internet: "No se pudo guardar. Revisa tu conexión." y el formulario conserva lo capturado.
- El médico intenta salir con datos capturados: "¿Descartar la evolución?" con opciones "Descartar" y "Seguir editando".

## Resultado esperado

La evolución queda registrada en la historia clínica del paciente y es visible en su historial, tanto en la app como en el sistema web.

## Criterios de aceptación

- [ ] El formulario abre con la fecha y hora actuales.
- [ ] Con diagnóstico o tratamiento vacíos, "Guardar" está deshabilitado.
- [ ] No se pueden escribir más de 500 caracteres en diagnóstico ni en tratamiento.
- [ ] Una fecha futura muestra "La fecha no puede ser futura" y no se envía.
- [ ] Al guardar correctamente, se regresa al historial y la evolución aparece primero.
- [ ] La evolución guardada tiene el `idDoctor` del médico de la sesión.
- [ ] Si el guardado falla, los datos capturados siguen en el formulario.
- [ ] Salir con datos sin guardar muestra la confirmación de descarte.
- [ ] Tocar "Guardar" dos veces seguidas registra una sola evolución.

## Tasks

- [ ] Crear el tipo `CrearEvolucion` en `src/models`.
- [ ] Crear `evolucionesService.crear(datos)`.
- [ ] Crear `validarEvolucion` con las reglas de la tabla.
- [ ] Crear el ViewModel `useNuevaEvolucionViewModel` (campos, errores, envío, cambios sin guardar).
- [ ] Crear `NuevaEvolucionScreen`.
- [ ] Actualizar el historial al regresar.
- [ ] Probar los criterios de aceptación.
