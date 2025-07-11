import api from './api';

const reportsService = {
  getReports: async (projectId?: string) => {
    const response = await api.get(`/reports${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getReport: async (reportId: string) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  generateReport: async (reportData: any) => {
    const response = await api.post('/reports/generate', reportData);
    return response.data;
  },

  downloadReport: async (reportId: string) => {
    const response = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
    return response.data;
  },

  getReportTemplates: async () => {
    const response = await api.get('/report-templates');
    return response.data;
  },

  createReportTemplate: async (templateData: any) => {
    const response = await api.post('/report-templates', templateData);
    return response.data;
  },

  updateReportTemplate: async (templateId: string, templateData: any) => {
    const response = await api.put(`/report-templates/${templateId}`, templateData);
    return response.data;
  },

  deleteReportTemplate: async (templateId: string) => {
    const response = await api.delete(`/report-templates/${templateId}`);
    return response.data;
  },
};

export default reportsService;


