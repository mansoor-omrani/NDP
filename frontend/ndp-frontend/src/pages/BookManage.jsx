import React, { useState, useEffect, useRef } from 'react';
import BookService from '../services/BookService';
import AuthService from '../services/AuthService';

const BookManage = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Toast states
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
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

  const toastRef = useRef(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success'
      });
    }, 3000);
  };

  const loadBooks = async () => {
    try {
      const response = await BookService.getBooks(1, 100, '', true);
      setBooks(response.data.items || []);
    } catch (err) {
      console.error('Error loading books:', err);
      showToast('Failed to load books.', 'error');
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
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = AuthService.getToken();
      
      if (editingBook) {
        await BookService.updateBook(editingBook.bookId, formData, token);
        showToast('Book updated successfully!', 'success');
      } else {
        await BookService.addBook(formData, token);
        showToast('Book added successfully!', 'success');
      }
      
      loadBooks();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving book:', err);
      showToast('Failed to save book. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book? (Soft Delete)')) {
      try {
        const token = AuthService.getToken();
        await BookService.deleteBook(id, token);
        showToast('Book deleted successfully!', 'success');
        loadBooks();
      } catch (err) {
        console.error('Error deleting book:', err);
        showToast('Failed to delete book.', 'error');
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to PERMANENTLY delete this book? This action cannot be undone!')) {
      try {
        const token = AuthService.getToken();
        await BookService.deletePermanently(id, token);
        showToast('Book permanently deleted!', 'success');
        loadBooks();
      } catch (err) {
        console.error('Error permanently deleting book:', err);
        showToast('Failed to permanently delete book.', 'error');
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this book?')) {
      try {
        const token = AuthService.getToken();
        await BookService.restoreBook(id, token);
        showToast('Book restored successfully!', 'success');
        loadBooks();
      } catch (err) {
        console.error('Error restoring book:', err);
        showToast('Failed to restore book.', 'error');
      }
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`toast show position-fixed top-0 end-0 m-4 ${toast.type === 'success' ? 'bg-success' : 'bg-danger'}`}
          style={{ zIndex: 9999 }}
          role="alert"
        >
          <div className="toast-header">
            <strong className="me-auto">
              {toast.type === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
            ></button>
          </div>
          <div className="toast-body text-white">
            {toast.message}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold mb-0">Manage Books</h2>
        {canEdit && (
          <button onClick={handleAddNew} className="btn btn-light btn-lg rounded-pill px-4">
            <span className="me-2">➕</span> Add New Book
          </button>
        )}
      </div>

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
                    style={book.isDeleted ? { backgroundColor: '#ffe6e6', opacity: '0.8' } : {}}
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

      {/* Book Form Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header text-white ${editingBook ? 'bg-warning' : 'bg-success'}`}>
                <h5 className="modal-title">
                  {editingBook ? '✏️ Edit Book' : '📚 Add New Book'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              
              <div className="modal-body p-4">
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
                </form>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${editingBook ? 'btn-warning' : 'btn-success'}`}
                  onClick={handleSubmit}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManage;
