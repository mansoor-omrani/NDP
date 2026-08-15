import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Books</h2>
      
      @if (loading) {
        <p class="text-center py-8">Loading books...</p>
      }
      
      @if (error) {
        <p class="text-center text-red-600 py-8">{{ error }}</p>
      }
      
      @if (!loading && !error) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (book of books; track book.bookId) {
            <div class="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer" [routerLink]="['/books', book.bookId]">
              <h3 class="font-bold">{{ book.title }}</h3>
              <p class="text-gray-600">{{ book.author }}</p>
              <p class="text-sm text-gray-500">{{ book.publishedYear }}</p>
              <p class="text-sm text-gray-500">{{ book.genre }}</p>
            </div>
          }
        </div>
        
        @if (books.length === 0) {
          <div class="text-center py-8">
            <p class="text-gray-500 mb-4">No books found.</p>
            <p class="text-sm text-gray-400">API URL: {{ apiUrl }}</p>
          </div>
        }
      }
    </div>
  `
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  loading: boolean = true;
  error: string = '';
  apiUrl: string = environment.apiUrl;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';
    
    this.bookService.getBooks(1, 12).subscribe({
      next: (response) => {
        this.books = response.items || [];
        this.loading = false;
        console.log('Books loaded:', this.books);
      },
      error: (error) => {
        this.error = 'Failed to load books. Please check if API is running.';
        this.loading = false;
        console.error('Error loading books:', error);
      }
    });
  }
}
