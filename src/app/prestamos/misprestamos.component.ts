import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { Prestamo } from './prestamo';
import { PrestamoService } from './prestamo.service';
import { PrestamoFilter } from './prestamofilter';

@Component({
  selector: 'app-misprestamos',
  templateUrl: './misprestamos.component.html',
  styleUrls: ['./misprestamos.component.css'],
})
export class MisprestamosComponent implements OnInit {
  prestamos: Prestamo[];
  prestamoFilter: PrestamoFilter;

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
    private prestamoService: PrestamoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prestamoFilter = {
      username: this.authService.usuario.username,
    };
    if (this.page === undefined || this.page === null) {
      this.page = 0;
    }
    if (this.size === undefined || this.size === null) {
      this.size = 5;
    }
    this.prestamoService
      .getPrestamos(this.prestamoFilter, 0, this.size, this.order, this.asc)
      .subscribe((prestamos: any) => {
        this.prestamos = prestamos.content;
        this.totalPaginas = prestamos.totalPages;
        this.rellenaArrayNumPaginas(this.totalPaginas);
      });
    this.pagActual = 1;
    this.isFirst = true;
  }

  filtrar() {
    this.prestamoFilter.username = this.authService.usuario.username;
    this.prestamoService
      .getPrestamos(
        this.prestamoFilter,
        this.page,
        this.size,
        this.order,
        this.asc
      )
      .subscribe((prestamos: any) => {
        this.prestamos = prestamos.content;
        this.totalPaginas = prestamos.totalPages;
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
    this.filtrar();
  }

  setOrder(order: string): void {
    this.order = order;
    this.asc = !this.asc;
    this.filtrar();
  }

  rellenaArrayNumPaginas(numero: number): void {
    this.numerosPaginas = [];
    for (let index = 0; index < numero; index++) {
      this.numerosPaginas.push(index + 1);
    }
  }
}
