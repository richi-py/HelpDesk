import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  EstadoIncidencia,
  Incidencia,
  Notificacion,
  NuevaIncidenciaDTO,
  ResumenDashboard,
  Usuario,
} from '../models/incidencia.model';

export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class IncidenciasService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'helpdesk_token';
  private readonly usuarioKey = 'helpdesk_usuario';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioActual());
  public usuarioActual$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsuarioActual(): Usuario | null {
    const data = localStorage.getItem(this.usuarioKey);
    return data ? JSON.parse(data) : null;
  }

  limpiarCacheLocal(): void {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith('helpdesk_ultimas_incidencias') ||
        key.startsWith('helpdesk_metricas')
      ) {
        localStorage.removeItem(key);
      }
    });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { correo, password })
      .pipe(
        tap((res) => {
          this.limpiarCacheLocal();
          if (res.access_token) {
            localStorage.setItem(this.tokenKey, res.access_token);
          }
          if (res.usuario) {
            localStorage.setItem(this.usuarioKey, JSON.stringify(res.usuario));
            this.usuarioSubject.next(res.usuario);
          }
        })
      );
  }

  register(datos: {
    nombre: string;
    correo: string;
    password: string;
    rol?: string;
    area?: string;
    telefono?: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/register`, datos)
      .pipe(
        tap((res) => {
          this.limpiarCacheLocal();
          if (res.access_token) {
            localStorage.setItem(this.tokenKey, res.access_token);
          }
          if (res.usuario) {
            localStorage.setItem(this.usuarioKey, JSON.stringify(res.usuario));
            this.usuarioSubject.next(res.usuario);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.limpiarCacheLocal();
    this.usuarioSubject.next(null);
  }

  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/auth/perfil`, {
      headers: this.getAuthHeaders(),
    });
  }

  getResumen(): Observable<ResumenDashboard> {
    return this.http.get<ResumenDashboard>(`${this.apiUrl}/incidencias/resumen`, {
      headers: this.getAuthHeaders(),
    });
  }

  getIncidencias(estado?: EstadoIncidencia): Observable<Incidencia[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<Incidencia[]>(`${this.apiUrl}/incidencias`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  getIncidenciaPorId(id: string): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/incidencias/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  crearIncidencia(datos: NuevaIncidenciaDTO): Observable<Incidencia> {
    return this.http.post<Incidencia>(
      `${this.apiUrl}/incidencias`,
      datos,
      { headers: this.getAuthHeaders() }
    );
  }

  agregarComentario(id: string, mensaje: string): Observable<Incidencia> {
    return this.http.post<Incidencia>(
      `${this.apiUrl}/incidencias/${id}/comentarios`,
      { mensaje },
      { headers: this.getAuthHeaders() }
    );
  }

  subirImagen(
    id: string,
    archivo: File,
    tipo: 'reporte' | 'solucion' = 'reporte'
  ): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('tipo', tipo);

    return this.http.post<{ url: string }>(
      `${this.apiUrl}/incidencias/${id}/imagenes`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/notificaciones`, {
      headers: this.getAuthHeaders(),
    });
  }

  marcarNotificacionLeida(id: string): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(
      `${this.apiUrl}/notificaciones/${id}/leida`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Métodos de integración con Estructuras de Datos
  deshacerUltimoEstado(id: string): Observable<{ ok: boolean; estado_anterior_restaurado: string }> {
    return this.http.post<{ ok: boolean; estado_anterior_restaurado: string }>(
      `${this.apiUrl}/incidencias/${id}/deshacer`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getColaPrioridad(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/estructuras/cola-prioridad`, {
      headers: this.getAuthHeaders(),
    });
  }

  getMetricasEstructuras(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estructuras/metricas`, {
      headers: this.getAuthHeaders(),
    });
  }
}
