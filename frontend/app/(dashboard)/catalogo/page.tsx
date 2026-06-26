import { LibrosPanel } from "@/components/features/libros/libros-panel";

export default function CatalogoPage() {
  return (
    <LibrosPanel
      mode="readonly"
      title="Catalogo bibliografico"
      description="Consulta los titulos disponibles en la biblioteca universitaria."
      defaultFilters={{ activo: true }}
    />
  );
}
