import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

// Evita que un usuario ya autenticado acceda al login
export const loginGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router    = inject(Router);

  if (!authStore.isAuthenticated()) return true;

  const type = authStore.userType();

  if (type === 'administrative') return router.createUrlTree(['/admin']);
  if (type === 'student')        return router.createUrlTree(['/student/my-profile']);

  // UserType inválido → limpiar y dejar en login
  authStore.clearUser();
  return true;
};
