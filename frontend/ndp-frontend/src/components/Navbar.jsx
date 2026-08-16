import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = AuthService.isLoggedIn();
  const user = AuthService.getUser();

  const getUserRoles = () => {
    return user?.roles || [];
  };

  const hasRole = (roles) => {
    const userRoles = getUserRoles();
    return roles.some(role => userRoles.includes(role));
  };

  const canManageBooks = hasRole(['Administrator', 'Manager', 'Operator']);
  const canManageUsers = hasRole(['Administrator']);
  const canViewAuditLogs = hasRole(['Administrator']);

  const handleLogout = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      AuthService.removeToken();
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-3 mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="me-2">📚</span>
          NDP Library
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <span className="me-1">🏠</span> Home
              </Link>
            </li>
            
            {canManageBooks && (
              <li className="nav-item">
                <Link to="/manage-books" className="nav-link">
                  <span className="me-1">📚</span> Manage Books
                </Link>
              </li>
            )}
            
            {canManageUsers && (
              <li className="nav-item">
                <Link to="/manage-users" className="nav-link">
                  <span className="me-1">👥</span> Manage Users
                </Link>
              </li>
            )}
            
            {canViewAuditLogs && (
              <li className="nav-item">
                <Link to="/audit-logs" className="nav-link">
                  <span className="me-1">📋</span> Audit Logs
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item me-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm px-4">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-light btn-sm px-4">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button 
                  className="btn btn-light btn-sm dropdown-toggle" 
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <span className="me-1">👤</span>
                  {user?.userName || 'User'}
                  {user?.roles?.length > 0 && (
                    <span className="badge bg-secondary ms-2">
                      {user.roles[0]}
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <span className="me-2">👤</span> My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <span className="me-2">🚪</span> Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
