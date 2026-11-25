import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonToggle,
  IonList,
  IonCol,
  IonAvatar,
  IonRow,
  IonGrid,
  IonButtons,
  IonInput,
  IonButton,
  IonModal,
  IonBadge,
  AlertController,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  personOutline,
  settingsOutline,
  notificationsOutline,
  logOutOutline,
  close,
  closeOutline,
  businessOutline,
  callOutline,
  mailOutline,
  fingerPrintOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { IncidenciasService } from '../services/incidencias.service';
import type { ResumenDashboard, Usuario } from '../models/incidencia.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonLabel,
    IonItem,
    IonToggle,
    IonList,
    IonCol,
    IonAvatar,
    IonRow,
    IonGrid,
    IonModal,
    IonButtons,
    IonButton,
    IonBadge,
  ],
})
export class Tab3Page implements OnInit {
  usuario: Usuario | null = null;
  paletteToggle = document.body.classList.contains('dark');
  modalDatosAbierto: boolean = false;

  // Datos de estadísticas de Atlas para la gráfica
  datosGrafica = [
    { etiqueta: 'Pendientes', valor: 0, claseColor: 'bar-amarillo' },
    { etiqueta: 'En proceso', valor: 0, claseColor: 'bar-azul' },
    { etiqueta: 'Resueltas', valor: 0, claseColor: 'bar-verde' },
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private incidenciasService: IncidenciasService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {
    addIcons({
      chevronForwardOutline,
      personOutline,
      settingsOutline,
      notificationsOutline,
      logOutOutline,
      close,
      closeOutline,
      businessOutline,
      callOutline,
      mailOutline,
      fingerPrintOutline,
      shieldCheckmarkOutline,
      checkmarkCircleOutline,
    });
  }

  abrirModalDatos(abrir: boolean) {
    this.modalDatosAbierto = abrir;
    if (abrir) {
      this.cargarDatosUsuario();
    }
  }

  ngOnInit() {
    this.paletteToggle = document.body.classList.contains('dark');
    this.incidenciasService.usuarioActual$.subscribe((usr) => {
      this.usuario = usr;
      this.cargarDatosUsuario();
    });
  }

  ionViewWillEnter() {
    this.paletteToggle = document.body.classList.contains('dark');
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.usuario = this.incidenciasService.getUsuarioActual();
    
    // Cargar métricas cacheadas para que la gráfica aparezca instantáneamente sin delay
    if (this.usuario?.id) {
      const cacheMetricas = localStorage.getItem(`helpdesk_metricas_${this.usuario.id}`);
      if (cacheMetricas) {
        try {
          this.datosGrafica = JSON.parse(cacheMetricas);
        } catch {}
      }
    }

    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.appRef.tick();

    // Cargar perfil actualizado
    this.incidenciasService.getPerfil().subscribe({
      next: (u) => {
        this.ngZone.run(() => {
          if (u) {
            this.usuario = u;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
            this.appRef.tick();
          }
        });
      },
      error: () => {},
    });

    // Cargar resumen de métricas para la gráfica
    this.incidenciasService.getResumen().subscribe({
      next: (res: ResumenDashboard) => {
        this.ngZone.run(() => {
          this.datosGrafica = [
            { etiqueta: 'Pendientes', valor: res.pendientes || 0, claseColor: 'bar-amarillo' },
            { etiqueta: 'En proceso', valor: (res.en_proceso || 0) + (res.asignadas || 0), claseColor: 'bar-azul' },
            { etiqueta: 'Resueltas', valor: res.resueltas || 0, claseColor: 'bar-verde' },
          ];
          if (this.usuario?.id) {
            localStorage.setItem(`helpdesk_metricas_${this.usuario.id}`, JSON.stringify(this.datosGrafica));
          }
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
        });
      },
      error: () => {},
    });
  }

  toggleChange(event: any) {
    const isDark = event.detail.checked;
    this.toggleDarkPalette(isDark);
    localStorage.setItem('darkMode', String(isDark));
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.incidenciasService.logout();
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }

  pageNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  calcularAltura(valor: number): number {
    const maxValor = Math.max(...this.datosGrafica.map((d) => d.valor), 1);
    return (valor / maxValor) * 72;
  }
}
