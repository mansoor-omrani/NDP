import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookManage from './pages/BookManage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import AuditLog from './pages/AuditLog';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container flex-grow-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/manage-books" element={<BookManage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/audit-logs" element={<AuditLog />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
