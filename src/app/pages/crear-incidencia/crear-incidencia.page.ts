import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonInput, IonTextarea, AlertController} from'@ionic/angular';
import { addIcons } from 'ionicons';
import {arrowBackOutline, cameraOutline, closeCircleOutline, laptopOutline, settingsOutline, wifiOutline} from 'ionicons/icons';

@Component({
  selector: 'app-crear-incidencia',
  templateUrl: './crear-incidencia.page.html',
  styleUrls: ['./crear-incidencia.page.scss'],
  standalone: true,
  imports: [IonContent,IonHeader, IonTitle,IonToolbar,IonButton, IonButtons,IonIcon,IonInput,IonTextarea, CommonModule, FormsModule],
})
export class CrearIncidenciaPage implements OnInit, OnDestroy {

  // Datos de la incidencia
  asunto = '';
  descripcion = '';

  // Tipo de incidencia
  tipoSeleccionado = 'Equipo';

  // Nivel de urgencia
  urgencia = 'Media';

  // Datos de la fotografía
  foto: File | null = null;
  fotoUrl: string | null = null;
  nombreFoto = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    // Registramos los iconos de Ionic
    addIcons({
      arrowBackOutline,
      cameraOutline,
      closeCircleOutline,
      laptopOutline,
      settingsOutline,
      wifiOutline
    });
  }

  ngOnInit() {}

  // Liberar recursos al destruir el componente para evitar memory leaks
  ngOnDestroy() {
    if (this.fotoUrl) {
      URL.revokeObjectURL(this.fotoUrl);
    }
  }

  // Regresar a la pantalla anterior
  Volver() {
    this.router.navigate(['/tabs/tab1']);
  }

  // Seleccionar tipo de incidencia
  SeleccionarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
  }

  // Seleccionar urgencia
  SeleccionarUrgencia(nivel: string) {
    this.urgencia = nivel;
  }

  // Adjuntar fotografía
  SeleccionarFoto(event: Event) {
    const archivo = (event.target as HTMLInputElement).files?.[0];

    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        return;
      }

      this.foto = archivo;
      this.nombreFoto = archivo.name;

      if (this.fotoUrl) {
        URL.revokeObjectURL(this.fotoUrl);
      }

      this.fotoUrl = URL.createObjectURL(archivo);
    }
  }

  // Eliminar fotografía
  EliminarFoto() {
    if (this.fotoUrl) {
      URL.revokeObjectURL(this.fotoUrl);
    }

    this.foto = null;
    this.fotoUrl = null;
    this.nombreFoto = '';
  }

  // Crear incidencia
  async CrearIncidencia() {
    if (this.asunto.trim() === '' || this.descripcion.trim() === '') {
      const alerta = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Completa el asunto y la descripción.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      return;
    }

    console.log('Asunto:', this.asunto);
    console.log('Tipo:', this.tipoSeleccionado);
    console.log('Descripción:', this.descripcion);
    console.log('Urgencia:', this.urgencia);
    console.log('Fotografía:', this.foto);

    const alerta = await this.alertController.create({
      header: 'Incidencia creada',
      message: 'Tu incidencia se registró correctamente.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.Volver();
        }
      }]
    });
    await alerta.present();
  }
}
