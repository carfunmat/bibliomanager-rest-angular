import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Autor } from './autor';
import { AutorService } from './autor.service';

@Component({
  selector: 'app-formautor',
  templateUrl: './formautor.component.html',
})
export class FormAutorComponent implements OnInit {
  public autor: Autor = new Autor();

  titulo = 'Crear Autor';

  constructor(
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarAutor();
  }

  cargarAutor(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        this.autorService.getAutor(id).subscribe((autor) => {
          this.autor = autor;
        });
      }
    });
  }

  public create(): void {
    this.autorService.create(this.autor).subscribe((autor) => {
      this.router.navigate(['/autores']);
      Swal.fire(
        'Nuevo autor',
        `Autor ${autor.nombre} creado con éxito`,
        'success'
      );
    });
  }

  update(): void {
    this.autorService.update(this.autor).subscribe((autor) => {
      this.router.navigate(['/autores']);
      Swal.fire(
        'Autor actualizado',
        `Autor ${autor.nombre} actualizado con éxito`,
        'success'
      );
    });
  }
}
