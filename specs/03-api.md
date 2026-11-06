# Conexión con la API

## Objetivo

Que la app use los datos reales de la clínica que expone la API REST del sistema web ECE-FIAD (proyecto de Aplicaciones Web), con inicio de sesión real y los permisos de cada rol.

## Origen de los datos

La dirección de la API se lee de la variable `EXPO_PUBLIC_API_URL`:

| Archivo | Se sube al repositorio | Contenido |
|---------|------------------------|-----------|
| `.env.development` | Sí | API publicada en Azure; la usa `npx expo start` |
| `.env.production` | Sí | API publicada en Azure; la usan las compilaciones |
| `.env.local` | No | Opcional, para cambiarla en una computadora |

La dirección de la API no es un secreto: es pública y la API exige token en cada petición.

- Para usar una API local: en `.env.local`, `EXPO_PUBLIC_API_URL=http://<IP-de-la-computadora>:5200`.
- Para el modo demostración con datos de ejemplo (sin servidor): en `.env.local`, `EXPO_PUBLIC_API_URL=` vacío.
- Después de cambiar la variable hay que reiniciar Expo con `npx expo start -c`.

## Autenticación

1. `POST /api/Auth/login` con `{ email, contrasena }` devuelve `{ token, expiraUtc, usuario }`.
2. `usuario.rol` debe ser `Medico` o `Paciente`; `idDoctor` o `idPaciente` vinculan la cuenta con su expediente.
3. El token se guarda en la sesión (en memoria y, con biometría, en el almacenamiento seguro) y `services/http.ts` lo envía en cada petición como `Authorization: Bearer {token}`.
4. El token dura 8 horas. Si la API responde 401, la app cierra la sesión y regresa a Login.
5. La API permite 5 intentos de inicio de sesión por minuto; al pasarse responde 429 y la app muestra "Demasiados intentos. Espera un minuto e intenta de nuevo."

## Endpoints que usa la app

| Servicio | Método y ruta | Feature | Quién |
|----------|---------------|---------|-------|
| `authService.iniciarSesion` | `POST /api/Auth/login` | F01 | Todos |
| `citasService.obtenerTodas` | `GET /api/Citas?desde=&hasta=` | F02, F06 | La API devuelve solo las citas del médico o del paciente del token |
| `citasService.obtenerPorId` | `GET /api/Citas/{id}` | F02 | Médico |
| `citasService.cambiarEstado` | `PATCH /api/Citas/{id}/estado` | F02 | Médico, solo en sus citas |
| `pacientesService.obtenerActivos` | `GET /api/Pacientes/activos` | F03 | Médico |
| `pacientesService.obtenerPorId` | `GET /api/Pacientes/{id}` | F03, Perfil | Médico; el paciente solo el suyo |
| `historialService.obtenerPorPaciente` | `GET /api/historial/paciente/{idPaciente}` | F03 | Médico |
| `evolucionesService.crear` | `POST /api/Evoluciones` | F04 | Médico |
| `doctoresService.obtenerTodos` | `GET /api/Doctores` | F06 | Todos |
| `doctoresService.obtenerPorId` | `GET /api/Doctores/{id}` | Perfil | Todos |

Siguen en el teléfono, porque la API aún no los soporta (ver `02-data-model.md`): las fotografías y los recordatorios. Los hospitales cercanos de F07 vienen de OpenStreetMap, no de la API.

## Reglas del cliente HTTP

- Todas las peticiones a la API pasan por un solo módulo (`services/http.ts`).
- Tiempo límite de 90 segundos, porque la API gratuita de Azure se duerme tras 20 minutos sin uso y, al despertar junto con la base de datos, puede tardar alrededor de un minuto. Si se agota, el mensaje es "El servidor tardó demasiado en responder"; si no hay red, "No se pudo conectar con el servidor". Cada pantalla muestra su estado de error con "Reintentar".
- Login despierta la API en cuanto se abre (`GET /salud` sin esperar respuesta), para que esté lista cuando el usuario termine de escribir.
- Si la API responde `exitoso: false`, el servicio devuelve el `mensaje` de la API; por ejemplo, F04 lo muestra y conserva el formulario.
- Si la API responde sin la envoltura `Respuesta<T>`, el servicio devuelve un mensaje según el código: 401 sesión expirada, 403 sin permiso, 429 demasiados intentos, y un mensaje genérico para los demás.
- La API guarda fechas sin zona horaria. La app envía las fechas en hora local sin zona (`2026-10-29T10:30:00`) y lee las que recibe como hora local. Las fracciones de segundo de más de 3 dígitos se recortan al leer.
- El modo de prueba (falla de red y lista sin citas) funciona igual con la API.

## Probar con la API local

1. Arrancar la API con el perfil que escucha en la red local: `dotnet run --launch-profile red` (puerto 5200).
2. Permitir el puerto 5200 en el firewall de Windows (una sola vez).
3. Escribir en `.env.local` la IP de la computadora, la misma que aparece en la dirección `exp://` de Expo.
4. Reiniciar Expo con `npx expo start -c`.

## Criterios de aceptación

- [ ] Con la API de Azure, medico@ecefiad.mx entra y ve su agenda de hoy registrada en el sistema web.
- [ ] Con la API de Azure, paciente@ecefiad.mx entra y ve solo sus próximas citas.
- [ ] Una cuenta de administrador o recepción no puede entrar a la app.
- [ ] El historial muestra la historia y las evoluciones registradas en el sistema web.
- [ ] Una evolución registrada en la app aparece en el sistema web con la misma fecha y hora.
- [ ] Un resultado registrado en la app (Atendida, No asistió) aparece en la agenda web.
- [ ] Con un token vencido, la app regresa a Login.
- [ ] Con `EXPO_PUBLIC_API_URL` vacía en `.env.local`, la app funciona con datos de ejemplo.
- [ ] El modo de prueba indica si la app usa la API o los datos de ejemplo.

## Tasks

- [x] Crear `src/config/api.ts` con la dirección de la API.
- [x] Crear el cliente `services/http.ts` (tiempo límite, envoltura, fechas).
- [x] Enviar las fechas en hora local sin zona.
- [x] Conectar `citasService` y `doctoresService`.
- [x] Conectar `pacientesService` e `historialService`.
- [x] Conectar `evolucionesService`.
- [x] Mostrar el origen de los datos en el modo de prueba.
- [x] Conectar el inicio de sesión y enviar el token en cada petición.
- [x] Cerrar la sesión ante un 401.
- [x] Apuntar `.env.development` y `.env.production` a la API publicada en Azure.
- [x] Usar los filtros de fecha de `GET /api/Citas`.
- [x] Registrar el resultado de la cita con `PATCH /api/Citas/{id}/estado`.
- [ ] Probar los criterios de aceptación con la API de Azure en un teléfono real.
