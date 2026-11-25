import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout, catchError, of } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonBadge,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { imageOutline, timeOutline, searchOutline } from 'ionicons/icons';
import { IncidenciasService } from '../services/incidencias.service';
import type { Incidencia } from '../models/incidencia.model';
import type { TicketDisplay } from '../tab1/tab1.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonBadge,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
  ],
})
export class Tab2Page implements OnInit {
  incidencias: TicketDisplay[] = [];
  textoBusqueda = '';
  filtroEstado = 'todas';
  cargando = true;

  constructor(
    private router: Router,
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {
    addIcons({ imageOutline, timeOutline, searchOutline });
  }

  ngOnInit() {
    this.incidenciasService.usuarioActual$.subscribe(() => {
      this.cargarDesdeCache();
      this.cargarIncidencias();
    });
  }

  ionViewWillEnter() {
    this.cargarDesdeCache();
    this.cargarIncidencias();
  }

  private cargarDesdeCache() {
    const usuario = this.incidenciasService.getUsuarioActual();
    if (!usuario?.id) {
      this.incidencias = [];
      this.cargando = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      this.appRef.tick();
      return;
    }

    const cacheKey = `helpdesk_ultimas_incidencias_${usuario.id}`;
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      try {
        const datos: TicketDisplay[] = JSON.parse(cache);
        if (datos && datos.length > 0) {
          this.incidencias = datos;
          this.cargando = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
          return;
        }
      } catch {}
    }
    this.incidencias = [];
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.appRef.tick();
  }

  cargarIncidencias(event?: any) {
    const usuario = this.incidenciasService.getUsuarioActual();

    this.incidenciasService
      .getIncidencias()
      .pipe(
        timeout(6000),
        catchError((err) => {
          console.warn('Timeout en tab2:', err);
          return of([]);
        })
      )
      .subscribe({
        next: (data: Incidencia[]) => {
          this.ngZone.run(() => {
            this.cargando = false;
            if (event) {
              event.target.complete();
            }

            if (data && data.length > 0) {
              const estadoMap: Record<string, { texto: string; clase: string }> = {
                pendiente: { texto: 'Pendiente', clase: 'primary' },
                asignada: { texto: 'Asignada', clase: 'tertiary' },
                en_proceso: { texto: 'En proceso', clase: 'warning' },
                resuelta: { texto: 'Resuelto', clase: 'success' },
              };

              this.incidencias = data.map((inc) => {
                const estadoInfo = estadoMap[inc.estado] || {
                  texto: inc.estado || 'Pendiente',
                  clase: 'primary',
                };

                return {
                  id: inc.codigo ? `#${inc.codigo}` : `#${inc.id.substring(0, 6)}`,
                  rawId: inc.id,
                  title: inc.titulo,
                  status: estadoInfo.texto,
                  statusClass: estadoInfo.clase,
                  time: this.formatearFechaRelativa(inc.created_at),
                  description: inc.descripcion,
                  type: inc.tipo || 'Soporte',
                  urgency: inc.urgencia || 'Media',
                  comments:
                    inc.solucion ||
                    (inc.comentarios?.length
                      ? inc.comentarios[inc.comentarios.length - 1].mensaje
                      : 'Aún no hay comentarios.'),
                  imagenes: inc.imagenes || [],
                  solucion: inc.solucion,
                  historial: inc.historial || [],
                };
              });

              if (usuario?.id) {
                localStorage.setItem(
                  `helpdesk_ultimas_incidencias_${usuario.id}`,
                  JSON.stringify(this.incidencias)
                );
              }
            } else {
              this.incidencias = [];
              if (usuario?.id) {
                localStorage.removeItem(`helpdesk_ultimas_incidencias_${usuario.id}`);
              }
            }
            this.cdr.markForCheck();
            this.cdr.detectChanges();
            this.appRef.tick();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.cargando = false;
            if (event) {
              event.target.complete();
            }
            this.cdr.markForCheck();
            this.cdr.detectChanges();
            this.appRef.tick();
          });
        },
      });
  }

  get incidenciasFiltradas(): TicketDisplay[] {
    let filtradas = this.incidencias;

    if (this.filtroEstado !== 'todas') {
      const mapeoFiltro: Record<string, string> = {
        pendiente: 'Pendiente',
        en_proceso: 'En proceso',
        resuelta: 'Resuelto',
      };
      const estadoBuscado = mapeoFiltro[this.filtroEstado];
      if (estadoBuscado) {
        filtradas = filtradas.filter((item) => item.status === estadoBuscado);
      }
    }

    if (this.textoBusqueda.trim()) {
      const q = this.textoBusqueda.toLowerCase().trim();
      filtradas = filtradas.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return filtradas;
  }

  private formatearFechaRelativa(fechaIso?: string): string {
    if (!fechaIso) return 'Reciente';
    try {
      const fecha = new Date(fechaIso);
      const ahora = new Date();
      const difSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

      if (difSegundos < 60) return 'Hace unos momentos';
      const minutos = Math.floor(difSegundos / 60);
      if (minutos < 60) return `Hace ${minutos} min`;
      const horas = Math.floor(minutos / 60);
      if (horas < 24) return `Hace ${horas} h`;
      const dias = Math.floor(horas / 24);
      return `Hace ${dias} día(s)`;
    } catch {
      return 'Reciente';
    }
  }

  verDetalle(incidencia: TicketDisplay) {
    this.router.navigate(['/detalle-incidencia'], {
      state: { incidencia },
    });
  }
}
