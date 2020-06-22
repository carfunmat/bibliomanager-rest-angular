import { Rol } from './rol';

export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: Rol[] = [];
}
