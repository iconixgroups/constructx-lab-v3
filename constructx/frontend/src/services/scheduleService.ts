import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Schedule API service
export const scheduleService = {
  // Schedule CRUD operations
  getSchedules: async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/schedules`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  createSchedule: async (projectId, scheduleData) => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/schedules`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await axios.put(`${API_URL}/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Schedule Items operations
  getScheduleItems: async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule items:', error);
      throw error;
    }
  },

  getScheduleItemById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/schedule-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule item:', error);
      throw error;
    }
  },

  createScheduleItem: async (scheduleId, itemData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/${scheduleId}/items`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule item:', error);
      throw error;
    }
  },

  updateScheduleItem: async (id, itemData) => {
    try {
      const response = await axios.put(`${API_URL}/schedule-items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule item:', error);
      throw error;
    }
  },

  deleteScheduleItem: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schedule-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule item:', error);
      throw error;
    }
  },

  reorderScheduleItems: async (scheduleId, orderData) => {
    try {
      const response = await axios.put(`${API_URL}/schedules/${scheduleId}/items/reorder`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error reordering schedule items:', error);
      throw error;
    }
  },

  updateItemStatus: async (id, statusData) => {
    try {
      const response = await axios.put(`${API_URL}/schedule-items/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating item status:', error);
      throw error;
    }
  },

  updateItemProgress: async (id, progressData) => {
    try {
      const response = await axios.put(`${API_URL}/schedule-items/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating item progress:', error);
      throw error;
    }
  },

  // Dependencies operations
  getItemDependencies: async (itemId) => {
    try {
      const response = await axios.get(`${API_URL}/schedule-items/${itemId}/dependencies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item dependencies:', error);
      throw error;
    }
  },

  getScheduleDependencies: async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/dependencies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule dependencies:', error);
      throw error;
    }
  },

  createDependency: async (itemId, dependencyData) => {
    try {
      const response = await axios.post(`${API_URL}/schedule-items/${itemId}/dependencies`, dependencyData);
      return response.data;
    } catch (error) {
      console.error('Error creating dependency:', error);
      throw error;
    }
  },

  deleteDependency: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schedule-dependencies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting dependency:', error);
      throw error;
    }
  },

  // Calendar operations
  getCalendarEvents: async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/calendar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  createCalendarEvent: async (scheduleId, eventData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/${scheduleId}/calendar`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  updateCalendarEvent: async (id, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/schedule-calendar/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  },

  deleteCalendarEvent: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schedule-calendar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  },

  // Baseline operations
  createBaseline: async (scheduleId, baselineData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/${scheduleId}/baseline`, baselineData);
      return response.data;
    } catch (error) {
      console.error('Error creating baseline:', error);
      throw error;
    }
  },

  getBaselines: async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/baselines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching baselines:', error);
      throw error;
    }
  },

  getBaselineComparison: async (scheduleId, baselineId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/baselines/${baselineId}/comparison`);
      return response.data;
    } catch (error) {
      console.error('Error fetching baseline comparison:', error);
      throw error;
    }
  },

  // Critical path operations
  getCriticalPath: async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${scheduleId}/critical-path`);
      return response.data;
    } catch (error) {
      console.error('Error fetching critical path:', error);
      throw error;
    }
  }
};

export default scheduleService;
