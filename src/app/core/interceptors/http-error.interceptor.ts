import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const reqComCredenciais = req.clone({ withCredentials: true });

  return next(reqComCredenciais).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const estaAutenticado = authService.estaAutenticado();
        authService.usuarioAtual.set(null);
        if (estaAutenticado) {
          router.navigate(['/login']);
        }
      }

      if (error.status === 500 && !environment.production) {
        console.error('[HTTP 500]', error);
      }

      return throwError(() => error);
    })
  );
};
