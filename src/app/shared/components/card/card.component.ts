import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <ng-content />
    </div>
  `
})
export class CardComponent {}
