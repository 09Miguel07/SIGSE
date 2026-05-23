import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Seguimiento, Status } from '../../../../interfaces/students/students.interface';
import { StudentService } from '../../../../services/students/student.service';
import { CreateMonitoringDto, MonitoringReason, MonitoringService } from '../../../../services/monitoring/monitoring.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AuthStore } from '../../../../store/auth.store';

@Component({
  selector: 'app-student-seguimiento',
  templateUrl: './student-seguimiento.component.html',
  styleUrl: './student-seguimiento.component.scss',
  imports: [RouterLink, LoaderComponent, CommonModule, FormsModule],
})
export class StudentSeguimientoComponent implements OnInit {
  public studentId           = signal<string | null>(null);
  public isLoading           = signal<boolean>(false);
  public isSaving            = signal<boolean>(false);
  public isUpdating          = signal<boolean>(false);
  public seguimientos        = signal<Seguimiento[]>([]);
  public statuses            = signal<Status[]>([]);
  public reasons             = signal<MonitoringReason[]>([]);
  public selectedSeguimiento = signal<Seguimiento | null>(null);

  // Comentario
  public showCommentForm = signal<boolean>(false);
  public commentContent  = signal<string>('');

  // Edición seguimiento
  public editDescription  = signal<string>('');
  public editStatusId     = signal<number>(0);
  public descriptionError = signal<string>('');

  // Crear seguimiento
  public showCreateModal   = signal<boolean>(false);
  public isCreating        = signal<boolean>(false);
  public newReasonId       = signal<number>(0);
  public newDescription    = signal<string>('');
  public newStatusId       = signal<number>(0);
  public newReasonError    = signal<string>('');
  public newDescError      = signal<string>('');
  public newStatusError    = signal<string>('');

  // Menú seguimiento
  public activeMenuSeguimientoId = signal<number | null>(null);

  // Menú comentario
  public activeMenuCommentId  = signal<number | null>(null);
  public editingCommentId     = signal<number | null>(null);
  public editCommentContent   = signal<string>('');
  public editCommentError     = signal<string>('');

  private readonly route             = inject(ActivatedRoute);
  private readonly studentService    = inject(StudentService);
  private readonly monitoringService = inject(MonitoringService);
  private readonly toast             = inject(ToastService);
  private readonly authStore         = inject(AuthStore);

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.studentId.set(id);

    if (!id) {
      this.toast.show('¡Error!', 'ID de estudiante no encontrado', 'error');
      return;
    }

