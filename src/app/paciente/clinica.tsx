import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Pestaña Clínica. Se reemplaza al implementar specs/features/F07-ubicar-clinica.md.
 */
export default function ClinicaScreen() {
  return (
    <PantallaProvisional
      titulo="Clínica"
      feature="F07"
      descripcion="Aquí se mostrará el mapa con la ubicación de la clínica y la distancia desde donde estás."
    />
  );
}
