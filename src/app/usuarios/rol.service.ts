import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from './rol';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private urlEndPoint = 'http://localhost:8080/api/roles/rolNombre';
  private urlEndPointRoles = 'http://localhost:8080/api/roles/listaRoles';

  constructor(private http: HttpClient) {}

  // getRol(nombre): Observable<Rol> {
  //   return this.http.get<Rol>(`${this.urlEndPoint}/${nombre}`).pipe(
  //     catchError((e) => {
  //       // if (!this.isNoAutorizado(e)) {
  //       if (e.status === 404) {
  //         Swal.fire(
  //           'Error al asignar rol',
  //           `No se ha podido encontrar el rol ${nombre}`,
  //           'error'
  //         );
  //       }
  //       // }
  //       return throwError(e);
  //     })
  //   );
  // }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.urlEndPointRoles);
  }
}
