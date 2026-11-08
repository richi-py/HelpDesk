import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonLabel, IonItem, IonToggle, IonList, IonCol, IonAvatar, IonRow, IonGrid, IonButtons, IonInput, IonButton } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, personOutline, settingsOutline, notificationsOutline, logOutOutline, close} from 'ionicons/icons';
import { IonModal } from '@ionic/angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, IonLabel, IonItem, IonToggle, IonList, IonCol, IonAvatar, IonRow, 
    IonGrid, IonModal, IonButtons, IonInput, IonButton],
})
export class Tab3Page {
  constructor(private router: Router) {
    addIcons({ chevronForwardOutline, personOutline, settingsOutline, notificationsOutline, logOutOutline, close });
  }

  pageLogin() {
    this.router.navigateByUrl('/login');
  }

  pageNotifications() {
    this.router.navigateByUrl('/notifications');
  }
}
