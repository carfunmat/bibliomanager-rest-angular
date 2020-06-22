import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Libro } from '../libros/libro';
import { LibroService } from '../libros/libro.service';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';
import { Prestamo } from './prestamo';
import { PrestamoService } from './prestamo.service';

@Component({
  selector: 'app-formprestamo',
  templateUrl: './formprestamo.component.html',
})
export class FormPrestamoComponent implements OnInit {
  public prestamo: Prestamo = new Prestamo();

  titulo = 'Prestamos';

  idUsuarioSeleccionado = 1;
  idLibroSeleccionado = 1;

  usuario: Usuario;
  libro: Libro;

  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  constructor(
    private prestamoService: PrestamoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private libroService: LibroService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getListaUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    this.libroService.getListaLibros().subscribe((libros) => {
      this.libros = libros;
    });
    this.cargarPrestamo();
  }

  cargarPrestamo(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        this.prestamoService.getPrestamo(id).subscribe((prestamo) => {
          this.prestamo = prestamo;
        });
      }
    });
  }

  public create(): void {
    this.prestamoService.create(this.prestamo).subscribe((prestamo) => {
      this.router.navigate(['/prestamos']);
      Swal.fire(
        'Nuevo prestamo',
        `Prestamo ${prestamo.id} creado con éxito`,
        'success'
      );
      Swal.fire(
        'Disponibilidad libro',
        `Fecha final prestamo: ${prestamo.fechaFinal}`,
        'info'
      );
    });
  }

  update(): void {
    this.prestamoService.update(this.prestamo).subscribe((prestamo) => {
      this.router.navigate(['/prestamos']);
      Swal.fire(
        'Prestamo actualizado',
        `Prestamo ${prestamo.id} actualizado con éxito`,
        'success'
      );
    });
  }
}
