import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Libro } from './libro';
import { LibroFilter } from './librofilter';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private urlEndPoint = 'http://localhost:8080/api/libros';
  private urlEndPointFilter = 'http://localhost:8080/api/libros/libroFilter';
  private urlEndPointFilterPage =
    'http://localhost:8080/api/libros/libroFilterPage';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getListaLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.urlEndPoint + '/listaLibros');
  }

  getLibros(
    libroFilter: LibroFilter,
    page: number,
    size: number,
    order: string,
    asc: boolean
  ): Observable<Libro[]> {
    return this.http
      .post<Libro[]>(
        this.urlEndPointFilterPage + `?page=${page}&size=${size}`,
        libroFilter
      )
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            Swal.fire(
              'Error al obtener los libros',
              'No existe ningun libro registrado',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  create(libro: Libro): Observable<Libro> {
    console.log('titulo: ' + libro.titulo);
    console.log('numeroPaginas: ' + libro.numeroPaginas);
    console.log('autor: ' + libro.autor.nombre);
    console.log('ubicacion: ' + libro.ubicacion.seccion);
    return this.http
      .post<Libro>(this.urlEndPoint + '/creaLibro', libro, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          this.router.navigate(['/libros']);
          if (e.status === 500 || e.status === 400) {
            Swal.fire(
              'Error al crear el libro',
              'Se ha producido un error al crear el libro',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  getLibro(id): Observable<Libro> {
    return this.http.get<Libro>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(['/libros']);
        if (e.status === 404) {
          Swal.fire(
            'Error al editar',
            `El libro con id ${id} no existe en la base de datos`,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  update(libro: Libro): Observable<Libro> {
    return this.http
      .put<Libro>(`${this.urlEndPoint}/${libro.id}`, libro, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            Swal.fire(
              'Error al actualizar el libro',
              `El libro con id ${libro.id} no existe en la base de datos`,
              'error'
            );
          } else if (e.status === 400) {
            Swal.fire(
              'Error al actualizar el libro',
              'No se pudo actualizar el libro',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<string> {
    return this.http
      .delete<string>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status === 500) {
            Swal.fire(
              'Error al eliminar el libro',
              'No se pudo eliminar el libro: error en el servidor',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }
}
