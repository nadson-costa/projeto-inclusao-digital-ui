import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { CadastroRequest } from '../models/auth.model';
import { ApiError } from '../models/api-error.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  readonly usuarioAtual = signal<Usuario | null>(null);
  readonly estaAutenticado = computed(() => this.usuarioAtual() !== null);

  login(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.baseUrl}/auth/login`, { email, senha }, { withCredentials: true })
      .pipe(
        tap(usuario => this.usuarioAtual.set(usuario)),
        catchError(this.tratarErro)
      );
  }

  cadastro(dados: CadastroRequest): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.baseUrl}/auth/cadastro`, dados, { withCredentials: true })
      .pipe(
        tap(usuario => this.usuarioAtual.set(usuario)),
        catchError(this.tratarErro)
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.usuarioAtual.set(null)),
        catchError(this.tratarErro)
      );
  }

  carregarUsuarioAtual(): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.baseUrl}/usuarios/me`, { withCredentials: true })
      .pipe(
        tap(usuario => this.usuarioAtual.set(usuario)),
        catchError(this.tratarErro)
      );
  }

  private tratarErro(error: HttpErrorResponse): Observable<never> {
    const apiError = error.error as ApiError;
    const mensagem = apiError?.mensagem ?? 'Erro inesperado. Tente novamente.';
    return throwError(() => new Error(mensagem));
  }
}
