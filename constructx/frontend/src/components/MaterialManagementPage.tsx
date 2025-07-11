import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Download,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Box,
  Loader2,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import materialService from '../services/materialService';

// import MaterialCatalogList from './MaterialCatalogList';
// import MaterialCatalogForm from './MaterialCatalogForm';
// import InventoryLocationsList from './InventoryLocationsList';
// import InventoryView from './InventoryView';
// import PurchaseOrdersList from './PurchaseOrdersList';
// import PurchaseOrderForm from './PurchaseOrderForm';
// import MaterialDeliveriesList from './MaterialDeliveriesList';
// import MaterialDeliveryForm from './MaterialDeliveryForm';
// import MaterialConsumptionForm from './MaterialConsumptionForm';
// import MaterialConsumptionList from './MaterialConsumptionList';

interface MaterialManagementPageProps {
  projectId?: string; // Optional - if provided, filters data for specific project
}

const MaterialManagementPage: React.FC<MaterialManagementPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [inventoryLocations, setInventoryLocations] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [materialDeliveries, setMaterialDeliveries] = useState<any[]>([]);
  const [materialConsumption, setMaterialConsumption] = useState<any[]>([]);

  const [metrics, setMetrics] = useState({
    totalCatalogItems: 0,
    totalInventoryLocations: 0,
    totalPurchaseOrders: 0,
    totalDeliveries: 0,
  });

  useEffect(() => {
    loadData();
  }, [projectId, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let data: any = {};
      switch (activeTab) {
        case 'catalog':
          data = await materialService.getMaterialCatalog();
          setCatalogItems(data);
          setMetrics(prev => ({ ...prev, totalCatalogItems: data.length }));
          break;
        case 'inventory':
          const [locations, items] = await Promise.all([
            materialService.getInventoryLocations(),
            materialService.getInventoryItems(),
          ]);
          setInventoryLocations(locations);
          setInventoryItems(items);
          setMetrics(prev => ({ ...prev, totalInventoryLocations: locations.length }));
          break;
        case 'purchase-orders':
          data = await materialService.getPurchaseOrders(projectId);
          setPurchaseOrders(data);
          setMetrics(prev => ({ ...prev, totalPurchaseOrders: data.length }));
          break;
        case 'deliveries':
          data = await materialService.getMaterialDeliveries(projectId);
          setMaterialDeliveries(data);
          setMetrics(prev => ({ ...prev, totalDeliveries: data.length }));
          break;
        case 'consumption':
          data = await materialService.getMaterialConsumption(projectId);
          setMaterialConsumption(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error);
      toast({
        title: 'Error',
        description: `Failed to load ${activeTab} data. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'category':
        setFilterCategory(value);
        break;
    }
  };

  if (isLoading && metrics.totalCatalogItems === 0 && metrics.totalInventoryLocations === 0 && metrics.totalPurchaseOrders === 0 && metrics.totalDeliveries === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Material Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage materials for project ${projectId}` : 'Track and manage all your construction materials'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => { /* Logic to open relevant form based on activeTab */ }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalog Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCatalogItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Locations</CardTitle>
            <Warehouse className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalInventoryLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPurchaseOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDeliveries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="catalog">
            <Package className="h-4 w-4 mr-2" /> Catalog
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Warehouse className="h-4 w-4 mr-2" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="purchase-orders">
            <ShoppingCart className="h-4 w-4 mr-2" /> Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="deliveries">
            <Truck className="h-4 w-4 mr-2" /> Deliveries
          </TabsTrigger>
          <TabsTrigger value="consumption">
            <Box className="h-4 w-4 mr-2" /> Consumption
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search catalog items..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4" />
              <p>Material Catalog List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <Warehouse className="mx-auto h-12 w-12 mb-4" />
              <p>Inventory View coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-4" />
              <p>Purchase Orders List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <Truck className="mx-auto h-12 w-12 mb-4" />
              <p>Material Deliveries List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search consumption records..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Project/Task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Projects/Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <Box className="mx-auto h-12 w-12 mb-4" />
              <p>Material Consumption List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialManagementPage;


