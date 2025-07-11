import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const approvalService = {
  // Approval Workflows
  getApprovalWorkflows: async (filters?: { moduleContext?: string; entityType?: string }) => {
    const response = await axios.get(`${API_URL}/approval-workflows`, { params: filters });
    return response.data;
  },

  getApprovalWorkflowById: async (id: string) => {
    const response = await axios.get(`${API_URL}/approval-workflows/${id}`);
    return response.data;
  },

  createApprovalWorkflow: async (data: any) => {
    const response = await axios.post(`${API_URL}/approval-workflows`, data);
    return response.data;
  },

  updateApprovalWorkflow: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/approval-workflows/${id}`, data);
    return response.data;
  },

  deleteApprovalWorkflow: async (id: string) => {
    const response = await axios.delete(`${API_URL}/approval-workflows/${id}`);
    return response.data;
  },

  activateApprovalWorkflow: async (id: string) => {
    const response = await axios.put(`${API_URL}/approval-workflows/${id}/activate`);
    return response.data;
  },

  deactivateApprovalWorkflow: async (id: string) => {
    const response = await axios.put(`${API_URL}/approval-workflows/${id}/deactivate`);
    return response.data;
  },

  // Approval Steps
  getApprovalSteps: async (workflowId: string) => {
    const response = await axios.get(`${API_URL}/approval-workflows/${workflowId}/steps`);
    return response.data;
  },

  createApprovalStep: async (workflowId: string, data: any) => {
    const response = await axios.post(`${API_URL}/approval-workflows/${workflowId}/steps`, data);
    return response.data;
  },

  updateApprovalStep: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/approval-steps/${id}`, data);
    return response.data;
  },

  deleteApprovalStep: async (id: string) => {
    const response = await axios.delete(`${API_URL}/approval-steps/${id}`);
    return response.data;
  },

  reorderApprovalSteps: async (workflowId: string, stepIds: string[]) => {
    const response = await axios.put(`${API_URL}/approval-workflows/${workflowId}/steps/reorder`, { stepIds });
    return response.data;
  },

  // Approval Requests
  getApprovalRequests: async (projectId: string, filters?: { status?: string; entityType?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/approval-requests`, { params: filters });
    return response.data;
  },

  getApprovalRequestById: async (id: string) => {
    const response = await axios.get(`${API_URL}/approval-requests/${id}`);
    return response.data;
  },

  createApprovalRequest: async (data: any) => {
    const response = await axios.post(`${API_URL}/approval-requests`, data);
    return response.data;
  },

  updateApprovalRequest: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/approval-requests/${id}`, data);
    return response.data;
  },

  deleteApprovalRequest: async (id: string) => {
    const response = await axios.delete(`${API_URL}/approval-requests/${id}`);
    return response.data;
  },

  getApprovalRequestStatuses: async () => {
    const response = await axios.get(`${API_URL}/approval-requests/statuses`);
    return response.data;
  },

  getApprovalEntityTypes: async () => {
    const response = await axios.get(`${API_URL}/approval-requests/entity-types`);
    return response.data;
  },

  cancelApprovalRequest: async (id: string) => {
    const response = await axios.put(`${API_URL}/approval-requests/${id}/cancel`);
    return response.data;
  },

  // Approval Actions
  approveRequest: async (requestId: string, comments?: string) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/approve`, { comments });
    return response.data;
  },

  rejectRequest: async (requestId: string, comments?: string) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/reject`, { comments });
    return response.data;
  },

  delegateRequest: async (requestId: string, delegatedTo: string, comments?: string) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/delegate`, { delegatedTo, comments });
    return response.data;
  },

  addCommentToRequest: async (requestId: string, comments: string) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/comment`, { comments });
    return response.data;
  },

  getApprovalHistory: async (requestId: string) => {
    const response = await axios.get(`${API_URL}/approval-requests/${requestId}/history`);
    return response.data;
  },

  // Approval Attachments
  getApprovalAttachments: async (requestId: string) => {
    const response = await axios.get(`${API_URL}/approval-requests/${requestId}/attachments`);
    return response.data;
  },

  uploadApprovalAttachment: async (requestId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadApprovalAttachment: async (id: string) => {
    const response = await axios.get(`${API_URL}/approval-attachments/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteApprovalAttachment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/approval-attachments/${id}`);
    return response.data;
  },

  // Approval Notifications
  getApprovalNotifications: async (userId: string) => {
    const response = await axios.get(`${API_URL}/users/${userId}/approval-notifications`);
    return response.data;
  },

  markNotificationAsRead: async (id: string) => {
    const response = await axios.put(`${API_URL}/approval-notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (userId: string) => {
    const response = await axios.put(`${API_URL}/approval-notifications/read-all`, { userId });
    return response.data;
  },

  sendReminder: async (requestId: string) => {
    const response = await axios.post(`${API_URL}/approval-requests/${requestId}/send-reminder`);
    return response.data;
  },
};

export default approvalService;


