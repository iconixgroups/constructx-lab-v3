import api from './api';

const equipmentService = {
  getEquipmentCatalog: async () => {
    const response = await api.get('/equipment-catalog');
    return response.data;
  },

  getEquipmentCatalogItem: async (itemId: string) => {
    const response = await api.get(`/equipment-catalog/${itemId}`);
    return response.data;
  },

  createEquipmentCatalogItem: async (itemData: any) => {
    const response = await api.post('/equipment-catalog', itemData);
    return response.data;
  },

  updateEquipmentCatalogItem: async (itemId: string, itemData: any) => {
    const response = await api.put(`/equipment-catalog/${itemId}`, itemData);
    return response.data;
  },

  deleteEquipmentCatalogItem: async (itemId: string) => {
    const response = await api.delete(`/equipment-catalog/${itemId}`);
    return response.data;
  },

  getEquipment: async (projectId?: string) => {
    const response = await api.get(`/equipment${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getEquipmentItem: async (itemId: string) => {
    const response = await api.get(`/equipment/${itemId}`);
    return response.data;
  },

  createEquipment: async (equipmentData: any) => {
    const response = await api.post('/equipment', equipmentData);
    return response.data;
  },

  updateEquipment: async (equipmentId: string, equipmentData: any) => {
    const response = await api.put(`/equipment/${equipmentId}`, equipmentData);
    return response.data;
  },

  deleteEquipment: async (equipmentId: string) => {
    const response = await api.delete(`/equipment/${equipmentId}`);
    return response.data;
  },

  getEquipmentStatuses: async () => {
    const response = await api.get('/equipment/statuses');
    return response.data;
  },

  updateEquipmentStatus: async (equipmentId: string, status: string) => {
    const response = await api.put(`/equipment/${equipmentId}/status`, { status });
    return response.data;
  },

  updateEquipmentLocation: async (equipmentId: string, locationId: string) => {
    const response = await api.put(`/equipment/${equipmentId}/location`, { locationId });
    return response.data;
  },

  getMaintenanceSchedules: async (equipmentId?: string) => {
    const response = await api.get(`/maintenance-schedules${equipmentId ? `?equipmentId=${equipmentId}` : ''}`);
    return response.data;
  },

  createMaintenanceSchedule: async (equipmentId: string, scheduleData: any) => {
    const response = await api.post(`/equipment/${equipmentId}/maintenance-schedules`, scheduleData);
    return response.data;
  },

  updateMaintenanceSchedule: async (scheduleId: string, scheduleData: any) => {
    const response = await api.put(`/equipment-maintenance-schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  deleteMaintenanceSchedule: async (scheduleId: string) => {
    const response = await api.delete(`/equipment-maintenance-schedules/${scheduleId}`);
    return response.data;
  },

  getDueMaintenanceSchedules: async () => {
    const response = await api.get('/maintenance-schedules/due');
    return response.data;
  },

  getMaintenanceLogs: async (equipmentId?: string) => {
    const response = await api.get(`/maintenance-logs${equipmentId ? `?equipmentId=${equipmentId}` : ''}`);
    return response.data;
  },

  createMaintenanceLog: async (equipmentId: string, logData: any) => {
    const response = await api.post(`/equipment/${equipmentId}/maintenance-logs`, logData);
    return response.data;
  },

  updateMaintenanceLog: async (logId: string, logData: any) => {
    const response = await api.put(`/maintenance-logs/${logId}`, logData);
    return response.data;
  },

  deleteMaintenanceLog: async (logId: string) => {
    const response = await api.delete(`/maintenance-logs/${logId}`);
    return response.data;
  },

  completeMaintenanceLog: async (logId: string) => {
    const response = await api.put(`/maintenance-logs/${logId}/complete`);
    return response.data;
  },

  getUsageLogs: async (equipmentId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (equipmentId) params.append('equipmentId', equipmentId);
    if (projectId) params.append('projectId', projectId);
    const response = await api.get(`/usage-logs?${params.toString()}`);
    return response.data;
  },

  createUsageLog: async (equipmentId: string, logData: any) => {
    const response = await api.post(`/equipment/${equipmentId}/usage-logs`, logData);
    return response.data;
  },

  updateUsageLog: async (logId: string, logData: any) => {
    const response = await api.put(`/usage-logs/${logId}`, logData);
    return response.data;
  },

  deleteUsageLog: async (logId: string) => {
    const response = await api.delete(`/usage-logs/${logId}`);
    return response.data;
  },

  getEquipmentAttachments: async (equipmentId: string) => {
    const response = await api.get(`/equipment/${equipmentId}/attachments`);
    return response.data;
  },

  uploadEquipmentAttachment: async (equipmentId: string, attachmentData: any) => {
    const response = await api.post(`/equipment/${equipmentId}/attachments`, attachmentData);
    return response.data;
  },

  deleteEquipmentAttachment: async (attachmentId: string) => {
    const response = await api.delete(`/equipment-attachments/${attachmentId}`);
    return response.data;
  },
};

export default equipmentService;


