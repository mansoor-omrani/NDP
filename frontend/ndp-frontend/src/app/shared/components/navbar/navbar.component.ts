import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-gray-100 shadow">
      <div class="container mx-auto flex items-center justify-between p-4">
        <div class="flex items-center space-x-4">
          <a routerLink="/" class="text-gray-700 hover:text-blue-600">Home</a>
          <a routerLink="/manage-books" class="text-gray-700 hover:text-blue-600">Manage Books</a>
          <a routerLink="/audit-logs" class="text-gray-700 hover:text-blue-600">Audit Logs</a>
        </div>
        <div class="flex items-center space-x-4">
          @if (!authService.isLoggedIn()) {
            <a routerLink="/login" class="bg-blue-600 text-white px-4 py-2 rounded">Login</a>
            <a routerLink="/register" class="bg-green-600 text-white px-4 py-2 rounded">Register</a>
          } @else {
            <a routerLink="/profile" class="text-gray-700 hover:text-blue-600">
              {{ authService.getUser()?.userName }}
            </a>
            <button (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
