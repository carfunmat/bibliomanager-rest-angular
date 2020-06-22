import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Autor } from './autor';
import { AutorService } from './autor.service';
import { AutorFilter } from './autorfilter';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
})
export class AutoresComponent implements OnInit {
  autores: Autor[];
  autorFilter: AutorFilter;

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
    private autorService: AutorService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.autorFilter = {
      nombre: '',
    };
    if (this.page === undefined || this.page === null) {
      this.page = 0;
    }
    if (this.size === undefined || this.size === null) {
      this.size = 5;
    }
    this.autorService
      .getAutores(this.autorFilter, 0, this.size, this.order, this.asc)
      .subscribe((autores: any) => {
        this.autores = autores.content;
        this.totalPaginas = autores.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
    this.pagActual = 1;
    this.isFirst = true;
  }

  delete(autor: Autor): void {
    Swal.fire({
      title: `¿Está seguro de que desea eliminar el autor ${autor.nombre} ?`,
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar autor',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.autorService.delete(autor.id).subscribe((response) => {
          this.autores = this.autores.filter((a) => a !== autor);
          Swal.fire(
            'Autor eliminado',
            `El autor ${autor.nombre} ha sido eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }

  filtrar(nombreAutor: string) {
    this.autorFilter.nombre = nombreAutor;
    this.autorService
      .getAutores(this.autorFilter, this.page, this.size, this.order, this.asc)
      .subscribe((autores: any) => {
        this.autores = autores.content;
        this.totalPaginas = autores.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
  }

  filtrarBusqueda(nombreAutor: string) {
    this.autorFilter.nombre = nombreAutor;
    this.autorService
      .getAutores(this.autorFilter, 0, this.size, this.order, this.asc)
      .subscribe((autores: any) => {
        this.setPage(0);
        this.autores = autores.content;
        this.totalPaginas = autores.totalPages;
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
    this.filtrar(this.autorFilter.nombre);
  }

  setOrder(order: string): void {
    this.order = order;
    this.asc = !this.asc;
    this.filtrar(this.autorFilter.nombre);
  }

  rellenaArrayNumPaginas(numero: number): void {
    this.numerosPaginas = [];
    for (let index = 0; index < numero; index++) {
      this.numerosPaginas.push(index + 1);
    }
  }
}
