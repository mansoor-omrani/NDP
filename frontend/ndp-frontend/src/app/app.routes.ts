import { Routes } from '@angular/router';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { BookManageComponent } from './features/books/book-manage/book-manage.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { AuditLogComponent } from './features/audit/audit-log/audit-log.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'manage-books', component: BookManageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'audit-logs', component: AuditLogComponent },
  { path: '**', redirectTo: '' }
];
