import axios from 'axios';
import API_URL from '../config';

const BookService = {
  getBooks(page = 1, pageSize = 12, searchTerm = '', includeDeleted = false) {
    const params = { page, pageSize };
    if (searchTerm && searchTerm.trim() !== '') {
      params.searchTerm = searchTerm.trim();
    }
    if (includeDeleted) {
      params.includeDeleted = true;
    }
    return axios.get(`${API_URL}/books`, { params });
  },

  getBookById(id) {
    return axios.get(`${API_URL}/books/${id}`);
  },

  addBook(book, token) {
    return axios.post(`${API_URL}/books`, book, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateBook(id, book, token) {
    return axios.put(`${API_URL}/books/${id}`, book, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deleteBook(id, token) {
    return axios.delete(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deletePermanently(id, token) {
    return axios.delete(`${API_URL}/books/${id}/permanent`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  restoreBook(id, token) {
    return axios.patch(`${API_URL}/books/${id}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  exportBooksExcel(token) {
    return axios.get(`${API_URL}/books/export`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  }
};

export default BookService;
