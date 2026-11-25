import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout, catchError, of } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonButtons,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  headsetOutline,
  notificationsOutline,
  personCircleOutline,
  documentTextOutline,
  timeOutline,
  checkmarkCircleOutline,
  addOutline,
  chatboxEllipsesOutline,
  personOutline,
  home,
  imageOutline,
  refreshOutline,
} from 'ionicons/icons';
import { IncidenciasService } from '../services/incidencias.service';
import type { Incidencia, Usuario } from '../models/incidencia.model';

export interface TicketDisplay {
  id: string;
  rawId: string;
  title: string;
  status: string;
  statusClass: string;
  time: string;
  description: string;
  type: string;
  urgency: string;
  comments: string;
  imagenes: any[];
  solucion?: string | null;
  historial?: any[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
  ],
})
export class Tab1Page implements OnInit {
  usuario: Usuario | null = null;
  cargando = true;
  recentTickets: TicketDisplay[] = [];

  stats = {
    total: 0,
    enProceso: 0,
    resueltas: 0,
    pendientes: 0,
  };

  constructor(
    private router: Router,
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {
    addIcons({
      'headset-outline': headsetOutline,
      'notifications-outline': notificationsOutline,
      'person-circle-outline': personCircleOutline,
      'document-text-outline': documentTextOutline,
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'add-outline': addOutline,
      'chatbox-ellipses-outline': chatboxEllipsesOutline,
      'person-outline': personOutline,
      home: home,
      'image-outline': imageOutline,
      'refresh-outline': refreshOutline,
    });
  }

  ngOnInit() {
    this.incidenciasService.usuarioActual$.subscribe((usr) => {
      this.usuario = usr;
      this.cargarDesdeCache();
      this.cargarDatos();
    });
  }

  ionViewWillEnter() {
    this.usuario = this.incidenciasService.getUsuarioActual();
    this.cargarDesdeCache();
    this.cargarDatos();
  }

  private cargarDesdeCache() {
    this.usuario = this.incidenciasService.getUsuarioActual();
    if (!this.usuario?.id) {
      this.recentTickets = [];
      this.stats = { total: 0, enProceso: 0, resueltas: 0, pendientes: 0 };
      this.cargando = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      this.appRef.tick();
      return;
    }

    const cacheKey = `helpdesk_ultimas_incidencias_${this.usuario.id}`;
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      try {
        const datos: TicketDisplay[] = JSON.parse(cache);
        if (datos && datos.length > 0) {
          this.recentTickets = datos;
          this.cargando = false;
          this.calcularEstadisticas(datos);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
          return;
        }
      } catch {}
    }
    // Si no hay cache para este usuario en particular, limpiar lista para no mostrar los de otra persona
    this.recentTickets = [];
    this.stats = { total: 0, enProceso: 0, resueltas: 0, pendientes: 0 };
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.appRef.tick();
  }

  cargarDatos(event?: any) {
    this.usuario = this.incidenciasService.getUsuarioActual();

    this.incidenciasService
      .getIncidencias()
      .pipe(
        timeout(6000),
        catchError((err) => {
          console.warn('Timeout o fallo al consultar HelpDesk:', err);
          return of([]);
        })
      )
      .subscribe({
        next: (incidencias: Incidencia[]) => {
          this.ngZone.run(() => {
            this.cargando = false;
            if (event) {
              event.target.complete();
            }

            if (incidencias && incidencias.length > 0) {
              this.recentTickets = incidencias.map((inc) => this.mapearTicket(inc));
              if (this.usuario?.id) {
                localStorage.setItem(
                  `helpdesk_ultimas_incidencias_${this.usuario.id}`,
                  JSON.stringify(this.recentTickets)
                );
              }
              this.calcularEstadisticas(this.recentTickets);
            } else {
              this.recentTickets = [];
              this.stats = { total: 0, enProceso: 0, resueltas: 0, pendientes: 0 };
              if (this.usuario?.id) {
                localStorage.removeItem(`helpdesk_ultimas_incidencias_${this.usuario.id}`);
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

  private calcularEstadisticas(tickets: TicketDisplay[]) {
    this.stats.total = tickets.length;
    this.stats.enProceso = tickets.filter(
      (i) => i.status === 'En proceso' || i.status === 'Asignada'
    ).length;
    this.stats.resueltas = tickets.filter(
      (i) => i.status === 'Resuelto'
    ).length;
    this.stats.pendientes = tickets.filter(
      (i) => i.status === 'Pendiente'
    ).length;
  }

  private mapearTicket(inc: Incidencia): TicketDisplay {
    const estadoMap: Record<string, { texto: string; clase: string }> = {
      pendiente: { texto: 'Pendiente', clase: 'primary' },
      asignada: { texto: 'Asignada', clase: 'tertiary' },
      en_proceso: { texto: 'En proceso', clase: 'warning' },
      resuelta: { texto: 'Resuelto', clase: 'success' },
    };

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
        (inc.comentarios && inc.comentarios.length > 0
          ? inc.comentarios[inc.comentarios.length - 1].mensaje
          : 'Aún no hay comentarios.'),
      imagenes: inc.imagenes || [],
      solucion: inc.solucion,
      historial: inc.historial || [],
    };
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

  Registrar_Incidencia() {
    this.router.navigate(['/crear-incidencia']);
  }

  verTodas() {
    this.router.navigate(['/tabs/tab2']);
  }

  verDetalle(incidencia: TicketDisplay) {
    this.router.navigate(['/detalle-incidencia'], {
      state: { incidencia },
    });
  }

  irPerfil() {
    this.router.navigate(['/tabs/tab3']);
  }

  irNotificaciones() {
    this.router.navigate(['/notifications']);
  }
}
