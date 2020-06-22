import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';
import { UsuarioFilter } from './usuariofilter';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private urlEndPoint = 'http://localhost:8080/api/usuarios';
  private urlEndPointFilterPage =
    'http://localhost:8080/api/usuarios/usuarioFilterPage';

  private orderAsc = '';

  constructor(private http: HttpClient, private router: Router) {}

  getListaUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlEndPoint + '/listaUsuarios');
  }

  getUsuarios(
    usuarioFilter: UsuarioFilter,
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
        usuarioFilter
      )
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            this.router.navigate(['/usuarios']);
            Swal.fire(
              'Error al obtener los usuarios',
              'No existe ningun usuario registrado',
              'error'
            );
          }

          return throwError(e);
        })
      );
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.urlEndPoint + '/creaUsuario', usuario)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            Swal.fire(
              'Error al crear el usuario',
              'No se pudo crear el usuario',
              'error'
            );
          }
          return throwError(e);
        })
      );
  }

  getUsuario(id): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status === 404) {
          this.router.navigate(['/usuarios']);
          Swal.fire(
            'Error al editar',
            `El usuario con id ${id} no existe en la base de datos`,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.urlEndPoint}/${usuario.id}`, usuario)
      .pipe(
        catchError((e) => {
          if (e.status === 404) {
            Swal.fire(
              'Error al actualizar el usuario',
              `El usuario con id ${usuario.id} no existe en la base de datos`,
              'error'
            );
          } else if (e.status === 400) {
            Swal.fire(
              'Error al actualizar el usuario',
              'No se pudo actualizar el usuario',
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
            'Error al eliminar el usuario',
            'No se pudo eliminar el usuario: error en el servidor',
            'error'
          );
        }
        // }

        return throwError(e);
      })
    );
  }
}
