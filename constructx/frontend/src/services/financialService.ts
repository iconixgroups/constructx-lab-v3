import axios from 'axios';

const API_BASE_URL = '/api';

// Financial Dashboard Service
const financialService = {
  // Dashboard
  getFinancialDashboard: async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/financial-dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial dashboard:', error);
      throw error;
    }
  },
  
  updateFinancialDashboardLayout: async (projectId, layout) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/projects/${projectId}/financial-dashboard`, { layout });
      return response.data;
    } catch (error) {
      console.error('Error updating financial dashboard layout:', error);
      throw error;
    }
  },
  
  getFinancialMetrics: async (projectId, dateRange) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/financial-metrics`, {
        params: { dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  },
  
  // Budgets
  getBudgets: async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/budgets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },
  
  getBudgetDetails: async (budgetId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget details:', error);
      throw error;
    }
  },
  
  createBudget: async (projectId, budgetData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/budgets`, budgetData);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },
  
  updateBudget: async (budgetId, budgetData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/budgets/${budgetId}`, budgetData);
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },
  
  deleteBudget: async (budgetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
  
  approveBudget: async (budgetId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/budgets/${budgetId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving budget:', error);
      throw error;
    }
  },
  
  getBudgetSummary: async (budgetId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets/${budgetId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  },
  
  // Budget Categories and Items
  getBudgetCategories: async (budgetId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets/${budgetId}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget categories:', error);
      throw error;
    }
  },
  
  createBudgetCategory: async (budgetId, categoryData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/budgets/${budgetId}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating budget category:', error);
      throw error;
    }
  },
  
  updateBudgetCategory: async (categoryId, categoryData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/budget-categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating budget category:', error);
      throw error;
    }
  },
  
  deleteBudgetCategory: async (categoryId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/budget-categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget category:', error);
      throw error;
    }
  },
  
  getBudgetItems: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/budget-categories/${categoryId}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget items:', error);
      throw error;
    }
  },
  
  createBudgetItem: async (categoryId, itemData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/budget-categories/${categoryId}/items`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating budget item:', error);
      throw error;
    }
  },
  
  updateBudgetItem: async (itemId, itemData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/budget-items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }
  },
  
  deleteBudgetItem: async (itemId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/budget-items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget item:', error);
      throw error;
    }
  },
  
  // Expenses
  getExpenses: async (projectId, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/expenses`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  
  getExpenseDetails: async (expenseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense details:', error);
      throw error;
    }
  },
  
  createExpense: async (projectId, expenseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/expenses`, expenseData);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },
  
  updateExpense: async (expenseId, expenseData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/expenses/${expenseId}`, expenseData);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },
  
  deleteExpense: async (expenseId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
  
  approveExpense: async (expenseId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/expenses/${expenseId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving expense:', error);
      throw error;
    }
  },
  
  rejectExpense: async (expenseId, reason) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/expenses/${expenseId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting expense:', error);
      throw error;
    }
  },
  
  uploadExpenseReceipt: async (expenseId, receiptFile) => {
    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      
      const response = await axios.post(`${API_BASE_URL}/expenses/${expenseId}/receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading expense receipt:', error);
      throw error;
    }
  },
  
  // Financial Reports
  getFinancialReports: async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/financial-reports`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      throw error;
    }
  },
  
  getReportDetails: async (reportId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/financial-reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report details:', error);
      throw error;
    }
  },
  
  generateReport: async (projectId, reportData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/financial-reports`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
  
  deleteReport: async (reportId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/financial-reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },
  
  exportReport: async (reportId, format) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/financial-reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },
  
  // Helper methods for common data
  getAvailableCategories: async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/expense-categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      throw error;
    }
  },
  
  getVendors: async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/vendors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },
  
  getPaymentMethods: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },
  
  // Dashboard chart data
  getBudgetVsActualData: async (projectId, dateRange) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/budget-vs-actual`, {
        params: { dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget vs actual data:', error);
      throw error;
    }
  },
  
  getCashFlowData: async (projectId, dateRange) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/cash-flow`, {
        params: { dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow data:', error);
      throw error;
    }
  },
  
  getExpenseBreakdownData: async (projectId, dateRange) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/expense-breakdown`, {
        params: { dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expense breakdown data:', error);
      throw error;
    }
  },
  
  getRecentExpenses: async (projectId, limit = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/recent-expenses`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent expenses:', error);
      throw error;
    }
  }
};

export default financialService;
