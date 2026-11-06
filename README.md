# ECE-FIAD Móvil

Aplicación móvil del Expediente Clínico Electrónico ECE-FIAD para médicos y pacientes.
Usa la misma API que [ECE-FIAD Web](https://ece-fiad-web.vercel.app), publicada en Azure.

- **Médico:** agenda del día con el siguiente paciente, registro del resultado de cada cita, lista de pacientes, historial clínico y registro de evoluciones con fotografías.
- **Paciente:** próximas citas con recordatorios, clínica y hospitales reales cercanos en el mapa con ruta y llamada, y sus datos.
- **Ambos:** inicio de sesión con huella o rostro.

## Especificaciones

El proyecto se desarrolla con Spec-Driven Development. El problema, el MVP, la navegación, el modelo de datos, la conexión con la API, el diseño y la especificación de cada feature están en [`specs/`](specs/README.md).

## Tecnología

- React Native con Expo SDK 58 y Expo Router
- TypeScript y arquitectura MVVM (los ViewModels son hooks en `src/viewmodels`)
- Funciones del teléfono: biometría, almacenamiento seguro, cámara y galería, notificaciones locales, ubicación y mapas
- Diseño propio "Marea" ([`specs/04-diseno.md`](specs/04-diseno.md))

## Ejecutar el proyecto

Requisitos: Node.js y la app **Expo Go** (SDK 58) en el teléfono.

```bash
npm install
npx expo start -c
```

Escanear el código QR con Expo Go (Android) o con la cámara (iPhone). El teléfono y la computadora deben estar en la misma red.

La app se conecta sola a la API de Azure (`.env.development`). La primera petición del día puede tardar hasta 40 segundos mientras el servidor despierta. Para usar una API local o el modo demostración sin servidor, ver [`specs/03-api.md`](specs/03-api.md).

## Cuentas de demostración

Las crea la API con los datos de demostración: `medico@ecefiad.mx` (médico) y `paciente@ecefiad.mx` (paciente). La contraseña es la configurada en `DatosDemostracion__Contrasena` de la API.
