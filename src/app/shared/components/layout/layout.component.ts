import { Component, HostListener, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthStore } from '../../../store/auth.store';

export interface NavItem {
  label: string;
  route: string;
  exact?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Home',                  route: '/admin',          exact: true },
  { label: 'Todos los estudiantes', route: '/admin/students'              },
  { label: 'Usuarios',              route: '/admin/users'                 },
  { label: 'Roles',                 route: '/admin/roles'                 },
  { label: 'Reportes',              route: '/admin/reports'               },
];

const STUDENT_NAV: NavItem[] = [
  { label: 'Mi Perfil',      route: '/student/my-profile', exact: true },
  { label: 'Mis Notas',      route: '/student/my-grades'               },
  { label: 'Mi Seguimiento', route: '/student/my-tracking'             },
];

const MOBILE_BP = 768;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [RouterOutlet, SidebarComponent],
})
export class LayoutComponent {
  private router    = inject(Router);
  private authStore = inject(AuthStore);

  sidebarOpen = signal(window.innerWidth > MOBILE_BP);

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth <= MOBILE_BP) {
      this.sidebarOpen.set(false);
    }
  }

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        // cierra el sidebar en mobile al navegar
        if (window.innerWidth <= MOBILE_BP) this.sidebarOpen.set(false);
        return (e as NavigationEnd).url;
      })
    ),
    { initialValue: this.router.url }
  );

  navItems = computed<NavItem[]>(() => {
    const url = this.currentUrl() ?? '';
    if (url.startsWith('/admin'))   return ADMIN_NAV;
    if (url.startsWith('/student')) return STUDENT_NAV;
    return [];
  });

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  onLogout(): void {
    this.authStore.clearUser();
    this.router.navigate(['/login']);
  }
}
