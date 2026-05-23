import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

interface NavItem {
  label: string;
  route: string | null;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bottom-nav.component.html'
})
export class BottomNavComponent {
  private readonly router = inject(Router);

  readonly items: NavItem[] = [
    { label: 'Início', route: '/dashboard' },
    { label: 'Cursos', route: '/cursos' },
    { label: 'Progresso', route: null },
    { label: 'Perfil', route: '/perfil' },
  ];

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isActive(route: string): boolean {
    return this.currentUrl().startsWith(route);
  }
}
