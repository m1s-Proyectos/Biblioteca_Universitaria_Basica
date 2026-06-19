export type RolUsuario = "admin" | "bibliotecario" | "estudiante";

export type UsuarioProfile = {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  matricula: string | null;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
