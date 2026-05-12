import { Component, signal } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [InputComponent, ButtonComponent],
})
export class LoginComponent {
  protected email    = signal('');
  protected password = signal('');

  protected onSubmit(): void {
    console.log('Email:', this.email());
    console.log('Password:', this.password());
  }
}
