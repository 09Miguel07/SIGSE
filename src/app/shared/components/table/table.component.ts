import { Component, input, output, computed } from '@angular/core';
import {
  TableColumn,
  TableAction,
  TableActionEvent,
  PageDirection,
} from '../../../interfaces/table/table.interface';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [ButtonComponent],
})
export class TableComponent<T extends Record<string, unknown>> {
  columns      = input.required<TableColumn[]>();
  data         = input.required<T[]>();
  actions      = input<TableAction<T>[]>([]);
  currentPage  = input<number>(1);
  totalPages   = input<number>(1);

  pageChange     = output<PageDirection>();
  actionClicked  = output<TableActionEvent<T>>();

  protected hasActions = computed(() => this.actions().length > 0);
  protected prevDisabled = computed(() => this.currentPage() <= 1);
  protected nextDisabled = computed(() => this.currentPage() >= this.totalPages());

  protected getLabel(action: TableAction<T>, row: T): string {
    return typeof action.label === 'function' ? action.label(row) : action.label;
  }

  protected onAction(action: string, row: T): void {
    this.actionClicked.emit({ action, row });
  }

  protected onPage(direction: PageDirection): void {
    this.pageChange.emit(direction);
  }
}
