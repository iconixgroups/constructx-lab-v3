import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Building,
  Search,
  Loader2,
  Plus,
  Wrench,
  CalendarCheck,
  ClipboardList,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import facilityService from '../services/facilityService';

interface FacilityManagementPageProps {
  // No specific props needed for a global facility management page
}

const FacilityManagementPage: React.FC<FacilityManagementPageProps> = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [facilitiesResponse, maintenanceRequestsResponse] = await Promise.all([
        facilityService.getFacilities(),
        facilityService.getMaintenanceRequests(),
      ]);
      setFacilities(facilitiesResponse);
      setMaintenanceRequests(maintenanceRequestsResponse);
    } catch (error) {
      console.error('Error loading facility management data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facility management data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleAddFacility = async () => {
    toast({
      title: 'Info',
      description: 'Add Facility functionality coming soon!',
    });
  };

  const handleCreateMaintenanceRequest = async () => {
    toast({
      title: 'Info',
      description: 'Create Maintenance Request functionality coming soon!',
    });
  };

  const filteredMaintenanceRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      !searchTerm ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || request.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading && facilities.length === 0 && maintenanceRequests.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facility Management</h1>
          <p className="text-muted-foreground">
            Manage facilities and track maintenance requests.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAddFacility}>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
          <Button onClick={handleCreateMaintenanceRequest}>
            <Wrench className="h-4 w-4 mr-2" />
            New Maintenance Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Facilities Overview</CardTitle>
            <CardDescription>List of managed facilities.</CardDescription>
          </CardHeader>
          <CardContent>
            {facilities.length > 0 ? (
              <ul className="space-y-2">
                {facilities.map((facility) => (
                  <li key={facility.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-sm text-muted-foreground">{facility.address}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <Building className="mx-auto h-12 w-12 mb-4" />
                <p>No facilities added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>Track and manage facility maintenance issues.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-40 ml-2">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredMaintenanceRequests.length > 0 ? (
              <ul className="space-y-2">
                {filteredMaintenanceRequests.map((request) => (
                  <li key={request.id} className="p-2 border rounded-md">
                    <div className="font-medium">{request.subject}</div>
                    <div className="text-sm text-muted-foreground">Facility: {request.facilityName} | Status: {request.status}</div>
                    <div className="text-xs text-muted-foreground">Due: {new Date(request.dueDate).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <ClipboardList className="mx-auto h-12 w-12 mb-4" />
                <p>No maintenance requests found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilityManagementPage;


