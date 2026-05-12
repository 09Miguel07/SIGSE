export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
}

export interface TableAction<T = unknown> {
  label: string | ((item: T) => string);
  type: 'primary' | 'secondary' | 'danger';
  action: string;
}

export interface TableActionEvent<T = unknown> {
  action: string;
  row: T;
}

export type PageDirection = 'prev' | 'next';
