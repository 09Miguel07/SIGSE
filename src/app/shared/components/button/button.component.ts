import { Component, input, output, computed } from '@angular/core';
import { ButtonVariant, ButtonType } from '../../../interfaces/button/button.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label     = input<string>('');
  variant   = input<ButtonVariant>('primary');
  type      = input<ButtonType>('button');
  disabled  = input<boolean>(false);
  loading   = input<boolean>(false);
  fullWidth = input<boolean>(false);

  clicked = output<void>();

  protected isDisabled = computed(() => this.disabled() || this.loading());

  protected onClick(): void {
    if (this.isDisabled()) return;
    this.clicked.emit();
  }
}
