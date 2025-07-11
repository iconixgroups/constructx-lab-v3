import api from './api';

const leadService = {
  getLeads: async (projectId?: string) => {
    const response = await api.get(`/leads${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getLeadStatuses: async () => {
    const response = await api.get('/leads/statuses');
    return response.data;
  },

  getLeadMetrics: async (projectId?: string) => {
    const response = await api.get(`/leads/metrics${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  createLead: async (leadData: any) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  updateLead: async (leadId: string, leadData: any) => {
    const response = await api.put(`/leads/${leadId}`, leadData);
    return response.data;
  },

  deleteLead: async (leadId: string) => {
    const response = await api.delete(`/leads/${leadId}`);
    return response.data;
  },

  convertToProject: async (leadId: string) => {
    const response = await api.post(`/leads/${leadId}/convert-to-project`);
    return response.data;
  },
};

export default leadService;


