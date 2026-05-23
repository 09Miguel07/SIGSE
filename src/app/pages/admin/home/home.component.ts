import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersLoginResponse } from '../../../interfaces/users/users.interface';
import { MonitoringStats, ReportsService } from '../../../services/reports/reports.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, LoaderComponent],
})
export class HomeComponent implements OnInit {
  public currentUser  = signal<UsersLoginResponse | null>(null);
  public stats        = signal<MonitoringStats | null>(null);
  public isLoading    = signal<boolean>(false);

  private readonly authService    = inject(AuthService);
  private readonly reportsService = inject(ReportsService);

  public getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  public async ngOnInit(): Promise<void> {
    this.currentUser.set(this.authService.getCurrentUser());
    await this.loadStats();
  }

  private async loadStats(): Promise<void> {
    this.isLoading.set(true);
    const response = await this.reportsService.getMonitoringStats();
    this.isLoading.set(false);

    if (response.success && response.data) {
      this.stats.set(response.data);
    }
  }
}
