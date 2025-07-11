import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const invoiceService = {
  // Invoices
  getInvoices: async (projectId: string, filters?: { status?: string; type?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/invoices`, { params: filters });
    return response.data;
  },

  getInvoiceById: async (id: string) => {
    const response = await axios.get(`${API_URL}/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: any) => {
    const response = await axios.post(`${API_URL}/invoices`, data);
    return response.data;
  },

  updateInvoice: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/invoices/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string) => {
    const response = await axios.delete(`${API_URL}/invoices/${id}`);
    return response.data;
  },

  getInvoiceStatuses: async () => {
    const response = await axios.get(`${API_URL}/invoices/statuses`);
    return response.data;
  },

  getInvoiceTypes: async () => {
    const response = await axios.get(`${API_URL}/invoices/types`);
    return response.data;
  },

  updateInvoiceStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/invoices/${id}/status`, { status });
    return response.data;
  },

  sendInvoice: async (id: string) => {
    const response = await axios.post(`${API_URL}/invoices/${id}/send`);
    return response.data;
  },

  recordPayment: async (invoiceId: string, data: any) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/record-payment`, data);
    return response.data;
  },

  // Invoice Line Items
  getInvoiceLineItems: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/items`);
    return response.data;
  },

  createInvoiceLineItem: async (invoiceId: string, data: any) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/items`, data);
    return response.data;
  },

  updateInvoiceLineItem: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/invoice-items/${id}`, data);
    return response.data;
  },

  deleteInvoiceLineItem: async (id: string) => {
    const response = await axios.delete(`${API_URL}/invoice-items/${id}`);
    return response.data;
  },

  reorderInvoiceLineItems: async (invoiceId: string, itemIds: string[]) => {
    const response = await axios.put(`${API_URL}/invoices/${invoiceId}/items/reorder`, { itemIds });
    return response.data;
  },

  // Invoice Documents
  getInvoiceDocuments: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/documents`);
    return response.data;
  },

  uploadInvoiceDocument: async (invoiceId: string, formData: FormData) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  generateInvoicePdf: async (invoiceId: string) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/generate-pdf`);
    return response.data;
  },

  downloadInvoiceDocument: async (id: string) => {
    const response = await axios.get(`${API_URL}/invoice-documents/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteInvoiceDocument: async (id: string) => {
    const response = await axios.delete(`${API_URL}/invoice-documents/${id}`);
    return response.data;
  },

  // Invoice Payments (Links to Payments Module)
  getInvoicePayments: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/payments`);
    return response.data;
  },

  // Invoice Reminders
  getInvoiceReminders: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/reminders`);
    return response.data;
  },

  sendInvoiceReminder: async (invoiceId: string, data: any) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/reminders`, data);
    return response.data;
  },

  getOverdueInvoices: async () => {
    const response = await axios.get(`${API_URL}/invoices/overdue`);
    return response.data;
  },

  // Invoice Comments
  getInvoiceComments: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/comments`);
    return response.data;
  },

  addInvoiceComment: async (invoiceId: string, data: any) => {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/comments`, data);
    return response.data;
  },

  updateInvoiceComment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/invoice-comments/${id}`, data);
    return response.data;
  },

  deleteInvoiceComment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/invoice-comments/${id}`);
    return response.data;
  },
};

export default invoiceService;


