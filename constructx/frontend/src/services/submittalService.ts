import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const submittalService = {
  // Submittals
  getSubmittals: async (projectId: string, filters?: { search?: string; status?: string; category?: string; ballInCourt?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/submittals`, { params: filters });
    return response.data;
  },

  getSubmittalById: async (id: string) => {
    const response = await axios.get(`${API_URL}/submittals/${id}`);
    return response.data;
  },

  createSubmittal: async (projectId: string, data: any) => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/submittals`, data);
    return response.data;
  },

  updateSubmittal: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/submittals/${id}`, data);
    return response.data;
  },

  deleteSubmittal: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittals/${id}`);
    return response.data;
  },

  getStatuses: async () => {
    const response = await axios.get(`${API_URL}/submittals/statuses`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/submittals/categories`);
    return response.data;
  },

  updateSubmittalStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/submittals/${id}/status`, { status });
    return response.data;
  },

  updateBallInCourt: async (id: string, ballInCourt: string) => {
    const response = await axios.put(`${API_URL}/submittals/${id}/ball-in-court`, { ballInCourt });
    return response.data;
  },

  // Submittal Items
  getSubmittalItems: async (submittalId: string) => {
    const response = await axios.get(`${API_URL}/submittals/${submittalId}/items`);
    return response.data;
  },

  addItemToSubmittal: async (submittalId: string, data: any) => {
    const response = await axios.post(`${API_URL}/submittals/${submittalId}/items`, data);
    return response.data;
  },

  updateSubmittalItem: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/submittal-items/${id}`, data);
    return response.data;
  },

  deleteSubmittalItem: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-items/${id}`);
    return response.data;
  },

  updateSubmittalItemStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/submittal-items/${id}/status`, { status });
    return response.data;
  },

  // Submittal Reviews
  getSubmittalReviews: async (submittalId: string) => {
    const response = await axios.get(`${API_URL}/submittals/${submittalId}/reviews`);
    return response.data;
  },

  createSubmittalReview: async (submittalId: string, data: any) => {
    const response = await axios.post(`${API_URL}/submittals/${submittalId}/reviews`, data);
    return response.data;
  },

  updateSubmittalReview: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/submittal-reviews/${id}`, data);
    return response.data;
  },

  deleteSubmittalReview: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-reviews/${id}`);
    return response.data;
  },

  completeSubmittalReview: async (id: string, decision: string, comments?: string) => {
    const response = await axios.put(`${API_URL}/submittal-reviews/${id}/complete`, { decision, comments });
    return response.data;
  },

  getPendingReviewsForUser: async (userId: string) => {
    const response = await axios.get(`${API_URL}/users/${userId}/pending-reviews`);
    return response.data;
  },

  // Submittal Attachments
  getSubmittalAttachments: async (submittalId: string) => {
    const response = await axios.get(`${API_URL}/submittals/${submittalId}/attachments`);
    return response.data;
  },

  uploadSubmittalAttachment: async (submittalId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/submittals/${submittalId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadSubmittalAttachment: async (id: string) => {
    const response = await axios.get(`${API_URL}/submittal-attachments/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteSubmittalAttachment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-attachments/${id}`);
    return response.data;
  },

  getSubmittalAttachmentVersions: async (id: string) => {
    const response = await axios.get(`${API_URL}/submittal-attachments/${id}/versions`);
    return response.data;
  },

  // Submittal Markups
  getMarkupsForAttachment: async (attachmentId: string) => {
    const response = await axios.get(`${API_URL}/submittal-attachments/${attachmentId}/markups`);
    return response.data;
  },

  createMarkup: async (attachmentId: string, data: any) => {
    const response = await axios.post(`${API_URL}/submittal-attachments/${attachmentId}/markups`, data);
    return response.data;
  },

  updateMarkup: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/submittal-markups/${id}`, data);
    return response.data;
  },

  deleteMarkup: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-markups/${id}`);
    return response.data;
  },

  getMarkupsForReview: async (reviewId: string) => {
    const response = await axios.get(`${API_URL}/submittal-reviews/${reviewId}/markups`);
    return response.data;
  },

  // Submittal Comments
  getSubmittalComments: async (submittalId: string) => {
    const response = await axios.get(`${API_URL}/submittals/${submittalId}/comments`);
    return response.data;
  },

  addCommentToSubmittal: async (submittalId: string, data: any) => {
    const response = await axios.post(`${API_URL}/submittals/${submittalId}/comments`, data);
    return response.data;
  },

  updateSubmittalComment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/submittal-comments/${id}`, data);
    return response.data;
  },

  deleteSubmittalComment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-comments/${id}`);
    return response.data;
  },

  // Submittal Distribution
  getSubmittalDistribution: async (submittalId: string) => {
    const response = await axios.get(`${API_URL}/submittals/${submittalId}/distribution`);
    return response.data;
  },

  addDistributionUser: async (submittalId: string, data: any) => {
    const response = await axios.post(`${API_URL}/submittals/${submittalId}/distribution`, data);
    return response.data;
  },

  removeDistributionUser: async (id: string) => {
    const response = await axios.delete(`${API_URL}/submittal-distribution/${id}`);
    return response.data;
  },

  notifyDistribution: async (submittalId: string) => {
    const response = await axios.put(`${API_URL}/submittals/${submittalId}/notify`);
    return response.data;
  },
};

export default submittalService;


