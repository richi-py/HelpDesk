import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IncidenciasService } from '../services/incidencias.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(IncidenciasService);
  const router = inject(Router);

  if (service.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
