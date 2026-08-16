import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="container py-4">
      <div className="text-center">
        <Link to="/" className="text-decoration-none">
          <h1 className="display-4 fw-bold text-white mb-2">
            📚 NDP Library
          </h1>
          <p className="lead text-white-50 mb-0">
            Digital Book Management System
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
