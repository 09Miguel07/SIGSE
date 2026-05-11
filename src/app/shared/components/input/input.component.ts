import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent implements OnInit {
  label = input<string>('');
  placeholder = input<string>('');
  defaultValue = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);

  valueChange = output<string>();

  protected value = signal<string>('');

  protected isDisabled = computed(() => this.disabled());

  ngOnInit(): void {
    this.value.set(this.defaultValue());
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.valueChange.emit(target.value);
  }
}
