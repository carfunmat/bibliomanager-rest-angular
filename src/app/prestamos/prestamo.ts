import { Libro } from '../libros/libro';
import { Usuario } from '../usuarios/usuario';

export class Prestamo {
  id: number;
  libro: Libro;
  usuario: Usuario;
  fechaInicio: Date;
  fechaFinal: Date;
}
