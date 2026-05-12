import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';

export interface NavItem {
  label: string;
  route: string;
  exact?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Home',               route: '/admin',                   exact: true },
  { label: 'Gestión de Estudiantes',  route: '/admin/students',         },
  { label: 'Seguimiento Estudiantil', route: '/admin/tracking',         },
  { label: 'Registro de Asistencia',  route: '/admin/attendance',       },
  { label: 'Alertas Académicas',      route: '/admin/alerts',           },
  { label: 'Reportes',                route: '/admin/reports',          },
  { label: 'Notificaciones',          route: '/admin/notifications',    },
  { label: 'Configuración',           route: '/admin/settings/roles',   },
];

const STUDENT_NAV: NavItem[] = [
  { label: 'Mi Perfil',       route: '/student/my-profile',    exact: true },
  { label: 'Mis Notas',       route: '/student/my-grades',     },
  { label: 'Mi Seguimiento',  route: '/student/my-tracking',   },
];

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [RouterOutlet, SidebarComponent]
})
export class LayoutComponent {
  private router = inject(Router);

  sidebarOpen = signal(true);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).url)
    ),
    { initialValue: this.router.url }
  );

  navItems = computed<NavItem[]>(() => {
    const url = this.currentUrl() ?? '';
    if (url.startsWith('/admin'))   return ADMIN_NAV;
    if (url.startsWith('/student')) return STUDENT_NAV;
    return [];
  });

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
