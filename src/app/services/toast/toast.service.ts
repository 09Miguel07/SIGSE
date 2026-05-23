import { Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'success' | 'warning';

export interface ToastData {
  title: string;
  subtitle: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<ToastData | null>(null);

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(title: string, subtitle: string, type: ToastType, duration = 3000): void {
    if (this.timer) clearTimeout(this.timer);
    this.toast.set({ title, subtitle, type });
    this.timer = setTimeout(() => this.dismiss(), duration);
  }

  dismiss(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.toast.set(null);
  }
}
