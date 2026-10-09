import { PantallaProvisional } from '@/components/PantallaProvisional';

/**
 * Pestaña Mis citas. Se reemplaza al implementar specs/features/F06-mis-citas-recordatorios.md.
 */
export default function MisCitasScreen() {
  return (
    <PantallaProvisional
      titulo="Mis citas"
      feature="F06"
      descripcion="Aquí se mostrarán tus próximas citas y se programarán sus recordatorios."
    />
  );
}
