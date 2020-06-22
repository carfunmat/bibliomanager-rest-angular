import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Prestamo } from './prestamo';
import { PrestamoFilter } from './prestamofilter';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private urlEndPoint = 'http://localhost:8080/api/prestamos';
  private urlEndPointFilterPage =
    'http://localhost:8080/api/prestamos/prestamoFilterPage';

  private orderAsc = '';

  constructor(private http: HttpClient, private router: Router) {}

  getPrestamos(
    prestamoFilter: PrestamoFilter,
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
        prestamoFilter
      )
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            this.router.navigate(['/prestamos']);
            Swal.fire(
              'Error al obtener los prestamos',
              'No existe ningun usuario registrado',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  create(prestamo: Prestamo): Observable<Prestamo> {
    console.log('titulo libro prestamo: ' + prestamo.libro.titulo);
    return this.http
      .post<Prestamo>(this.urlEndPoint + '/creaPrestamo', prestamo)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            Swal.fire(
              'Error al crear el prestamo',
              'No se pudo crear el prestamo',
              'error'
            );
          }
          return throwError(e);
        })
      );
  }

  getPrestamo(id): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status === 404) {
          this.router.navigate(['/prestamos']);
          Swal.fire(
            'Error al editar',
            `El prestamo con id ${id} no existe en la base de datos`,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  update(prestamo: Prestamo): Observable<Prestamo> {
    return this.http
      .put<Prestamo>(`${this.urlEndPoint}/${prestamo.id}`, prestamo)
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            Swal.fire(
              'Error al actualizar el prestamo',
              `El prestamo con id ${prestamo.id} no existe en la base de datos`,
              'error'
            );
          } else if (e.status === 400) {
            Swal.fire(
              'Error al actualizar el prestamo',
              'No se pudo actualizar el prestamo',
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
            'Error al eliminar el prestamo',
            'No se pudo eliminar el prestamo: error en el servidor',
            'error'
          );
        }
        // }

        return throwError(e);
      })
    );
  }
}
