# Diseño "Marea"

**Estado:** En desarrollo

La app móvil usa la misma identidad que ECE-FIAD Web: paleta "Marea", Schibsted Grotesk para títulos y cifras, y Public Sans para el texto. Todo se construye con `StyleSheet` y componentes propios para que funcione en Expo Go sin compilar código nativo.

## Tokens

Definidos en `src/theme/colores.ts` y `src/theme/tema.ts`. Ninguna pantalla escribe colores ni tamaños de letra sueltos.

| Token | Valor | Uso |
|-------|-------|-----|
| `marea` | `#0E7490` | Acciones principales, pestaña activa |
| `mareaProfunda` | `#0B5568` | Degradados, encabezados de detalle |
| `mareaNoche` | `#082F3A` | Inicio del degradado de los encabezados |
| `mareaSuave` | `#E3EFF2` | Fondos de íconos, botones suaves |
| `tinta` | `#14262E` | Texto principal |
| `pizarra` | `#5B6B73` | Texto secundario |
| `papel` | `#F4F7F8` | Fondo de las pantallas |
| `linea` | `#D9E3E7` | Bordes y divisores |
| `coral` | `#C2412D` | Errores, hora actual, cuenta regresiva |

Estados de cita (mismos que la agenda web): Pendiente `#B7791F`, Confirmada `#0E7490`, Completada `#2F855A`, No asistió `#B83280`, Cancelada `#718096`.

Tipografía (`tipografia` en `tema.ts`): `display`, `titulo1`, `titulo2`, `titulo3`, `cuerpo`, `cuerpoFuerte`, `secundario`, `etiqueta`, `mayusculas` y `cifra`. Cada peso de fuente es una familia distinta, así que nunca se usa `fontWeight` con estas fuentes. Las fuentes se cargan en el layout raíz y la pantalla de bienvenida se mantiene hasta que están listas.

## Elementos de identidad

- **Encabezado Marea** (`EncabezadoMarea`): degradado de `mareaNoche` a `marea`, anillos concéntricos tipo sonar y tres olas que desembocan en el fondo de la pantalla. Lo usan las pantallas principales de cada pestaña.
- **Tarjeta montada**: la primera tarjeta de Agenda y Mis citas se sube sobre las olas del encabezado.
- **Logotipo**: cruz médica cuya barra horizontal es una ola.
- **Barra de pestañas flotante** (`BarraPestanas`): cápsula blanca sobre el contenido; la pestaña activa se expande con su nombre. Las listas dejan `ALTO_BARRA_PESTANAS` de margen inferior.

## Componentes

En `src/components/ui/`: `Texto`, `Presionable` (resorte al presionar y vibración ligera), `Tarjeta`, `Avatar` (iniciales con un tono fijo por persona), `Campo`, `Esqueleto`, `AnilloProgreso`, `Pulso`, `TituloSeccion`, `Marea` (encabezado, olas, anillos, logotipo) y `BarraPestanas`.

En `src/components/`: `Boton` (variantes primario, secundario, suave, claro, fantasma y peligro), `EtiquetaEstadoCita`, `EstadosPantalla` (cargando y mensaje con ilustración), `TarjetaCita` (línea de tiempo), `TarjetaSiguienteCita`, `TarjetaCitaPaciente`, `FilaPaciente` y `VistaPerfil`.

## Pantallas

| Pantalla | Diseño |
|----------|--------|
| Login | Héroe con degradado, anillos, logotipo y olas; formulario en blanco con campos con ícono; botón circular de huella cuando hay sesión guardada; accesos a las cuentas de demostración que llenan el correo. |
| Agenda (médico) | Saludo según la hora, tarjeta de avance del día (anillo y cifras), tarjeta "Siguiente paciente" con cuenta regresiva en vivo, línea de tiempo con marca coral de la hora actual y las canceladas al final. |
| Pacientes (médico) | Encabezado con buscador que ignora acentos; filas con avatar, edad, documento y grupo sanguíneo. |
| Mis citas (paciente) | Saludo, tarjeta de la próxima cita estilo boleto (calendario, hora, cuenta regresiva, doctor, motivo y "Cómo llegar"), aviso de recordatorios y lista "Más adelante". |
| Clínica (paciente) | Mapa a pantalla completa con marcador propio y tarjeta flotante con distancia, dirección y acciones. |
| Perfil | Avatar grande, tipo de cuenta, estado de la biometría, servidor y cerrar sesión. |

## Movimiento

- Las secciones entran con `FadeInDown` escalonado (Reanimated).
- Botones y tarjetas se encogen con un resorte al presionarlos; en el teléfono vibran levemente.
- Los esqueletos laten mientras llegan los datos en lugar de mostrar un indicador de carga a pantalla completa.
- La cuenta regresiva y la marca de la hora actual se actualizan cada 30 segundos.

## Accesibilidad

- Áreas táctiles de al menos 44 puntos.
- Pestañas con rol `tab` y estado seleccionado; tarjetas tocables con etiqueta que resume su contenido.
- El estado de una cita nunca depende solo del color: siempre lleva texto.

## Dependencias

Todas vienen incluidas en Expo Go SDK 58: `react-native-svg`, `expo-linear-gradient`, `expo-haptics`, `react-native-reanimated`, `@expo-google-fonts/public-sans`, `@expo-google-fonts/schibsted-grotesk` y `lucide-react-native` (los mismos íconos que la web).

## Tareas

- [x] Tokens, fuentes y componentes base.
- [x] Login, Agenda, Pacientes, Mis citas, Clínica y Perfil.
- [ ] Detalle de cita, Historial y Nueva evolución.
- [ ] Inicio de sesión real con la API.
