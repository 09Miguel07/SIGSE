import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputType } from '../../../interfaces/input/input.interface';

@Component({
  selector: 'app-input',
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  public label = input<string>('');
  public type = input<InputType>('text');
  public placeholder = input<string>('');
  public defaultValue = input<string>('');
  public disabled = input<boolean>(false);
  public readonly = input<boolean>(false);

  public valueChange = output<string>();

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
