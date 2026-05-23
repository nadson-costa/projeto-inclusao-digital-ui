import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Curso } from '../../core/models/curso.model';
import { Categoria } from '../../core/models/categoria.model';
import { Aula } from '../../core/models/aula.model';
import { ApiError } from '../../core/models/api-error.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos`, {
      params: { status: 'ATIVO' },
      withCredentials: true
    }).pipe(catchError(this.tratarErro));
  }

  buscarPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/cursos/${id}`, {
      withCredentials: true
    }).pipe(catchError(this.tratarErro));
  }

  listarAulas(cursoId: number): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.baseUrl}/aulas/curso/${cursoId}`, {
      params: { status: 'ATIVA' },
      withCredentials: true
    }).pipe(catchError(this.tratarErro));
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`, {
      params: { status: 'ATIVA' },
      withCredentials: true
    }).pipe(catchError(this.tratarErro));
  }

  private tratarErro(error: HttpErrorResponse): Observable<never> {
    const apiError = error.error as ApiError;
    const mensagem = apiError?.mensagem ?? 'Erro inesperado. Tente novamente.';
    return throwError(() => new Error(mensagem));
  }
}
