import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Libro } from './libro';
import { LibroService } from './libro.service';
import { LibroFilter } from './librofilter';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
})
export class LibrosComponent implements OnInit {
  libros: Libro[];
  libroFilter: LibroFilter;

  totalPaginas: number;
  numerosPaginas: number[] = [];

  page: number; // 0
  size: number; // 5;
  order: string;
  asc = true;

  isFirst = false;
  isLast = false;

  pagActual = 1;

  constructor(
    private libroService: LibroService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.libroFilter = {
      titulo: null,
    };
    if (this.page === undefined || this.page === null) {
      this.page = 0;
    }
    if (this.size === undefined || this.size === null) {
      this.size = 5;
    }
    this.libroService
      .getLibros(this.libroFilter, 0, this.size, this.order, this.asc)
      .subscribe((libros: any) => {
        this.libros = libros.content;
        this.totalPaginas = libros.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
    this.pagActual = 1;
    this.isFirst = true;
  }

  delete(libro: Libro): void {
    Swal.fire({
      title: `¿Está seguro de que desea eliminar el libro con id: ${libro.id} ?`,
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar libro',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.libroService.delete(libro.id).subscribe((response) => {
          this.libros = this.libros.filter((l) => l !== libro);
          Swal.fire(
            'Libro eliminado',
            `El libro con id ${libro.id} ha sido eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }

  filtrar(titulo: string) {
    this.libroFilter.titulo = titulo;

    this.libroService
      .getLibros(this.libroFilter, this.page, this.size, this.order, this.asc)
      .subscribe((libros) => {
        const content = 'content';
        const totalPages = 'totalPages';
        this.libros = libros[content];
        this.totalPaginas = libros[totalPages];
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
  }

  filtrarBusqueda(titulo: string) {
    this.libroFilter.titulo = titulo;

    this.libroService
      .getLibros(this.libroFilter, 0, this.size, this.order, this.asc)
      .subscribe((libros) => {
        const content = 'content';
        const totalPages = 'totalPages';
        this.setPage(0);
        this.libros = libros[content];
        this.totalPaginas = libros[totalPages];
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
  }

  rewind(): void {
    if (!this.isFirst) {
      this.page--;
      this.pagActual = this.page + 1;
      this.isLast = false;
      if (this.pagActual === 1) {
        this.isFirst = true;
      }
      this.filtrar(this.libroFilter.titulo);
    }
  }

  forward(): void {
    if (!this.isLast) {
      this.page++;
      this.pagActual = this.page + 1;
      this.isFirst = false;
      if (this.pagActual === this.totalPaginas) {
        this.isLast = true;
      }
      this.filtrar(this.libroFilter.titulo);
    }
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
    this.filtrar(this.libroFilter.titulo);
  }

  setOrder(order: string): void {
    this.order = order;
    this.filtrar(this.libroFilter.titulo);
  }

  rellenaArrayNumPaginas(numero: number): void {
    this.numerosPaginas = [];
    for (let index = 0; index < numero; index++) {
      this.numerosPaginas.push(index + 1);
    }
  }
}
