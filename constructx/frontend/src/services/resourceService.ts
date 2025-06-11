import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Resource API service
export const resourceService = {
  // Resources CRUD operations
  getResources: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/resources`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  getResourceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  createResource: async (resourceData) => {
    try {
      const response = await axios.post(`${API_URL}/resources`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  updateResource: async (id, resourceData) => {
    try {
      const response = await axios.put(`${API_URL}/resources/${id}`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  getResourceTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/resources/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource types:', error);
      throw error;
    }
  },

  getResourceCategories: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/resources/categories`, { params: { type } });
      return response.data;
    } catch (error) {
      console.error('Error fetching resource categories:', error);
      throw error;
    }
  },

  getResourceStatuses: async () => {
    try {
      const response = await axios.get(`${API_URL}/resources/statuses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource statuses:', error);
      throw error;
    }
  },

  // Resource Allocations operations
  getResourceAllocations: async (resourceId) => {
    try {
      const response = await axios.get(`${API_URL}/resources/${resourceId}/allocations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource allocations:', error);
      throw error;
    }
  },
  
  getProjectAllocations: async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/allocations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project allocations:', error);
      throw error;
    }
  },

  getAllocationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/allocations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching allocation:', error);
      throw error;
    }
  },

  createAllocation: async (resourceId, allocationData) => {
    try {
      const response = await axios.post(`${API_URL}/resources/${resourceId}/allocations`, allocationData);
      return response.data;
    } catch (error) {
      console.error('Error creating allocation:', error);
      throw error;
    }
  },

  updateAllocation: async (id, allocationData) => {
    try {
      const response = await axios.put(`${API_URL}/allocations/${id}`, allocationData);
      return response.data;
    } catch (error) {
      console.error('Error updating allocation:', error);
      throw error;
    }
  },

  deleteAllocation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/allocations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting allocation:', error);
      throw error;
    }
  },
  
  getAllocationStatuses: async () => {
    try {
      const response = await axios.get(`${API_URL}/allocations/statuses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching allocation statuses:', error);
      throw error;
    }
  },

  // Resource Availability operations
  getResourceAvailability: async (resourceId) => {
    try {
      // This might need adjustment based on how backend exposes combined availability
      const response = await axios.get(`${API_URL}/resources/${resourceId}/availability`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource availability:', error);
      throw error;
    }
  },
  
  getResourceAvailabilityExceptions: async (resourceId) => {
    try {
      // Assuming a specific endpoint for exceptions if needed separately
      const response = await axios.get(`${API_URL}/resources/${resourceId}/availability/exceptions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability exceptions:', error);
      throw error;
    }
  },

  createAvailabilityException: async (resourceId, exceptionData) => {
    try {
      const response = await axios.post(`${API_URL}/resources/${resourceId}/availability`, exceptionData);
      return response.data;
    } catch (error) {
      console.error('Error creating availability exception:', error);
      throw error;
    }
  },

  updateAvailabilityException: async (id, exceptionData) => {
    try {
      const response = await axios.put(`${API_URL}/availability/${id}`, exceptionData);
      return response.data;
    } catch (error) {
      console.error('Error updating availability exception:', error);
      throw error;
    }
  },

  deleteAvailabilityException: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/availability/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting availability exception:', error);
      throw error;
    }
  },
  
  checkAvailabilityConflicts: async (resourceId, startDate, endDate, exceptionId = null) => {
    try {
      const response = await axios.post(`${API_URL}/resources/${resourceId}/availability/check-conflict`, { startDate, endDate, exceptionId });
      return response.data;
    } catch (error) {
      console.error('Error checking availability conflicts:', error);
      throw error;
    }
  },

  // Resource Utilization operations
  getResourceUtilization: async (resourceId, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/resources/${resourceId}/utilization`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching resource utilization:', error);
      throw error;
    }
  },

  recordUtilization: async (resourceId, utilizationData) => {
    try {
      const response = await axios.post(`${API_URL}/resources/${resourceId}/utilization`, utilizationData);
      return response.data;
    } catch (error) {
      console.error('Error recording utilization:', error);
      throw error;
    }
  },

  updateUtilization: async (id, utilizationData) => {
    try {
      const response = await axios.put(`${API_URL}/utilization/${id}`, utilizationData);
      return response.data;
    } catch (error) {
      console.error('Error updating utilization record:', error);
      throw error;
    }
  },

  deleteUtilization: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/utilization/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting utilization record:', error);
      throw error;
    }
  },
  
  getProjectUtilization: async (projectId, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/utilization`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching project utilization:', error);
      throw error;
    }
  },
  
  // Helper endpoints (assuming they exist based on form needs)
  getProjects: async () => {
    try {
      // Assuming a general projects endpoint exists
      const response = await axios.get(`${API_URL}/projects?minimal=true`); // Fetch minimal data
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  getProjectTasks: async (projectId) => {
    try {
      // Assuming a tasks endpoint exists per project
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks?minimal=true`); // Fetch minimal data
      return response.data;
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  },
  
  getAvailabilityReasons: async () => {
      try {
          // Assuming an endpoint for reasons exists
          const response = await axios.get(`${API_URL}/availability/reasons`);
          return response.data;
      } catch (error) {
          console.error('Error fetching availability reasons:', error);
          // Fallback to mock data if needed
          return ["Vacation", "Maintenance", "Reserved", "Training", "Sick Leave", "Other"];
      }
  }
};

export default resourceService;
