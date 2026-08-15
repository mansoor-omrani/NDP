import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-blue-600 text-white p-4">
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold">NDP Library</h1>
        </div>
      </header>

      <!-- Navbar -->
      <nav class="bg-gray-100 shadow">
        <div class="container mx-auto flex items-center justify-between p-4">
          <div class="flex items-center space-x-4">
            <a routerLink="/" class="text-gray-700 hover:text-blue-600 cursor-pointer">Home</a>
            <a routerLink="/manage-books" class="text-gray-700 hover:text-blue-600 cursor-pointer">Manage Books</a>
            <a routerLink="/audit-logs" class="text-gray-700 hover:text-blue-600 cursor-pointer">Audit Logs</a>
          </div>
          <div class="flex items-center space-x-4">
            @if (!authService.isLoggedIn()) {
              <a routerLink="/login" class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Login</a>
              <a routerLink="/register" class="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">Register</a>
            } @else {
              <a routerLink="/profile" class="text-gray-700 hover:text-blue-600 cursor-pointer">
                {{ authService.getUser()?.userName }}
              </a>
              <button (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
            }
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white p-4 mt-8">
        <div class="container mx-auto text-center">
          <p>&copy; 2026 NDP Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  title = 'ndp-frontend';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
