import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonBadge,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonModal,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline, timeOutline, checkmarkCircleOutline, closeOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-incidencia',
  templateUrl: './detalle-incidencia.page.html',
  styleUrls: ['./detalle-incidencia.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButtons,
    IonBadge,
    IonButton,
    IonIcon,
    IonModal,
  ],
})
export class DetalleIncidenciaPage implements OnInit {
  incidencia: any;

  // Estado del visor de fotos interno
  fotoModalAbierta: boolean = false;
  fotoSeleccionadaUrl: string = '';
  fotoSeleccionadaTipo: string = '';

  constructor(private router: Router) {
    addIcons({ imageOutline, timeOutline, checkmarkCircleOutline, closeOutline, searchOutline });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['incidencia']) {
      this.incidencia = navigation.extras.state['incidencia'];
    } else if (history.state?.incidencia) {
      this.incidencia = history.state.incidencia;
    }
  }

  ngOnInit() {
    if (!this.incidencia) {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  verFotoCompleta(url: string, tipo: string = 'evidencia') {
    this.fotoSeleccionadaUrl = url;
    this.fotoSeleccionadaTipo = tipo;
    this.fotoModalAbierta = true;
  }

  cerrarFotoModal() {
    this.fotoModalAbierta = false;
  }

  onImgError(event: any) {
    event.target.src = 'assets/icon/reporte.png';
  }

  Ver_Historial() {
    this.router.navigate(['/historial-incidencia'], {
      state: {
        incidencia: this.incidencia,
      },
    });
  }
}
