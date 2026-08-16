import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await BookService.getBooks(1, 12, searchTerm);
      setBooks(response.data.items || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-white fw-bold">Explore Our Books</h2>
        <p className="text-white-50">Discover your next favorite book</p>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
          />
          <button type="submit" className="btn btn-primary">
            🔍 Search
          </button>
        </div>
      </form>

      {books.length === 0 ? (
        <div className="text-center text-white-50 py-5">
          <h3>📚 No books found</h3>
        </div>
      ) : (
        <div className="row">
          {books.map((book) => (
            <div key={book.bookId} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <Link to={`/books/${book.bookId}`} className="text-decoration-none">
                <div className="card h-100 hover-shadow">
                  <div className="card-body text-center">
                    <div className="display-4 mb-3">📖</div>
                    <h5 className="card-title text-dark fw-bold">{book.title}</h5>
                    <p className="card-text text-muted mb-1">{book.author}</p>
                    <p className="card-text">
                      <span className="badge bg-primary me-1">{book.genre || 'General'}</span>
                      <span className="badge bg-secondary">{book.publishedYear || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
