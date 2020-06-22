import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Autor } from './autor';
import { AutorFilter } from './autorfilter';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  private urlEndPoint = 'http://localhost:8080/api/autores';
  private urlEndPointFilter = 'http://localhost:8080/api/autores/autorFilter';
  private urlEndPointFilterPage =
    'http://localhost:8080/api/autores/autorFilterPage';

  private orderAsc = '';

  constructor(private http: HttpClient, private router: Router) {}

  getListaAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.urlEndPoint + '/listaAutores');
  }

  getAutores(
    autorFilter: AutorFilter,
    page: number,
    size: number,
    order: string,
    asc: boolean
  ): Observable<any[]> {
    if (!asc) {
      this.orderAsc = 'desc';
    } else {
      this.orderAsc = '';
    }
    return this.http
      .post<any[]>(
        this.urlEndPointFilterPage +
          `?page=${page}&size=${size}&sort=${order},${this.orderAsc}`,
        autorFilter
      )
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            this.router.navigate(['/autores']);
            Swal.fire(
              'Error al obtener los autores',
              'No existe ningun autor registrado',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  create(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.urlEndPoint + '/creaAutor', autor).pipe(
      catchError((e) => {
        if (e.status === 400) {
          Swal.fire(
            'Error al crear el autor',
            'No se pudo crear el autor',
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  getAutor(id): Observable<Autor> {
    return this.http.get<Autor>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        // if (!this.isNoAutorizado(e)) {
        if (e.status === 404) {
          this.router.navigate(['/autores']);
          Swal.fire(
            'Error al editar',
            `El autor con id ${id} no existe en la base de datos`,
            'error'
          );
        }
        // }
        return throwError(e);
      })
    );
  }

  update(autor: Autor): Observable<Autor> {
    return this.http.put<Autor>(`${this.urlEndPoint}/${autor.id}`, autor).pipe(
      catchError((e) => {
        if (e.status === 404) {
          Swal.fire(
            'Error al actualizar el autor',
            `El autor con id ${autor.id} no existe en la base de datos`,
            'error'
          );
        } else if (e.status === 400) {
          Swal.fire(
            'Error al actualizar el autor',
            'No se pudo actualizar el autor',
            'error'
          );
        }

        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status === 500) {
          Swal.fire(
            'Error al eliminar el autor',
            'No se pudo eliminar el autor: error en el servidor',
            'error'
          );
        }

        return throwError(e);
      })
    );
  }
}
