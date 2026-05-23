import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto, UsersService } from '../../../services/users/users.service';
import { ToastService } from '../../../services/toast/toast.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PageDirection, TableAction, TableActionEvent, TableColumn } from '../../../interfaces/table/table.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [CommonModule, FormsModule, LoaderComponent, TableComponent],
})
export class UsersComponent implements OnInit {
  public users        = signal<UserDto[]>([]);
  public isLoading    = signal(false);
  public isSaving     = signal(false);
  public currentPage  = signal(1);
  public totalPages   = signal(1);
  public searchEmail  = signal('');

  // ── Tabla ──────────────────────────────────────────────────
  public readonly tableColumns: TableColumn[] = [
    { key: 'names',     label: 'Nombres',           minWidth: '130px' },
    { key: 'lastNames', label: 'Apellidos',          minWidth: '130px' },
    { key: 'email',     label: 'Correo electrónico', minWidth: '200px' },
    { key: 'estado',    label: 'Estado',             width: '90px'     },
  ];

  public readonly tableActions: TableAction<Record<string, unknown>>[] = [
    { action: 'edit', label: 'Editar',     type: 'primary'   },
    { action: 'pwd',  label: 'Contraseña', type: 'secondary' },
  ];

  public readonly tableData = computed(() =>
    this.users().map(u => ({
      id:        u.id,
      names:     u.names,
      lastNames: u.lastNames,
      email:     u.email,
      estado:    u.active ? 'Activo' : 'Inactivo',
    }))
  );

  // ── Crear usuario ──────────────────────────────────────────
  public showCreateModal  = signal(false);
  public createNames      = signal('');
  public createLastNames  = signal('');
  public createEmail      = signal('');
  public createPassword   = signal('');
  public createActive     = signal(true);
  public createNamesErr   = signal('');
  public createLastErr    = signal('');
  public createEmailErr   = signal('');
  public createPassErr    = signal('');

  // ── Editar usuario ─────────────────────────────────────────
  public editUser       = signal<UserDto | null>(null);
  public editNames      = signal('');
  public editLastNames  = signal('');
  public editEmail      = signal('');
  public editActive     = signal(true);
  public editNamesErr   = signal('');
  public editLastErr    = signal('');
  public editEmailErr   = signal('');

  // ── Cambiar contraseña ─────────────────────────────────────
  public pwdUser       = signal<UserDto | null>(null);
  public currentPwd    = signal('');
  public newPwd        = signal('');
  public confirmPwd    = signal('');
  public currentPwdErr = signal('');
  public newPwdErr     = signal('');
  public confirmPwdErr = signal('');

  private readonly usersService = inject(UsersService);
  private readonly toast        = inject(ToastService);

