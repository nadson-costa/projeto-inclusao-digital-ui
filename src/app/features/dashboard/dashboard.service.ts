import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Curso } from '../../core/models/curso.model';
import { Categoria } from '../../core/models/categoria.model';
import { ApiError } from '../../core/models/api-error.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  carregarDados(): Observable<{ cursos: Curso[]; categorias: Categoria[] }> {
    return forkJoin({
      cursos: this.http.get<Curso[]>(`${this.baseUrl}/cursos`, { params: { status: 'ATIVO' } }),
      categorias: this.http.get<Categoria[]>(`${this.baseUrl}/categorias`, { params: { status: 'ATIVA' } })
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = error.error as ApiError;
        const mensagem = apiError?.mensagem ?? 'Erro ao carregar dados. Tente novamente.';
        return throwError(() => new Error(mensagem));
      })
    );
  }
}
