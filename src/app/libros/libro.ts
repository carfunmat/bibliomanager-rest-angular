import { Autor } from '../autores/autor';
import { Ubicacion } from './ubicacion';

export class Libro {
  id: number;
  titulo: string;
  numeroPaginas: number;
  autor: Autor;
  ubicacion: Ubicacion;
}
