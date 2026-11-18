import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { notifications, checkmark } from 'ionicons/icons';
import {IonButtons, IonContent, IonHeader,IonTitle, IonToolbar,IonBackButton,IonIcon} from '@ionic/angular';

@Component({
  selector: 'app-historial-incidencia',
  templateUrl: './historial-incidencia.page.html',
  styleUrls: ['./historial-incidencia.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons, IonIcon
  ],
})
export class HistorialIncidenciaPage implements OnInit {

  incidencia: any;

  historial: any[] = [];

  solucion: string = '';

  constructor(private router: Router) {

    addIcons({ notifications, checkmark });

    // Recibir la incidencia seleccionada
    this.incidencia = this.router.getCurrentNavigation()?.extras.state?.['incidencia']
      || history.state.incidencia;

  }

  ngOnInit() {

    if (!this.incidencia) {
      return;
    }

    // Obtener el estado actual de la incidencia
    const estado = String(this.incidencia.status || '')
      .toLowerCase()
      .trim();

    // La incidencia siempre comienza como creada
    this.historial = [
      {
        titulo: 'Creada',
        tiempo: this.incidencia.time || 'Fecha de registro',
        autor: 'Adán Velasco (Usuario)',
        isCheck: false
      }
    ];

    // Si está asignada, agregar ese movimiento
    if (
      estado.includes('asignada') ||
      estado.includes('proceso') ||
      estado.includes('resuelt')
    ) {

      this.historial.push({
        titulo: 'Asignada',
        tiempo: 'Hace 3 h',
        autor: 'María González (Técnico)',
        isCheck: false
      });

    }

    // Si está en proceso, agregar ese movimiento
    if (
      estado.includes('proceso') ||
      estado.includes('resuelt')
    ) {

      this.historial.push({
        titulo: 'En proceso',
        tiempo: 'Hace 2 h',
        autor: 'Carlos López (Técnico)',
        isCheck: false
      });

    }

    // Si ya está resuelta, agregar el último movimiento
    if (estado.includes('resuelt')) {

      this.historial.push({
        titulo: 'Resuelta',
        tiempo: 'Hace 1 h',
        autor: 'Carlos López (Técnico)',
        isCheck: true
      });

      // Mostrar la solución registrada en los comentarios
      this.solucion = this.incidencia.comments || 
        'La incidencia fue resuelta correctamente.';

    } else {

      this.solucion = '';

    }
  }
}
