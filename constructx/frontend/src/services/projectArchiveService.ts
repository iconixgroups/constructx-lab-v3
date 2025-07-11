import api from './api';

const projectArchiveService = {
  getArchivedProjects: async () => {
    const response = await api.get('/project-archives');
    return response.data;
  },

  getArchivedProject: async (projectId: string) => {
    const response = await api.get(`/project-archives/${projectId}`);
    return response.data;
  },

  restoreProject: async (projectId: string) => {
    const response = await api.post(`/project-archives/${projectId}/restore`);
    return response.data;
  },

  deleteArchivedProject: async (projectId: string) => {
    const response = await api.delete(`/project-archives/${projectId}`);
    return response.data;
  },
};

export default projectArchiveService;


