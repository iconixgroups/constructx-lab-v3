import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const quoteService = {
  // Quotes
  getQuotes: async (projectId: string, filters?: { status?: string; type?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/quotes`, { params: filters });
    return response.data;
  },

  getQuoteById: async (id: string) => {
    const response = await axios.get(`${API_URL}/quotes/${id}`);
    return response.data;
  },

  createQuote: async (data: any) => {
    const response = await axios.post(`${API_URL}/quotes`, data);
    return response.data;
  },

  updateQuote: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/quotes/${id}`, data);
    return response.data;
  },

  deleteQuote: async (id: string) => {
    const response = await axios.delete(`${API_URL}/quotes/${id}`);
    return response.data;
  },

  getQuoteStatuses: async () => {
    const response = await axios.get(`${API_URL}/quotes/statuses`);
    return response.data;
  },

  getQuoteTypes: async () => {
    const response = await axios.get(`${API_URL}/quotes/types`);
    return response.data;
  },

  updateQuoteStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/quotes/${id}/status`, { status });
    return response.data;
  },

  sendQuote: async (id: string) => {
    const response = await axios.post(`${API_URL}/quotes/${id}/send`);
    return response.data;
  },

  convertQuote: async (id: string) => {
    const response = await axios.post(`${API_URL}/quotes/${id}/convert`);
    return response.data;
  },

  // Quote Sections
  getQuoteSections: async (quoteId: string) => {
    const response = await axios.get(`${API_URL}/quotes/${quoteId}/sections`);
    return response.data;
  },

  createQuoteSection: async (quoteId: string, data: any) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/sections`, data);
    return response.data;
  },

  updateQuoteSection: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/quote-sections/${id}`, data);
    return response.data;
  },

  deleteQuoteSection: async (id: string) => {
    const response = await axios.delete(`${API_URL}/quote-sections/${id}`);
    return response.data;
  },

  reorderQuoteSections: async (quoteId: string, sectionIds: string[]) => {
    const response = await axios.put(`${API_URL}/quotes/${quoteId}/sections/reorder`, { sectionIds });
    return response.data;
  },

  // Quote Items
  getQuoteItems: async (quoteId: string) => {
    const response = await axios.get(`${API_URL}/quotes/${quoteId}/items`);
    return response.data;
  },

  getQuoteItemsBySection: async (sectionId: string) => {
    const response = await axios.get(`${API_URL}/quote-sections/${sectionId}/items`);
    return response.data;
  },

  createQuoteItem: async (quoteId: string, data: any) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/items`, data);
    return response.data;
  },

  createQuoteItemInSection: async (sectionId: string, data: any) => {
    const response = await axios.post(`${API_URL}/quote-sections/${sectionId}/items`, data);
    return response.data;
  },

  updateQuoteItem: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/quote-items/${id}`, data);
    return response.data;
  },

  deleteQuoteItem: async (id: string) => {
    const response = await axios.delete(`${API_URL}/quote-items/${id}`);
    return response.data;
  },

  reorderQuoteItems: async (quoteId: string, itemIds: string[]) => {
    const response = await axios.put(`${API_URL}/quotes/${quoteId}/items/reorder`, { itemIds });
    return response.data;
  },

  // Quote Documents
  getQuoteDocuments: async (quoteId: string) => {
    const response = await axios.get(`${API_URL}/quotes/${quoteId}/documents`);
    return response.data;
  },

  uploadQuoteDocument: async (quoteId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  generateQuotePdf: async (quoteId: string) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/generate-pdf`);
    return response.data;
  },

  downloadQuoteDocument: async (id: string) => {
    const response = await axios.get(`${API_URL}/quote-documents/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteQuoteDocument: async (id: string) => {
    const response = await axios.delete(`${API_URL}/quote-documents/${id}`);
    return response.data;
  },

  // Quote Versions
  getQuoteVersions: async (quoteId: string) => {
    const response = await axios.get(`${API_URL}/quotes/${quoteId}/versions`);
    return response.data;
  },

  createQuoteVersion: async (quoteId: string, data: any) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/versions`, data);
    return response.data;
  },

  getQuoteVersionById: async (id: string) => {
    const response = await axios.get(`${API_URL}/quote-versions/${id}`);
    return response.data;
  },

  restoreQuoteVersion: async (quoteId: string, versionId: string) => {
    const response = await axios.put(`${API_URL}/quotes/${quoteId}/restore/${versionId}`);
    return response.data;
  },

  // Quote Comments
  getQuoteComments: async (quoteId: string) => {
    const response = await axios.get(`${API_URL}/quotes/${quoteId}/comments`);
    return response.data;
  },

  addQuoteComment: async (quoteId: string, data: any) => {
    const response = await axios.post(`${API_URL}/quotes/${quoteId}/comments`, data);
    return response.data;
  },

  updateQuoteComment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/quote-comments/${id}`, data);
    return response.data;
  },

  deleteQuoteComment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/quote-comments/${id}`);
    return response.data;
  },
};

export default quoteService;


