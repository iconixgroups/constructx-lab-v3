import api from './api';

const dashboardService = {
  getDashboards: async (projectId?: string) => {
    const response = await api.get(`/dashboards${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getWidgets: async (dashboardId: string) => {
    const response = await api.get(`/dashboards/${dashboardId}/widgets`);
    return response.data;
  },

  getWidgetData: async (widgetId: string) => {
    const response = await api.get(`/widgets/${widgetId}/data`);
    return response.data;
  },

  createDashboard: async (dashboardData: any) => {
    const response = await api.post("/dashboards", dashboardData);
    return response.data;
  },

  updateDashboard: async (dashboardId: string, dashboardData: any) => {
    const response = await api.put(`/dashboards/${dashboardId}`, dashboardData);
    return response.data;
  },

  deleteDashboard: async (dashboardId: string) => {
    const response = await api.delete(`/dashboards/${dashboardId}`);
    return response.data;
  },

  addWidget: async (dashboardId: string, widgetData: any) => {
    const response = await api.post(`/dashboards/${dashboardId}/widgets`, widgetData);
    return response.data;
  },

  updateWidget: async (widgetId: string, widgetData: any) => {
    const response = await api.put(`/widgets/${widgetId}`, widgetData);
    return response.data;
  },

  deleteWidget: async (widgetId: string) => {
    const response = await api.delete(`/widgets/${widgetId}`);
    return response.data;
  },
};

export default dashboardService;


