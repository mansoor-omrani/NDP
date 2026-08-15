import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p class="text-gray-600 mb-4 text-center">Enter your email or phone number to reset your password.</p>
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email or Phone</label>
          <input type="text" [(ngModel)]="emailOrPhone" name="emailOrPhone" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        @if (message) {
          <p class="text-green-600 mb-4">{{ message }}</p>
        }
        @if (error) {
          <p class="text-red-600 mb-4">{{ error }}</p>
        }
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Send Reset Link
        </button>
      </form>
      <div class="mt-4 text-center">
        <a routerLink="/login" class="text-blue-600 hover:underline">Back to Login</a>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  emailOrPhone: string = '';
  message: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.message = '';
    this.error = '';
    
    // TODO: Call forgot password API
    this.message = 'If the account exists, a reset link has been sent.';
  }
}
