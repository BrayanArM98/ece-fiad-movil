# Navegación

## Principio

La app tiene dos zonas: la de **acceso** (antes de iniciar sesión) y la **principal** (después). La zona principal cambia según el rol del usuario: el médico y el paciente ven pestañas distintas. Un usuario sin sesión nunca puede llegar a una pantalla de la zona principal.

## Mapa de pantallas

```text
RootStack
│
├── Acceso (sin sesión)
│   └── Login
│
├── MedicoTabs (rol = medico)
│   ├── Agenda                  ← pestaña inicial
│   │   └── CitaDetalle
│   │       └── HistorialPaciente
│   │           └── NuevaEvolucion
│   │               └── Camara
│   ├── Pacientes
│   │   └── HistorialPaciente
│   └── Perfil
│
└── PacienteTabs (rol = paciente)
    ├── MisCitas                ← pestaña inicial
    ├── Clinica (mapa)
    └── Perfil
```

## Rutas y parámetros

| Desde | Hacia | Parámetro | Por qué |
|-------|-------|-----------|---------|
| Login | MedicoTabs / PacienteTabs | — | El rol de la sesión decide el destino |
| Agenda | CitaDetalle | `citaId` | Ver los datos de una cita del día |
| CitaDetalle | HistorialPaciente | `pacienteId` | Revisar antecedentes antes o durante la consulta |
| Pacientes | HistorialPaciente | `pacienteId` | Consultar a un paciente sin cita hoy |
| HistorialPaciente | NuevaEvolucion | `historiaId`, `pacienteId` | Registrar la consulta en su historia |
| NuevaEvolucion | Camara | — | Tomar la foto; regresa con la `uri` de la imagen |
| Perfil | Login | — | Cerrar sesión limpia la pila completa |

## Reglas

1. Al abrir la app con una sesión guardada se pide biometría; si se valida, se entra directo a la pestaña inicial del rol.
2. Cerrar sesión regresa a Login y elimina el historial de navegación, para que el botón "atrás" no regrese a datos clínicos.
3. Después de guardar una evolución, la app regresa a HistorialPaciente y la nueva evolución aparece al inicio de la lista.
4. Si se sale de NuevaEvolucion con datos capturados sin guardar, la app pregunta antes de descartarlos.
5. HistorialPaciente es la misma pantalla desde Agenda y desde Pacientes; solo cambia de dónde llega.

## Barra de pestañas

| Rol | Pestañas | Ícono |
|-----|----------|-------|
| Médico | Agenda · Pacientes · Perfil | calendario · personas · usuario |
| Paciente | Mis citas · Clínica · Perfil | calendario · ubicación · usuario |
