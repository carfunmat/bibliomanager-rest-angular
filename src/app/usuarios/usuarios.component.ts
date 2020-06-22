import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';
import { UsuarioFilter } from './usuariofilter';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[];
  usuarioFilter: UsuarioFilter;

  totalPaginas: number;
  numerosPaginas: number[] = [];

  page: number;
  size: number;
  order = '';
  asc = false;

  isFirst = false;
  isLast = false;

  pagActual = 1;

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.authService.usuario.roles[0]);
    this.usuarioFilter = {
      username: '',
    };
    if (this.page === undefined || this.page === null) {
      this.page = 0;
    }
    if (this.size === undefined || this.size === null) {
      this.size = 5;
    }
    this.usuarioService
      .getUsuarios(this.usuarioFilter, 0, this.size, this.order, this.asc)
      .subscribe((usuarios: any) => {
        this.usuarios = usuarios.content;
        this.totalPaginas = usuarios.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
    this.pagActual = 1;
    this.isFirst = true;
  }

  delete(usuario: Usuario): void {
    Swal.fire({
      title: `¿Está seguro de que desea eliminar el usuario ${usuario.username} : ${usuario.nombre} ${usuario.apellido} ?`,
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar usuario',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.usuarioService.delete(usuario.id).subscribe((response) => {
          this.usuarios = this.usuarios.filter((u) => u !== usuario);
          Swal.fire(
            'Usuario eliminado',
            `El usuario ${usuario.username} ha sido eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }

  filtrar(username: string) {
    this.usuarioFilter.username = username;
    this.usuarioService
      .getUsuarios(
        this.usuarioFilter,
        this.page,
        this.size,
        this.order,
        this.asc
      )
      .subscribe((usuarios: any) => {
        this.usuarios = usuarios.content;
        this.totalPaginas = usuarios.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
  }

  filtrarBusqueda(username: string) {
    this.usuarioFilter.username = username;
    this.usuarioService
      .getUsuarios(this.usuarioFilter, 0, this.size, this.order, this.asc)
      .subscribe((usuarios: any) => {
        this.setPage(0);
        this.usuarios = usuarios.content;
        this.totalPaginas = usuarios.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
  }

  setPage(page: number): void {
    this.page = page;
    this.pagActual = page + 1;
    this.isFirst = false;
    this.isLast = false;
    if (this.pagActual === 1) {
      this.isFirst = true;
    }
    if (this.pagActual === this.totalPaginas) {
      this.isLast = true;
    }
    this.filtrar(this.usuarioFilter.username);
  }

  setOrder(order: string): void {
    this.order = order;
    this.asc = !this.asc;
    this.filtrar(this.usuarioFilter.username);
  }

  rellenaArrayNumPaginas(numero: number): void {
    this.numerosPaginas = [];
    for (let index = 0; index < numero; index++) {
      this.numerosPaginas.push(index + 1);
    }
  }
}
