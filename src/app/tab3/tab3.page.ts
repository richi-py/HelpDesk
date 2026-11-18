import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonLabel, IonItem, IonToggle, IonList, IonCol, IonAvatar, IonRow, IonGrid, IonButtons, IonInput, IonButton } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, personOutline, settingsOutline, notificationsOutline, logOutOutline, close } from 'ionicons/icons';
import { IonModal } from '@ionic/angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, IonLabel, IonItem, IonToggle, IonList, IonCol, IonAvatar, IonRow,
    IonGrid, IonModal, IonButtons, IonInput, IonButton],
})
export class Tab3Page implements OnInit{
  constructor(private router: Router) {
    addIcons({ chevronForwardOutline, personOutline, settingsOutline, notificationsOutline, logOutOutline, close });
  }
  // Modo Oscuro
  paletteToggle = document.body.classList.contains('dark');

  ngOnInit() {
    this.paletteToggle = document.body.classList.contains('dark');
  }

  ionViewWillEnter() {
    this.paletteToggle = document.body.classList.contains('dark');
  }

  toggleChange(event: any) {
    const isDark = event.detail.checked;
    this.toggleDarkPalette(isDark);
    localStorage.setItem('darkMode', String(isDark));
  }
  toggleDarkPalette(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  pageLogin() {
    this.router.navigateByUrl('/login');
  }
  pageNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  // Para las Graficas
  datosGrafica = [
    { etiqueta: 'Pendientes', valor: 8, claseColor: 'bar-amarillo' },
    { etiqueta: 'En proceso', valor: 6, claseColor: 'bar-azul' },
    { etiqueta: 'Resueltas', valor: 14, claseColor: 'bar-verde' },
    { etiqueta: 'Canceladas', valor: 2, claseColor: 'bar-rojo' },
  ];
  calcularAltura(valor: number): number {
    const maxValor = Math.max(...this.datosGrafica.map(d => d.valor), 1);
    return (valor / maxValor) * 72;
  }
  usuario = true
}
