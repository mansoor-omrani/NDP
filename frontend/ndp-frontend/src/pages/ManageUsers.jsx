import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUserId, setRoleUserId] = useState(null);
  const [roleUserName, setRoleUserName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  
  // Toast states
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

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

  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success'
      });
    }, 3000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      const response = await UserService.getUsers(1, 100, searchTerm, token);
      setUsers(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading users:', err);
      showToast('Failed to load users.', 'error');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setTimeout(() => loadUsers(), 100);
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
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async () => {
    try {
      const token = AuthService.getToken();
      
      if (editingUser) {
        await UserService.updateUser(editingUser.userId || editingUser.id, formData, token);
        showToast('User updated successfully!', 'success');
        loadUsers();
        handleCloseEditModal();
      }
    } catch (err) {
      console.error('Error updating user:', err);
      showToast('Failed to update user.', 'error');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
      try {
        const token = AuthService.getToken();
        await UserService.deleteUser(user.userId || user.id, token);
        showToast('User deleted successfully!', 'success');
        loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        showToast('Failed to delete user.', 'error');
      }
    }
  };

  const handleEditRoles = (user) => {
    setRoleUserId(user.userId || user.id);
    setRoleUserName(user.userName);
    setSelectedRoles(user.roles || []);
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setRoleUserId(null);
    setRoleUserName('');
    setSelectedRoles([]);
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
      showToast('Roles updated successfully!', 'success');
      handleCloseRoleModal();
      loadUsers();
    } catch (err) {
      console.error('Error saving roles:', err);
      showToast('Failed to update roles.', 'error');
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

      <h2 className="text-white fw-bold mb-4">
        <span className="me-2">👥</span> Manage Users
      </h2>

      {/* Search */}
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
          {searchTerm && (
            <button type="button" className="btn btn-secondary" onClick={handleResetSearch}>
              ✖
            </button>
          )}
        </div>
      </form>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr className="table-dark">
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <div className="fs-1 mb-2">👥</div>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
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
                          title="Edit User"
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
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  ✏️ Edit User: {editingUser.userName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseEditModal}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
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
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 555 123 4567"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    className="form-control"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateUser}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  👤 Edit Roles for {roleUserName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseRoleModal}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                <p className="text-muted mb-3">
                  Select roles for <strong>{roleUserName}</strong>
                </p>
                <div className="list-group">
                  {availableRoles.map(role => (
                    <label 
                      key={role} 
                      className="list-group-item d-flex align-items-center cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseRoleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleSaveRoles}
                >
                  💾 Save Roles
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
