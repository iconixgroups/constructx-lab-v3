import api from './api';

const aiAssistantService = {
  getAssistantConfig: async () => {
    const response = await api.get('/ai/assistant');
    return response.data;
  },

  updateAssistantConfig: async (configData: any) => {
    const response = await api.put('/ai/assistant', configData);
    return response.data;
  },

  enableAssistant: async () => {
    const response = await api.put('/ai/assistant/enable');
    return response.data;
  },

  disableAssistant: async () => {
    const response = await api.put('/ai/assistant/disable');
    return response.data;
  },

  getConversations: async (projectId?: string) => {
    const response = await api.get(`/ai/conversations${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(`/ai/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, messageData: any) => {
    const response = await api.post(`/ai/conversations/${conversationId}/messages`, messageData);
    return response.data;
  },

  createConversation: async (conversationData: any) => {
    const response = await api.post('/ai/conversations', conversationData);
    return response.data;
  },

  updateConversation: async (conversationId: string, conversationData: any) => {
    const response = await api.put(`/ai/conversations/${conversationId}`, conversationData);
    return response.data;
  },

  deleteConversation: async (conversationId: string) => {
    const response = await api.delete(`/ai/conversations/${conversationId}`);
    return response.data;
  },

  getActions: async (projectId?: string) => {
    const response = await api.get(`/ai/actions${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  acceptAction: async (actionId: string) => {
    const response = await api.post(`/ai/actions/${actionId}/accept`);
    return response.data;
  },

  rejectAction: async (actionId: string) => {
    const response = await api.post(`/ai/actions/${actionId}/reject`);
    return response.data;
  },

  getInsights: async (projectId?: string) => {
    const response = await api.get(`/ai/insights${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  markInsightAsRead: async (insightId: string) => {
    const response = await api.put(`/ai/insights/${insightId}/read`);
    return response.data;
  },
};

export default aiAssistantService;


