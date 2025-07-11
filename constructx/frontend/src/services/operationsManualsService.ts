import api from './api';

const operationsManualsService = {
  getManuals: async (projectId?: string) => {
    const response = await api.get(`/operations-manuals${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getManual: async (manualId: string) => {
    const response = await api.get(`/operations-manuals/${manualId}`);
    return response.data;
  },

  createManual: async (manualData: any) => {
    const response = await api.post('/operations-manuals', manualData);
    return response.data;
  },

  updateManual: async (manualId: string, manualData: any) => {
    const response = await api.put(`/operations-manuals/${manualId}`, manualData);
    return response.data;
  },

  deleteManual: async (manualId: string) => {
    const response = await api.delete(`/operations-manuals/${manualId}`);
    return response.data;
  },

  getManualCategories: async () => {
    const response = await api.get('/operations-manuals/categories');
    return response.data;
  },

  createManualCategory: async (categoryData: any) => {
    const response = await api.post('/operations-manuals/categories', categoryData);
    return response.data;
  },

  updateManualCategory: async (categoryId: string, categoryData: any) => {
    const response = await api.put(`/operations-manuals/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteManualCategory: async (categoryId: string) => {
    const response = await api.delete(`/operations-manuals/categories/${categoryId}`);
    return response.data;
  },
};

export default operationsManualsService;


