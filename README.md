# ECE-FIAD Móvil

Aplicación móvil de Expediente Clínico Electrónico.
Consulta de expedientes, agenda de citas y registro de evoluciones desde el dispositivo.

## Especificaciones

El proyecto se desarrolla con Spec-Driven Development. El problema, el MVP, la navegación, el modelo de datos y la especificación de cada feature están en [`specs/`](specs/README.md).

## Tecnología

- React Native con Expo y Expo Router
- TypeScript
- Arquitectura MVVM

## Ejecutar el proyecto

Requisitos: Node.js y la app **Expo Go** en el teléfono.

```bash
npm install
npx expo start
```

Escanear el código QR con Expo Go (Android) o con la cámara (iPhone). El teléfono y la computadora deben estar en la misma red.