  public async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.usersService.getUsers(this.currentPage(), this.searchEmail());
      if (res.success && res.data) {
        this.users.set(res.data.users);
        this.totalPages.set(res.data.totalPages);
      } else {
        this.toast.show('¡Error!', res.message || 'No se pudieron cargar los usuarios', 'error');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  // ── Filtro por correo ──────────────────────────────────────
  public async onFilterChange(email: string): Promise<void> {
    this.searchEmail.set(email.trim());
    this.currentPage.set(1);
    await this.loadUsers();
  }

  // ── Paginación ─────────────────────────────────────────────
  public async onPageChange(direction: PageDirection): Promise<void> {
    if (direction === 'next') this.currentPage.update(p => p + 1);
    if (direction === 'prev') this.currentPage.update(p => p - 1);
    await this.loadUsers();
  }

  // ── Acciones de la tabla ───────────────────────────────────
  public onAction(event: TableActionEvent<Record<string, unknown>>): void {
    const user = this.users().find(u => u.id === event.row['id']);
    if (!user) return;
    if (event.action === 'edit') this.openEditModal(user);
    if (event.action === 'pwd')  this.openPwdModal(user);
  }

  // ── Crear ──────────────────────────────────────────────────
  public openCreateModal(): void {
    this.createNames.set('');     this.createLastNames.set('');
    this.createEmail.set('');     this.createPassword.set('');
    this.createActive.set(true);
    this.createNamesErr.set('');  this.createLastErr.set('');
    this.createEmailErr.set('');  this.createPassErr.set('');
    this.showCreateModal.set(true);
  }

  public closeCreateModal(): void { this.showCreateModal.set(false); }

  public async submitCreate(): Promise<void> {
    let valid = true;
    if (!this.createNames().trim())     { this.createNamesErr.set('Campo requerido'); valid = false; }
    else this.createNamesErr.set('');
    if (!this.createLastNames().trim()) { this.createLastErr.set('Campo requerido');  valid = false; }
    else this.createLastErr.set('');
    if (!this.createEmail().trim())     { this.createEmailErr.set('Campo requerido'); valid = false; }
    else this.createEmailErr.set('');
    if (!this.createPassword().trim())  { this.createPassErr.set('Campo requerido');  valid = false; }
    else this.createPassErr.set('');
    if (!valid) return;

    this.isSaving.set(true);
    const res = await this.usersService.createUser({
      names: this.createNames().trim(), lastNames: this.createLastNames().trim(),
      email: this.createEmail().trim(), password: this.createPassword().trim(),
      active: this.createActive(),
    });
    this.isSaving.set(false);

    if (!res.success) { this.toast.show('¡Error!', res.message || 'No se pudo crear el usuario', 'error'); return; }
    this.toast.show('¡Éxito!', 'Usuario creado correctamente', 'success');
    this.closeCreateModal();
    await this.loadUsers();
  }

  // ── Editar ─────────────────────────────────────────────────
  public openEditModal(user: UserDto): void {
    this.editUser.set(user);
    this.editNames.set(user.names);       this.editLastNames.set(user.lastNames);
    this.editEmail.set(user.email);       this.editActive.set(user.active);
    this.editNamesErr.set('');            this.editLastErr.set('');
    this.editEmailErr.set('');
  }

  public closeEditModal(): void { this.editUser.set(null); }

  public async submitEdit(): Promise<void> {
    let valid = true;
    if (!this.editNames().trim())     { this.editNamesErr.set('Campo requerido'); valid = false; }
    else this.editNamesErr.set('');
    if (!this.editLastNames().trim()) { this.editLastErr.set('Campo requerido');  valid = false; }
    else this.editLastErr.set('');
    if (!this.editEmail().trim())     { this.editEmailErr.set('Campo requerido'); valid = false; }
    else this.editEmailErr.set('');
    if (!valid) return;

    const user = this.editUser();
    if (!user) return;

    this.isSaving.set(true);
    const res = await this.usersService.updateUser(user.id, {
      names: this.editNames().trim(), lastNames: this.editLastNames().trim(),
      email: this.editEmail().trim(), active: this.editActive(),
    });
    this.isSaving.set(false);

    if (!res.success) { this.toast.show('¡Error!', res.message || 'No se pudo actualizar el usuario', 'error'); return; }
    this.toast.show('¡Éxito!', 'Usuario actualizado correctamente', 'success');
    this.closeEditModal();
    await this.loadUsers();
  }

  // ── Cambiar contraseña ─────────────────────────────────────
  public openPwdModal(user: UserDto): void {
    this.pwdUser.set(user);
    this.currentPwd.set('');    this.newPwd.set('');    this.confirmPwd.set('');
    this.currentPwdErr.set(''); this.newPwdErr.set(''); this.confirmPwdErr.set('');
  }

  public closePwdModal(): void { this.pwdUser.set(null); }

  public async submitChangePassword(): Promise<void> {
    let valid = true;
    if (!this.currentPwd().trim()) { this.currentPwdErr.set('Campo requerido');                       valid = false; }
    else this.currentPwdErr.set('');
    if (!this.newPwd().trim())     { this.newPwdErr.set('Campo requerido');                           valid = false; }
    else this.newPwdErr.set('');
    if (this.newPwd() !== this.confirmPwd()) { this.confirmPwdErr.set('Las contraseñas no coinciden'); valid = false; }
    else this.confirmPwdErr.set('');
    if (!valid) return;

    const user = this.pwdUser();
    if (!user) return;

    this.isSaving.set(true);
    const res = await this.usersService.changePassword(user.id, {
      current_password: this.currentPwd().trim(),
      new_password:     this.newPwd().trim(),
    });
    this.isSaving.set(false);

    if (!res.success) { this.toast.show('¡Error!', res.message || 'No se pudo cambiar la contraseña', 'error'); return; }
    this.toast.show('¡Éxito!', 'Contraseña actualizada correctamente', 'success');
    this.closePwdModal();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeCreateModal();
    this.closeEditModal();
    this.closePwdModal();
  }
}
