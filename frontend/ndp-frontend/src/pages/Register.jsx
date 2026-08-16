import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">
              <span className="me-2">🎉</span> Create Account
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">First Name</label>
                  <input type="text" name="firstName" className="form-control"
                    value={formData.firstName} onChange={handleChange} placeholder="John" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Last Name</label>
                  <input type="text" name="lastName" className="form-control"
                    value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Username *</label>
                <input type="text" name="userName" className="form-control"
                  value={formData.userName} onChange={handleChange} placeholder="johndoe" required />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Password *</label>
                <input type="password" name="password" className="form-control"
                  value={formData.password} onChange={handleChange} placeholder="••••••••" required />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Email *</label>
                <input type="email" name="email" className="form-control"
                  value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Phone Number</label>
                <input type="text" name="phoneNumber" className="form-control"
                  value={formData.phoneNumber} onChange={handleChange} placeholder="+1 555 123 4567" />
              </div>
              
              {error && (
                <div className="alert alert-danger py-2">
                  ⚠️ {error}
                </div>
              )}
              
              <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-decoration-none">
                Already have an account? <strong>Login</strong>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
