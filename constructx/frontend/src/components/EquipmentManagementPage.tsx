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
  Wrench,
  Truck,
  Gauge,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import equipmentService from '../services/equipmentService';

// import EquipmentCatalogList from './EquipmentCatalogList';
// import EquipmentCatalogForm from './EquipmentCatalogForm';
// import EquipmentFleetList from './EquipmentFleetList';
// import EquipmentForm from './EquipmentForm';
// import MaintenanceLogsList from './MaintenanceLogsList';
// import MaintenanceLogForm from './MaintenanceLogForm';
// import UsageLogsList from './UsageLogsList';
// import UsageLogForm from './UsageLogForm';

interface EquipmentManagementPageProps {
  projectId?: string; // Optional - if provided, filters data for specific project
}

const EquipmentManagementPage: React.FC<EquipmentManagementPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fleet');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [equipmentCatalog, setEquipmentCatalog] = useState<any[]>([]);
  const [equipmentFleet, setEquipmentFleet] = useState<any[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<any[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [usageLogs, setUsageLogs] = useState<any[]>([]);

  const [metrics, setMetrics] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    inMaintenance: 0,
    totalMaintenanceLogs: 0,
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
          data = await equipmentService.getEquipmentCatalog();
          setEquipmentCatalog(data);
          break;
        case 'fleet':
          data = await equipmentService.getEquipment(projectId);
          setEquipmentFleet(data);
          const available = data.filter((eq: any) => eq.status === 'Available').length;
          const inMaintenance = data.filter((eq: any) => eq.status === 'Maintenance').length;
          setMetrics(prev => ({
            ...prev,
            totalEquipment: data.length,
            availableEquipment: available,
            inMaintenance: inMaintenance,
          }));
          break;
        case 'maintenance':
          const [schedules, logs] = await Promise.all([
            equipmentService.getMaintenanceSchedules(),
            equipmentService.getMaintenanceLogs(),
          ]);
          setMaintenanceSchedules(schedules);
          setMaintenanceLogs(logs);
          setMetrics(prev => ({ ...prev, totalMaintenanceLogs: logs.length }));
          break;
        case 'usage':
          data = await equipmentService.getUsageLogs(projectId);
          setUsageLogs(data);
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
      case 'status':
        setFilterStatus(value);
        break;
      case 'type':
        setFilterType(value);
        break;
    }
  };

  if (isLoading && metrics.totalEquipment === 0 && metrics.totalMaintenanceLogs === 0) {
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
          <h1 className="text-3xl font-bold">Equipment Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage equipment for project ${projectId}` : 'Track and manage all your construction equipment'}
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
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEquipment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Equipment</CardTitle>
            <Gauge className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.availableEquipment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inMaintenance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Logs</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMaintenanceLogs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="fleet">
            <Truck className="h-4 w-4 mr-2" /> Fleet
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <ClipboardList className="h-4 w-4 mr-2" /> Catalog
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="h-4 w-4 mr-2" /> Maintenance
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Gauge className="h-4 w-4 mr-2" /> Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => handleFilterChange('type', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <Truck className="mx-auto h-12 w-12 mb-4" />
              <p>Equipment Fleet List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search catalog..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value) => handleFilterChange('type', value)}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <ClipboardList className="mx-auto h-12 w-12 mb-4" />
              <p>Equipment Catalog List coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search maintenance logs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}> {/* Placeholder */}
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
              <Wrench className="mx-auto h-12 w-12 mb-4" />
              <p>Maintenance Schedules and Logs coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search usage logs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value) => handleFilterChange('type', value)}> {/* Placeholder */}
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
              <Gauge className="mx-auto h-12 w-12 mb-4" />
              <p>Equipment Usage Logs coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentManagementPage;


