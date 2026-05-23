import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsersLoginResponse } from '../../interfaces/users/users.interface';
import { firstValueFrom } from 'rxjs';
import { ModelApiResponseDto } from '../../interfaces/api/api-response.interface';
import { AuthStore } from '../../store/auth.store';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http      = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl    = `${environment.apiUrl}/Users`;

  public getCurrentUser(): UsersLoginResponse | null {
    return this.authStore.user();
  }

  public async login (email:string, password:string) : Promise<ModelApiResponseDto<UsersLoginResponse>> {
    const formData = new FormData();

    formData.append('Email', email);
    formData.append('Password', password);

    const url = `${this.apiUrl}/login`;

    return firstValueFrom(
      this.http.post<ModelApiResponseDto<UsersLoginResponse>>(url, formData)
    ).catch( e => {
      return {
        success: false,
        message: e.error?.message || 'An error occurred during login',
        data: null
      }
    })
  }



}
