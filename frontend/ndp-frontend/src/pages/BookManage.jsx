import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import AuthService from '../services/AuthService';

const BookManage = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const user = AuthService.getUser();
  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('Administrator');
  const isManager = userRoles.includes('Manager');
  const isOperator = userRoles.includes('Operator');
  const canEdit = isAdmin || isManager || isOperator;
  const canDelete = isAdmin || isManager;
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publishedYear: '',
    genre: '',
    photo: '',
    description: '',
    url: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await BookService.getBooks(1, 100, '', true);
      setBooks(response.data.items || []);
    } catch (err) {
      console.error('Error loading books:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      publisher: '',
      publishedYear: '',
      genre: '',
      photo: '',
      description: '',
      url: ''
    });
    setEditingBook(null);
    setError('');
    setSuccess('');
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      publisher: book.publisher || '',
      publishedYear: book.publishedYear || '',
      genre: book.genre || '',
      photo: book.photo || '',
      description: book.description || '',
      url: book.url || ''
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = AuthService.getToken();
      
      if (editingBook) {
        await BookService.updateBook(editingBook.bookId, formData, token);
        setSuccess('Book updated successfully!');
      } else {
        await BookService.addBook(formData, token);
        setSuccess('Book added successfully!');
      }
      
      loadBooks();
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setError('Failed to save book. Please try again.');
      console.error('Error saving book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book? (Soft Delete)')) {
      try {
        const token = AuthService.getToken();
        await BookService.deleteBook(id, token);
        setSuccess('Book deleted successfully!');
        loadBooks();
      } catch (err) {
        setError('Failed to delete book.');
        console.error('Error deleting book:', err);
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to PERMANENTLY delete this book? This action cannot be undone!')) {
      try {
        const token = AuthService.getToken();
        await BookService.deletePermanently(id, token);
        setSuccess('Book permanently deleted!');
        loadBooks();
      } catch (err) {
        setError('Failed to permanently delete book.');
        console.error('Error permanently deleting book:', err);
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this book?')) {
      try {
        const token = AuthService.getToken();
        await BookService.restoreBook(id, token);
        setSuccess('Book restored successfully!');
        loadBooks();
      } catch (err) {
        setError('Failed to restore book.');
        console.error('Error restoring book:', err);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold mb-0">Manage Books</h2>
        {canEdit && (
          <button onClick={handleAddNew} className="btn btn-light btn-lg rounded-pill px-4">
            <span className="me-2">➕</span> Add New Book
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          ⚠️ {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          ✅ {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {showForm && canEdit && (
        <div className="card mb-4">
          <div className={`card-header text-white ${editingBook ? 'bg-warning' : 'bg-success'}`}>
            <h5 className="mb-0">
              {editingBook ? '✏️ Edit Book' : '📚 Add New Book'}
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Author <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    className="form-control"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="Enter publisher name"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Published Year</label>
                  <input
                    type="text"
                    name="publishedYear"
                    className="form-control"
                    value={formData.publishedYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Genre</label>
                  <select
                    name="genre"
                    className="form-select"
                    value={formData.genre}
                    onChange={handleInputChange}
                  >
                    <option value="">Select genre...</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Drama">Drama</option>
                    <option value="Children">Children</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Photo URL</label>
                  <input
                    type="url"
                    name="photo"
                    className="form-control"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Book URL</label>
                <input
                  type="url"
                  name="url"
                  className="form-control"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/book-details"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter book description..."
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn ${editingBook ? 'btn-warning' : 'btn-success'} btn-lg px-5`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : editingBook ? (
                    '✏️ Update Book'
                  ) : (
                    '➕ Add Book'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg px-5"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr className="table-dark">
                  <th className="px-4">ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Year</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr 
                    key={book.bookId} 
                    className={book.isDeleted ? 'table-danger opacity-75' : ''}
                    style={book.isDeleted ? { backgroundColor: '#ffe6e6' } : {}}
                  >
                    <td className="px-4">{book.bookId}</td>
                    <td className="fw-bold">
                      {book.title}
                      {book.isDeleted && (
                        <span className="ms-2 badge bg-danger">Deleted</span>
                      )}
                    </td>
                    <td>{book.author}</td>
                    <td>{book.publisher || '-'}</td>
                    <td>{book.publishedYear || '-'}</td>
                    <td>
                      <span className="badge bg-info text-dark">{book.genre || 'General'}</span>
                    </td>
                    <td>
                      {book.isDeleted ? (
                        <span className="badge bg-danger">Soft Deleted</span>
                      ) : (
                        <span className="badge bg-success">Active</span>
                      )}
                    </td>
                    <td className="text-end px-4">
                      {!book.isDeleted ? (
                        <>
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(book)}
                              className="btn btn-sm btn-outline-primary me-1"
                              title="Edit"
                            >
                              ✏️
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(book.bookId)}
                              className="btn btn-sm btn-outline-danger me-1"
                              title="Soft Delete"
                            >
                              🗑️
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handlePermanentDelete(book.bookId)}
                              className="btn btn-sm btn-outline-dark"
                              title="Permanent Delete"
                            >
                              ⛔
                            </button>
                          )}
                        </>
                      ) : (
                        isAdmin && (
                          <button
                            onClick={() => handleRestore(book.bookId)}
                            className="btn btn-sm btn-outline-success"
                            title="Restore"
                          >
                            ♻️ Restore
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManage;
