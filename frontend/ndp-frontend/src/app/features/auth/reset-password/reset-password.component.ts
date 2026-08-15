import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">New Password</label>
          <input type="password" [(ngModel)]="newPassword" name="newPassword" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Confirm Password</label>
          <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                 class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        @if (error) {
          <p class="text-red-600 mb-4">{{ error }}</p>
        }
        @if (message) {
          <p class="text-green-600 mb-4">{{ message }}</p>
        }
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Reset Password
        </button>
      </form>
    </div>
  `
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  error: string = '';
  message: string = '';

  onSubmit(): void {
    this.error = '';
    this.message = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    // TODO: Call reset password API
    this.message = 'Password has been reset successfully.';
  }
}
