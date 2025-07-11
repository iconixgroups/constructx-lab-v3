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
  MoreHorizontal
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import rfiService from "../services/rfiService";
import RFIsList from "./RFIsList";
import RFIKanbanBoard from "./RFIKanbanBoard";
import RFIForm from "./RFIForm";
// import RFIMetricsComponent from "./RFIMetricsComponent";

interface RFIsPageProps {
  projectId?: string; // Optional - if provided, shows RFIs for specific project
}

const RFIsPage: React.FC<RFIsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRFIForm, setShowRFIForm] = useState(false);
  const [editingRFI, setEditingRFI] = useState<any>(null);
  const [rfis, setRFIs] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRFIs: 0,
    openRFIs: 0,
    overdueRFIs: 0,
    respondedRFIs: 0,
  });

  // Mock data for development
  const mockRFIs = [
    {
      id: "rfi-1",
      projectId: "proj-1",
      rfiNumber: "RFI-001",
      title: "Clarification on Foundation Details",
      description: "Need clarification on the rebar spacing for the main building foundation. Drawing A-101 shows conflicting information with structural specifications.",
      status: "Under Review",
      priority: "High",
      category: "Structural",
      dueDate: "2025-06-20",
      submittedDate: "2025-06-10",
      closedDate: null,
      submittedBy: "John Doe",
      assignedTo: "Jane Smith",
      impactDescription: "Potential delay to foundation pouring if not resolved by due date.",
      costImpact: false,
      scheduleImpact: true,
      responses: [],
      attachments: [],
      comments: []
    },
    {
      id: "rfi-2",
      projectId: "proj-1",
      rfiNumber: "RFI-002",
      title: "MEP Rough-in Schedule",
      description: "Requesting the updated MEP rough-in schedule for Level 3. The current schedule is outdated.",
      status: "Submitted",
      priority: "Medium",
      category: "MEP",
      dueDate: "2025-06-25",
      submittedDate: "2025-06-12",
      closedDate: null,
      submittedBy: "Sarah Johnson",
      assignedTo: "Mike Chen",
      impactDescription: "",
      costImpact: false,
      scheduleImpact: false,
      responses: [],
      attachments: [],
      comments: []
    },
    {
      id: "rfi-3",
      projectId: "proj-1",
      rfiNumber: "RFI-003",
      title: "Paint Color for Lobby",
      description: "Confirming the final paint color for the main lobby area. Please provide the exact color code.",
      status: "Responded",
      priority: "Low",
      category: "Architectural",
      dueDate: "2025-06-15",
      submittedDate: "2025-06-08",
      closedDate: "2025-06-14",
      submittedBy: "Lisa Rodriguez",
      assignedTo: "Architect Team",
      impactDescription: "",
      costImpact: false,
      scheduleImpact: false,
      responses: [{ id: "resp-1", response: "The final paint color is Sherwin-Williams SW 7006 Extra White.", respondedBy: "Architect Team", respondedAt: "2025-06-14T10:00:00Z", isOfficial: true }],
      attachments: [],
      comments: []
    }
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "Submitted", label: "Submitted" },
    { value: "Under Review", label: "Under Review" },
    { value: "Responded", label: "Responded" },
    { value: "Closed", label: "Closed" },
  ];

  const mockPriorities = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  const mockCategories = [
    { value: "Architectural", label: "Architectural" },
    { value: "Structural", label: "Structural" },
    { value: "MEP", label: "MEP" },
    { value: "Civil", label: "Civil" },
    { value: "Finishes", label: "Finishes" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rfisResponse, statusesResponse, prioritiesResponse, categoriesResponse] = await Promise.all([
        rfiService.getRFIs(projectId || ""), // Pass projectId if available
        rfiService.getStatuses(),
        rfiService.getPriorities(),
        rfiService.getCategories()
      ]);
      
      setRFIs(rfisResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setPriorities(prioritiesResponse.map((p: string) => ({ value: p, label: p })));
      setCategories(categoriesResponse.map((c: string) => ({ value: c, label: c })));
      setStats({
        totalRFIs: rfisResponse.length,
        openRFIs: rfisResponse.filter((r: any) => r.status !== "Closed" && r.status !== "Responded").length,
        overdueRFIs: rfisResponse.filter((r: any) => r.status !== "Closed" && new Date(r.dueDate) < new Date()).length,
        respondedRFIs: rfisResponse.filter((r: any) => r.status === "Responded").length,
      });
    } catch (error) {
      console.error("Error loading RFI data:", error);
      toast({
        title: "Error",
        description: "Failed to load RFI data. Please try again.",
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
      case "priority":
        setFilterPriority(value);
        break;
      case "category":
        setFilterCategory(value);
        break;
    }
  };

  // Handle add RFI
  const handleAddRFI = () => {
    setEditingRFI(null);
    setShowRFIForm(true);
  };

  // Handle edit RFI
  const handleEditRFI = (rfi: any) => {
    setEditingRFI(rfi);
    setShowRFIForm(true);
  };

  // Handle RFI form submit
  const handleRFIFormSubmit = async (rfiData: any) => {
    setIsLoading(true);
    try {
      if (editingRFI) {
        await rfiService.updateRFI(editingRFI.id, rfiData);
        toast({
          title: "Success",
          description: "RFI updated successfully."
        });
      } else {
        await rfiService.createRFI(projectId || "", rfiData);
        toast({
          title: "Success",
          description: "RFI created successfully."
        });
      }
      setShowRFIForm(false);
      setEditingRFI(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving RFI:", error);
      toast({
        title: "Error",
        description: "Failed to save RFI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter RFIs based on search and filters
  const filteredRFIs = rfis.filter(rfi => {
    const matchesSearch = !searchTerm || 
      rfi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfi.rfiNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || rfi.status === filterStatus;
    const matchesPriority = !filterPriority || rfi.priority === filterPriority;
    const matchesCategory = !filterCategory || rfi.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  if (isLoading && rfis.length === 0) {
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
          <h1 className="text-3xl font-bold">RFI Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage Requests for Information for this project" : "Manage all Requests for Information"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddRFI}>
            <Plus className="h-4 w-4 mr-2" />
            Add RFI
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFIs</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRFIs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open RFIs</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRFIs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue RFIs</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueRFIs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded RFIs</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.respondedRFIs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search RFIs..."
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
              <Select value={filterPriority} onValueChange={(value) => handleFilterChange("priority", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RFIs List */}
          <RFIsList 
            rfis={filteredRFIs}
            onEdit={handleEditRFI}
            onDelete={async (rfi) => {
              try {
                await rfiService.deleteRFI(rfi.id);
                toast({
                  title: "Success",
                  description: "RFI removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting RFI:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove RFI. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <RFIKanbanBoard 
            rfis={filteredRFIs}
            onEdit={handleEditRFI}
            onStatusChange={async (rfiId, newStatus) => {
              try {
                await rfiService.updateRFIStatus(rfiId, newStatus);
                toast({
                  title: "Success",
                  description: `RFI status updated to ${newStatus}.`
                });
                loadData();
              } catch (error) {
                console.error("Error updating RFI status:", error);
                toast({
                  title: "Error",
                  description: "Failed to update RFI status. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <RFIMetricsComponent 
            rfis={rfis}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* RFI Form Dialog */}
      {showRFIForm && (
        <RFIForm
          rfi={editingRFI}
          statuses={statuses}
          priorities={priorities}
          categories={categories}
          onSubmit={handleRFIFormSubmit}
          onCancel={() => {
            setShowRFIForm(false);
            setEditingRFI(null);
          }}
        />
      )}
    </div>
  );
};

export default RFIsPage;


