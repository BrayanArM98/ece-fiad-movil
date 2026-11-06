# Feature F07: Ubicar la clínica y hospitales cercanos

## Objetivo

Que el paciente sepa dónde está la clínica y cómo llegar, y que pueda encontrar el hospital o la clínica real más cercana cuando lo necesite, sin tener que llamar para pedir indicaciones.

## Actor

Paciente.

## Precondiciones

- El paciente inició sesión (F01).

## Datos de entrada

- La clínica ECE-FIAD: nombre, dirección y coordenadas (configuradas en la app).
- Hospitales y clínicas reales cercanos, consultados en vivo en OpenStreetMap.
- Ubicación actual del teléfono, si el paciente da permiso.

## Flujo principal

1. El paciente entra a la pestaña Clínica.
2. La primera vez, el sistema solicita el permiso de ubicación.
3. El sistema muestra un mapa con un marcador en la clínica ECE-FIAD.
4. El sistema busca hospitales y clínicas reales en un radio de 8 km alrededor del paciente (o de la clínica, si no hay ubicación) y los marca en el mapa: "H" coral para hospitales y cruz verde para clínicas.
5. Si hay permiso, el mapa muestra la posición del paciente y se ajusta para que se vean él y los lugares más cercanos.
6. Debajo del mapa, un carrusel de tarjetas muestra primero la clínica ECE-FIAD y después los demás lugares, del más cercano al más lejano. Cada tarjeta indica tipo, si atiende urgencias, distancia y dirección.
7. Al deslizar el carrusel o tocar un marcador, el mapa se centra en ese lugar.
8. "Cómo llegar" abre la aplicación de mapas del teléfono con la ruta hacia el lugar elegido.
9. "Llamar" abre el marcador telefónico; solo aparece si el lugar tiene teléfono registrado.
10. Los filtros "Todas", "Hospitales" y "Clínicas" limitan el carrusel y los marcadores.

## Validaciones

- La distancia se muestra en metros por debajo de 1 km y en kilómetros con un decimal a partir de 1 km.
- La distancia solo se muestra si se conoce la ubicación del paciente.
- Se descartan elementos de OpenStreetMap sin nombre, sin coordenadas, repetidos o que no son lugares de atención (por ejemplo estacionamientos).

## Estados de la pantalla

| Estado | Qué ve el paciente |
|--------|--------------------|
| Obteniendo ubicación | Mapa centrado en la clínica e indicador "Buscando tu ubicación" |
| Buscando lugares | Tarjeta "Buscando hospitales y clínicas cercanas…" al final del carrusel |
| Con ubicación | Su posición, los lugares ordenados por cercanía y la distancia en cada tarjeta |
| Sin permiso | Lugares alrededor de la clínica, sin distancia, y "Activa tu ubicación para ver qué tan lejos estás" |
| Sin lugares cercanos | Solo la clínica ECE-FIAD y "No encontramos otros hospitales en 8 km" |

## Casos de error

- Permiso negado: la pantalla funciona sin la posición del paciente; "Cómo llegar" sigue disponible.
- El GPS no responde en 10 segundos: se muestra el estado sin permiso con el mensaje "No se pudo obtener tu ubicación".
- OpenStreetMap no responde en 12 segundos (o está saturado): se prueba un segundo servidor y, si tampoco responde, se muestran los hospitales y clínicas reales de Ensenada guardados en la app.

## Resultado esperado

El paciente ve dónde están la clínica y los hospitales reales cercanos respecto a él y puede iniciar la ruta o llamar con un toque.

## Criterios de aceptación

- [ ] El mapa muestra el marcador de la clínica ECE-FIAD con su nombre.
- [ ] El mapa muestra hospitales y clínicas reales cercanos con el nombre que tienen en OpenStreetMap.
- [ ] Con permiso, el mapa muestra la posición del paciente y los lugares más cercanos al mismo tiempo.
- [ ] A 500 m se lee "500 m"; a 2.4 km se lee "2.4 km".
- [ ] Con el permiso negado, la pantalla muestra los lugares, el mensaje y no muestra distancia.
- [ ] Al deslizar el carrusel, el mapa se centra en el lugar de la tarjeta visible.
- [ ] "Cómo llegar" abre la app de mapas del teléfono con destino al lugar elegido.
- [ ] "Llamar" abre el marcador con el número del lugar y no aparece si no tiene teléfono.
- [ ] Sin Internet para OpenStreetMap, aparecen los hospitales de respaldo de Ensenada.

## Decisiones

- La API no guarda datos de clínicas: la clínica ECE-FIAD se define en `src/config/clinica.ts`.
- Los lugares reales vienen de OpenStreetMap mediante la API pública Overpass (sin clave ni costo). Se consulta una sola vez por zona cada 10 minutos, porque Overpass limita las consultas por teléfono.
- La lista de respaldo (`CLINICAS_RESPALDO`) contiene lugares reales de Ensenada tomados de OpenStreetMap: Hospital General de Ensenada, IMSS HGZ No. 8, Hospital ISSSTECALI, Clínica Hospital ISSSTE, IMSS UMF No. 25, Cruz Roja y Centro de Salud Chapultepec.
- Los datos de OpenStreetMap se muestran con la atribución "© OpenStreetMap", como pide su licencia (ODbL).
- Ubicación con `expo-location`, solo mientras la app está abierta (nunca en segundo plano); mapa con `react-native-maps`; "Cómo llegar" y "Llamar" con `Linking`.
- "Cómo llegar" abre Google Maps en Android y Apple Maps en iOS. La distancia mostrada es en línea recta; la distancia por carretera la da la app de mapas.
- Los marcadores se dibujan con vistas, sin SVG, porque en Android los marcadores con SVG pueden quedar en blanco.
- En Expo Go el mapa funciona sin configuración. Una compilación propia para Android necesitará una clave de Google Maps (se agrega al configurar EAS).

## Tasks

- [x] Crear el tipo `Clinica` y `src/config/clinica.ts` con los datos de la clínica.
- [x] Crear `ubicacionService` (permiso, posición actual con tiempo límite).
- [x] Crear la función `calcularDistancia` y su formato.
- [x] Crear `enlacesService` para abrir la app de mapas y el marcador.
- [x] Crear el ViewModel `useClinicaViewModel`.
- [x] Crear `ClinicaScreen` con sus estados.
- [x] Crear `clinicasService` con la consulta a OpenStreetMap, segundo servidor, caché y lista de respaldo.
- [x] Mostrar los lugares en el mapa y en el carrusel, con filtros y selección sincronizada.
- [ ] Probar los criterios de aceptación en un teléfono real.
