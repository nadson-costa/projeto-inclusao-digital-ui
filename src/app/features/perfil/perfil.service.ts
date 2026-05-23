import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.model';
import { ApiError } from '../../core/models/api-error.model';

export interface UsuarioEditRequest {
  nomeCompleto: string;
  telefone: string;
  dataNascimento: string;
  emergenciaNome: string;
  emergenciaTelefone: string;
  emergenciaParentesco: string;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  editar(dados: UsuarioEditRequest): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.baseUrl}/usuarios/me`, dados, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const apiError = error.error as ApiError;
          const mensagem = apiError?.mensagem ?? 'Erro ao salvar. Tente novamente.';
          return throwError(() => new Error(mensagem));
        })
      );
  }
}
