import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Username</label>
          <input type="text" [(ngModel)]="username" name="username" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Password</label>
          <input type="password" [(ngModel)]="password" name="password" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        @if (error) {
          <p class="text-red-600 mb-4">{{ error }}</p>
        }
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Login
        </button>
      </form>
      <div class="mt-4 text-center space-y-2">
        <a routerLink="/register" class="text-blue-600 hover:underline block">Don't have an account? Register</a>
        <a routerLink="/forgot-password" class="text-gray-600 hover:underline block">Forgot password?</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }
}
