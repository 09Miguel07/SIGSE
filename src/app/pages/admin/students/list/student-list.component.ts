import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Students } from '../../../../interfaces/students/students.interface';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { TableComponent } from "../../../../shared/components/table/table.component";
import { PageDirection, TableAction, TableActionEvent, TableColumn } from '../../../../interfaces/table/table.interface';
import { StudentService } from '../../../../services/students/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  imports: [LoaderComponent, TableComponent]
})
export class StudentListComponent implements OnInit {
  public isLoading = signal<boolean>(false);
  public allStudents = signal<Students[]>([]);
  public currentPage = signal<number>(1);
  public totalPages = signal<number>(1);
  public searchedTearm = signal<string>('');

  private readonly studentService = inject(StudentService);
  private readonly router         = inject(Router);

  public TableColumn  : TableColumn[] = [
    {key: 'names', label: 'Nombres'},
    {key: 'lastNames', label: 'Apellidos'},
    {key: 'email', label: 'Correo electrónico'},
    {key: 'program_name', label: 'Programa académico'},
    {key: 'semester', label: 'Semestre'},
    {key: 'status_name', label: 'Estado'},
  ]

  public tableActions: TableAction<Students>[] = [
    { label: 'Ver mas', type: 'primary', action: 'view' },
  ]

  public async ngOnInit(): Promise<void> {
    await this.loadStudents()
   }

  private async loadStudents(): Promise<void> {
    this.isLoading.set(true);

    const response = await this.studentService.getAllStudents(
      this.currentPage(),
      this.searchedTearm(),
    );

    this.isLoading.set(false);

    if (response.success && response.data) {
      this.allStudents.set(response.data.students);
      this.totalPages.set(response.data.totalPages);
      return;
    }

    console.error('Error al cargar los estudiantes:', response.message);

  }

  public async onpageChange(direction: PageDirection): Promise<void> {
    switch (direction) {
      case 'next':
        this.currentPage.update(page => page + 1);
        break;
      case 'prev':
        this.currentPage.update(page => page - 1);
        break;
    }

    await this.loadStudents();
  }

  public async onSearchTermChange(search: string): Promise<void> {
    this.searchedTearm.set(search.trim());
    this.currentPage.set(1);
    await this.loadStudents();
  }


  public onActionClicked(event: TableActionEvent<Students>): void {
    const {action, row} = event;

    if (action !== 'view') return;

    this.router.navigate(['/admin/students/profile', row.student_id]);
  }
}
