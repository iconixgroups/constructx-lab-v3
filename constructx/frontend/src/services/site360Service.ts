import api from './api';

const site360Service = {
  getSitePhotos: async (projectId?: string) => {
    const response = await api.get(`/site360/photos${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  uploadSitePhoto: async (projectId: string, photoData: any) => {
    const response = await api.post(`/site360/photos/${projectId}`, photoData);
    return response.data;
  },

  deleteSitePhoto: async (photoId: string) => {
    const response = await api.delete(`/site360/photos/${photoId}`);
    return response.data;
  },

  getSiteLocations: async (projectId?: string) => {
    const response = await api.get(`/site360/locations${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  addSiteLocation: async (locationData: any) => {
    const response = await api.post('/site360/locations', locationData);
    return response.data;
  },

  updateSiteLocation: async (locationId: string, locationData: any) => {
    const response = await api.put(`/site360/locations/${locationId}`, locationData);
    return response.data;
  },

  deleteSiteLocation: async (locationId: string) => {
    const response = await api.delete(`/site360/locations/${locationId}`);
    return response.data;
  },
};

export default site360Service;


