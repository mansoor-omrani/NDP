import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookService from '../services/BookService';
import HitService from '../services/HitService';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [hits, setHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [createdByUser, setCreatedByUser] = useState(null);

  useEffect(() => {
    loadBook();
    saveHit();
    loadHits();
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await BookService.getBookById(id);
      setBook(response.data);
      setLoading(false);
      
      // دریافت اطلاعات کاربر ایجادکننده
      if (response.data.createdBy) {
        loadUserInfo(response.data.createdBy);
      }
    } catch (err) {
      console.error('Error loading book:', err);
      setLoading(false);
    }
  };

  const loadUserInfo = async (userId) => {
    try {
      const token = AuthService.getToken();
      if (token) {
        const userResponse = await UserService.getUserById(userId, token);
        setCreatedByUser(userResponse.data);
      }
    } catch (err) {
      console.error('Error loading user info:', err);
    }
  };

  const saveHit = async () => {
    try {
      const token = localStorage.getItem('token');
      await HitService.saveHit('Book', parseInt(id), token);
    } catch (err) {
      console.error('Error saving hit:', err);
    }
  };

  const loadHits = async () => {
    try {
      const response = await HitService.getHits('Book', parseInt(id));
      setHits(response.data);
    } catch (err) {
      console.error('Error loading hits:', err);
    }
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

  if (!book) {
    return (
      <div className="text-center py-5">
        <div className="display-1 mb-3">📕</div>
        <h3 className="text-white">Book not found</h3>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="btn btn-outline-light mb-4">
        ← Back to Books
      </Link>

      <div className="card border-0 shadow-lg">
        {/* Header Section */}
        <div className="card-header text-white p-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px 15px 0 0'
        }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-6 fw-bold mb-2">{book.title}</h1>
              <p className="lead mb-1">
                <span className="me-2">✍️</span> {book.author}
              </p>
              <div className="mt-3">
                {book.genre && (
                  <span className="badge bg-light text-dark me-2 p-2">
                    🏷️ {book.genre}
                  </span>
                )}
                {book.publishedYear && (
                  <span className="badge bg-light text-dark me-2 p-2">
                    📅 {book.publishedYear}
                  </span>
                )}
                <span className="badge bg-light text-dark p-2">
                  👁️ {hits} Views
                </span>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div style={{
                width: '120px',
                height: '160px',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                fontSize: '4rem'
              }}>
                📖
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Info Cards */}
          <div className="row mb-4">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-light border-0 text-center h-100">
                <div className="card-body">
                  <div className="fs-3 mb-2">🏢</div>
                  <h6 className="text-muted mb-1">Publisher</h6>
                  <p className="fw-bold mb-0">{book.publisher || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-light border-0 text-center h-100">
                <div className="card-body">
                  <div className="fs-3 mb-2">📅</div>
                  <h6 className="text-muted mb-1">Published Year</h6>
                  <p className="fw-bold mb-0">{book.publishedYear || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-light border-0 text-center h-100">
                <div className="card-body">
                  <div className="fs-3 mb-2">🏷️</div>
                  <h6 className="text-muted mb-1">Genre</h6>
                  <p className="fw-bold mb-0">{book.genre || 'General'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-light border-0 text-center h-100">
                <div className="card-body">
                  <div className="fs-3 mb-2">👁️</div>
                  <h6 className="text-muted mb-1">Total Views</h6>
                  <p className="fw-bold mb-0">{hits}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {book.description && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">
                <span className="me-2">📝</span> Description
              </h5>
              <div className="card bg-light border-0">
                <div className="card-body">
                  <p className="text-dark mb-0" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                    {book.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">
                <span className="me-2">📋</span> Additional Information
              </h5>
              <div className="card bg-light border-0">
                <div className="card-body">
                  <table className="table table-sm mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted" width="40%">
                          <span className="me-2">👤</span> Created By
                        </td>
                        <td className="fw-bold">
                          {createdByUser ? (
                            <>
                              {createdByUser.firstName} {createdByUser.lastName}
                              <span className="text-muted ms-2">(@{createdByUser.userName})</span>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">
                          <span className="me-2">📅</span> Created Date
                        </td>
                        <td>{book.createdDate ? new Date(book.createdDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">
                          <span className="me-2">🔄</span> Last Modified
                        </td>
                        <td>{book.lastModifiedDate ? new Date(book.lastModifiedDate).toLocaleDateString() : 'Never'}</td>
                      </tr>
                      {book.url && (
                        <tr>
                          <td className="text-muted">
                            <span className="me-2">🔗</span> External Link
                          </td>
                          <td>
                            <a href={book.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                              Visit Link ↗
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">
                <span className="me-2">📷</span> Book Cover
              </h5>
              <div className="card bg-light border-0">
                <div className="card-body text-center">
                  {book.photo ? (
                    <img 
                      src={book.photo} 
                      alt={book.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ fontSize: '6rem', opacity: '0.5' }}>📚</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="card-footer bg-light p-3" style={{
          borderRadius: '0 0 15px 15px'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">
                📅 Last Updated: {book.lastModifiedDate ? new Date(book.lastModifiedDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div>
              <Link to="/" className="btn btn-outline-primary btn-sm me-2">
                ← Back
              </Link>
              <button className="btn btn-primary btn-sm">
                📖 Read Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
