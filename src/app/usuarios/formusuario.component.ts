import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Rol } from './rol';
import { RolService } from './rol.service';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-formusuario',
  templateUrl: './formusuario.component.html',
})
export class FormUsuarioComponent implements OnInit {
  public usuario: Usuario = new Usuario();

  titulo = 'Crear Usuario';

  idRolSeleccionado = 1;

  rol: Rol;

  roles: Rol[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private rolService: RolService,
    public authService: AuthService,
    // tslint:disable-next-line: variable-name
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.rolService.getRoles().subscribe((roles) => {
      this.roles = roles;
      console.log('roles: ' + this.roles);
    });
    this.cargarUsuario();
  }

  backClick() {
    this._location.back();
  }

  cargarUsuario(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        this.usuarioService.getUsuario(id).subscribe((usuario) => {
          this.usuario = usuario;
        });
      }
    });
  }

  public create(): void {
    this.usuarioService.create(this.usuario).subscribe((usuario) => {
      this.router.navigate(['/home']);
      Swal.fire(
        'Nuevo usuario',
        `Usuario ${usuario.username} creado con éxito`,
        'success'
      );
    });
  }

  update(): void {
    this.usuarioService.update(this.usuario).subscribe((usuario) => {
      this.router.navigate(['/usuarios']);
      Swal.fire(
        'Usuario actualizado',
        `Usuario ${usuario.username} actualizado con éxito`,
        'success'
      );
    });
  }
}
