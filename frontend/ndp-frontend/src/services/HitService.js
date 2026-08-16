import axios from 'axios';
import API_URL from '../config';

const HitService = {
  saveHit(entityName, entityId, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.post(`${API_URL}/hits`, { entityName, entityId }, { headers });
  },

  getHits(entityName, entityId) {
    return axios.get(`${API_URL}/hits/${entityName}/${entityId}`);
  }
};

export default HitService;
