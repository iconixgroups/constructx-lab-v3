import api from './api';

const projectService = {
  getProjects: async (companyId?: string) => {
    const response = await api.get(`/projects${companyId ? `?companyId=${companyId}` : ''}`);
    return response.data;
  },

  getProjectStatuses: async () => {
    const response = await api.get('/projects/statuses');
    return response.data;
  },

  getProjectTypes: async () => {
    const response = await api.get('/projects/types');
    return response.data;
  },

  getProjectMetrics: async (companyId?: string) => {
    const response = await api.get(`/projects/metrics${companyId ? `?companyId=${companyId}` : ''}`);
    return response.data;
  },

  createProject: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (projectId: string, projectData: any) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  deleteProject: async (projectId: string) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  getProjectPhases: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/phases`);
    return response.data;
  },

  addProjectPhase: async (projectId: string, phaseData: any) => {
    const response = await api.post(`/projects/${projectId}/phases`, phaseData);
    return response.data;
  },

  updateProjectPhase: async (phaseId: string, phaseData: any) => {
    const response = await api.put(`/projects/phases/${phaseId}`, phaseData);
    return response.data;
  },

  deleteProjectPhase: async (phaseId: string) => {
    const response = await api.delete(`/projects/phases/${phaseId}`);
    return response.data;
  },

  getProjectMembers: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data;
  },

  addProjectMember: async (projectId: string, memberData: any) => {
    const response = await api.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  updateProjectMember: async (memberId: string, memberData: any) => {
    const response = await api.put(`/projects/members/${memberId}`, memberData);
    return response.data;
  },

  deleteProjectMember: async (memberId: string) => {
    const response = await api.delete(`/projects/members/${memberId}`);
    return response.data;
  },

  getProjectRoles: async () => {
    const response = await api.get('/projects/roles');
    return response.data;
  },

  getProjectMetricsData: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/metrics`);
    return response.data;
  },

  addProjectMetric: async (projectId: string, metricData: any) => {
    const response = await api.post(`/projects/${projectId}/metrics`, metricData);
    return response.data;
  },

  updateProjectMetric: async (metricId: string, metricData: any) => {
    const response = await api.put(`/projects/metrics/${metricId}`, metricData);
    return response.data;
  },

  deleteProjectMetric: async (metricId: string) => {
    const response = await api.delete(`/projects/metrics/${metricId}`);
    return response.data;
  },

  getProjectMetricCategories: async () => {
    const response = await api.get('/projects/metric-categories');
    return response.data;
  },
};

export default projectService;


