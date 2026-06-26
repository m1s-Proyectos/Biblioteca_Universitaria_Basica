import { LibrosPanel } from "@/components/features/libros/libros-panel";

export default function LibrosPage() {
  return (
    <LibrosPanel
      mode="manage"
      title="Gestion de libros"
      description="Administra el catalogo bibliografico: crear, editar, buscar y desactivar titulos."
    />
  );
}
