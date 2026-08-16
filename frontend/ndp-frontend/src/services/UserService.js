import axios from 'axios';
import API_URL from '../config';

const UserService = {
  getUsers(page = 1, pageSize = 20, searchTerm = '', token) {
    const params = { page, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;
    return axios.get(`${API_URL}/users`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getUserById(id, token) {
    return axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateUser(id, userData, token) {
    return axios.put(`${API_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deleteUser(id, token) {
    return axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  assignRoles(userId, roleIds, token) {
    return axios.post(`${API_URL}/users/${userId}/roles`, { roleIds }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default UserService;
