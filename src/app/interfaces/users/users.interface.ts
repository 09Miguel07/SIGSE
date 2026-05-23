export interface UsersLoginResponse {
  id:                number;
  names:             string;
  lastNames:         string;
  email:             string;
  active:            boolean;
  userType:          'student' | 'administrative' | null;
  role?:             string;
  administrative_id?: number;
}
