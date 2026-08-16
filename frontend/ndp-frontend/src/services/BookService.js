import axios from 'axios';
import API_URL from '../config';

const BookService = {
  getBooks(page = 1, pageSize = 12, searchTerm = '') {
    const params = { page, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;
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

  restoreBook(id, token) {
    return axios.patch(`${API_URL}/books/${id}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default BookService;
