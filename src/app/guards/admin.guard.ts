import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router    = inject(Router);

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const type = authStore.userType();

  if (type === 'student') {
    return router.createUrlTree(['/student/my-profile']);
  }

  // UserType null o desconocido → limpiar sesión y volver a login
  if (type !== 'administrative') {
    authStore.clearUser();
    return router.createUrlTree(['/login']);
  }

  return true;
};
