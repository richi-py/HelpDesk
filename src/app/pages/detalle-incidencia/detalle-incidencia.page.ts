import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonBadge, IonButton 
} from '@ionic/angular';

@Component({
  selector: 'app-detalle-incidencia',
  templateUrl: './detalle-incidencia.page.html',
  styleUrls: ['./detalle-incidencia.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons,IonBadge, IonButton
  ],
})
export class DetalleIncidenciaPage implements OnInit {

  // Objeto para almacenar la información recibida
  incidencia: any;

  constructor(private router: Router) {
    // Captura los datos pasados desde el Router en la pantalla principal
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.incidencia = navigation.extras.state['incidencia'];
    }
  }

  ngOnInit() {
    // Si el usuario recarga la vista y se pierde el estado, redirige al menú principal
  }

Ver_Historial() {

  console.log('Incidencia seleccionada:', this.incidencia);

  this.router.navigate(['/historial-incidencia'], {
    state: {
      incidencia: this.incidencia
    }
  });

}
}
