import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Autor } from '../autores/autor';
import { AutorService } from '../autores/autor.service';
import { Libro } from './libro';
import { LibroService } from './libro.service';
import { Ubicacion } from './ubicacion';

@Component({
  selector: 'app-formlibro',
  templateUrl: './formlibro.component.html',
})
export class FormLibroComponent implements OnInit {
  public libro: Libro = new Libro();
  // public titulo = 'Nuevo Libro';

  idSeleccionado = -1;
  ubicacionLibro: Ubicacion = new Ubicacion();

  autor: Autor;

  autores: Autor[] = [];

  constructor(
    private libroService: LibroService,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.autorService.getListaAutores().subscribe((autores) => {
      this.autores = autores;
    });
    this.cargarLibro();
  }

  cargarLibro(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        this.libroService
          .getLibro(id)
          .subscribe((libro) => (this.libro = libro));
      }
    });
  }

  public create(): void {
    console.log('id seleccionado: ' + this.idSeleccionado);
    this.autorService.getAutor(this.idSeleccionado).subscribe((autor) => {
      this.libro.autor = autor;
      this.ubicacionLibro.fila = 1;
      this.ubicacionLibro.pasillo = 1;
      this.ubicacionLibro.seccion = 'A';
      console.log('ubicacionLibro: ' + this.ubicacionLibro.seccion);
      this.libro.ubicacion = this.ubicacionLibro;
      console.log('autor: ' + this.libro.autor.nombre); // OK
      this.libroService.create(this.libro).subscribe((libro) => {
        this.router.navigate(['/libros']);
        Swal.fire(
          'Nuevo Libro',
          `El libro ha sido creada correctamente`,
          'success'
        );
      });
    });
  }

  update(): void {
    this.autorService.getAutor(this.idSeleccionado).subscribe((autor) => {
      this.libroService.update(this.libro).subscribe((libro) => {
        this.router.navigate(['/libros']);
        Swal.fire(
          'Libro actualizado',
          `El libro con id ${libro.id} ha sido actualizado con éxito`,
          'success'
        );
      });
    });
  }
}
