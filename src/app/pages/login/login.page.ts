import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonText, IonInputPasswordToggle, IonLabel, IonImg, IonButton } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonLabel, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonText, IonInputPasswordToggle, IonImg, IonButton]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  pageHelp() {
    this.router.navigateByUrl('/tabs/tab1');
  }

}
