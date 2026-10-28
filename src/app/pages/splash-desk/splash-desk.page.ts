import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonLoading, IonSpinner } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-splash-desk',
  templateUrl: './splash-desk.page.html',
  styleUrls: ['./splash-desk.page.scss'],
  standalone: true,
  imports: [IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonLoading, IonSpinner]
})
export class SplashDeskPage implements OnInit {

  isLoading = true;
  constructor(private router:Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  

}
