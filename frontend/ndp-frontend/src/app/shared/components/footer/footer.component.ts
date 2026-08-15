import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p>&copy; 2026 NDP Library. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
