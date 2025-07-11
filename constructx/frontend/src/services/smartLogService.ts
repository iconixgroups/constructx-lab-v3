import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const smartLogService = {
  // Log Types
  getLogTypes: async () => {
    const response = await axios.get(`${API_URL}/log-types`);
    return response.data;
  },

  getLogTypeById: async (id: string) => {
    const response = await axios.get(`${API_URL}/log-types/${id}`);
    return response.data;
  },

  createLogType: async (data: any) => {
    const response = await axios.post(`${API_URL}/log-types`, data);
    return response.data;
  },

  updateLogType: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/log-types/${id}`, data);
    return response.data;
  },

  deleteLogType: async (id: string) => {
    const response = await axios.delete(`${API_URL}/log-types/${id}`);
    return response.data;
  },

  activateLogType: async (id: string) => {
    const response = await axios.put(`${API_URL}/log-types/${id}/activate`);
    return response.data;
  },

  deactivateLogType: async (id: string) => {
    const response = await axios.put(`${API_URL}/log-types/${id}/deactivate`);
    return response.data;
  },

  // Log Entries
  getLogEntries: async (projectId: string, filters?: { logTypeId?: string; status?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/log-entries`, { params: filters });
    return response.data;
  },

  getLogEntryById: async (id: string) => {
    const response = await axios.get(`${API_URL}/log-entries/${id}`);
    return response.data;
  },

  createLogEntry: async (projectId: string, data: any) => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/log-entries`, data);
    return response.data;
  },

  updateLogEntry: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/log-entries/${id}`, data);
    return response.data;
  },

  deleteLogEntry: async (id: string) => {
    const response = await axios.delete(`${API_URL}/log-entries/${id}`);
    return response.data;
  },

  submitLogEntry: async (id: string) => {
    const response = await axios.put(`${API_URL}/log-entries/${id}/submit`);
    return response.data;
  },

  approveLogEntry: async (id: string) => {
    const response = await axios.put(`${API_URL}/log-entries/${id}/approve`);
    return response.data;
  },

  getLogEntryStatuses: async () => {
    const response = await axios.get(`${API_URL}/log-entries/statuses`);
    return response.data;
  },

  // Log Entry Attachments
  getLogEntryAttachments: async (logEntryId: string) => {
    const response = await axios.get(`${API_URL}/log-entries/${logEntryId}/attachments`);
    return response.data;
  },

  uploadLogEntryAttachment: async (logEntryId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/log-entries/${logEntryId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadLogEntryAttachment: async (id: string) => {
    const response = await axios.get(`${API_URL}/log-attachments/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteLogEntryAttachment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/log-attachments/${id}`);
    return response.data;
  },

  // Log Entry Comments
  getLogEntryComments: async (logEntryId: string) => {
    const response = await axios.get(`${API_URL}/log-entries/${logEntryId}/comments`);
    return response.data;
  },

  addLogEntryComment: async (logEntryId: string, data: any) => {
    const response = await axios.post(`${API_URL}/log-entries/${logEntryId}/comments`, data);
    return response.data;
  },

  updateLogEntryComment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/log-comments/${id}`, data);
    return response.data;
  },

  deleteLogEntryComment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/log-comments/${id}`);
    return response.data;
  },

  // Log Entry Signatures
  getLogEntrySignatures: async (logEntryId: string) => {
    const response = await axios.get(`${API_URL}/log-entries/${logEntryId}/signatures`);
    return response.data;
  },

  addLogEntrySignature: async (logEntryId: string, data: any) => {
    const response = await axios.post(`${API_URL}/log-entries/${logEntryId}/signatures`, data);
    return response.data;
  },
};

export default smartLogService;


