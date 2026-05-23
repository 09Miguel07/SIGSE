import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../../services/reports/reports.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  imports: [CommonModule],
})
export class ReportsComponent {
  public isDownloading = signal<boolean>(false);

  private readonly reportsService = inject(ReportsService);
  private readonly toast          = inject(ToastService);

  public async downloadActiveMonitoring(): Promise<void> {
    this.isDownloading.set(true);
    const blob = await this.reportsService.downloadActiveMonitoringExcel();
    this.isDownloading.set(false);

    if (!blob) {
      this.toast.show('¡Error!', 'No se pudo descargar el reporte', 'error');
      return;
    }

    const url      = URL.createObjectURL(blob);
    const anchor   = document.createElement('a');
    anchor.href    = url;
    anchor.download = 'Reporte_Estudiantes.xlsx';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
