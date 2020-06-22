import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AutorService } from './autores/autor.service';
import { AutoresComponent } from './autores/autores.component';
import { FormAutorComponent } from './autores/formautor.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FormLibroComponent } from './libros/formlibro.component';
import { LibroService } from './libros/libro.service';
import { LibrosComponent } from './libros/libros.component';
import { NombrerolPipe } from './pipes/nombrerol.pipe';
import { FormPrestamoComponent } from './prestamos/formprestamo.component';
import { MisprestamosComponent } from './prestamos/misprestamos.component';
import { PrestamoService } from './prestamos/prestamo.service';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { FormUsuarioComponent } from './usuarios/formusuario.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { LoginComponent } from './usuarios/login.component';
import { RolService } from './usuarios/rol.service';
import { UsuarioService } from './usuarios/usuario.service';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'autores', component: AutoresComponent },
  {
    path: 'autores/form',
    component: FormAutorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'autores/form/:id',
    component: FormAutorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  { path: 'libros', component: LibrosComponent },
  {
    path: 'libros/form',
    component: FormLibroComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'libros/form/:id',
    component: FormLibroComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'usuarios/form',
    component: FormUsuarioComponent,
  },
  {
    path: 'usuarios/form/:id',
    component: FormUsuarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'prestamos',
    component: PrestamosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prestamos/form',
    component: FormPrestamoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'prestamos/form/:id',
    component: FormPrestamoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'misPrestamos',
    component: MisprestamosComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    HomeComponent,
    LoginComponent,
    FormUsuarioComponent,
    NombrerolPipe,
    FooterComponent,
    HeaderComponent,
    AutoresComponent,
    LibrosComponent,
    PrestamosComponent,
    FormAutorComponent,
    FormLibroComponent,
    FormPrestamoComponent,
    MisprestamosComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    UsuarioService,
    AutorService,
    LibroService,
    RolService,
    PrestamoService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
