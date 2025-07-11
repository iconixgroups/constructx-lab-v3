import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  LayoutGrid, 
  List, 
  Loader2,
  BarChart,
  DollarSign,
  Users,
  ArrowRight
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import leadService from '../services/leadService';

// import LeadPipeline from './LeadPipeline';
// import LeadsList from './LeadsList';
// import LeadForm from './LeadForm';

interface LeadsPageProps {
  projectId?: string; // Optional - if provided, shows leads for specific project
}

const LeadsPage: React.FC<LeadsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]); // Mock for now
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    wonLeads: 0,
    totalEstimatedValue: 0,
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsResponse, statusesResponse, metricsResponse] = await Promise.all([
        leadService.getLeads(projectId || ''),
        leadService.getLeadStatuses(),
        leadService.getLeadMetrics(projectId || ''),
      ]);
      
      setLeads(leadsResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setMetrics(metricsResponse);

      // Mock assigned users for now
      setAssignedUsers([
        { id: 'user-1', name: 'John Doe' },
        { id: 'user-2', name: 'Jane Smith' },
      ]);

    } catch (error) {
      console.error('Error loading lead data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lead data. Please try again.',
        variant: 'destructive'
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
      case 'assignedTo':
        setFilterAssignedTo(value);
        break;
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setShowLeadForm(true);
  };

  const handleEditLead = (lead: any) => {
    setEditingLead(lead);
    setShowLeadForm(true);
  };

  const handleLeadFormSubmit = async (leadData: any) => {
    setIsLoading(true);
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead.id, leadData);
        toast({
          title: 'Success',
          description: 'Lead updated successfully.'
        });
      } else {
        await leadService.createLead(leadData);
        toast({
          title: 'Success',
          description: 'Lead created successfully.'
        });
      }
      setShowLeadForm(false);
      setEditingLead(null);
      loadData();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to save lead. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(leadId);
      toast({
        title: 'Success',
        description: 'Lead deleted successfully.'
      });
      loadData();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertLead = async (leadId: string) => {
    setIsLoading(true);
    try {
      await leadService.convertToProject(leadId);
      toast({
        title: 'Success',
        description: 'Lead converted to project successfully.'
      });
      loadData();
    } catch (error) {
      console.error('Error converting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to convert lead to project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.clientCompany?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || lead.status === filterStatus;
    const matchesAssignedTo = !filterAssignedTo || lead.assignedTo === filterAssignedTo;
    
    return matchesSearch && matchesStatus && matchesAssignedTo;
  });

  if (isLoading && leads.length === 0) {
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
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage leads for project ${projectId}` : 'Track and manage your potential business opportunities'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddLead}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.qualifiedLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
            <ArrowRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.wonLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Est. Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalEstimatedValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAssignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  {assignedUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lead Pipeline Component */}
          {/* <LeadPipeline 
            leads={filteredLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onConvert={handleConvertLead}
            onStatusChange={async (leadId, newStatus) => {
              try {
                await leadService.updateLead(leadId, { status: newStatus });
                toast({
                  title: 'Success',
                  description: 'Lead status updated successfully.'
                });
                loadData();
              } catch (error) {
                console.error('Error updating lead status:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to update lead status. Please try again.',
                  variant: 'destructive'
                });
              }
            }}
          /> */}
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <LayoutGrid className="mx-auto h-12 w-12 mb-4" />
              <p>Lead Pipeline visualization coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters (repeated for list view for now, can be refactored) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAssignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  {assignedUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leads List Component */}
          {/* <LeadsList 
            leads={filteredLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onConvert={handleConvertLead}
          /> */}
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <List className="mx-auto h-12 w-12 mb-4" />
              <p>Leads List view coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Form Modal */}
      {/* {showLeadForm && (
        <LeadForm
          lead={editingLead}
          onSubmit={handleLeadFormSubmit}
          onCancel={() => {
            setShowLeadForm(false);
            setEditingLead(null);
          }}
        />
      )} */}
    </div>
  );
};

export default LeadsPage;


