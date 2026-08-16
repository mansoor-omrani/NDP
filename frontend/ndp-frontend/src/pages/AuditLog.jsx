import React, { useState, useEffect } from 'react';
import AuditService from '../services/AuditService';
import AuthService from '../services/AuthService';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
      
      console.log('Loading audit logs with params:', params);
      
      const response = await AuditService.getAuditLogs(params, token);
      console.log('Audit logs response:', response.data);
      
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
    // بعد از reset دوباره لود کن
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

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">🔍 Filters</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Username</label>
                <input
                  type="text"
                  name="userName"
                  className="form-control form-control-sm"
                  value={filters.userName}
                  onChange={handleFilterChange}
                  placeholder="Filter by username..."
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Entity Name</label>
                <select
                  name="entityName"
                  className="form-select form-select-sm"
                  value={filters.entityName}
                  onChange={handleFilterChange}
                >
                  <option value="">All Entities</option>
                  <option value="Book">Book</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">Action</label>
                <select
                  name="action"
                  className="form-select form-select-sm"
                  value={filters.action}
                  onChange={handleFilterChange}
                >
                  <option value="">All Actions</option>
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
                <label className="form-label small fw-bold">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  className="form-control form-control-sm"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  className="form-control form-control-sm"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary btn-sm">
                🔍 Apply Filters
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
                🗑️ Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Audit Logs</h6>
          <span className="badge bg-light text-dark">
            Total: {totalCount} records
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-3">#</th>
                  <th>Date & Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <div className="fs-1 mb-2">📋</div>
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, index) => (
                    <tr key={log.id}>
                      <td className="px-3">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td>
                        <div className="fw-bold">
                          {new Date(log.auditDate).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(log.auditDate).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <span className="fw-bold">{log.userName || 'Anonymous'}</span>
                      </td>
                      <td>
                        <span className={`badge ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        {log.entityName} #{log.entityId}
                      </td>
                      <td>
                        <code className="small">{log.ip}</code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <select
                  className="form-select form-select-sm"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  style={{ width: 'auto', display: 'inline-block' }}
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
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
                  
                  {[...Array(totalPages)].map((_, i) => {
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
        )}
      </div>
    </div>
  );
};

export default AuditLog;
