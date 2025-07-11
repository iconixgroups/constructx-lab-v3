import api from './api';

const facilityService = {
  getFacilities: async () => {
    const response = await api.get('/facilities');
    return response.data;
  },

  getFacility: async (facilityId: string) => {
    const response = await api.get(`/facilities/${facilityId}`);
    return response.data;
  },

  createFacility: async (facilityData: any) => {
    const response = await api.post('/facilities', facilityData);
    return response.data;
  },

  updateFacility: async (facilityId: string, facilityData: any) => {
    const response = await api.put(`/facilities/${facilityId}`, facilityData);
    return response.data;
  },

  deleteFacility: async (facilityId: string) => {
    const response = await api.delete(`/facilities/${facilityId}`);
    return response.data;
  },

  getMaintenanceRequests: async (facilityId?: string) => {
    const response = await api.get(`/maintenance-requests${facilityId ? `?facilityId=${facilityId}` : ''}`);
    return response.data;
  },

  getMaintenanceRequest: async (requestId: string) => {
    const response = await api.get(`/maintenance-requests/${requestId}`);
    return response.data;
  },

  createMaintenanceRequest: async (requestData: any) => {
    const response = await api.post('/maintenance-requests', requestData);
    return response.data;
  },

  updateMaintenanceRequest: async (requestId: string, requestData: any) => {
    const response = await api.put(`/maintenance-requests/${requestId}`, requestData);
    return response.data;
  },

  deleteMaintenanceRequest: async (requestId: string) => {
    const response = await api.delete(`/maintenance-requests/${requestId}`);
    return response.data;
  },
};

export default facilityService;


