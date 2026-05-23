import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';

export interface UserDto {
  id:        number;
  names:     string;
  lastNames: string;
  email:     string;
  active:    boolean;
}

export interface UsersResponse {
  page:         number;
  pageSize:     number;
  totalRecords: number;
  totalPages:   number;
  users:        UserDto[];
}

export interface CreateUserDto {
  names:     string;
  lastNames: string;
  email:     string;
  password:  string;
  active:    boolean;
}

export interface UpdateUserDto {
  names:     string;
  lastNames: string;
  email:     string;
  active:    boolean;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password:     string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  public async getUsers(page = 1, email = ''): Promise<ModelApiResponseDto<UsersResponse>> {
    let url = `${environment.apiUrl}/users?page=${page}`;
    if (email.trim()) url += `&email=${encodeURIComponent(email.trim())}`;
    return firstValueFrom(
      this.http.get<ModelApiResponseDto<UsersResponse>>(url)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al obtener usuarios' }));
  }

  public async createUser(dto: CreateUserDto): Promise<ModelApiResponseDto<UserDto>> {
    const form = new FormData();
    form.append('names',     dto.names);
    form.append('lastNames', dto.lastNames);
    form.append('email',     dto.email);
    form.append('password',  dto.password);
    form.append('active',    String(dto.active));
    return firstValueFrom(
      this.http.post<ModelApiResponseDto<UserDto>>(`${environment.apiUrl}/users`, form)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al crear usuario' }));
  }

  public async updateUser(id: number, dto: UpdateUserDto): Promise<ModelApiResponseDto<UserDto>> {
    const form = new FormData();
    form.append('id',        id.toString());
    form.append('names',     dto.names);
    form.append('lastNames', dto.lastNames);
    form.append('email',     dto.email);
    form.append('active',    String(dto.active));
    return firstValueFrom(
      this.http.put<ModelApiResponseDto<UserDto>>(`${environment.apiUrl}/users/${id}`, form)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al actualizar usuario' }));
  }

  public async changePassword(id: number, dto: ChangePasswordDto): Promise<ModelApiResponseDto<null>> {
    const form = new FormData();
    form.append('current_password', dto.current_password);
    form.append('new_password',     dto.new_password);
    return firstValueFrom(
      this.http.post<ModelApiResponseDto<null>>(`${environment.apiUrl}/users/${id}/change-password`, form)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al cambiar contraseña' }));
  }

  public async deleteUser(id: number): Promise<ModelApiResponseDto<null>> {
    return firstValueFrom(
      this.http.delete<ModelApiResponseDto<null>>(`${environment.apiUrl}/users/${id}`)
    ).catch(e => ({ success: false, data: null, message: e.error?.message || 'Error al eliminar usuario' }));
  }
}
