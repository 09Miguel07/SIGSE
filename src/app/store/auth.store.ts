import { computed, Injectable, signal } from '@angular/core';
import { UsersLoginResponse } from '../interfaces/users/users.interface';

const STORAGE_KEY = 'sigse_user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<UsersLoginResponse | null>(this.loadFromStorage());

  readonly user          = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly userType        = computed(() => this._user()?.userType ?? null);

  setUser(user: UsersLoginResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
  }

  private loadFromStorage(): UsersLoginResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UsersLoginResponse) : null;
    } catch {
      return null;
    }
  }
}
