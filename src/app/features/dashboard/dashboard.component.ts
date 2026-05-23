import { Component } from '@angular/core';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BottomNavComponent],
  template: `
    <div class="min-h-screen bg-bg-light pb-20">
      <p class="p-6">Dashboard</p>
    </div>
    <app-bottom-nav />
  `
})
export default class DashboardComponent {}
