import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Direkt localStorage prüfen statt nur Signal
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  authState.clearAuth();
  router.navigate(['/login']);
  return false;
};
