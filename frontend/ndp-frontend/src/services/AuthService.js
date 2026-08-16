import axios from 'axios';
import API_URL from '../config';

const AuthService = {
  register(userData) {
    return axios.post(`${API_URL}/auth/register`, userData);
  },

  login(username, password) {
    return axios.post(`${API_URL}/auth/login`, { username, password });
  },

  logout(token) {
    return axios.post(`${API_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    // اطمینان از ذخیره roles
    const userWithRoles = {
      ...user,
      roles: user.roles || []
    };
    localStorage.setItem('user', JSON.stringify(userWithRoles));
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  getUserRoles() {
    const user = this.getUser();
    return user?.roles || [];
  },

  hasRole(roles) {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
};

export default AuthService;
