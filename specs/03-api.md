# Conexión con la API

## Objetivo

Que la app use los datos reales de la clínica que expone la API REST del sistema web ECE-FIAD (proyecto de Aplicaciones Web), sin modificar pantallas ni ViewModels: solo cambian los servicios.

## Origen de los datos

- Si la variable `EXPO_PUBLIC_API_URL` está definida, los servicios consultan la API en esa dirección.
- Si no está definida, los servicios usan los datos de ejemplo (modo demostración). Así la app se puede presentar aunque la API no esté encendida.

La dirección se configura en el archivo `.env.local` de la raíz del proyecto, que no se sube al repositorio porque cambia en cada red:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.70:5200
```

## Endpoints que usa la app

| Servicio | Método y ruta | Feature |
|----------|---------------|---------|
| `citasService.obtenerTodas` | `GET /api/Citas` | F02, F06 |
| `citasService.obtenerPorId` | `GET /api/Citas/{id}` | F02 |
| `pacientesService.obtenerActivos` | `GET /api/Pacientes/activos` | F03 |
| `pacientesService.obtenerPorId` | `GET /api/Pacientes/{id}` | F03 |
| `historialService.obtenerPorPaciente` | `GET /api/historial/paciente/{idPaciente}` | F03 |
| `evolucionesService.crear` | `POST /api/Evoluciones` | F04 |
| `doctoresService.obtenerTodos` | `GET /api/Doctores` | F06 |

Siguen en el teléfono, porque la API aún no los soporta (ver `02-data-model.md`): la sesión y las cuentas, las fotografías, los recordatorios y los datos de la clínica.

## Reglas del cliente HTTP

- Todas las peticiones pasan por un solo módulo (`services/http.ts`).
- Tiempo límite de 10 segundos. Si se agota o no hay conexión, el servicio falla como "sin Internet" y cada pantalla muestra su estado de error con "Reintentar".
- Si la API responde `exitoso: false`, el servicio devuelve el `mensaje` de la API; por ejemplo, F04 lo muestra y conserva el formulario.
- Si la API responde sin la envoltura `Respuesta<T>` (error 500, error de validación de ASP.NET), el servicio devuelve un mensaje genérico de error del servidor.
- La API guarda fechas sin zona horaria. La app envía las fechas en hora local sin zona (`2026-10-29T10:30:00`) y lee las que recibe como hora local. Las fracciones de segundo de más de 3 dígitos se recortan al leer.
- El modo de prueba (falla de red y lista sin citas) funciona igual con la API.

## Probar con la API en la computadora

1. Arrancar la API con el perfil que escucha en la red local: `dotnet run --launch-profile red` (puerto 5200).
2. Permitir el puerto 5200 en el firewall de Windows (una sola vez).
3. Escribir en `.env.local` la IP de la computadora, la misma que aparece en la dirección `exp://` de Expo.
4. Reiniciar Expo con `npx expo start -c` para que lea la variable.
5. Para usar las cuentas de ejemplo, la base debe tener el doctor con id 1 y el paciente con id 1, porque la API aún no tiene inicio de sesión.

## Criterios de aceptación

- [ ] Sin `EXPO_PUBLIC_API_URL`, la app funciona igual que antes con datos de ejemplo.
- [ ] Con la API encendida, la agenda muestra las citas de hoy del doctor 1 registradas en el sistema web.
- [ ] Con la API encendida, el historial muestra la historia y las evoluciones registradas en el sistema web.
- [ ] Una evolución registrada en la app aparece en el sistema web con la misma fecha y hora.
- [ ] Con la API apagada, las pantallas muestran su estado de error y "Reintentar" funciona al encenderla.
- [ ] El modo de prueba indica si la app usa la API o los datos de ejemplo.

## Tasks

- [x] Crear `src/config/api.ts` con la dirección de la API.
- [x] Crear el cliente `services/http.ts` (tiempo límite, envoltura, fechas).
- [x] Enviar las fechas en hora local sin zona.
- [x] Conectar `citasService` y `doctoresService`.
- [x] Conectar `pacientesService` e `historialService`.
- [x] Conectar `evolucionesService`.
- [x] Mostrar el origen de los datos en el modo de prueba.
- [ ] Probar los criterios de aceptación con la API encendida.
