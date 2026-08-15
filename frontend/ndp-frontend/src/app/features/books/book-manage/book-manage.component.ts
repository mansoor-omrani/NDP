import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-manage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Manage Books</h2>
        <button (click)="showAddForm = !showAddForm" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Book
        </button>
      </div>

      @if (showAddForm) {
        <div class="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-bold mb-4">Add Book</h3>
          <form (ngSubmit)="addBook()">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-1">Title</label>
                <input type="text" [(ngModel)]="newBook.title" name="title" required class="w-full px-3 py-2 border rounded">
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Author</label>
                <input type="text" [(ngModel)]="newBook.author" name="author" required class="w-full px-3 py-2 border rounded">
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Publisher</label>
                <input type="text" [(ngModel)]="newBook.publisher" name="publisher" class="w-full px-3 py-2 border rounded">
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Year</label>
                <input type="text" [(ngModel)]="newBook.publishedYear" name="publishedYear" class="w-full px-3 py-2 border rounded">
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Genre</label>
                <input type="text" [(ngModel)]="newBook.genre" name="genre" class="w-full px-3 py-2 border rounded">
              </div>
            </div>
            <button type="submit" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Book
            </button>
          </form>
        </div>
      }

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Title</th>
              <th class="px-4 py-2 text-left">Author</th>
              <th class="px-4 py-2 text-left">Year</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (book of books; track book.bookId) {
              <tr class="border-b hover:bg-gray-50" [class.bg-red-50]="book.isDeleted">
                <td class="px-4 py-2">{{ book.bookId }}</td>
                <td class="px-4 py-2">{{ book.title }}</td>
                <td class="px-4 py-2">{{ book.author }}</td>
                <td class="px-4 py-2">{{ book.publishedYear }}</td>
                <td class="px-4 py-2">
                  @if (book.isDeleted) {
                    <span class="text-red-600">Deleted</span>
                  } @else {
                    <span class="text-green-600">Active</span>
                  }
                </td>
                <td class="px-4 py-2 space-x-2">
                  @if (!book.isDeleted) {
                    <button (click)="deleteBook(book.bookId)" class="text-red-600 hover:underline">Delete</button>
                  } @else {
                    <button (click)="restoreBook(book.bookId)" class="text-green-600 hover:underline">Restore</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookManageComponent implements OnInit {
  books: any[] = [];
  showAddForm: boolean = false;
  newBook: any = {
    title: '',
    author: '',
    publisher: '',
    publishedYear: '',
    genre: '',
    photo: '',
    description: '',
    url: ''
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks(1, 50, undefined).subscribe({
      next: (response) => {
        this.books = response.items;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  addBook(): void {
    this.bookService.addBook(this.newBook).subscribe({
      next: () => {
        this.loadBooks();
        this.showAddForm = false;
        this.newBook = {
          title: '',
          author: '',
          publisher: '',
          publishedYear: '',
          genre: '',
          photo: '',
          description: '',
          url: ''
        };
      },
      error: (error) => {
        console.error('Error adding book:', error);
      }
    });
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        }
      });
    }
  }

  restoreBook(id: number): void {
    this.bookService.restoreBook(id).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error restoring book:', error);
      }
    });
  }
}
