import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonAvatar, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {headsetOutline, notificationsOutline, personCircleOutline, documentTextOutline, timeOutline, checkmarkCircleOutline, addOutline, chatboxEllipsesOutline, personOutline, home} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonAvatar, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge],})

export class Tab1Page {

  // Variable para comprobar si existen incidencias
  sihay = true;

  // Arreglo con la información completa de cada incidencia
  recentTickets = [
    {
      id: '#INC-001',
      title: 'Problema con computadora',
      status: 'En proceso',
      statusClass: 'warning',
      time: 'Hace 10 min',
      description: 'La computadora no enciende, no muestra imagen en el monitor.',
      type: 'Hardware',
      urgency: 'Media',
      comments: 'Aún no hay comentarios.'
    },
    {
      id: '#INC-002',
      title: 'Error de conexión a internet',
      status: 'Resuelto',
      statusClass: 'success',
      time: 'Hace 1 hora',
      description: 'No hay conexión a la red local ni a internet en la estación 4.',
      type: 'Redes',
      urgency: 'Alta',
      comments: 'Se solucionó reiniciando el switch del rack central.'
    },
    {
      id: '#INC-003',
      title: 'Problema con impresora',
      status: 'Pendiente',
      statusClass: 'primary',
      time: 'Hace 2 horas',
      description: 'La impresora marca error de atasco de papel en la bandeja 2.',
      type: 'Hardware',
      urgency: 'Baja',
      comments: 'Aún no hay comentarios.'
    }
  ];

  constructor(private router: Router) {
    // Registramos los iconos que se utilizan en la interfaz
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
      'home': home
    });
  }

  // Función para navegar a la página de registro de incidencias
  Registrar_Incidencia() {
    this.router.navigate(['/crear-incidencia']);
  }

  // Función para enviar los datos de la incidencia seleccionada a la pantalla de detalle
  verDetalle(incidencia: any) {
    this.router.navigate(['/detalle-incidencia'], {
      state: { incidencia }
    });
  }
}
