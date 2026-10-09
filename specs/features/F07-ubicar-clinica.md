# Feature F07: Ubicar la clínica en el mapa

## Objetivo

Que el paciente sepa dónde está la clínica y cómo llegar, sin tener que llamar para pedir indicaciones.

## Actor

Paciente.

## Precondiciones

- El paciente inició sesión (F01).

## Datos de entrada

- Ubicación de la clínica: nombre, dirección, teléfono y coordenadas (configuradas en la app).
- Ubicación actual del teléfono, si el paciente da permiso.

## Flujo principal

1. El paciente entra a la pestaña Clínica.
2. La primera vez, el sistema solicita el permiso de ubicación.
3. El sistema muestra un mapa con un marcador en la clínica.
4. Si hay permiso, el sistema muestra también la posición del paciente y ajusta el mapa para que se vean ambos puntos.
5. Debajo del mapa se muestran nombre, dirección, teléfono y la distancia aproximada a la clínica.
6. "Cómo llegar" abre la aplicación de mapas del teléfono con la ruta hacia la clínica.
7. "Llamar" abre el marcador telefónico con el número de la clínica.

## Validaciones

- La distancia se muestra en metros por debajo de 1 km y en kilómetros con un decimal a partir de 1 km.
- La distancia solo se muestra si se conoce la ubicación del paciente.

## Estados de la pantalla

| Estado | Qué ve el paciente |
|--------|--------------------|
| Obteniendo ubicación | Mapa centrado en la clínica e indicador "Buscando tu ubicación" |
| Con ubicación | Ambos puntos en el mapa y la distancia |
| Sin permiso | Mapa con la clínica, sin distancia, y "Activa tu ubicación para ver qué tan lejos estás" |

## Casos de error

- Permiso negado: la pantalla funciona sin la posición del paciente; "Cómo llegar" sigue disponible.
- El GPS no responde en 10 segundos: se muestra el estado sin permiso con el mensaje "No se pudo obtener tu ubicación".

## Resultado esperado

El paciente ve dónde está la clínica respecto a él y puede iniciar la ruta o llamar con un toque.

## Criterios de aceptación

- [ ] El mapa muestra el marcador de la clínica con su nombre.
- [ ] Con permiso, el mapa muestra la posición del paciente y la clínica al mismo tiempo.
- [ ] A 500 m se lee "500 m"; a 2.4 km se lee "2.4 km".
- [ ] Con el permiso negado, la pantalla muestra la clínica, el mensaje y no muestra distancia.
- [ ] "Cómo llegar" abre la app de mapas del teléfono con destino a la clínica.
- [ ] "Llamar" abre el marcador con el número de la clínica.

## Decisiones

- Las coordenadas de la clínica se definen en un archivo de configuración de la app, porque la API no guarda datos de la clínica.
- Ubicación con `expo-location`; mapa con `react-native-maps`; "Cómo llegar" y "Llamar" con `Linking`.

## Tasks

- [ ] Crear `src/config/clinica.ts` con los datos de la clínica.
- [ ] Crear `ubicacionService` (permiso, posición actual con tiempo límite).
- [ ] Crear la función `calcularDistancia` y su formato.
- [ ] Crear el ViewModel `useClinicaViewModel`.
- [ ] Crear `ClinicaScreen` con sus estados.
- [ ] Probar los criterios de aceptación en un teléfono real.
