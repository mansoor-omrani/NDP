import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleUserId, setRoleUserId] = useState(null);
  const [roleUserName, setRoleUserName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: ''
  });

  const availableRoles = ['Administrator', 'Manager', 'Operator', 'Member'];
  const roleMap = {
    'Administrator': 1,
    'Manager': 2,
    'Operator': 3,
    'Member': 4
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      const response = await UserService.getUsers(1, 100, searchTerm, token);
      setUsers(response.data.items || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users.');
      setLoading(false);
      console.error('Error loading users:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      avatar: ''
    });
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      avatar: user.avatar || ''
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = AuthService.getToken();
      
      if (editingUser) {
        await UserService.updateUser(editingUser.userId || editingUser.id, formData, token);
        setSuccess('User updated successfully!');
      }
      
      loadUsers();
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setError('Failed to save user.');
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
      try {
        const token = AuthService.getToken();
        await UserService.deleteUser(user.userId || user.id, token);
        setSuccess('User deleted successfully!');
        loadUsers();
      } catch (err) {
        setError('Failed to delete user.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleEditRoles = (user) => {
    setRoleUserId(user.userId || user.id);
    setRoleUserName(user.userName);
    setSelectedRoles(user.roles || []);
    setShowRoleModal(true);
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSaveRoles = async () => {
    try {
      const token = AuthService.getToken();
      const roleIds = selectedRoles.map(roleName => roleMap[roleName]).filter(Boolean);
      await UserService.assignRoles(roleUserId, roleIds, token);
      setShowRoleModal(false);
      setSuccess('Roles updated successfully!');
      loadUsers();
    } catch (err) {
      console.error('Error saving roles:', err);
      setError('Failed to update roles.');
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold mb-0">Manage Users</h2>
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

      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or username..."
          />
          <button type="submit" className="btn btn-primary">
            🔍 Search
          </button>
        </div>
      </form>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              {editingUser ? `✏️ Edit User: ${editingUser.userName}` : '👤 Edit User'}
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  className="form-control"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary px-5">
                  💾 Save Changes
                </button>
                <button type="button" className="btn btn-secondary px-5" onClick={() => setShowForm(false)}>
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
                <tr>
                  <th className="px-4">ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Roles</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId || user.id}>
                    <td className="px-4">{user.userId || user.id}</td>
                    <td className="fw-bold">{user.userName}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || '-'}</td>
                    <td>
                      {user.roles?.map(role => (
                        <span key={role} className="badge bg-info text-dark me-1">
                          {role}
                        </span>
                      ))}
                    </td>
                    <td className="text-end px-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEditRoles(user)}
                        className="btn btn-sm btn-outline-warning me-1"
                        title="Edit Roles"
                      >
                        👤
                      </button>
                      {user.userName !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Edit Modal */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  Edit Roles for {roleUserName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  Select roles for <strong>{roleUserName}</strong>
                </p>
                <div className="list-group">
                  {availableRoles.map(role => (
                    <label key={role} className="list-group-item d-flex align-items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                      />
                      <span className="fw-bold">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-warning" onClick={handleSaveRoles}>
                  Save Roles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
