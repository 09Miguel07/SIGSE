import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InformationOfOneStudent } from '../../../../interfaces/students/students.interface';
import { StudentService } from '../../../../services/students/student.service';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { ToastService } from '../../../../services/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss',
  imports: [LoaderComponent, RouterLink, DatePipe]
})
export class StudentProfileComponent implements OnInit {
  public isLoading = signal<boolean>(false);

  public studentData = signal<InformationOfOneStudent| null>(null)



  private readonly route          = inject(ActivatedRoute);
  private readonly studentService = inject(StudentService);
  private readonly toast          = inject(ToastService);
  private readonly router         = inject(Router);


  public onNotasToggle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/admin/students/profile', id, 'notas']);
  }

  public onSeguimientoToggle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/admin/students/profile', id, 'seguimiento']);
  }

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id || id === '0') {
      this.toast.show('¡Error!', 'Ups, parece que hay un error al consultar este estudiante', 'error');
      return;
    }

    this.isLoading.set(true);

    const response = await this.studentService.getStudentById(id);

    this.isLoading.set(false)

    if (!response.success) {
      this.toast.show('¡Error!', 'Ups, parece que hay un error al consultar este estudiante', 'error');
      return;
    }

    this.studentData.set(response.data)
  }
}
