import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';
import { Calification, InformationOfOneStudent, Seguimiento, StudentsResponse } from '../../interfaces/students/students.interface';
import { firstValueFrom } from 'rxjs';

export interface PostCommentDto {
  monitoringId: number;
  userId:       number;
  content:      string;
  date:         string;
}

@Injectable({providedIn: 'root'})
export class StudentService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl =  `${environment.apiUrl}/Students`;

  public async getAllStudents(
    page: number,
    search = ''
  ): Promise<ModelApiResponseDto<StudentsResponse>> {

    let url = `${this.baseUrl}?page=${page}`;

    if (search.trim().length >= 2) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<StudentsResponse>>(url)
    ).catch(e => {
      return {
        success: false,
        data: null,
        message: e.error?.message || 'Error al obtener los estudiantes'
      }
    });
  }

  public async getStudentById(id: string): Promise<ModelApiResponseDto<InformationOfOneStudent>> {
    const url = `${this.baseUrl}/${id}`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<InformationOfOneStudent>>(url)
    ).catch(e => {
      return {
        success: false,
        data: null,
        message: e.error?.message || 'Error al obtener el estudiante'
      }
    });
  }

  public async getStudentSeguimientos(id: string): Promise<ModelApiResponseDto<Seguimiento[]>> {
    const url = `${this.baseUrl}/${id}/monitorings`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<Seguimiento[]>>(url)
    ).catch(e => {
      return {
        success: false,
        data: null,
        message: e.error?.message || 'Error al obtener los seguimientos'
      }
    });
  }

  public async postMonitoringComment(dto: PostCommentDto): Promise<ModelApiResponseDto<null>> {
    const url = `${environment.apiUrl}/Monitoring_Comments`;
    const formData = new FormData();

    formData.append('Monitoring_id', dto.monitoringId.toString());
    formData.append('User_id',       dto.userId.toString());
    formData.append('Content',       dto.content);
    formData.append('Date',          dto.date);

    return firstValueFrom(
      this.http.post<ModelApiResponseDto<null>>(url, formData)
    ).catch(e => {
      return {
        success: false,
        data: null,
        message: e.error?.message || 'Error al guardar el comentario'
      }
    });
  }

  public async getStudentCalifications(id: string): Promise<ModelApiResponseDto<Calification[]>> {
    const url = `${this.baseUrl}/${id}/califications`;

    return firstValueFrom(
      this.http.get<ModelApiResponseDto<Calification[]>>(url)
    ).catch(e => {
      return {
        success: false,
        data: null,
        message: e.error?.message || 'Error al obtener las calificaciones'
      }
    });
  }
}
