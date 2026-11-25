import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonBadge,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { notificationsOutline, checkmarkCircleOutline, timeOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import { IncidenciasService } from '../../services/incidencias.service';
import type { Notificacion } from '../../models/incidencia.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonBadge,
  ],
})
export class NotificationsPage implements OnInit {
  notificaciones: Notificacion[] = [];
  cargando = true;

  constructor(
    private incidenciasService: IncidenciasService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {
    addIcons({
      notificationsOutline,
      checkmarkCircleOutline,
      timeOutline,
      chatboxEllipsesOutline,
    });
  }

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.incidenciasService.getNotificaciones().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.cargando = false;
          this.notificaciones = data;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.cargando = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
        });
      },
    });
  }

  marcarComoLeida(item: Notificacion) {
    if (!item.leida) {
      this.incidenciasService.marcarNotificacionLeida(item.id).subscribe({
        next: () => {
          item.leida = true;
        },
      });
    }
  }
}
