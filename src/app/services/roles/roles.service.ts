import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';

export interface RoleDto {
  id:        number;
  role:      string;
  is_active: boolean;
}

export interface CreateRoleDto {
  role:      string;
  is_active: boolean;
}

export interface UpdateRoleDto {
  id:        number;
  role:      string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);

  public async getRoles(): Promise<ModelApiResponseDto<RoleDto[]>> {
    return firstValueFrom(
      this.http.get<ModelApiResponseDto<RoleDto[]>>(`${environment.apiUrl}/roles`)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al obtener roles' }));
  }

  public async createRole(dto: CreateRoleDto): Promise<ModelApiResponseDto<RoleDto>> {
    const form = new FormData();
    form.append('role',      dto.role);
    form.append('is_active', String(dto.is_active));
    return firstValueFrom(
      this.http.post<ModelApiResponseDto<RoleDto>>(`${environment.apiUrl}/roles`, form)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al crear rol' }));
  }

  public async updateRole(id: number, dto: UpdateRoleDto): Promise<ModelApiResponseDto<RoleDto>> {
    const form = new FormData();
    form.append('id',        id.toString());
    form.append('role',      dto.role);
    form.append('is_active', String(dto.is_active));
    return firstValueFrom(
      this.http.put<ModelApiResponseDto<RoleDto>>(`${environment.apiUrl}/roles/${id}`, form)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al actualizar rol' }));
  }

  public async deleteRole(id: number): Promise<ModelApiResponseDto<null>> {
    return firstValueFrom(
      this.http.delete<ModelApiResponseDto<null>>(`${environment.apiUrl}/roles/${id}`)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al eliminar rol' }));
  }
}
