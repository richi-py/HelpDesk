import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonLoading, IonSpinner } from '@ionic/angular';
import { Router } from '@angular/router';
import { IncidenciasService } from '../../services/incidencias.service';

@Component({
  selector: 'app-splash-desk',
  templateUrl: './splash-desk.page.html',
  styleUrls: ['./splash-desk.page.scss'],
  standalone: true,
  imports: [IonImg, IonContent, CommonModule, FormsModule, IonLoading, IonSpinner]
})
export class SplashDeskPage implements OnInit {

  isLoading = true;
  constructor(
    private router: Router,
    private incidenciasService: IncidenciasService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.incidenciasService.isAuthenticated()) {
        this.router.navigate(['/tabs/tab1']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 1500);
  }
}
