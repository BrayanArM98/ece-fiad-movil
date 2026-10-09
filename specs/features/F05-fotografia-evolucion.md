# Feature F05: Adjuntar una fotografía a la evolución

## Objetivo

Que el médico conserve evidencia visual de la consulta (una lesión, un estudio impreso, una receta) junto a la evolución, tomándola con la cámara del teléfono en el momento.

## Actor

Médico.

## Precondiciones

- El médico está en el formulario de NuevaEvolucion (F04).

## Datos de entrada

- Fotografía tomada con la cámara o elegida de la galería.

## Flujo principal

1. En NuevaEvolucion, el médico presiona "Agregar foto".
2. El sistema ofrece "Tomar foto" o "Elegir de la galería".
3. La primera vez, el sistema solicita el permiso correspondiente del teléfono.
4. El médico toma o elige la imagen.
5. El sistema muestra una miniatura de la foto en el formulario, con un botón para quitarla.
6. Al guardar la evolución (F04), el sistema guarda las fotos en el teléfono asociadas a la evolución creada.
7. En HistorialPaciente, la evolución muestra sus fotos al expandirla; tocar una la muestra en pantalla completa.

## Validaciones

- Máximo 3 fotografías por evolución; al llegar a 3, "Agregar foto" se deshabilita.
- Las imágenes se comprimen antes de guardarse para no ocupar demasiado espacio.
- Las fotos solo se asocian si la evolución se guardó con éxito.

## Casos de error

- Permiso de cámara negado: "Para tomar fotos, permite el acceso a la cámara en la configuración del teléfono" y la opción de galería sigue disponible.
- Permiso de galería negado: mensaje equivalente; la cámara sigue disponible.
- El médico cancela la cámara: regresa al formulario sin cambios.
- La evolución no se guarda: las fotos permanecen en el formulario para reintentar.

## Resultado esperado

La evolución queda acompañada de hasta tres fotografías que el médico puede volver a ver desde el historial.

## Criterios de aceptación

- [ ] "Agregar foto" ofrece cámara y galería.
- [ ] La foto tomada aparece como miniatura en el formulario.
- [ ] La miniatura se puede quitar antes de guardar.
- [ ] Con 3 fotos, "Agregar foto" se deshabilita.
- [ ] Con el permiso de cámara negado, se muestra el mensaje y la galería sigue funcionando.
- [ ] Después de guardar, la evolución muestra sus fotos en el historial.
- [ ] Tocar una foto del historial la abre en pantalla completa.
- [ ] Si la evolución no se guarda, ninguna foto queda asociada.

## Decisiones

- La API aún no recibe imágenes. Las fotos se guardan en el teléfono como `Adjunto` (ver `02-data-model.md`), así que solo se ven en el teléfono que las tomó. Subirlas al servidor queda como trabajo futuro cuando exista el endpoint.
- Cámara y galería con `expo-image-picker`; archivos con `expo-file-system`.

## Tasks

- [ ] Crear el tipo `Adjunto`.
- [ ] Crear `adjuntosService` (guardar, listar por evolución, borrar).
- [ ] Crear `camaraService` con solicitud de permisos.
- [ ] Agregar fotos al ViewModel `useNuevaEvolucionViewModel`.
- [ ] Crear el componente `SelectorFotos` con miniaturas.
- [ ] Mostrar las fotos en `TarjetaEvolucion` y el visor en pantalla completa.
- [ ] Probar los criterios de aceptación en un teléfono real.
