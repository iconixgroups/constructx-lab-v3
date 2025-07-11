import api from './api';

const taskService = {
  getTasks: async (projectId?: string) => {
    const response = await api.get(`/tasks${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getTaskStatuses: async () => {
    const response = await api.get('/tasks/statuses');
    return response.data;
  },

  getTaskPriorities: async () => {
    const response = await api.get('/tasks/priorities');
    return response.data;
  },

  createTask: async (taskData: any) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (taskId: string, taskData: any) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getTaskDependencies: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/dependencies`);
    return response.data;
  },

  addTaskDependency: async (taskId: string, dependencyData: any) => {
    const response = await api.post(`/tasks/${taskId}/dependencies`, dependencyData);
    return response.data;
  },

  deleteTaskDependency: async (dependencyId: string) => {
    const response = await api.delete(`/tasks/dependencies/${dependencyId}`);
    return response.data;
  },

  getTaskComments: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  addTaskComment: async (taskId: string, commentData: any) => {
    const response = await api.post(`/tasks/${taskId}/comments`, commentData);
    return response.data;
  },

  updateTaskComment: async (commentId: string, commentData: any) => {
    const response = await api.put(`/tasks/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteTaskComment: async (commentId: string) => {
    const response = await api.delete(`/tasks/comments/${commentId}`);
    return response.data;
  },

  getTaskAttachments: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/attachments`);
    return response.data;
  },

  uploadTaskAttachment: async (taskId: string, attachmentData: any) => {
    const response = await api.post(`/tasks/${taskId}/attachments`, attachmentData);
    return response.data;
  },

  deleteTaskAttachment: async (attachmentId: string) => {
    const response = await api.delete(`/tasks/attachments/${attachmentId}`);
    return response.data;
  },

  getTimeEntries: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/time-entries`);
    return response.data;
  },

  createTimeEntry: async (taskId: string, timeEntryData: any) => {
    const response = await api.post(`/tasks/${taskId}/time-entries`, timeEntryData);
    return response.data;
  },

  updateTimeEntry: async (timeEntryId: string, timeEntryData: any) => {
    const response = await api.put(`/time-entries/${timeEntryId}`, timeEntryData);
    return response.data;
  },

  deleteTimeEntry: async (timeEntryId: string) => {
    const response = await api.delete(`/time-entries/${timeEntryId}`);
    return response.data;
  },

  startTimeTracking: async (taskId: string) => {
    const response = await api.post(`/tasks/${taskId}/time-entries/start`);
    return response.data;
  },

  stopTimeTracking: async (timeEntryId: string) => {
    const response = await api.put(`/time-entries/${timeEntryId}/stop`);
    return response.data;
  },
};

export default taskService;


