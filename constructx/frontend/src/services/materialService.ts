import api from './api';

const materialService = {
  getMaterialCatalog: async () => {
    const response = await api.get('/material-catalog');
    return response.data;
  },

  getMaterialCatalogItem: async (itemId: string) => {
    const response = await api.get(`/material-catalog/${itemId}`);
    return response.data;
  },

  createMaterialCatalogItem: async (itemData: any) => {
    const response = await api.post('/material-catalog', itemData);
    return response.data;
  },

  updateMaterialCatalogItem: async (itemId: string, itemData: any) => {
    const response = await api.put(`/material-catalog/${itemId}`, itemData);
    return response.data;
  },

  deleteMaterialCatalogItem: async (itemId: string) => {
    const response = await api.delete(`/material-catalog/${itemId}`);
    return response.data;
  },

  getInventoryLocations: async () => {
    const response = await api.get('/inventory-locations');
    return response.data;
  },

  createInventoryLocation: async (locationData: any) => {
    const response = await api.post('/inventory-locations', locationData);
    return response.data;
  },

  updateInventoryLocation: async (locationId: string, locationData: any) => {
    const response = await api.put(`/inventory-locations/${locationId}`, locationData);
    return response.data;
  },

  deleteInventoryLocation: async (locationId: string) => {
    const response = await api.delete(`/inventory-locations/${locationId}`);
    return response.data;
  },

  getInventoryItems: async (locationId?: string, catalogItemId?: string) => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (catalogItemId) params.append('catalogItemId', catalogItemId);
    const response = await api.get(`/inventory?${params.toString()}`);
    return response.data;
  },

  adjustInventoryQuantity: async (adjustmentData: any) => {
    const response = await api.post('/inventory/adjust', adjustmentData);
    return response.data;
  },

  getLowStockItems: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  getPurchaseOrders: async (projectId?: string) => {
    const response = await api.get(`/purchase-orders${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getPurchaseOrder: async (poId: string) => {
    const response = await api.get(`/purchase-orders/${poId}`);
    return response.data;
  },

  createPurchaseOrder: async (poData: any) => {
    const response = await api.post('/purchase-orders', poData);
    return response.data;
  },

  updatePurchaseOrder: async (poId: string, poData: any) => {
    const response = await api.put(`/purchase-orders/${poId}`, poData);
    return response.data;
  },

  deletePurchaseOrder: async (poId: string) => {
    const response = await api.delete(`/purchase-orders/${poId}`);
    return response.data;
  },

  submitPurchaseOrderForApproval: async (poId: string) => {
    const response = await api.put(`/purchase-orders/${poId}/submit`);
    return response.data;
  },

  approvePurchaseOrder: async (poId: string) => {
    const response = await api.put(`/purchase-orders/${poId}/approve`);
    return response.data;
  },

  getPurchaseOrderItems: async (poId: string) => {
    const response = await api.get(`/purchase-orders/${poId}/items`);
    return response.data;
  },

  addPurchaseOrderItem: async (poId: string, itemData: any) => {
    const response = await api.post(`/purchase-orders/${poId}/items`, itemData);
    return response.data;
  },

  updatePurchaseOrderItem: async (itemId: string, itemData: any) => {
    const response = await api.put(`/purchase-order-items/${itemId}`, itemData);
    return response.data;
  },

  deletePurchaseOrderItem: async (itemId: string) => {
    const response = await api.delete(`/purchase-order-items/${itemId}`);
    return response.data;
  },

  getMaterialDeliveries: async (projectId?: string) => {
    const response = await api.get(`/material-deliveries${projectId ? `?projectId=${projectId}` : ''}`);
    return response.data;
  },

  getMaterialDelivery: async (deliveryId: string) => {
    const response = await api.get(`/material-deliveries/${deliveryId}`);
    return response.data;
  },

  recordMaterialDelivery: async (deliveryData: any) => {
    const response = await api.post('/material-deliveries', deliveryData);
    return response.data;
  },

  updateMaterialDelivery: async (deliveryId: string, deliveryData: any) => {
    const response = await api.put(`/material-deliveries/${deliveryId}`, deliveryData);
    return response.data;
  },

  receiveMaterialDelivery: async (deliveryId: string) => {
    const response = await api.put(`/material-deliveries/${deliveryId}/receive`);
    return response.data;
  },

  getMaterialDeliveryItems: async (deliveryId: string) => {
    const response = await api.get(`/material-deliveries/${deliveryId}/items`);
    return response.data;
  },

  addMaterialDeliveryItem: async (deliveryId: string, itemData: any) => {
    const response = await api.post(`/material-deliveries/${deliveryId}/items`, itemData);
    return response.data;
  },

  updateMaterialDeliveryItem: async (itemId: string, itemData: any) => {
    const response = await api.put(`/material-delivery-items/${itemId}`, itemData);
    return response.data;
  },

  getMaterialConsumption: async (projectId?: string, taskId?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (taskId) params.append('taskId', taskId);
    const response = await api.get(`/material-consumption?${params.toString()}`);
    return response.data;
  },

  recordMaterialConsumption: async (consumptionData: any) => {
    const response = await api.post('/material-consumption', consumptionData);
    return response.data;
  },
};

export default materialService;


