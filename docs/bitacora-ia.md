# Bitácora de IA

**Proyecto:** ECE-FIAD Móvil · **Autor:** Brayan Arturo Rocha Meneses
**Herramienta:** Claude (en claude.ai y como asistente con acceso al proyecto)

## Cómo trabajé con la IA

1. Primero escribí las especificaciones en `specs/` (problema, MVP, navegación, modelo de datos y una spec por feature, F01 a F07). La IA me ayudó a redactarlas, pero yo decidí el alcance y las reglas.
2. Le pedía a la IA una feature a la vez, siempre señalando la spec que debía cumplir.
3. Revisaba el código que proponía, lo probaba en el celular con Expo Go y validaba los criterios de aceptación de la spec.
4. Si algo fallaba, le mandaba la captura del error y revisábamos juntos la causa.
5. Hacía un commit por cada paso pequeño; el historial de commits sigue el orden de las features.

## Registro

### 2026-10-09 · Especificaciones y estructura base
- **Pedí:** redactar las specs del MVP con Spec-Driven Development y crear el proyecto con Expo Router, TypeScript y MVVM.
- **Propuso:** una spec por feature con flujo, validaciones, estados de pantalla y criterios de aceptación.
- **Decidí:** limitar el MVP a siete features (F01 a F07) que usan funciones del teléfono, y dejar fuera la gestión de citas, que ya existe en la web.

### 2026-10-09 · Agenda, historial, evolución y fotos (F02 a F05)
- **Pedí:** implementar cada feature siguiendo su spec, primero con datos de ejemplo porque la API todavía no tenía inicio de sesión.
- **Acepté:** separar las reglas en funciones puras (`utils/agenda.ts`, `utils/validaciones.ts`) para poder probarlas sin pantallas.
- **Corregí:** una primera versión de los commits quedó desordenada; regresé el historial y volví a hacer los commits en el orden correcto (se ve el `reset` en el historial).
- **Agregué:** un modo de prueba (`config/simulacion.ts`) para simular falla de red y agenda vacía, y así validar los estados de error de las specs.

### 2026-10-18 · Recordatorios y mapa de la clínica (F06 y F07)
- **Pedí:** recordatorios con notificaciones locales y la ubicación de la clínica con distancia y ruta.
- **Verifiqué:** que los recordatorios se cancelen al cerrar sesión y que la pantalla funcione aunque se niegue el permiso de ubicación.

### 2026-10-29 · Biometría, SDK 58 y conexión con la API
- **Pedí:** entrar con huella o rostro y conectar los servicios a la API real.
- **Error que detecté:** las fechas que devolvía la API llegaban con 7 decimales en los segundos y el teléfono las interpretaba mal. Se corrigió recortando la fracción al leer el JSON (`services/http.ts`).
- **Decidí:** enviar las fechas en hora local sin zona, porque así las guarda la API.

### 2026-11-06 · Rediseño "Marea"
- **Pedí:** un diseño profesional con la misma identidad que la web.
- **Revisé:** la IA generó capturas de cada pantalla a tamaño de teléfono antes de pasar el código a mi proyecto; aprobé el diseño viéndolas.
- **Corregí:** la etiqueta "Por atender" no cabía junto a los divisores del resumen; la cambiamos a "Pendientes".

### 2026-11-06 · Inicio de sesión real y clínicas reales
- **Pedí:** dejar la app funcional al 100 % con la API de Azure y que el mapa llevara a clínicas reales.
- **Error que detecté al probar en el celular:** al iniciar sesión apareció la pantalla roja "Sin conexión con el servidor". Había dos causas:
  1. La API gratuita de Azure estaba dormida y tardó más que el límite de 45 segundos.
  2. La IA dijo que había atrapado ese error en el ViewModel, pero su edición no se había aplicado, así que el error llegaba sin control a la pantalla.
  **Corrección:** límite de 90 segundos, Login "despierta" al servidor al abrirse, el error se atrapa y se muestra un mensaje claro. Aprendí a no confiar en "ya quedó" sin probarlo.
- **Rechacé:** el teléfono de la clínica que venía en la configuración era un número inventado; si alguien tocaba "Llamar" podía marcarle a una persona real. Lo quitamos y "Llamar" solo aparece cuando el lugar tiene teléfono registrado.
- **Decidí:** usar OpenStreetMap (gratis y sin clave) para los hospitales reales en lugar de Google Places, que requiere clave y cobra por uso.
- **Problema detectado al probar:** el servicio de OpenStreetMap limita las consultas por dispositivo y a veces está saturado. Se agregó un segundo servidor, caché de 10 minutos y una lista de respaldo con hospitales reales de Ensenada.
- **Restricción:** la IA no podía escribir archivos `.env` en mi computadora; los creé yo con el comando que me pasó.

## Lo que aprendí sobre trabajar con IA
- Hay que probar en el dispositivo real: el error del login no aparecía en la vista web.
- Revisar que el cambio realmente se aplicó antes de darlo por hecho.
- Pedir cambios pequeños y con contexto (la spec o el archivo exacto) da mejores resultados que pedir "todo".