    await Promise.all([this.loadSeguimientos(), this.loadStatuses(), this.loadReasons()]);
  }

  private async loadStatuses(): Promise<void> {
    const response = await this.monitoringService.getStatuses();
    if (response.success && response.data) {
      this.statuses.set(response.data);
    }
  }

  private async loadReasons(): Promise<void> {
    const response = await this.monitoringService.getMonitoringReasons();
    if (response.success && response.data) {
      this.reasons.set(response.data);
    }
  }

  private async loadSeguimientos(): Promise<void> {
    const id = this.studentId();
    if (!id) return;

    // Capturar el id ANTES del await para evitar lecturas stale del signal
    const currentId = this.selectedSeguimiento()?.id ?? null;

    this.isLoading.set(true);
    const response = await this.studentService.getStudentSeguimientos(id);
    this.isLoading.set(false);

    if (!response.success || !response.data) {
      this.toast.show('¡Error!', 'No se pudieron cargar los seguimientos', 'error');
      return;
    }

    this.seguimientos.set(response.data);

    if (currentId !== null) {
      const updated = response.data.find(s => s.id === currentId);
      // Spread para garantizar nueva referencia y que Angular detecte el cambio
      this.selectedSeguimiento.set(
        updated ? { ...updated, comentarios: [...updated.comentarios] } : null
      );
      if (updated) this.initEditSignals(updated);
    }
  }

  private initEditSignals(seg: Seguimiento): void {
    this.editDescription.set(seg.description);
    this.descriptionError.set('');
    const matched = this.statuses().find(s => s.status_name === seg.status);
    this.editStatusId.set(matched?.status_id ?? this.statuses()[0]?.status_id ?? 0);
  }

  public openModal(seguimiento: Seguimiento): void {
    this.selectedSeguimiento.set(seguimiento);
    this.showCommentForm.set(false);
    this.commentContent.set('');
    this.initEditSignals(seguimiento);
  }

  public closeModal(): void {
    this.selectedSeguimiento.set(null);
    this.showCommentForm.set(false);
    this.commentContent.set('');
    this.editDescription.set('');
    this.descriptionError.set('');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeMenuCommentId.set(null);
    this.activeMenuSeguimientoId.set(null);
  }

  public openCreateModal(): void {
    this.newReasonId.set(this.reasons()[0]?.id ?? 0);
    this.newStatusId.set(this.statuses()[0]?.status_id ?? 0);
    this.newDescription.set('');
    this.newReasonError.set('');
    this.newDescError.set('');
    this.newStatusError.set('');
    this.showCreateModal.set(true);
  }

  public closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.newReasonId.set(0);
    this.newDescription.set('');
    this.newStatusId.set(0);
    this.newReasonError.set('');
    this.newDescError.set('');
    this.newStatusError.set('');
  }

  public async submitCreateMonitoring(): Promise<void> {
    let valid = true;

    if (!this.newReasonId() || this.newReasonId() === 0) {
      this.newReasonError.set('Selecciona una razón');
      valid = false;
    } else { this.newReasonError.set(''); }

    if (this.newDescription().trim().length < 1) {
      this.newDescError.set('La descripción es requerida');
      valid = false;
    } else { this.newDescError.set(''); }

    if (!this.newStatusId() || this.newStatusId() === 0) {
      this.newStatusError.set('Selecciona un estado');
      valid = false;
    } else { this.newStatusError.set(''); }

    if (!valid) return;

    const administrativeId = this.authStore.user()?.administrative_id;
    const studentId        = this.studentId();

    if (!administrativeId) {
      this.toast.show('¡Error!', 'No se encontró el ID administrativo del usuario', 'error');
      return;
    }

    if (!studentId) return;

    const dto: CreateMonitoringDto = {
      studentId:        Number(studentId),
      administrativeId: administrativeId,
      reasonId:         this.newReasonId(),
      description:      this.newDescription().trim(),
      statusId:         this.newStatusId(),
      openingDate:      new Date().toISOString(),
    };

    this.isCreating.set(true);
    const response = await this.monitoringService.createMonitoring(dto);
    this.isCreating.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo crear el seguimiento', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Seguimiento creado correctamente', 'success');
    this.closeCreateModal();
    await this.loadSeguimientos();
  }

  public toggleSeguimientoMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.activeMenuSeguimientoId.update(current => current === id ? null : id);
  }

  public async deleteMonitoring(id: number, event: Event): Promise<void> {
    event.stopPropagation();
    this.activeMenuSeguimientoId.set(null);
    this.isSaving.set(true);
    const response = await this.monitoringService.deleteMonitoring(id);
    this.isSaving.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo eliminar el seguimiento', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Seguimiento eliminado correctamente', 'success');
    this.closeModal();
    await this.loadSeguimientos();
  }

  public toggleCommentMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.activeMenuCommentId.update(current => current === id ? null : id);
  }

  public startEditComment(id: number, content: string, event: Event): void {
    event.stopPropagation();
    this.activeMenuCommentId.set(null);
    this.editingCommentId.set(id);
    this.editCommentContent.set(content);
    this.editCommentError.set('');
  }

  public cancelEditComment(): void {
    this.editingCommentId.set(null);
    this.editCommentContent.set('');
    this.editCommentError.set('');
  }

  public async saveEditComment(id: number): Promise<void> {
    if (this.editCommentContent().trim().length < 1) {
      this.editCommentError.set('El comentario no puede estar vacío');
      return;
    }

    this.isSaving.set(true);
    const response = await this.monitoringService.updateComment(id, this.editCommentContent().trim());
    this.isSaving.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo editar el comentario', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Comentario actualizado correctamente', 'success');
    this.cancelEditComment();
    await this.loadSeguimientos();
  }

  public async deleteComment(id: number, event: Event): Promise<void> {
    event.stopPropagation();
    this.activeMenuCommentId.set(null);
    this.isSaving.set(true);
    const response = await this.monitoringService.deleteComment(id);
    this.isSaving.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo eliminar el comentario', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Comentario eliminado correctamente', 'success');
    await this.loadSeguimientos();
  }

  public toggleCommentForm(): void {
    this.showCommentForm.update(v => !v);
    this.commentContent.set('');
  }

  public async updateSeguimiento(): Promise<void> {
    if (this.editDescription().trim().length < 1) {
      this.descriptionError.set('La descripción no puede estar vacía');
      return;
    }

    this.descriptionError.set('');

    const seg             = this.selectedSeguimiento();
    const administrativeId = this.authStore.user()?.administrative_id;

    if (!seg) return;

    if (!administrativeId) {
      this.toast.show('¡Error!', 'No se encontró el ID administrativo del usuario', 'error');
      return;
    }

    this.isUpdating.set(true);

    const response = await this.monitoringService.updateMonitoring(seg.id, {
      administrativeId: administrativeId,
      description:      this.editDescription().trim(),
      statusId:         this.editStatusId(),
    });

    this.isUpdating.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo actualizar el seguimiento', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Seguimiento actualizado correctamente', 'success');
    await this.loadSeguimientos();
  }

  public async saveComment(): Promise<void> {
    if (this.commentContent().trim().length === 0) {
      this.toast.show('¡Advertencia!', 'El comentario no puede estar vacío', 'warning');
      return;
    }

    const seg              = this.selectedSeguimiento();
    const administrativeId = this.authStore.user()?.administrative_id;

    if (!seg) return;

    if (!administrativeId) {
      this.toast.show('¡Error!', 'Parece que hay un error con tu usuario, contactate con TI', 'error');
      return;
    }

    this.isSaving.set(true);

    const response = await this.studentService.postMonitoringComment({
      monitoringId: seg.id,
      userId:       administrativeId,
      content:      this.commentContent().trim(),
      date:         new Date().toISOString(),
    });

    this.isSaving.set(false);

    if (!response.success) {
      this.toast.show('¡Error!', response.message || 'No se pudo guardar el comentario', 'error');
      return;
    }

    this.toast.show('¡Éxito!', 'Comentario guardado correctamente', 'success');
    this.showCommentForm.set(false);
    this.commentContent.set('');
    await this.loadSeguimientos();
  }
}
