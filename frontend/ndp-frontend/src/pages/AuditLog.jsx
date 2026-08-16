import React, { useState, useEffect } from 'react';
import AuditService from '../services/AuditService';
import AuthService from '../services/AuthService';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // فیلترها
  const [filters, setFilters] = useState({
    userName: '',
    entityName: '',
    action: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, pageSize]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const token = AuthService.getToken();
      
      if (!token) {
        setError('Please login to view audit logs.');
        setLoading(false);
        return;
      }
      
      const params = {
        page: currentPage,
        pageSize: pageSize,
        ...filters
      };
      
      const response = await AuditService.getAuditLogs(params, token);
      
      setAuditLogs(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError('Failed to load audit logs. Please check if you have permission.');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAuditLogs();
  };

  const handleReset = () => {
    setFilters({
      userName: '',
      entityName: '',
      action: '',
      fromDate: '',
      toDate: ''
    });
    setCurrentPage(1);
    setTimeout(() => {
      loadAuditLogs();
    }, 100);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getActionBadge = (action) => {
    const actionStyles = {
      'Add': 'bg-success',
      'Edit': 'bg-warning text-dark',
      'SoftDelete': 'bg-danger',
      'Restore': 'bg-info text-dark',
      'HardDelete': 'bg-danger',
      'Login': 'bg-primary',
      'Logout': 'bg-secondary',
      'Register': 'bg-info text-dark',
      'SaveProfile': 'bg-warning text-dark',
      'AssignRole': 'bg-primary',
      'Delete': 'bg-danger'
    };
    
    return actionStyles[action] || 'bg-secondary';
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
      <h2 className="text-white fw-bold mb-4">
        <span className="me-2">📋</span> Audit Logs
      </h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          ⚠️ {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Filter Section - Compact */}
      <div className="card mb-3">
        <div className="card-body py-2">
          <form onSubmit={handleSearch}>
            <div className="row g-2 align-items-end">
              <div className="col-md-3">
                <label className="form-label small mb-1 fw-bold">Username</label>
                <input
                  type="text"
                  name="userName"
                  className="form-control form-control-sm"
                  value={filters.userName}
                  onChange={handleFilterChange}
                  placeholder="Filter by username..."
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small mb-1 fw-bold">Entity</label>
                <select
                  name="entityName"
                  className="form-control form-control-sm form-select"
                  value={filters.entityName}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="Book">Book</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small mb-1 fw-bold">Action</label>
                <select
                  name="action"
                  className="form-control form-control-sm form-select"
                  value={filters.action}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="Add">Add</option>
                  <option value="Edit">Edit</option>
                  <option value="SoftDelete">SoftDelete</option>
                  <option value="Restore">Restore</option>
                  <option value="HardDelete">HardDelete</option>
                  <option value="Login">Login</option>
                  <option value="Logout">Logout</option>
                  <option value="Register">Register</option>
                  <option value="SaveProfile">SaveProfile</option>
                  <option value="AssignRole">AssignRole</option>
                  <option value="Delete">Delete</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small mb-1 fw-bold">From</label>
                <input
                  type="date"
                  name="fromDate"
                  className="form-control form-control-sm"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small mb-1 fw-bold">To</label>
                <input
                  type="date"
                  name="toDate"
                  className="form-control form-control-sm"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-primary btn-sm w-100">
                  🔍
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Audit Logs Table - Condensed */}
      <div className="card">
        <div className="card-header bg-primary text-white py-2 d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Audit Logs</h6>
          <span className="badge bg-light text-dark">
            {totalCount} records
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="py-2">Date & Time</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Action</th>
                  <th className="py-2">Entity</th>
                  <th className="py-2">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      📋 No audit logs found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, index) => (
                    <tr key={log.id}>
                      <td className="px-2 py-1 text-muted small">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="py-1 small">
                        <div className="fw-bold">
                          {new Date(log.auditDate).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(log.auditDate).toLocaleTimeString()}
                        </small>
                      </td>
                      <td className="py-1">
                        <span className="fw-bold small">{log.userName || 'Anonymous'}</span>
                      </td>
                      <td className="py-1">
                        <span className={`badge ${getActionBadge(log.action)}`} style={{ fontSize: '0.7rem' }}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-1 small">
                        {log.entityName} <span className="text-muted">#{log.entityId}</span>
                      </td>
                      <td className="py-1">
                        <code className="small text-muted">{log.ip}</code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Compact */}
        <div className="card-footer py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Show:</span>
              <select
                className="form-control form-control-sm form-select"
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 'auto' }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-muted small">entries</span>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">
                Page {currentPage} of {totalPages || 1}
              </span>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      ←
                    </button>
                  </li>
                  
                  {[...Array(totalPages || 1)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <li
                          key={pageNum}
                          className={`page-item ${pageNum === currentPage ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                    return null;
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      →
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
