import axios from 'axios';
import API_URL from '../config';

const AuditService = {
  getAuditLogs(filters = {}, token) {
    const params = {
      page: filters.page || 1,
      pageSize: filters.pageSize || 20
    };
    
    // اضافه کردن فیلترها فقط اگر مقدار دارند
    if (filters.userName) params.userName = filters.userName;
    if (filters.entityName) params.entityName = filters.entityName;
    if (filters.action) params.action = filters.action;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    
    return axios.get(`${API_URL}/audits`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default AuditService;
