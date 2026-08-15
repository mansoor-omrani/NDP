import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Username</label>
          <input type="text" [(ngModel)]="userName" name="userName" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Password</label>
          <input type="password" [(ngModel)]="password" name="password" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input type="email" [(ngModel)]="email" name="email" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Phone Number</label>
          <input type="text" [(ngModel)]="phoneNumber" name="phoneNumber"
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">First Name</label>
          <input type="text" [(ngModel)]="firstName" name="firstName"
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Last Name</label>
          <input type="text" [(ngModel)]="lastName" name="lastName"
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        @if (error) {
          <p class="text-red-600 mb-4">{{ error }}</p>
        }
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Register
        </button>
      </form>
      <div class="mt-4 text-center">
        <a routerLink="/login" class="text-blue-600 hover:underline">Already have an account? Login</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  userName: string = '';
  password: string = '';
  email: string = '';
  phoneNumber: string = '';
  firstName: string = '';
  lastName: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    const userData = {
      userName: this.userName,
      password: this.password,
      email: this.email,
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = 'Registration failed. Please try again.';
        console.error('Register error:', error);
      }
    });
  }
}
