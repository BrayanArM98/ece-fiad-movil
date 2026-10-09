# Proyecto final: ECE-FIAD Móvil

## Nombre

ECE-FIAD Móvil — Expediente Clínico Electrónico en el teléfono.

## Problema

En una clínica pequeña el médico pasa de consultorio en consultorio y no siempre tiene una computadora a la mano. Para revisar a quién atiende hoy, consultar los antecedentes de un paciente o anotar lo que ocurrió en la consulta depende de un equipo de escritorio, así que muchas notas se escriben después, de memoria, o se quedan en papel.

Del otro lado, los pacientes olvidan sus citas y no tienen una forma rápida de saber cómo llegar a la clínica, lo que provoca inasistencias y retrasos en la agenda.

## Usuario objetivo

**Usuario principal: médico de una clínica pequeña.** Atiende entre 10 y 20 consultas al día, usa su propio teléfono y necesita consultar y registrar información clínica entre consultas, en pocos toques.

**Usuario secundario: paciente de la clínica.** Necesita recordar sus citas y llegar a la clínica sin llamar por teléfono.

## Propuesta de solución

Una aplicación móvil que pone en el teléfono del médico lo que necesita durante su jornada: la agenda del día, el historial de cada paciente y el registro de la evolución de la consulta, incluyendo una fotografía cuando haga falta (una receta, un estudio, una lesión). El acceso se protege con la biometría del teléfono, porque la información es sensible.

Para el paciente, la app envía recordatorios de sus citas y le muestra dónde está la clínica.

La app consume la misma información clínica que ya administra el sistema de la clínica (pacientes, doctores, citas, historias clínicas y evoluciones) a través de una API REST.

## MVP

| ID  | Feature | Actor | Capacidad del teléfono |
|-----|---------|-------|------------------------|
| F01 | Iniciar sesión con biometría | Médico / Paciente | Huella o rostro |
| F02 | Ver la agenda del día | Médico | — |
| F03 | Consultar el historial de un paciente | Médico | — |
| F04 | Registrar la evolución de una consulta | Médico | — |
| F05 | Adjuntar una fotografía a la evolución | Médico | Cámara |
| F06 | Ver mis citas y recibir recordatorios | Paciente | Notificaciones |
| F07 | Ubicar la clínica en el mapa | Paciente | Geolocalización |

Cada feature tiene su especificación en `specs/features/`.

## Funcionalidades futuras

- Modo sin conexión: guardar evoluciones en el teléfono y sincronizarlas al recuperar Internet.
- Notificaciones enviadas desde el servidor (por ejemplo, avisar al paciente que la clínica canceló su cita).
- Subir las fotografías de las evoluciones al servidor.
- Confirmar o cancelar una cita desde la app del paciente.
- Buscar pacientes por nombre o número de documento.
- Modo oscuro.

## Fuera de alcance

- Administración de catálogos (especialidades, alta de doctores): se hace en el sistema web.
- Agendar citas desde la app: lo hace la recepción en el sistema web.

## Decisiones iniciales

- **Tecnología:** React Native con Expo, para probar en el teléfono con Expo Go y generar el instalable con EAS Build.
- **Arquitectura:** patrón MVVM. Cada pantalla (View) obtiene su estado de un ViewModel (hook), y el ViewModel obtiene los datos de un servicio, sin que la pantalla sepa de dónde vienen.
- **Datos:** mientras se termina la conexión con la API, los servicios devuelven datos de ejemplo con la misma forma que la API. Cambiar a la API real solo modifica la capa de servicios.
