import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { studentGuard } from './guards/student.guard';

import { HomeComponent } from './pages/admin/home/home.component';
import { StudentListComponent } from './pages/admin/students/list/student-list.component';
import { StudentProfileComponent } from './pages/admin/students/profile/student-profile.component';
import { StudentNotasComponent } from './pages/admin/students/notas/student-notas.component';
import { StudentSeguimientoComponent } from './pages/admin/students/seguimiento/student-seguimiento.component';
import { ReportsComponent } from './pages/admin/reports/reports.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { RolesComponent } from './pages/admin/roles/roles.component';

import { MyProfileComponent } from './pages/student/my-profile/my-profile.component';
import { MyGradesComponent } from './pages/student/my-grades/my-grades.component';
import { MyTrackingComponent } from './pages/student/my-tracking/my-tracking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth — sin layout
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },

  // Admin — con layout
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '',                                        component: HomeComponent },
      { path: 'students',                                component: StudentListComponent },
      { path: 'students/profile/:id',                    component: StudentProfileComponent },
      { path: 'students/profile/:id/notas',              component: StudentNotasComponent },
      { path: 'students/profile/:id/seguimiento',        component: StudentSeguimientoComponent },
      { path: 'reports',                                 component: ReportsComponent },
      { path: 'users',                                   component: UsersComponent },
      { path: 'roles',                                   component: RolesComponent },
    ]
  },

  // Student — con layout
  {
    path: 'student',
    component: LayoutComponent,
    canActivate: [studentGuard],
    children: [
      { path: 'my-profile',  component: MyProfileComponent },
      { path: 'my-grades',   component: MyGradesComponent },
      { path: 'my-tracking', component: MyTrackingComponent },
    ]
  },

  // Cualquier ruta desconocida → login
  { path: '**', redirectTo: 'login' },
];
