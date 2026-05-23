import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-10">
      <span class="w-10 h-10 border-4 border-orange-primary border-t-transparent rounded-full animate-spin"></span>
    </div>
  `
})
export class LoadingComponent {}
