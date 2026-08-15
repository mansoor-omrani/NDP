import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { HitService } from '../../../core/services/hit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto">
      @if (book) {
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-3xl font-bold mb-4">{{ book.title }}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Author:</strong> {{ book.author }}</p>
              <p><strong>Publisher:</strong> {{ book.publisher }}</p>
              <p><strong>Year:</strong> {{ book.publishedYear }}</p>
              <p><strong>Genre:</strong> {{ book.genre }}</p>
              <p><strong>Hits:</strong> {{ hits }}</p>
            </div>
            <div>
              @if (book.photo) {
                <img [src]="book.photo" [alt]="book.title" class="max-w-full h-auto rounded">
              }
            </div>
          </div>
          @if (book.description) {
            <div class="mt-4">
              <h3 class="font-bold">Description:</h3>
              <p>{{ book.description }}</p>
            </div>
          }
        </div>
      } @else {
        <p class="text-center py-8">Loading...</p>
      }
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  book: any = null;
  hits: number = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private hitService: HitService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (error) => {
        console.error('Error loading book:', error);
      }
    });

    this.hitService.saveHit('Book', id).subscribe();
    this.hitService.getHits('Book', id).subscribe({
      next: (hits) => {
        this.hits = hits;
      }
    });
  }
}
