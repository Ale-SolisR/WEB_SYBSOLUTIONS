export interface Usuario {
  Id: number;
  Username: string;
  PasswordHash: string;
  Nombre: string;
  Email: string;
  CreatedAt: Date;
  Activo: boolean;
  IdEmpresa: number | null;
  RequiereCambioPassword: boolean;
}

export interface Video {
  Id: number;
  Titulo: string;
  Descripcion: string;
  YoutubeUrl: string;
  YoutubeId: string;
  Categoria: string;
  Activo: boolean;
  Orden: number;
  CreadoEn: string;
}

export interface Cliente {
  Id: number;
  Nombre: string;
  LogoUrl: string;
  Activo: boolean;
  Orden: number;
}

export interface MiembroEquipo {
  Id: number;
  Nombre: string;
  Cargo: string;
  Descripcion: string;
  FotoUrl: string;
  LinkedIn: string;
  Activo: boolean;
  Orden: number;
}

export interface Configuracion {
  whatsapp: string;
  email: string;
  direccion: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export type Theme =
  | "blue"
  | "dark"
  | "light"
  | "red"
  | "orange"
  | "christmas"
  | "valentine"
  | "easter";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
