import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

import { HomeComponent } from './pages/admin/home/home.component';
import { StudentListComponent } from './pages/admin/students/list/student-list.component';
import { StudentProfileComponent } from './pages/admin/students/profile/student-profile.component';
import { TrackingListComponent } from './pages/admin/tracking/list/tracking-list.component';
import { TrackingRegisterComponent } from './pages/admin/tracking/register/tracking-register.component';
import { TrackingHistoryComponent } from './pages/admin/tracking/history/tracking-history.component';
import { TrackingCloseComponent } from './pages/admin/tracking/close/tracking-close.component';
import { AttendanceComponent } from './pages/admin/attendance/attendance.component';
import { AlertsComponent } from './pages/admin/alerts/alerts.component';
import { ReportsComponent } from './pages/admin/reports/reports.component';
import { NotificationsComponent } from './pages/admin/notifications/notifications.component';
import { RolesComponent } from './pages/admin/settings/roles/roles.component';

import { MyProfileComponent } from './pages/student/my-profile/my-profile.component';
import { MyGradesComponent } from './pages/student/my-grades/my-grades.component';
import { MyTrackingComponent } from './pages/student/my-tracking/my-tracking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth — sin layout
  { path: 'login', component: LoginComponent },

  // Admin — con layout
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '',                      component: HomeComponent },
      { path: 'students',              component: StudentListComponent },
      { path: 'students/profile/:id',  component: StudentProfileComponent },
      { path: 'tracking',              component: TrackingListComponent },
      { path: 'tracking/register',     component: TrackingRegisterComponent },
      { path: 'tracking/history',      component: TrackingHistoryComponent },
      { path: 'tracking/close',        component: TrackingCloseComponent },
      { path: 'attendance',            component: AttendanceComponent },
      { path: 'alerts',                component: AlertsComponent },
      { path: 'reports',               component: ReportsComponent },
      { path: 'notifications',         component: NotificationsComponent },
      { path: 'settings/roles',        component: RolesComponent },
    ]
  },

  // Student — con layout
  {
    path: 'student',
    component: LayoutComponent,
    children: [
      { path: 'my-profile',  component: MyProfileComponent },
      { path: 'my-grades',   component: MyGradesComponent },
      { path: 'my-tracking', component: MyTrackingComponent },
    ]
  },
];
