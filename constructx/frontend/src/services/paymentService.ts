import axios from "axios";

const API_URL = "/api"; // Base URL for all APIs

const paymentService = {
  // Payments
  getPayments: async (projectId: string, filters?: { status?: string; type?: string }) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}/payments`, { params: filters });
    return response.data;
  },

  getPaymentById: async (id: string) => {
    const response = await axios.get(`${API_URL}/payments/${id}`);
    return response.data;
  },

  recordPayment: async (data: any) => {
    const response = await axios.post(`${API_URL}/payments`, data);
    return response.data;
  },

  updatePayment: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/payments/${id}`, data);
    return response.data;
  },

  deletePayment: async (id: string) => {
    const response = await axios.delete(`${API_URL}/payments/${id}`);
    return response.data;
  },

  getPaymentStatuses: async () => {
    const response = await axios.get(`${API_URL}/payments/statuses`);
    return response.data;
  },

  getPaymentTypes: async () => {
    const response = await axios.get(`${API_URL}/payments/types`);
    return response.data;
  },

  updatePaymentStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/payments/${id}/status`, { status });
    return response.data;
  },

  // Payment Methods
  getPaymentMethods: async () => {
    const response = await axios.get(`${API_URL}/payment-methods`);
    return response.data;
  },

  getPaymentMethodById: async (id: string) => {
    const response = await axios.get(`${API_URL}/payment-methods/${id}`);
    return response.data;
  },

  addPaymentMethod: async (data: any) => {
    const response = await axios.post(`${API_URL}/payment-methods`, data);
    return response.data;
  },

  updatePaymentMethod: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/payment-methods/${id}`, data);
    return response.data;
  },

  deletePaymentMethod: async (id: string) => {
    const response = await axios.delete(`${API_URL}/payment-methods/${id}`);
    return response.data;
  },

  activatePaymentMethod: async (id: string) => {
    const response = await axios.put(`${API_URL}/payment-methods/${id}/activate`);
    return response.data;
  },

  deactivatePaymentMethod: async (id: string) => {
    const response = await axios.put(`${API_URL}/payment-methods/${id}/deactivate`);
    return response.data;
  },

  setDefaultPaymentMethod: async (id: string, isDefaultIncoming: boolean, isDefaultOutgoing: boolean) => {
    const response = await axios.put(`${API_URL}/payment-methods/${id}/set-default`, { isDefaultIncoming, isDefaultOutgoing });
    return response.data;
  },

  // Payment Links
  linkPaymentToInvoice: async (paymentId: string, invoiceId: string, amountApplied: number) => {
    const response = await axios.post(`${API_URL}/payments/${paymentId}/link-invoice`, { invoiceId, amountApplied });
    return response.data;
  },

  linkPaymentToExpense: async (paymentId: string, expenseId: string, amountApplied: number) => {
    const response = await axios.post(`${API_URL}/payments/${paymentId}/link-expense`, { expenseId, amountApplied });
    return response.data;
  },

  getPaymentsForInvoice: async (invoiceId: string) => {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/payments`);
    return response.data;
  },

  getPaymentsForExpense: async (expenseId: string) => {
    const response = await axios.get(`${API_URL}/expenses/${expenseId}/payments`);
    return response.data;
  },

  // Payment Approvals
  getPaymentApprovalStatus: async (paymentId: string) => {
    const response = await axios.get(`${API_URL}/payments/${paymentId}/approval`);
    return response.data;
  },

  getPaymentsPendingApproval: async () => {
    const response = await axios.get(`${API_URL}/payments/pending-approval`);
    return response.data;
  },

  initiatePaymentApproval: async (paymentId: string) => {
    const response = await axios.post(`${API_URL}/payments/${paymentId}/approve`);
    return response.data;
  },
};

export default paymentService;


