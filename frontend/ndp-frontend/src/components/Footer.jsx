import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="text-white-50 mb-0">
              <span className="me-2">📚</span>
              NDP Library Management System
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-white-50 mb-0">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
