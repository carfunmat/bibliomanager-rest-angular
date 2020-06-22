import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  titulo = 'Iniciar Sesión';
  usuario: Usuario;

  constructor(public authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire(
        'Login',
        `El usuario ${this.authService.usuario.username} ya se encuentra autenticado`,
        'info'
      );
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire(
        'Error en el Login',
        'Nombre de usuario o contraseña vacíos',
        'error'
      );
      return;
    }

    this.authService.login(this.usuario).subscribe(
      (response) => {
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        this.router.navigate(['/home']);
        Swal.fire(
          'Login',
          `Bienvenid@ ${usuario.username}, has iniciado sesión con éxito`,
          'success'
        );
      },
      (error) => {
        if (error.status === 400) {
          Swal.fire(
            'Error en el Login',
            'Usuario o contraseña incorrectos',
            'error'
          );
        }
      }
    );
  }
}
