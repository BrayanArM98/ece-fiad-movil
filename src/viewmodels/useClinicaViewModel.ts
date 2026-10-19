import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { CLINICA } from '@/config/clinica';
import type { Coordenadas } from '@/models/Clinica';
import { abrirRuta, llamar } from '@/services/enlacesService';
import { obtenerUbicacion } from '@/services/ubicacionService';
import { calcularDistancia, formatearDistancia } from '@/utils/distancia';

export type EstadoClinica = 'buscando' | 'conUbicacion' | 'sinPermiso' | 'sinSenal';

/**
 * ViewModel de la pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * La clínica siempre se muestra; la posición del paciente y la distancia solo si hay ubicación.
 */
export function useClinicaViewModel() {
  const [estado, setEstado] = useState<EstadoClinica>('buscando');
  const [posicion, setPosicion] = useState<Coordenadas | null>(null);

  useEffect(() => {
    let activo = true;

    obtenerUbicacion().then((resultado) => {
      if (!activo) return;
      if (resultado.estado === 'ok') {
        setPosicion(resultado.coordenadas);
        setEstado('conUbicacion');
      } else {
        setEstado(resultado.estado);
      }
    });

    return () => {
      activo = false;
    };
  }, []);

  const distancia = posicion ? formatearDistancia(calcularDistancia(posicion, CLINICA.coordenadas)) : null;

  async function comoLlegar() {
    const abierta = await abrirRuta(CLINICA.coordenadas);
    if (!abierta) Alert.alert('No se pudo abrir la app de mapas');
  }

  async function llamarClinica() {
    const abierta = await llamar(CLINICA.telefono);
    if (!abierta) Alert.alert('No se pudo abrir el marcador', `Llama al ${CLINICA.telefono}`);
  }

  return { clinica: CLINICA, estado, posicion, distancia, comoLlegar, llamarClinica };
}
