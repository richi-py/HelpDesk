export type RolUsuario = 'usuario' | 'tecnico' | 'admin';

export type TipoIncidencia = 'hardware' | 'software' | 'red' | 'otro';

export type UrgenciaIncidencia = 'baja' | 'media' | 'alta';

export type EstadoIncidencia = 'pendiente' | 'asignada' | 'en_proceso' | 'resuelta';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  area?: string;
  telefono?: string;
  avatar_url?: string;
  activo: boolean;
  created_at: string;
}

export interface ImagenIncidencia {
  url: string;
  public_id?: string;
  subida_por_id: string;
  tipo: 'reporte' | 'solucion';
  created_at: string;
}

export interface HistorialIncidencia {
  estado: 'creada' | EstadoIncidencia;
  por_id: string;
  por_nombre: string;
  por_rol: string;
  fecha: string;
}

export interface ComentarioIncidencia {
  autor_id: string;
  autor_nombre: string;
  autor_rol: RolUsuario;
  mensaje: string;
  created_at: string;
}

export interface Incidencia {
  id: string;
  codigo: string;
  usuario_id: string;
  usuario_nombre: string;
  tecnico_id?: string | null;
  tecnico_nombre?: string | null;
  tipo: TipoIncidencia;
  urgencia: UrgenciaIncidencia;
  estado: EstadoIncidencia;
  titulo: string;
  descripcion: string;
  solucion?: string | null;
  imagenes: ImagenIncidencia[];
  historial: HistorialIncidencia[];
  comentarios: ComentarioIncidencia[];
  created_at: string;
  assigned_at?: string | null;
  started_at?: string | null;
  resolved_at?: string | null;
  updated_at: string;
}

export interface ResumenDashboard {
  pendientes: number;
  asignadas: number;
  en_proceso: number;
  resueltas: number;
}

export interface Notificacion {
  id: string;
  usuario_id: string;
  incidencia_id?: string;
  codigo?: string;
  mensaje: string;
  tipo: 'cambio_estado' | 'comentario' | 'resuelta' | 'soporte';
  leida: boolean;
  created_at: string;
}

export interface NuevaIncidenciaDTO {
  titulo: string;
  descripcion: string;
  tipo: TipoIncidencia;
  urgencia: UrgenciaIncidencia;
}
