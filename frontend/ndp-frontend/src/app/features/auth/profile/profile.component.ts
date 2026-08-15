import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">My Profile</h2>
      @if (user) {
        <div class="space-y-4">
          <div class="flex items-center justify-center">
            @if (user.avatar) {
              <img [src]="user.avatar" alt="Avatar" class="w-24 h-24 rounded-full">
            } @else {
              <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
                {{ user.firstName?.[0] || user.userName?.[0] | uppercase }}
              </div>
            }
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-1">Username</label>
              <p class="font-semibold">{{ user.userName }}</p>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">Email</label>
              <p class="font-semibold">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-gray-700 mb-1">First Name</label>
              <input type="text" [(ngModel)]="user.firstName" class="w-full px-3 py-2 border rounded">
            </div>
            <div>
              <label class="block text-gray-700 mb-1">Last Name</label>
              <input type="text" [(ngModel)]="user.lastName" class="w-full px-3 py-2 border rounded">
            </div>
            <div>
              <label class="block text-gray-700 mb-1">Phone</label>
              <p class="font-semibold">{{ user.phoneNumber }}</p>
            </div>
          </div>
          
          @if (message) {
            <p class="text-green-600">{{ message }}</p>
          }
          
          <button (click)="saveProfile()" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Save Profile
          </button>
        </div>
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  message: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  saveProfile(): void {
    // TODO: Call save profile API
    this.message = 'Profile saved successfully.';
  }
}
