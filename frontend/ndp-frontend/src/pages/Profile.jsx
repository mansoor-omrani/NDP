import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Change Password Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  
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

  useEffect(() => {
    loadUserData();
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

  const loadUserData = () => {
    const userData = AuthService.getUser();
    setUser(userData);
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        avatar: userData.avatar || ''
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call save profile API
      // await AuthService.updateProfile(formData);
      
      const updatedUser = {
        ...user,
        ...formData
      };
      AuthService.setUser(updatedUser);
      setUser(updatedUser);
      
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleChangePassword = async () => {
    // اعتبارسنجی
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    
    if (!passwordForm.newPassword) {
      showToast('Please enter a new password.', 'error');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const token = AuthService.getToken();
      await AuthService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        token
      );
      
      showToast('Password changed successfully!', 'success');
      handleClosePasswordModal();
    } catch (err) {
      console.error('Error changing password:', err);
      showToast('Failed to change password. Please check your current password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-5">
        <div className="display-1 mb-3">👤</div>
        <h3 className="text-white">Please login to view your profile</h3>
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

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Profile Header */}
          <div className="card mb-4 border-0 shadow">
            <div className="card-body p-0">
              <div className="text-white text-center p-4" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px 15px 0 0'
              }}>
                <div className="mb-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid white' }}
                    />
                  ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                      style={{
                        width: '100px',
                        height: '100px',
                        background: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: '#667eea'
                      }}
                    >
                      {user.firstName?.[0] || user.userName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="fw-bold mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="mb-2 opacity-75">@{user.userName}</p>
                <div>
                  {user.roles?.map(role => (
                    <span key={role} className="badge bg-light text-dark me-1">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="card border-0 shadow">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <span className="me-2">👤</span> Profile Information
              </h5>
              {!isEditing ? (
                <button onClick={handleEdit} className="btn btn-primary btn-sm">
                  ✏️ Edit Profile
                </button>
              ) : (
                <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                  ✖ Cancel
                </button>
              )}
            </div>
            <div className="card-body p-4">
              {!isEditing ? (
                /* View Mode */
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="me-3 fs-4">👤</div>
                      <div>
                        <label className="text-muted small mb-0">First Name</label>
                        <p className="fw-bold mb-0">{user.firstName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="me-3 fs-4">👤</div>
                      <div>
                        <label className="text-muted small mb-0">Last Name</label>
                        <p className="fw-bold mb-0">{user.lastName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="me-3 fs-4">📧</div>
                      <div>
                        <label className="text-muted small mb-0">Email</label>
                        <p className="fw-bold mb-0">{user.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="me-3 fs-4">📱</div>
                      <div>
                        <label className="text-muted small mb-0">Phone Number</label>
                        <p className="fw-bold mb-0">{user.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
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
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">📧</span>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">📱</span>
                      <input
                        type="text"
                        name="phoneNumber"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Avatar URL</label>
                    <div className="input-group">
                      <span className="input-group-text">🖼️</span>
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
                </form>
              )}
            </div>
            
            {isEditing && (
              <div className="card-footer bg-light d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="card border-0 shadow mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-bold">
                <span className="me-2">🔒</span> Security
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">Password</h6>
                  <p className="text-muted mb-0">Change your account password</p>
                </div>
                <button onClick={handleOpenPasswordModal} className="btn btn-outline-primary">
                  🔑 Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card border-0 shadow mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-bold">
                <span className="me-2">ℹ️</span> Account Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Username</label>
                  <p className="fw-bold mb-0">{user.userName}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Roles</label>
                  <div>
                    {user.roles?.map(role => (
                      <span key={role} className="badge bg-info text-dark me-1">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Last Login</label>
                    <p className="fw-bold mb-0">
                      {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  🔑 Change Password
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleClosePasswordModal}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text">🔒</span>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text">🔑</span>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text">✅</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClosePasswordModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Changing...
                    </>
                  ) : (
                    '🔑 Change Password'
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

export default Profile;
