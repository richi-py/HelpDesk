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
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  },
  {
    path: 'crear-incidencia',
    loadComponent: () => import('./pages/crear-incidencia/crear-incidencia.page').then( m => m.CrearIncidenciaPage)
  },
  {
    path: 'detalle-incidencia',
    loadComponent: () => import('./pages/detalle-incidencia/detalle-incidencia.page').then( m => m.DetalleIncidenciaPage)
  },
  {
    path: 'historial-incidencia',
    loadComponent: () => import('./pages/historial-incidencia/historial-incidencia.page').then( m => m.HistorialIncidenciaPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then( m => m.NotificationsPage)
  },

];
