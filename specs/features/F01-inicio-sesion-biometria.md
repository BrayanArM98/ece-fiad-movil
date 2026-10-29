# Feature F01: Iniciar sesión con biometría

## Objetivo

Proteger la información clínica que hay en el teléfono: nadie que tome el teléfono del médico o del paciente debe poder ver expedientes. El usuario se identifica una vez con su cuenta y después entra con su huella o su rostro, en un solo toque.

## Actor

Médico y paciente.

## Precondiciones

- El usuario tiene una cuenta de la clínica.
- Para entrar con biometría, el teléfono debe tener sensor biométrico y al menos una huella o rostro registrado.

## Datos de entrada

- Primer acceso: correo y contraseña.
- Accesos siguientes: huella o rostro.

## Flujo principal (primer acceso)

1. El usuario abre la app y ve la pantalla Login.
2. Captura correo y contraseña y presiona "Entrar".
3. El sistema valida las credenciales.
4. El sistema pregunta: "¿Quieres usar tu huella o rostro para entrar la próxima vez?".
5. Si acepta, el sistema solicita la biometría una vez para confirmar y la activa.
6. Si la biometría quedó activa, el sistema guarda la sesión en el almacenamiento seguro del teléfono. Si no, la sesión solo dura mientras la app está abierta.
7. El sistema lleva al usuario a la pestaña inicial de su rol: Agenda (médico) o Mis citas (paciente).

## Flujo principal (accesos siguientes)

1. El usuario abre la app y existe una sesión guardada con biometría activa.
2. El sistema muestra Login con el saludo "Hola de nuevo, {nombre}" y abre la solicitud de huella o rostro del teléfono.
3. Si la biometría es correcta, el sistema lleva al usuario a la pestaña inicial de su rol.

## Flujos alternos

- **Sin biometría disponible:** si el teléfono no tiene sensor o no hay huellas registradas, no se ofrece el paso 4 y el usuario entra siempre con correo y contraseña.
- **Usar contraseña:** en la solicitud biométrica, el botón "Usar contraseña" cierra la solicitud y deja el formulario de Login; el botón "Entrar con huella o rostro" permite volver a intentarlo.
- **Huellas eliminadas del teléfono:** si hay una sesión guardada pero el teléfono ya no tiene huellas ni rostro registrados, se borra la sesión guardada y se entra con contraseña.
- **Cerrar sesión:** desde Perfil, el usuario cierra sesión; se borra la sesión guardada y la app regresa a Login.

## Validaciones

- Correo con formato válido y contraseña no vacía; el botón "Entrar" permanece deshabilitado mientras falte alguno.
- La sesión se guarda solo en almacenamiento seguro, nunca en almacenamiento normal.

## Casos de error

- Credenciales incorrectas: "Correo o contraseña incorrectos" y los campos se conservan.
- Biometría fallida 3 veces, o el teléfono bloquea el sensor por demasiados intentos: "No se reconoció tu huella o rostro. Entra con tu correo y contraseña." y desaparece el botón de biometría.
- El usuario cancela la solicitud biométrica: se queda en Login sin error.
- Cuenta de médico sin `idDoctor` o de paciente sin `idPaciente`: "Tu cuenta no está vinculada a un expediente" y no se inicia sesión.

## Resultado esperado

El usuario entra a la zona de su rol, y en los siguientes accesos solo necesita su huella o rostro.

## Criterios de aceptación

- [ ] Con correo o contraseña vacíos, el botón "Entrar" está deshabilitado.
- [ ] Con credenciales incorrectas aparece "Correo o contraseña incorrectos".
- [ ] Con una cuenta de médico, después de entrar la primera pantalla es Agenda.
- [ ] Con una cuenta de paciente, después de entrar la primera pantalla es Mis citas.
- [ ] Al aceptar la biometría, al reabrir la app se pide huella o rostro en lugar de la contraseña.
- [ ] En un teléfono sin huellas registradas no se ofrece activar la biometría.
- [ ] Tres intentos biométricos fallidos llevan a Login.
- [ ] Después de cerrar sesión, el botón "atrás" no regresa a ninguna pantalla clínica.

## Decisiones

- La API todavía no tiene inicio de sesión. Mientras tanto, las credenciales se validan contra cuentas de ejemplo definidas en la app (una de médico y una de paciente). Al existir el endpoint, solo cambia el servicio de autenticación.
- Biometría con `expo-local-authentication`; sesión con `expo-secure-store`.
- La sesión solo se guarda si la biometría está activa. Sin biometría, guardar la sesión permitiría que cualquiera que abra la app entre sin identificarse, que es justo lo que esta feature evita.
- La alternativa a la huella es la contraseña de la cuenta, no el PIN del teléfono: el PIN suelen conocerlo otras personas.
- Dentro de la solicitud de huella, el propio sistema operativo deja reintentar. La app cuenta como intento fallido cada solicitud que termina sin reconocer al usuario; al tercero, o si el teléfono bloquea el sensor, pide la contraseña.

## Tasks

- [x] Crear el tipo `Sesion` en `src/models`.
- [x] Crear `authService` con las cuentas de ejemplo.
- [x] Crear `sesionStorage` sobre almacenamiento seguro (guardar, leer, borrar).
- [x] Crear `biometriaService` (disponibilidad y autenticación).
- [x] Crear el ViewModel `useLoginViewModel`.
- [x] Crear la pantalla `LoginScreen`.
- [x] Redirigir según el rol al iniciar la app.
- [x] Agregar "Cerrar sesión" en Perfil.
- [ ] Probar los criterios de aceptación en un teléfono real.
