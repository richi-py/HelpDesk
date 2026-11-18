import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonText, IonInputPasswordToggle, IonLabel, IonImg, IonButton, IonCheckbox, IonIcon } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonLabel, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonText, IonInputPasswordToggle, IonImg, IonButton, IonCheckbox, IonIcon]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    addIcons({
     "lockClosedOutline": lockClosedOutline,
     "personOutline": personOutline
    })
  }

  pageHelp() {
    this.router.navigateByUrl('/tabs/tab1');
  }

}
