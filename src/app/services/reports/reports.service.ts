import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';

export interface MonitoringStats {
  students_without_monitoring:      number;
  students_with_monitoring:         number;
  students_with_active_monitoring:  number;
  students_with_closed_monitoring:  number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly http = inject(HttpClient);

  public async getMonitoringStats(): Promise<ModelApiResponseDto<MonitoringStats>> {
    const url = `${environment.apiUrl}/Reports/students/monitoring-stats`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<MonitoringStats>>(url)
    ).catch(e => ({
      success: false,
      data:    null,
      message: e.error?.message || 'Error al obtener las estadísticas',
    }));
  }

  public async downloadActiveMonitoringExcel(): Promise<Blob | null> {
    const url = `${environment.apiUrl}/Reports/students/active-monitoring-excel`;

    return firstValueFrom(
      this.http.get(url, { responseType: 'blob' })
    ).catch(() => null);
  }
}
