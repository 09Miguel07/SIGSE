import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Calification, Periods, Subject } from '../../../../interfaces/students/students.interface';
import { StudentService } from '../../../../services/students/student.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-notas',
  templateUrl: './student-notas.component.html',
  styleUrl: './student-notas.component.scss',
  imports: [RouterLink, LoaderComponent, CommonModule],
})
export class StudentNotasComponent implements OnInit {
  public studentId      = signal<string | null>(null);
  public isLoading      = signal<boolean>(false);
  public califications  = signal<Calification[]>([]);
  public selectedPeriod = signal<{ yearIndex: number; period: Periods } | null>(null);
  public selectedSubject = signal<Subject | null>(null);

  private readonly route          = inject(ActivatedRoute);
  private readonly studentService = inject(StudentService);
  private readonly toast          = inject(ToastService);

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.studentId.set(id);

    if (!id) {
      this.toast.show('¡Error!', 'ID de estudiante no encontrado', 'error');
      return;
    }

    this.isLoading.set(true);
    const response = await this.studentService.getStudentCalifications(id);
    this.isLoading.set(false);

    if (!response.success || !response.data) {
      this.toast.show('¡Error!', 'No se pudieron cargar las calificaciones', 'error');
      return;
    }

    this.califications.set(response.data);
  }

  public selectPeriod(yearIndex: number, period: Periods): void {
    const current = this.selectedPeriod();
    if (current?.yearIndex === yearIndex && current.period.period_name === period.period_name) {
      this.selectedPeriod.set(null);
    } else {
      this.selectedPeriod.set({ yearIndex, period });
    }
  }

  public isPeriodActive(yearIndex: number, period: Periods): boolean {
    const current = this.selectedPeriod();
    return current?.yearIndex === yearIndex && current.period.period_name === period.period_name;
  }

  public openSubjectModal(subject: Subject): void {
    this.selectedSubject.set(subject);
  }

  public closeModal(): void {
    this.selectedSubject.set(null);
  }
}
