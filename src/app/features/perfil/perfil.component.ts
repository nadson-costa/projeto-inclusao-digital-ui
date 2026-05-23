import { Component } from '@angular/core';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [BottomNavComponent],
  template: `
    <div class="min-h-screen bg-bg-light pb-20">
      <p class="p-6">Perfil</p>
    </div>
    <app-bottom-nav />
  `
})
export default class PerfilComponent {}
