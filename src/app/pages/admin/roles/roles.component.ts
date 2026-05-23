import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleDto, RolesService } from '../../../services/roles/roles.service';
import { ToastService } from '../../../services/toast/toast.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  imports: [CommonModule, FormsModule, LoaderComponent],
})
export class RolesComponent implements OnInit {
  public roles     = signal<RoleDto[]>([]);
  public isLoading = signal(false);
  public isSaving  = signal(false);

  // ── Modal (create & edit comparten el mismo) ───────────────
  public showModal    = signal(false);
  public editingRole  = signal<RoleDto | null>(null); // null = crear, obj = editar
  public roleName     = signal('');
  public roleActive   = signal(true);
  public roleNameErr  = signal('');

  // ── Modal confirmación de eliminar ─────────────────────────
  public roleToDelete = signal<RoleDto | null>(null);

  private readonly rolesService = inject(RolesService);
  private readonly toast        = inject(ToastService);

  public get modalTitle(): string {
    return this.editingRole() ? 'Editar rol' : 'Nuevo rol';
  }

  public async ngOnInit(): Promise<void> {
    await this.loadRoles();
  }

  private async loadRoles(): Promise<void> {
    this.isLoading.set(true);
    const res = await this.rolesService.getRoles();
    this.isLoading.set(false);
    if (res.success && res.data) this.roles.set(res.data);
    else this.toast.show('¡Error!', res.message || 'No se pudieron cargar los roles', 'error');
  }

  public openCreateModal(): void {
    this.editingRole.set(null);
    this.roleName.set('');
    this.roleActive.set(true);
    this.roleNameErr.set('');
    this.showModal.set(true);
  }

  public openEditModal(role: RoleDto): void {
    this.editingRole.set(role);
    this.roleName.set(role.role);
    this.roleActive.set(role.is_active);
    this.roleNameErr.set('');
    this.showModal.set(true);
  }

  public closeModal(): void {
    this.showModal.set(false);
    this.editingRole.set(null);
  }

  public async submitModal(): Promise<void> {
    if (!this.roleName().trim()) {
      this.roleNameErr.set('Campo requerido');
      return;
    }
    this.roleNameErr.set('');

    this.isSaving.set(true);
    const editing = this.editingRole();

    const res = editing
      ? await this.rolesService.updateRole(editing.id, {
          id: editing.id, role: this.roleName().trim(), is_active: this.roleActive(),
        })
      : await this.rolesService.createRole({
          role: this.roleName().trim(), is_active: this.roleActive(),
        });

    this.isSaving.set(false);

    if (!res.success) {
      this.toast.show('¡Error!', res.message || 'No se pudo guardar el rol', 'error');
      return;
    }

    this.toast.show('¡Éxito!', editing ? 'Rol actualizado correctamente' : 'Rol creado correctamente', 'success');
    this.closeModal();
    await this.loadRoles();
  }

  public openDeleteModal(role: RoleDto): void  { this.roleToDelete.set(role); }
  public closeDeleteModal(): void              { this.roleToDelete.set(null); }

  public async confirmDelete(): Promise<void> {
    const role = this.roleToDelete();
    if (!role) return;
    this.isSaving.set(true);
    const res = await this.rolesService.deleteRole(role.id);
    this.isSaving.set(false);
    if (!res.success) {
      this.toast.show('¡Error!', res.message || 'No se pudo eliminar el rol', 'error');
      return;
    }
    this.toast.show('¡Éxito!', 'Rol eliminado correctamente', 'success');
    this.closeDeleteModal();
    await this.loadRoles();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
    this.closeDeleteModal();
  }
}
