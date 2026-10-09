# Especificaciones del proyecto (SDD)

Este proyecto se desarrolla con **Spec-Driven Development**: ninguna feature se implementa sin que antes exista su especificación en esta carpeta. La especificación guía al código, no al revés.

## Índice

| Archivo | Contenido |
|---------|-----------|
| [`00-project.md`](00-project.md) | Problema, usuarios, propuesta, MVP y alcance |
| [`01-navigation.md`](01-navigation.md) | Mapa de pantallas, rutas, parámetros y reglas de navegación |
| [`02-data-model.md`](02-data-model.md) | Entidades, origen de cada dato y pendientes con la API |
| [`features/`](features/) | Una especificación por feature del MVP |

## Features del MVP

| ID | Feature | Spec | Estado |
|----|---------|------|--------|
| F01 | Iniciar sesión con biometría | [F01](features/F01-inicio-sesion-biometria.md) | Especificada |
| F02 | Ver la agenda del día | [F02](features/F02-agenda-del-dia.md) | Implementada |
| F03 | Consultar el historial de un paciente | [F03](features/F03-historial-paciente.md) | Implementada |
| F04 | Registrar la evolución de una consulta | [F04](features/F04-registrar-evolucion.md) | Implementada |
| F05 | Adjuntar una fotografía a la evolución | [F05](features/F05-fotografia-evolucion.md) | Especificada |
| F06 | Ver mis citas y recibir recordatorios | [F06](features/F06-mis-citas-recordatorios.md) | Especificada |
| F07 | Ubicar la clínica en el mapa | [F07](features/F07-ubicar-clinica.md) | Especificada |

Estados posibles: Especificada → En desarrollo → Implementada → Validada. Una feature solo pasa a **Validada** cuando todos sus criterios de aceptación están marcados.

## Estructura de cada spec

Todas las specs de `features/` siguen la misma estructura:

1. **Objetivo**: qué problema resuelve la feature.
2. **Actor**: quién la usa.
3. **Precondiciones**: qué debe ser cierto antes.
4. **Datos de entrada**: qué información necesita.
5. **Flujo principal** (y flujos alternos si existen).
6. **Validaciones**.
7. **Estados de la pantalla**: cargando, con datos, vacío y error.
8. **Casos de error**: sin Internet, permisos negados, datos inválidos.
9. **Resultado esperado**.
10. **Criterios de aceptación**: verificables, como casillas.
11. **Decisiones**: elecciones técnicas y su motivo, cuando las hay.
12. **Tasks**: la spec dividida en tareas pequeñas para implementar.

## Flujo de trabajo por feature

```text
1. Escribir la spec
        ↓
2. Revisar comportamiento y casos de error
        ↓
3. Ajustar datos (02-data-model) y navegación (01-navigation) si hace falta
        ↓
4. Implementar una task a la vez, un commit por task
        ↓
5. Validar los criterios de aceptación en un teléfono real
        ↓
6. Marcar los criterios y actualizar el estado en este índice
        ↓
7. Si algo cambió durante la implementación, actualizar la spec
```

## Validación de casos de error

Mientras la app usa datos de ejemplo, los casos de error no ocurren por sí solos. Para validarlos, la pestaña Perfil incluye un **modo de prueba** (solo en desarrollo) que simula una falla de red o una agenda sin citas. Con él se comprueban los criterios de aceptación de los estados de error y de lista vacía. Al conectar la API, estos casos se producen de verdad.

## Trazabilidad

- Las features se identifican por su ID (`F01` a `F07`) en las specs, en el código y en las conversaciones del equipo.
- Cada commit de implementación corresponde a una task de una spec y describe el cambio en imperativo, por ejemplo: `crea el viewmodel de la agenda con el filtro por medico y fecha`.
- Cuando una implementación obliga a cambiar el comportamiento, la spec se actualiza en un commit propio antes o junto con el código, para que spec y código sigan alineados.

## Uso de IA

La IA se usa sobre las specs, no en lugar de ellas:

- para revisar una spec y encontrar ambigüedades o casos no considerados;
- para implementar **una task a la vez**, respetando la spec y sin agregar funcionalidades.

Todo código generado se revisa antes de commitearlo y se valida contra los criterios de aceptación.
