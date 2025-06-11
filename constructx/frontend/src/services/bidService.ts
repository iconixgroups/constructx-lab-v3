import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Service for handling bid-related API calls
 */
const bidService = {
  // Core Bid Operations
  getBids: async (filters = {}) => {
    return axios.get(`${API_URL}/bids`, { params: filters });
  },
  
  getBid: async (bidId) => {
    return axios.get(`${API_URL}/bids/${bidId}`);
  },
  
  createBid: async (bidData) => {
    return axios.post(`${API_URL}/bids`, bidData);
  },
  
  updateBid: async (bidId, bidData) => {
    return axios.put(`${API_URL}/bids/${bidId}`, bidData);
  },
  
  deleteBid: async (bidId) => {
    return axios.delete(`${API_URL}/bids/${bidId}`);
  },
  
  // Bid Status Management
  updateBidStatus: async (bidId, status) => {
    return axios.patch(`${API_URL}/bids/${bidId}/status`, { status });
  },
  
  // Bid Duplication and Conversion
  duplicateBid: async (bidId) => {
    return axios.post(`${API_URL}/bids/${bidId}/duplicate`);
  },
  
  convertToProject: async (bidId) => {
    return axios.post(`${API_URL}/bids/${bidId}/convert-to-project`);
  },
  
  // Bid Sections
  getBidSections: async (bidId) => {
    return axios.get(`${API_URL}/bids/${bidId}/sections`);
  },
  
  createBidSection: async (bidId, sectionData) => {
    return axios.post(`${API_URL}/bids/${bidId}/sections`, sectionData);
  },
  
  updateBidSection: async (bidId, sectionId, sectionData) => {
    return axios.put(`${API_URL}/bids/${bidId}/sections/${sectionId}`, sectionData);
  },
  
  deleteBidSection: async (bidId, sectionId) => {
    return axios.delete(`${API_URL}/bids/${bidId}/sections/${sectionId}`);
  },
  
  updateBidSectionsOrder: async (bidId, sectionsOrder) => {
    return axios.patch(`${API_URL}/bids/${bidId}/sections/order`, { sections: sectionsOrder });
  },
  
  // Bid Items
  getBidItems: async (bidId, sectionId) => {
    return axios.get(`${API_URL}/bids/${bidId}/sections/${sectionId}/items`);
  },
  
  createBidItem: async (bidId, sectionId, itemData) => {
    return axios.post(`${API_URL}/bids/${bidId}/sections/${sectionId}/items`, itemData);
  },
  
  updateBidItem: async (bidId, sectionId, itemId, itemData) => {
    return axios.put(`${API_URL}/bids/${bidId}/sections/${sectionId}/items/${itemId}`, itemData);
  },
  
  deleteBidItem: async (bidId, sectionId, itemId) => {
    return axios.delete(`${API_URL}/bids/${bidId}/sections/${sectionId}/items/${itemId}`);
  },
  
  updateBidItemsOrder: async (bidId, sectionId, itemsOrder) => {
    return axios.patch(`${API_URL}/bids/${bidId}/sections/${sectionId}/items/order`, { items: itemsOrder });
  },
  
  // Bid Documents
  getBidDocuments: async (bidId) => {
    return axios.get(`${API_URL}/bids/${bidId}/documents`);
  },
  
  uploadBidDocument: async (bidId, formData) => {
    return axios.post(`${API_URL}/bids/${bidId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteBidDocument: async (bidId, documentId) => {
    return axios.delete(`${API_URL}/bids/${bidId}/documents/${documentId}`);
  },
  
  downloadBidDocument: async (bidId, documentId) => {
    return axios.get(`${API_URL}/bids/${bidId}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  },
  
  getBidDocumentUrl: async (bidId, documentId) => {
    return axios.get(`${API_URL}/bids/${bidId}/documents/${documentId}/url`);
  },
  
  // Bid Versions
  getBidVersions: async (bidId) => {
    return axios.get(`${API_URL}/bids/${bidId}/versions`);
  },
  
  createBidVersion: async (bidId) => {
    return axios.post(`${API_URL}/bids/${bidId}/versions`);
  },
  
  restoreBidVersion: async (bidId, versionId) => {
    return axios.post(`${API_URL}/bids/${bidId}/versions/${versionId}/restore`);
  },
  
  downloadBidVersion: async (bidId, versionId) => {
    return axios.get(`${API_URL}/bids/${bidId}/versions/${versionId}/download`, {
      responseType: 'blob'
    });
  },
  
  getBidVersionUrl: async (bidId, versionId) => {
    return axios.get(`${API_URL}/bids/${bidId}/versions/${versionId}/url`);
  },
  
  compareBidVersions: async (bidId, fromVersionId, toVersionId) => {
    return axios.get(`${API_URL}/bids/${bidId}/versions/compare`, {
      params: { fromVersionId, toVersionId }
    });
  },
  
  // Bid Competitors
  getBidCompetitors: async (bidId) => {
    return axios.get(`${API_URL}/bids/${bidId}/competitors`);
  },
  
  createBidCompetitor: async (bidId, competitorData) => {
    return axios.post(`${API_URL}/bids/${bidId}/competitors`, competitorData);
  },
  
  updateBidCompetitor: async (bidId, competitorId, competitorData) => {
    return axios.put(`${API_URL}/bids/${bidId}/competitors/${competitorId}`, competitorData);
  },
  
  deleteBidCompetitor: async (bidId, competitorId) => {
    return axios.delete(`${API_URL}/bids/${bidId}/competitors/${competitorId}`);
  },
  
  // Related Data
  getClients: async () => {
    return axios.get(`${API_URL}/clients`);
  },
  
  getLeads: async () => {
    return axios.get(`${API_URL}/leads`);
  },
  
  getUsers: async () => {
    return axios.get(`${API_URL}/users`);
  },
  
  // Metrics and Dashboard
  getBidMetrics: async () => {
    return axios.get(`${API_URL}/bids/metrics`);
  },
  
  getBidsByStatus: async () => {
    return axios.get(`${API_URL}/bids/by-status`);
  }
};

export default bidService;
