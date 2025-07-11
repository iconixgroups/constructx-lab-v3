import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const inspectionService = {
  // Inspection Templates
  getInspectionTemplates: async () => {
    const response = await axios.get(`${API_URL}/inspection-templates`);
    return response.data;
  },

  getInspectionTemplateById: async (id: string) => {
    const response = await axios.get(`${API_URL}/inspection-templates/${id}`);
    return response.data;
  },

  createInspectionTemplate: async (data: any) => {
    const response = await axios.post(`${API_URL}/inspection-templates`, data);
    return response.data;
  },

  updateInspectionTemplate: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/inspection-templates/${id}`, data);
    return response.data;
  },

  deleteInspectionTemplate: async (id: string) => {
    const response = await axios.delete(`${API_URL}/inspection-templates/${id}`);
    return response.data;
  },

  // Inspections
  getInspections: async (projectId: string, filters?: { status?: string; type?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/inspections`, { params: filters });
    return response.data;
  },

  getInspectionById: async (id: string) => {
    const response = await axios.get(`${API_URL}/inspections/${id}`);
    return response.data;
  },

  scheduleInspection: async (projectId: string, data: any) => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/inspections`, data);
    return response.data;
  },

  updateInspection: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/inspections/${id}`, data);
    return response.data;
  },

  cancelInspection: async (id: string) => {
    const response = await axios.delete(`${API_URL}/inspections/${id}`);
    return response.data;
  },

  getInspectionStatuses: async () => {
    const response = await axios.get(`${API_URL}/inspections/statuses`);
    return response.data;
  },

  startInspection: async (id: string) => {
    const response = await axios.put(`${API_URL}/inspections/${id}/start`);
    return response.data;
  },

  completeInspection: async (id: string) => {
    const response = await axios.put(`${API_URL}/inspections/${id}/complete`);
    return response.data;
  },

  // Deficiencies
  getDeficiencies: async (projectId: string, filters?: { status?: string; priority?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/deficiencies`, { params: filters });
    return response.data;
  },

  getDeficiencyById: async (id: string) => {
    const response = await axios.get(`${API_URL}/deficiencies/${id}`);
    return response.data;
  },

  createDeficiency: async (inspectionId: string, data: any) => {
    const response = await axios.post(`${API_URL}/inspections/${inspectionId}/deficiencies`, data);
    return response.data;
  },

  updateDeficiency: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/deficiencies/${id}`, data);
    return response.data;
  },

  deleteDeficiency: async (id: string) => {
    const response = await axios.delete(`${API_URL}/deficiencies/${id}`);
    return response.data;
  },

  getDeficiencyStatuses: async () => {
    const response = await axios.get(`${API_URL}/deficiencies/statuses`);
    return response.data;
  },

  updateDeficiencyStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/deficiencies/${id}/status`, { status });
    return response.data;
  },

  assignDeficiency: async (id: string, assignedTo: string) => {
    const response = await axios.put(`${API_URL}/deficiencies/${id}/assign`, { assignedTo });
    return response.data;
  },

  // Inspection Results
  getInspectionResults: async (inspectionId: string) => {
    const response = await axios.get(`${API_URL}/inspections/${inspectionId}/results`);
    return response.data;
  },

  recordInspectionResult: async (inspectionId: string, data: any) => {
    const response = await axios.post(`${API_URL}/inspections/${inspectionId}/results`, data);
    return response.data;
  },

  updateInspectionResult: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/inspection-results/${id}`, data);
    return response.data;
  },

  // Attachments (simplified for now, can be expanded)
  uploadAttachment: async (entityType: string, entityId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/${entityType}/${entityId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAttachments: async (entityType: string, entityId: string) => {
    const response = await axios.get(`${API_URL}/${entityType}/${entityId}/attachments`);
    return response.data;
  },

  downloadAttachment: async (id: string) => {
    const response = await axios.get(`${API_URL}/attachments/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteAttachment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/attachments/${id}`);
    return response.data;
  },
};

export default inspectionService;


