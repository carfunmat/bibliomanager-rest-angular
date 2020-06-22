import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  title = 'BiblioManager APP';

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire(
      'Sesión cerrada',
      `El usuario ${username} ha cerrado sesión con éxito`,
      'success'
    );
    this.router.navigate(['/login']);
  }
}
