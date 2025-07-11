import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const rfiService = {
  // RFIs
  getRFIs: async (projectId: string, filters?: { search?: string; status?: string; priority?: string; category?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/rfis`, { params: filters });
    return response.data;
  },

  getRFIById: async (id: string) => {
    const response = await axios.get(`${API_URL}/rfis/${id}`);
    return response.data;
  },

  createRFI: async (projectId: string, data: any) => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/rfis`, data);
    return response.data;
  },

  updateRFI: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/rfis/${id}`, data);
    return response.data;
  },

  deleteRFI: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfis/${id}`);
    return response.data;
  },

  getStatuses: async () => {
    const response = await axios.get(`${API_URL}/rfis/statuses`);
    return response.data;
  },

  getPriorities: async () => {
    const response = await axios.get(`${API_URL}/rfis/priorities`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/rfis/categories`);
    return response.data;
  },

  updateRFIStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/rfis/${id}/status`, { status });
    return response.data;
  },

  assignRFI: async (id: string, assignedTo: string) => {
    const response = await axios.put(`${API_URL}/rfis/${id}/assign`, { assignedTo });
    return response.data;
  },

  // RFI Responses
  getResponses: async (rfiId: string) => {
    const response = await axios.get(`${API_URL}/rfis/${rfiId}/responses`);
    return response.data;
  },

  addResponse: async (rfiId: string, data: any) => {
    const response = await axios.post(`${API_URL}/rfis/${rfiId}/responses`, data);
    return response.data;
  },

  updateResponse: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/rfi-responses/${id}`, data);
    return response.data;
  },

  deleteResponse: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfi-responses/${id}`);
    return response.data;
  },

  markResponseOfficial: async (id: string) => {
    const response = await axios.put(`${API_URL}/rfi-responses/${id}/official`);
    return response.data;
  },

  // RFI Attachments
  getAttachments: async (rfiId: string) => {
    const response = await axios.get(`${API_URL}/rfis/${rfiId}/attachments`);
    return response.data;
  },

  uploadAttachment: async (rfiId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/rfis/${rfiId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAttachmentsForResponse: async (responseId: string) => {
    const response = await axios.get(`${API_URL}/rfi-responses/${responseId}/attachments`);
    return response.data;
  },

  uploadAttachmentForResponse: async (responseId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/rfi-responses/${responseId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadAttachment: async (id: string) => {
    const response = await axios.get(`${API_URL}/rfi-attachments/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteAttachment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfi-attachments/${id}`);
    return response.data;
  },

  // RFI References
  getReferences: async (rfiId: string) => {
    const response = await axios.get(`${API_URL}/rfis/${rfiId}/references`);
    return response.data;
  },

  addReference: async (rfiId: string, data: any) => {
    const response = await axios.post(`${API_URL}/rfis/${rfiId}/references`, data);
    return response.data;
  },

  updateReference: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/rfi-references/${id}`, data);
    return response.data;
  },

  deleteReference: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfi-references/${id}`);
    return response.data;
  },

  // RFI Comments
  getComments: async (rfiId: string) => {
    const response = await axios.get(`${API_URL}/rfis/${rfiId}/comments`);
    return response.data;
  },

  addComment: async (rfiId: string, data: any) => {
    const response = await axios.post(`${API_URL}/rfis/${rfiId}/comments`, data);
    return response.data;
  },

  updateComment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/rfi-comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfi-comments/${id}`);
    return response.data;
  },

  // RFI Distribution
  getDistribution: async (rfiId: string) => {
    const response = await axios.get(`${API_URL}/rfis/${rfiId}/distribution`);
    return response.data;
  },

  addDistributionUser: async (rfiId: string, data: any) => {
    const response = await axios.post(`${API_URL}/rfis/${rfiId}/distribution`, data);
    return response.data;
  },

  removeDistributionUser: async (id: string) => {
    const response = await axios.delete(`${API_URL}/rfi-distribution/${id}`);
    return response.data;
  },

  notifyDistribution: async (rfiId: string) => {
    const response = await axios.put(`${API_URL}/rfis/${rfiId}/notify`);
    return response.data;
  },
};

export default rfiService;


