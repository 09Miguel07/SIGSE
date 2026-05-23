export interface Students {
  [key: string]: unknown;
  student_id:   number;
  user_id:      number;
  names:        string;
  lastNames:    string;
  email:        string;
  program_id:   number;
  program_name: string;
  semester:     number;
  status_id:    number;
  status_name:  string;
}

export interface StudentsResponse {
  page:       number;
  pageSize:   number;
  totalRecords: number;
  totalPages: number;
  students:      Students[];
}

export interface InformationOfOneStudent extends Students {
  campuses: Campus[]
  user_created_at: string
}


export interface Campus {
  campus_id:   number;
  campus_name: string;
  address:     string;
}

export interface Calification {
  year: string
  periods: Periods[]
}


export interface Periods {
  period_name: string;
  subjects: Subject[]
}


export interface Subject {
  subject_id:   number;
  subject_name: string;
  teacher:      string;
  promedio:     number;
  notas:        Nota[];
}

export interface Nota {
  activity_name: string;
  percentage:    number;
  value:         number;
  date:          string;
}

export interface Status {
  status_id:        number;
  status_name:      string;
  status_is_active: boolean;
}

export interface Seguimiento {
  id:             number;
  reason:         string;
  description:    string;
  status:         string;
  opening_date:   string;
  administrative: string;
  historial:      Historial[];
  comentarios:    Comentario[];
}

export interface Comentario {
  id:         number;
  comment_by: string;
  content:    string;
  date:       string;
}

export interface Historial {
  id:              number;
  changed_by:      string;
  previous_status: string | null;
  current_status:  string;
  date:            string;
}
