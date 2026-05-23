import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/cadastro/cadastro.component')
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
      },
      {
        path: 'cursos',
        loadComponent: () => import('./features/cursos/listagem/cursos-listagem.component')
      },
      {
        path: 'cursos/:id',
        loadComponent: () => import('./features/cursos/detalhe/curso-detalhe.component')
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/perfil.component')
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
