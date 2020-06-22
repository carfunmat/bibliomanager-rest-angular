import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombrerol',
})
export class NombrerolPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value === 'ROLE_USER') {
      return 'Usuario';
    }

    if (value === 'ROLE_ADMIN') {
      return 'Administrador';
    }

    return null;
  }
}
