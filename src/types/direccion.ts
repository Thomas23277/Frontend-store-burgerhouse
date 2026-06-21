export interface Direccion {
  id: number;
  usuario_id: number;
  alias: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  es_principal: boolean;
}

export interface DireccionCreate {
  alias: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  es_principal?: boolean;
}

export interface DireccionUpdate {
  alias?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  es_principal?: boolean;
}
