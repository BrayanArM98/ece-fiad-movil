# Diario de decisiones

**Proyecto:** ECE-FIAD Móvil · **Autor:** Brayan Arturo Rocha Meneses

Cada decisión indica qué se eligió, qué alternativas había y por qué.

### 1. React Native con Expo y Expo Go
- **Alternativas:** Flutter, Android nativo.
- **Por qué:** con Expo Go pruebo en el celular sin compilar, y TypeScript es el mismo lenguaje del frontend web.

### 2. Arquitectura MVVM con hooks como ViewModels
- **Alternativas:** lógica dentro de cada pantalla, o Redux.
- **Por qué:** las pantallas solo dibujan y cada ViewModel (`src/viewmodels/`) concentra estado y acciones; así es fácil ubicar y cambiar la lógica.

### 3. Rutas protegidas por rol con Expo Router
- **Por qué:** las rutas del médico y del paciente solo existen con la sesión correcta (`app/_layout.tsx`, `Stack.Protected`). Al cerrar sesión desaparecen del historial y "atrás" no regresa a datos clínicos.

### 4. La app no tiene base de datos propia; usa la API del sistema web
- **Alternativa:** SQLite en el teléfono.
- **Por qué:** una sola fuente de datos. Lo que el médico registra en el celular aparece en la web al instante.

### 5. Un solo cliente HTTP (`services/http.ts`)
- **Por qué:** en un lugar se agrega el token, el tiempo límite y el manejo del error 401 (sesión vencida). Ningún servicio llama a `fetch` por su cuenta.

### 6. Biometría guardando el token, no la contraseña
- **Alternativa:** guardar correo y contraseña para reenviarlos.
- **Por qué:** la contraseña nunca se guarda. El token vive en el almacenamiento seguro (SecureStore) y solo se entrega después de reconocer la huella. Si el token venció (dura 8 horas), se pide la contraseña.

### 7. La sesión sin biometría no se conserva al cerrar la app
- **Por qué:** es información clínica. Si el usuario no activó la huella, al volver a abrir la app debe iniciar sesión.

### 8. Tiempo límite de 90 segundos y "despertar" al servidor
- **Contexto:** la API está en el plan gratuito de Azure, que se duerme sin uso y tarda cerca de un minuto en despertar.
- **Por qué:** con 45 segundos el primer inicio de sesión del día fallaba. Login hace una petición a `/salud` al abrirse para que el servidor esté listo.

### 9. Fotografías y recordatorios guardados en el teléfono
- **Contexto:** la API no tiene endpoint para subir imágenes ni para notificaciones.
- **Por qué:** se guardan localmente y está documentado en `specs/02-data-model.md` como pendiente para cuando la API lo soporte.

### 10. Hospitales reales con OpenStreetMap
- **Alternativa:** Google Places.
- **Por qué:** OpenStreetMap es gratis y sin clave. Como su servicio puede saturarse, hay segundo servidor, caché y lista de respaldo.

### 11. Diseño propio con StyleSheet en lugar de una librería de componentes
- **Por qué:** funciona en Expo Go sin configuración nativa y mantiene la misma identidad visual que la web ("Marea").

### 12. Pantalla fija en vertical
- **Por qué:** las pantallas están diseñadas para uso con una mano; girar el teléfono no cambia la vista (`app.json`, `orientation: portrait`).

### 13. Modo de prueba solo en desarrollo
- **Por qué:** permite simular falla de red y lista vacía para validar los estados de error frente a quien evalúa, sin activar el modo avión.
