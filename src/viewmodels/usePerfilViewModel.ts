import { useEffect, useState } from 'react';

import { API_URL, usarApi } from '@/config/api';
import { useSesion } from '@/context/SesionContext';
import { obtenerPorId as obtenerDoctor } from '@/services/doctoresService';
import { obtenerPorId as obtenerPaciente } from '@/services/pacientesService';
import { cancelarTodos } from '@/services/recordatoriosService';
import { borrarSesion } from '@/services/sesionStorage';
import { formatearFechaCompleta } from '@/utils/fechas';
import { calcularEdad, textoGrupoSanguineo } from '@/utils/pacientes';

/** Un dato del expediente que se muestra en Perfil. */
export interface DatoPerfil {
  clave: 'especialidad' | 'horario' | 'telefono' | 'nacimiento' | 'sangre' | 'documento' | 'direccion';
  titulo: string;
  valor: string;
}

/**
 * ViewModel de la pestaña Perfil, compartida por médico y paciente.
 * Muestra los datos del expediente (GET /api/Doctores/{id} o GET /api/Pacientes/{id}).
 * Al cerrar sesión, el layout raíz retira las rutas protegidas y regresa a Login
 * (specs/01-navigation.md, regla 2). Antes se borra la sesión guardada (F01) y, si es paciente,
 * se eliminan sus recordatorios (F06).
 */
export function usePerfilViewModel() {
  const { sesion, cerrarSesion } = useSesion();
  const esMedico = sesion?.rol === 'medico';
  const [datos, setDatos] = useState<DatoPerfil[] | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        if (sesion?.rol === 'medico' && sesion.idDoctor) {
          const respuesta = await obtenerDoctor(sesion.idDoctor);
          const d = respuesta.datos;
          if (activo && d) {
            setDatos([
              { clave: 'especialidad', titulo: 'Especialidad', valor: d.nombreEspecialidad },
              { clave: 'horario', titulo: 'Horario de atención', valor: d.horarioAtencion || 'Sin registrar' },
              { clave: 'telefono', titulo: 'Teléfono', valor: d.telefono || 'Sin registrar' },
            ]);
          }
        } else if (sesion?.rol === 'paciente' && sesion.idPaciente) {
          const respuesta = await obtenerPaciente(sesion.idPaciente);
          const p = respuesta.datos;
          if (activo && p) {
            setDatos([
              {
                clave: 'nacimiento',
                titulo: 'Fecha de nacimiento',
                valor: `${formatearFechaCompleta(new Date(p.fechaNacimiento))} (${calcularEdad(p.fechaNacimiento)} años)`,
              },
              { clave: 'sangre', titulo: 'Grupo sanguíneo', valor: textoGrupoSanguineo(p.grupoSanguineo) },
              { clave: 'documento', titulo: 'Documento', valor: p.numeroDocumento },
              { clave: 'telefono', titulo: 'Teléfono', valor: p.telefono || 'Sin registrar' },
            ]);
          }
        }
      } catch {
        // Sin conexión: Perfil sigue mostrando la cuenta y permite cerrar sesión
      } finally {
        if (activo) setDatos((actuales) => actuales ?? []);
      }
    })();
    return () => {
      activo = false;
    };
  }, [sesion?.rol, sesion?.idDoctor, sesion?.idPaciente]);

  async function salir() {
    await borrarSesion();
    if (sesion?.rol === 'paciente') {
      await cancelarTodos().catch(() => {});
    }
    cerrarSesion();
  }

  return {
    nombre: sesion?.nombre ?? '',
    correo: sesion?.correo ?? '',
    esMedico,
    rolTexto: esMedico ? 'Médico' : 'Paciente',
    datos,
    biometriaActiva: !!sesion?.biometriaActiva,
    origenDatos: usarApi ? API_URL.replace(/^https?:\/\//, '') : 'Datos de ejemplo',
    cerrarSesion: salir,
  };
}
