import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold">NDP Library</h1>
      </div>
    </header>
  `
})
export class HeaderComponent {}
