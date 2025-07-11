import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  List, 
  LayoutDashboard, 
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Check
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import approvalService from "../services/approvalService";
import ApprovalRequestsList from "./ApprovalRequestsList";
// import ApprovalWorkflowsList from "./ApprovalWorkflowsList";
// import ApprovalWorkflowDesigner from "./ApprovalWorkflowDesigner";
import ApprovalRequestForm from "./ApprovalRequestForm";
// import ApprovalMetricsComponent from "./ApprovalMetricsComponent";

interface ApprovalsPageProps {
  projectId?: string; // Optional - if provided, shows approvals for specific project
}

const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEntityType, setFilterEntityType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [entityTypes, setEntityTypes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  // Mock data for development
  const mockApprovalRequests = [
    {
      id: "req-1",
      workflowId: "wf-1",
      projectId: "proj-1",
      entityType: "Submittal",
      entityId: "sub-001",
      title: "Submittal Approval: Concrete Mix Design",
      description: "Approval for concrete mix design as per specification 03 30 00.",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-06-25",
      requestedBy: "John Doe",
      currentStepId: "step-2",
      createdAt: "2025-06-10T10:00:00Z",
      updatedAt: "2025-06-18T14:30:00Z",
    },
    {
      id: "req-2",
      workflowId: "wf-2",
      projectId: "proj-1",
      entityType: "Change Order",
      entityId: "co-005",
      title: "Change Order Approval: HVAC Reroute",
      description: "Approval for rerouting HVAC ducts due to unforeseen conditions.",
      status: "Pending",
      priority: "Critical",
      dueDate: "2025-06-20",
      requestedBy: "Jane Smith",
      currentStepId: "step-1",
      createdAt: "2025-06-15T09:00:00Z",
      updatedAt: "2025-06-15T09:00:00Z",
    },
    {
      id: "req-3",
      workflowId: "wf-1",
      projectId: "proj-1",
      entityType: "Submittal",
      entityId: "sub-002",
      title: "Submittal Approval: Steel Reinforcement",
      description: "Approval for rebar shop drawings.",
      status: "Approved",
      priority: "Medium",
      dueDate: "2025-06-10",
      requestedBy: "John Doe",
      currentStepId: "step-3",
      createdAt: "2025-06-01T11:00:00Z",
      updatedAt: "2025-06-08T16:00:00Z",
      completedAt: "2025-06-08T16:00:00Z",
    },
  ];

  const mockWorkflows = [
    { id: "wf-1", name: "Standard Submittal Approval", isActive: true, moduleContext: "Submittals", entityType: "Submittal" },
    { id: "wf-2", name: "Major Change Order Approval", isActive: true, moduleContext: "Contracts", entityType: "Change Order" },
    { id: "wf-3", name: "Document Review Workflow", isActive: false, moduleContext: "Documents", entityType: "Document" },
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "In Progress", label: "In Progress" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Pending", label: "Pending" },
  ];

  const mockEntityTypes = [
    { value: "Submittal", label: "Submittal" },
    { value: "Change Order", label: "Change Order" },
    { value: "Document", label: "Document" },
    { value: "Invoice", label: "Invoice" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [requestsResponse, workflowsResponse, statusesResponse, entityTypesResponse] = await Promise.all([
        approvalService.getApprovalRequests(projectId || ""),
        approvalService.getApprovalWorkflows(),
        approvalService.getApprovalRequestStatuses(),
        approvalService.getApprovalEntityTypes(),
      ]);
      
      setApprovalRequests(requestsResponse);
      setWorkflows(workflowsResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setEntityTypes(entityTypesResponse.map((e: string) => ({ value: e, label: e })));
      setStats({
        totalRequests: requestsResponse.length,
        pendingRequests: requestsResponse.filter((r: any) => r.status === "Pending" || r.status === "In Progress").length,
        approvedRequests: requestsResponse.filter((r: any) => r.status === "Approved").length,
        rejectedRequests: requestsResponse.filter((r: any) => r.status === "Rejected").length,
      });
    } catch (error) {
      console.error("Error loading approval data:", error);
      toast({
        title: "Error",
        description: "Failed to load approval data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "status":
        setFilterStatus(value);
        break;
      case "entityType":
        setFilterEntityType(value);
        break;
    }
  };

  // Handle add Approval Request
  const handleAddRequest = () => {
    setEditingRequest(null);
    setShowRequestForm(true);
  };

  // Handle edit Approval Request
  const handleEditRequest = (request: any) => {
    setEditingRequest(request);
    setShowRequestForm(true);
  };

  // Handle Approval Request form submit
  const handleRequestFormSubmit = async (requestData: any) => {
    setIsLoading(true);
    try {
      if (editingRequest) {
        await approvalService.updateApprovalRequest(editingRequest.id, requestData);
        toast({
          title: "Success",
          description: "Approval Request updated successfully."
        });
      } else {
        await approvalService.createApprovalRequest(requestData);
        toast({
          title: "Success",
          description: "Approval Request created successfully."
        });
      }
      setShowRequestForm(false);
      setEditingRequest(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving approval request:", error);
      toast({
        title: "Error",
        description: "Failed to save approval request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Approval Requests based on search and filters
  const filteredRequests = approvalRequests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || request.status === filterStatus;
    const matchesEntityType = !filterEntityType || request.entityType === filterEntityType;
    
    return matchesSearch && matchesStatus && matchesEntityType;
  });

  if (isLoading && approvalRequests.length === 0) {
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
          <h1 className="text-3xl font-bold">Approvals Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage approval requests for this project" : "Manage all project approval requests"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddRequest}>
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Approval Requests</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange("status", value)}>
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
              <Select value={filterEntityType} onValueChange={(value) => handleFilterChange("entityType", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Entity Types</SelectItem>
                  {entityTypes.map(entityType => (
                    <SelectItem key={entityType.value} value={entityType.value}>
                      {entityType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Approval Requests List */}
          <ApprovalRequestsList 
            requests={filteredRequests}
            onEdit={handleEditRequest}
            onCancel={async (request) => {
              try {
                await approvalService.cancelApprovalRequest(request.id);
                toast({
                  title: "Success",
                  description: "Approval Request cancelled successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error cancelling approval request:", error);
                toast({
                  title: "Error",
                  description: "Failed to cancel approval request. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {/* <ApprovalWorkflowsList 
            workflows={workflows}
            onEdit={(workflow) => { /* Open workflow designer */ } }
            onDelete={(workflow) => {
              // Handle delete
              setWorkflows(prev => prev.filter(w => w.id !== workflow.id));
              toast({
                title: "Success",
                description: "Workflow deleted successfully."
              });
            }}
            onActivateToggle={(workflowId, isActive) => {
              // Handle activate/deactivate
              setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, isActive: isActive } : w));
              toast({
                title: "Success",
                description: `Workflow ${isActive ? "activated" : "deactivated"} successfully.`
              });
            }}
          /> */}
          <div>Workflows List coming soon...</div>
          {/* <ApprovalWorkflowDesigner /> */}
          <div>Workflow Designer coming soon...</div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <ApprovalMetricsComponent 
            requests={approvalRequests}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Approval Request Form Dialog */}
      {showRequestForm && (
        // <ApprovalRequestForm
        //   request={editingRequest}
        //   workflows={workflows}
        //   entityTypes={entityTypes}
        //   onSubmit={handleRequestFormSubmit}
        //   onCancel={() => {
        //     setShowRequestForm(false);
        //     setEditingRequest(null);
        //   }}
        // />
        <Dialog open={true} onOpenChange={setShowRequestForm}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRequest ? "Edit Approval Request" : "Create New Approval Request"}</DialogTitle>
              <DialogDescription>
                {editingRequest ? "Edit the details of this approval request." : "Fill in the details to create a new approval request."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleRequestFormSubmit({}); }} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workflow" className="text-right">Workflow</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map(wf => (
                      <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entityType" className="text-right">Entity Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map(et => (
                      <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entityId" className="text-right">Entity ID</Label>
                <Input id="entityId" name="entityId" className="col-span-3" placeholder="e.g., sub-001, co-005" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requestedBy" className="text-right">Requested By</Label>
                <Input id="requestedBy" name="requestedBy" className="col-span-3" required />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>Cancel</Button>
              <Button type="submit" onClick={(e) => { e.preventDefault(); handleRequestFormSubmit({}); }}>
                {editingRequest ? "Save Changes" : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ApprovalsPage;


