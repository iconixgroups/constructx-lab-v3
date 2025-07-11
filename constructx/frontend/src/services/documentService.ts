import api from './api';

const documentService = {
  getDocuments: async (projectId?: string) => {
    const response = await api.get(`/documents${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getDocumentCategories: async () => {
    const response = await api.get('/documents/categories');
    return response.data;
  },

  getDocumentStatuses: async () => {
    const response = await api.get('/documents/statuses');
    return response.data;
  },

  uploadDocument: async (projectId: string, documentData: any) => {
    const response = await api.post(`/projects/${projectId}/documents`, documentData);
    return response.data;
  },

  updateDocument: async (documentId: string, documentData: any) => {
    const response = await api.put(`/documents/${documentId}`, documentData);
    return response.data;
  },

  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },

  getFolders: async (projectId?: string) => {
    const response = await api.get(`/folders${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  createFolder: async (projectId: string, folderData: any) => {
    const response = await api.post(`/projects/${projectId}/folders`, folderData);
    return response.data;
  },

  updateFolder: async (folderId: string, folderData: any) => {
    const response = await api.put(`/folders/${folderId}`, folderData);
    return response.data;
  },

  deleteFolder: async (folderId: string) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  },

  getDocumentVersions: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/versions`);
    return response.data;
  },

  uploadDocumentVersion: async (documentId: string, versionData: any) => {
    const response = await api.post(`/documents/${documentId}/versions`, versionData);
    return response.data;
  },

  restoreDocumentVersion: async (documentId: string, versionId: string) => {
    const response = await api.put(`/documents/${documentId}/versions/${versionId}/restore`);
    return response.data;
  },

  getDocumentComments: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/comments`);
    return response.data;
  },

  addDocumentComment: async (documentId: string, commentData: any) => {
    const response = await api.post(`/documents/${documentId}/comments`, commentData);
    return response.data;
  },

  updateDocumentComment: async (commentId: string, commentData: any) => {
    const response = await api.put(`/documents/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteDocumentComment: async (commentId: string) => {
    const response = await api.delete(`/documents/comments/${commentId}`);
    return response.data;
  },

  getDocumentApprovals: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/approvals`);
    return response.data;
  },

  createDocumentApproval: async (documentId: string, approvalData: any) => {
    const response = await api.post(`/documents/${documentId}/approvals`, approvalData);
    return response.data;
  },

  respondToDocumentApproval: async (approvalId: string, responseData: any) => {
    const response = await api.put(`/documents/approvals/${approvalId}`, responseData);
    return response.data;
  },

  cancelDocumentApproval: async (approvalId: string) => {
    const response = await api.delete(`/documents/approvals/${approvalId}`);
    return response.data;
  },

  getDocumentAccess: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/access`);
    return response.data;
  },

  grantDocumentAccess: async (documentId: string, accessData: any) => {
    const response = await api.post(`/documents/${documentId}/access`, accessData);
    return response.data;
  },

  updateDocumentAccess: async (accessId: string, accessData: any) => {
    const response = await api.put(`/documents/access/${accessId}`, accessData);
    return response.data;
  },

  revokeDocumentAccess: async (accessId: string) => {
    const response = await api.delete(`/documents/access/${accessId}`);
    return response.data;
  },
};

export default documentService;


