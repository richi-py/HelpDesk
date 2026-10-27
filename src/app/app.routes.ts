import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-desk',
    pathMatch: 'full'
  },
  {
    path: 'splash-desk',
    loadComponent: () => import('./pages/splash-desk/splash-desk.page').then( m => m.SplashDeskPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];
