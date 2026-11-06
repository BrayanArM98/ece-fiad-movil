import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { CLINICA, RADIO_BUSQUEDA_METROS } from '@/config/clinica';
import type { Clinica, Coordenadas } from '@/models/Clinica';
import { buscarCercanas, type OrigenClinicas } from '@/services/clinicasService';
import { abrirRuta, llamar } from '@/services/enlacesService';
import { obtenerUbicacion } from '@/services/ubicacionService';
import { calcularDistancia, formatearDistancia } from '@/utils/distancia';

export type EstadoClinica = 'buscando' | 'conUbicacion' | 'sinPermiso' | 'sinSenal';
export type FiltroClinicas = 'todas' | 'hospital' | 'clinica';

export interface ClinicaConDistancia extends Clinica {
  /** Metros en línea recta desde el paciente; null si no se conoce su ubicación. */
  metros: number | null;
  distanciaTexto: string | null;
}

/**
 * ViewModel de la pestaña Clínica (specs/features/F07-ubicar-clinica.md).
 * La clínica ECE-FIAD siempre aparece primero; después, los hospitales y clínicas reales
 * de OpenStreetMap más cercanos al paciente (o a la clínica si no hay ubicación).
 */
export function useClinicaViewModel() {
  const [estado, setEstado] = useState<EstadoClinica>('buscando');
  const [posicion, setPosicion] = useState<Coordenadas | null>(null);
  const [cercanas, setCercanas] = useState<Clinica[]>([]);
  const [origen, setOrigen] = useState<OrigenClinicas | null>(null);
  const [buscandoClinicas, setBuscandoClinicas] = useState(true);
  const [filtro, setFiltro] = useState<FiltroClinicas>('todas');
  const [idSeleccionada, setIdSeleccionada] = useState(CLINICA.id);

  useEffect(() => {
    let activo = true;
    (async () => {
      const resultado = await obtenerUbicacion();
      if (!activo) return;
      const centro = resultado.estado === 'ok' ? resultado.coordenadas : CLINICA.coordenadas;
      if (resultado.estado === 'ok') {
        setPosicion(resultado.coordenadas);
        setEstado('conUbicacion');
      } else {
        setEstado(resultado.estado);
      }

      const encontradas = await buscarCercanas(centro, RADIO_BUSQUEDA_METROS);
      if (!activo) return;
      setCercanas(encontradas.clinicas);
      setOrigen(encontradas.origen);
      setBuscandoClinicas(false);
    })();
    return () => {
      activo = false;
    };
  }, []);

  function conDistancia(clinica: Clinica): ClinicaConDistancia {
    const metros = posicion ? calcularDistancia(posicion, clinica.coordenadas) : null;
    return { ...clinica, metros, distanciaTexto: metros === null ? null : formatearDistancia(metros) };
  }

  // Las más cercanas primero; sin ubicación, se ordenan por cercanía a la clínica ECE-FIAD
  const referencia = posicion ?? CLINICA.coordenadas;
  const reales = cercanas
    .filter((c) => filtro === 'todas' || c.tipo === filtro)
    .sort((a, b) => calcularDistancia(referencia, a.coordenadas) - calcularDistancia(referencia, b.coordenadas))
    .map(conDistancia);
  const lista: ClinicaConDistancia[] = [conDistancia(CLINICA), ...reales];
  const seleccionada = lista.find((c) => c.id === idSeleccionada) ?? lista[0];

  async function comoLlegar(clinica: Clinica = seleccionada) {
    const abierta = await abrirRuta(clinica.coordenadas, clinica.nombre);
    if (!abierta) Alert.alert('No se pudo abrir la app de mapas');
  }

  async function llamarA(clinica: Clinica = seleccionada) {
    if (!clinica.telefono) return;
    const abierta = await llamar(clinica.telefono);
    if (!abierta) Alert.alert('No se pudo abrir el marcador', `Llama al ${clinica.telefono}`);
  }

  return {
    estado,
    posicion,
    clinicas: lista,
    seleccionada,
    seleccionar: setIdSeleccionada,
    filtro,
    setFiltro,
    buscandoClinicas,
    origen,
    totalCercanas: cercanas.length,
    comoLlegar,
    llamar: llamarA,
  };
}
