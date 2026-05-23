import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';
import { Status } from '../../interfaces/students/students.interface';

export interface MonitoringReason {
  id:          number;
  reason_name: string;
  is_active:   boolean;
}

export interface UpdateMonitoringDto {
  administrativeId: number;
  description:      string;
  statusId:         number;
}

export interface CreateMonitoringDto {
  studentId:        number;
  administrativeId: number;
  reasonId:         number;
  description:      string;
  statusId:         number;
  openingDate:      string;
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly http = inject(HttpClient);

  public async getMonitoringReasons(): Promise<ModelApiResponseDto<MonitoringReason[]>> {
    const url = `${environment.apiUrl}/Monitoring_Reasons`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<MonitoringReason[]>>(url)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al obtener las razones de seguimiento'
    }));
  }

  public async getStatuses(): Promise<ModelApiResponseDto<Status[]>> {
    const url = `${environment.apiUrl}/Status`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<Status[]>>(url)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al obtener los estados'
    }));
  }

  public async createMonitoring(dto: CreateMonitoringDto): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitorings`;
    const formData = new FormData();

    formData.append('Student_id',        dto.studentId.toString());
    formData.append('Administrative_id', dto.administrativeId.toString());
    formData.append('Reason_id',         dto.reasonId.toString());
    formData.append('Description',       dto.description);
    formData.append('Status_id',         dto.statusId.toString());
    formData.append('Opening_date',      dto.openingDate);

    return firstValueFrom(
      this.http.post<ModelApiResponseDto<null>>(url, formData)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al crear el seguimiento'
    }));
  }

  public async deleteMonitoring(id: number): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitorings/${id}`;

    return firstValueFrom(
      this.http.delete<ModelApiResponseDto<null>>(url)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al eliminar el seguimiento'
    }));
  }

  public async deleteComment(id: number): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitoring_Comments/${id}`;

    return firstValueFrom(
      this.http.delete<ModelApiResponseDto<null>>(url)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al eliminar el comentario'
    }));
  }

  public async updateComment(id: number, content: string): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitoring_Comments/${id}`;
    const formData = new FormData();
    formData.append('Content', content);

    return firstValueFrom(
      this.http.put<ModelApiResponseDto<null>>(url, formData)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al editar el comentario'
    }));
  }

  public async updateMonitoring(id: number, dto: UpdateMonitoringDto): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitorings/${id}`;
    const formData = new FormData();

    formData.append('Administrative_id', dto.administrativeId.toString());
    formData.append('Description',       dto.description);
    formData.append('Status_id',         dto.statusId.toString());

    return firstValueFrom(
      this.http.put<ModelApiResponseDto<null>>(url, formData)
    ).catch(e => ({
      success: false,
      data: null,
      message: e.error?.message || 'Error al actualizar el seguimiento'
    }));
  }
}
