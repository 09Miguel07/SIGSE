import { Component, input, output, computed, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableColumn,
  TableAction,
  TableActionEvent,
  PageDirection,
} from '../../../interfaces/table/table.interface';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from "../input/input.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [ButtonComponent, InputComponent],
})
export class TableComponent<T extends Record<string, unknown>> {
  // ── Tabla ──────────────────────────────────────────────────────────
  columns     = input.required<TableColumn[]>();
  data        = input.required<T[]>();
  actions     = input<TableAction<T>[]>([]);
  currentPage = input<number>(1);
  totalPages  = input<number>(1);

  pageChange    = output<PageDirection>();
  actionClicked = output<TableActionEvent<T>>();

  // ── Filtro ─────────────────────────────────────────────────────────
  showFilter        = input<boolean>(false);
  filterLabel       = input<string>('');
  filterPlaceholder = input<string>('');

  filterChange = output<string>();

  protected filterValue   = signal('');
  protected filterVisible = signal(true);   // controla la re-creación del app-input

  private readonly filterSubject = new Subject<string>();

  constructor() {
    // Espera 2 s sin cambios antes de emitir
    this.filterSubject.pipe(
      debounceTime(1000),
      takeUntilDestroyed(),
    ).subscribe(value => this.filterChange.emit(value));
  }

  // ── Computed ───────────────────────────────────────────────────────
  protected hasActions   = computed(() => this.actions().length > 0);
  protected prevDisabled = computed(() => this.currentPage() <= 1);
  protected nextDisabled = computed(() => this.currentPage() >= this.totalPages());

  // ── Métodos tabla ──────────────────────────────────────────────────
  protected getLabel(action: TableAction<T>, row: T): string {
    return typeof action.label === 'function' ? action.label(row) : action.label;
  }

  protected onAction(action: string, row: T): void {
    this.actionClicked.emit({ action, row });
  }

  protected onPage(direction: PageDirection): void {
    this.pageChange.emit(direction);
  }

  // ── Métodos filtro ─────────────────────────────────────────────────
  protected onFilterInput(value: string): void {
    this.filterValue.set(value);
    this.filterSubject.next(value);
  }

  protected onFilterReset(): void {
    this.filterValue.set('');
    this.filterChange.emit('');           // emite inmediatamente sin esperar debounce
    this.filterSubject.next('');          // cancela cualquier debounce pendiente
    // Re-crea el app-input para limpiar su estado interno
    this.filterVisible.set(false);
    setTimeout(() => this.filterVisible.set(true), 0);
  }
}
