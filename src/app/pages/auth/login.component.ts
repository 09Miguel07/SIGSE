import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { AuthService } from '../../services/auth/auth.service';
import { AuthStore } from '../../store/auth.store';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [InputComponent, ButtonComponent, LoaderComponent],
})
export class LoginComponent {
  protected email     = signal('');
  protected password  = signal('');
  protected isLoading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly authStore   = inject(AuthStore);
  private readonly router      = inject(Router);
  private readonly toast       = inject(ToastService);

  protected async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if(!this.email() || !this.password()) {
      this.toast.show('¡Error!', 'Por favor, ingresa tu correo electrónico y contraseña', 'error');
      return;
    }

    this.isLoading.set(true);

    const response = await this.authService.login(this.email(), this.password());

    this.isLoading.set(false);


    if (!response.success || !response.data) {
      let messageError: string;

      if (response.message.toLowerCase() === 'invalid credentials') {
        messageError = 'Correo electrónico o contraseña incorrectos';
      } else {
        messageError = response.message || 'Ocurrió un error durante el inicio de sesión';
      }

      this.toast.show('¡Error!', messageError, 'error');
      return;
    }

    this.authStore.setUser(response.data);

    if (response.data.userType === 'administrative') {
      this.router.navigate(['/admin']);
    } else if (response.data.userType === 'student') {
      this.router.navigate(['/student/my-profile']);
    } else {
      this.authStore.clearUser();
      this.toast.show('¡Error!', 'Tipo de usuario no reconocido', 'error');
    }
  }
}
