import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  },
  {
    path: 'crear-incidencia',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/crear-incidencia/crear-incidencia.page').then( m => m.CrearIncidenciaPage)
  },
  {
    path: 'detalle-incidencia',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detalle-incidencia/detalle-incidencia.page').then( m => m.DetalleIncidenciaPage)
  },
  {
    path: 'historial-incidencia',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/historial-incidencia/historial-incidencia.page').then( m => m.HistorialIncidenciaPage)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notifications/notifications.page').then( m => m.NotificationsPage)
  },
];
