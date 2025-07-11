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
import submittalService from "../services/submittalService";
import SubmittalLog from "./SubmittalLog";
import SubmittalForm from "./SubmittalForm";
// import SubmittalMetricsComponent from "./SubmittalMetricsComponent";

interface SubmittalsPageProps {
  projectId?: string; // Optional - if provided, shows submittals for specific project
}

const SubmittalsPage: React.FC<SubmittalsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("log");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBallInCourt, setFilterBallInCourt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmittalForm, setShowSubmittalForm] = useState(false);
  const [editingSubmittal, setEditingSubmittal] = useState<any>(null);
  const [submittals, setSubmittals] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ballInCourts, setBallInCourts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSubmittals: 0,
    pendingSubmittals: 0,
    overdueSubmittals: 0,
    approvedSubmittals: 0,
  });

  // Mock data for development
  const mockSubmittals = [
    {
      id: "sub-1",
      projectId: "proj-1",
      submittalNumber: "SUB-001",
      title: "Concrete Mix Design",
      description: "Mix design for all structural concrete elements.",
      specificationSection: "03 30 00 Cast-in-Place Concrete",
      status: "Under Review",
      priority: "High",
      category: "Material",
      dueDate: "2025-06-20",
      submittedDate: "2025-06-10",
      returnedDate: null,
      submittedBy: "Contractor A",
      contractor: "ABC Construction",
      supplier: "ReadyMix Inc.",
      ballInCourt: "Architect",
      items: [],
      attachments: [],
      reviews: [],
      comments: []
    },
    {
      id: "sub-2",
      projectId: "proj-1",
      submittalNumber: "SUB-002",
      title: "HVAC Ductwork Shop Drawings",
      description: "Shop drawings for Level 2 HVAC ductwork installation.",
      specificationSection: "23 31 00 HVAC Ducts and Casings",
      status: "Submitted",
      priority: "Medium",
      category: "Shop Drawing",
      dueDate: "2025-06-25",
      submittedDate: "2025-06-12",
      returnedDate: null,
      submittedBy: "MEP Subcontractor",
      contractor: "XYZ Mechanical",
      supplier: "DuctFab Corp.",
      ballInCourt: "Engineer",
      items: [],
      attachments: [],
      reviews: [],
      comments: []
    },
    {
      id: "sub-3",
      projectId: "proj-1",
      submittalNumber: "SUB-003",
      title: "Paint Color Samples",
      description: "Samples for interior paint colors as per architectural specifications.",
      specificationSection: "09 90 00 Painting and Coating",
      status: "Approved",
      priority: "Low",
      category: "Sample",
      dueDate: "2025-06-15",
      submittedDate: "2025-06-08",
      returnedDate: "2025-06-14",
      submittedBy: "Finishes Contractor",
      contractor: "Elegant Finishes",
      supplier: "PaintCo",
      ballInCourt: "None",
      items: [],
      attachments: [],
      reviews: [],
      comments: []
    }
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "Submitted", label: "Submitted" },
    { value: "Under Review", label: "Under Review" },
    { value: "Approved", label: "Approved" },
    { value: "Approved as Noted", label: "Approved as Noted" },
    { value: "Revise and Resubmit", label: "Revise and Resubmit" },
    { value: "Rejected", label: "Rejected" },
  ];

  const mockCategories = [
    { value: "Material", label: "Material" },
    { value: "Equipment", label: "Equipment" },
    { value: "Shop Drawing", label: "Shop Drawing" },
    { value: "Sample", label: "Sample" },
    { value: "Product Data", label: "Product Data" },
  ];

  const mockBallInCourts = [
    { value: "Contractor", label: "Contractor" },
    { value: "Architect", label: "Architect" },
    { value: "Engineer", label: "Engineer" },
    { value: "Owner", label: "Owner" },
    { value: "Consultant", label: "Consultant" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [submittalsResponse, statusesResponse, categoriesResponse, ballInCourtsResponse] = await Promise.all([
        submittalService.getSubmittals(projectId || ""),
        submittalService.getStatuses(),
        submittalService.getCategories(),
        submittalService.getBallInCourts()
      ]);
      
      setSubmittals(submittalsResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setCategories(categoriesResponse.map((c: string) => ({ value: c, label: c })));
      setBallInCourts(ballInCourtsResponse.map((b: string) => ({ value: b, label: b })));
      setStats({
        totalSubmittals: submittalsResponse.length,
        pendingSubmittals: submittalsResponse.filter((s: any) => s.status === "Submitted" || s.status === "Under Review").length,
        overdueSubmittals: submittalsResponse.filter((s: any) => (s.status === "Submitted" || s.status === "Under Review") && new Date(s.dueDate) < new Date()).length,
        approvedSubmittals: submittalsResponse.filter((s: any) => s.status === "Approved" || s.status === "Approved as Noted").length,
      });
    } catch (error) {
      console.error("Error loading submittal data:", error);
      toast({
        title: "Error",
        description: "Failed to load submittal data. Please try again.",
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
      case "category":
        setFilterCategory(value);
        break;
      case "ballInCourt":
        setFilterBallInCourt(value);
        break;
    }
  };

  // Handle add Submittal
  const handleAddSubmittal = () => {
    setEditingSubmittal(null);
    setShowSubmittalForm(true);
  };

  // Handle edit Submittal
  const handleEditSubmittal = (submittal: any) => {
    setEditingSubmittal(submittal);
    setShowSubmittalForm(true);
  };

  // Handle Submittal form submit
  const handleSubmittalFormSubmit = async (submittalData: any) => {
    setIsLoading(true);
    try {
      if (editingSubmittal) {
        await submittalService.updateSubmittal(editingSubmittal.id, submittalData);
        toast({
          title: "Success",
          description: "Submittal updated successfully."
        });
      } else {
        await submittalService.createSubmittal(projectId || "", submittalData);
        toast({
          title: "Success",
          description: "Submittal created successfully."
        });
      }
      setShowSubmittalForm(false);
      setEditingSubmittal(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving submittal:", error);
      toast({
        title: "Error",
        description: "Failed to save submittal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Submittals based on search and filters
  const filteredSubmittals = submittals.filter(submittal => {
    const matchesSearch = !searchTerm || 
      submittal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submittal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submittal.submittalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submittal.specificationSection.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || submittal.status === filterStatus;
    const matchesCategory = !filterCategory || submittal.category === filterCategory;
    const matchesBallInCourt = !filterBallInCourt || submittal.ballInCourt === filterBallInCourt;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesBallInCourt;
  });

  if (isLoading && submittals.length === 0) {
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
          <h1 className="text-3xl font-bold">Submittals Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage submittals for this project" : "Manage all project submittals"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddSubmittal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Submittal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submittals</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmittals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submittals</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSubmittals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Submittals</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueSubmittals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Submittals</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedSubmittals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="log">Submittal Log</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search submittals..."
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
              <Select value={filterBallInCourt} onValueChange={(value) => handleFilterChange("ballInCourt", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Ball-in-Court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {ballInCourts.map(bic => (
                    <SelectItem key={bic.value} value={bic.value}>
                      {bic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submittal Log */}
          <SubmittalLog 
            submittals={filteredSubmittals}
            onEdit={handleEditSubmittal}
            onDelete={async (submittal) => {
              try {
                await submittalService.deleteSubmittal(submittal.id);
                toast({
                  title: "Success",
                  description: "Submittal removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting submittal:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove submittal. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <SubmittalMetricsComponent 
            submittals={submittals}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Submittal Form Dialog */}
      {showSubmittalForm && (
        <SubmittalForm
          submittal={editingSubmittal}
          statuses={statuses}
          categories={categories}
          ballInCourts={ballInCourts}
          onSubmit={handleSubmittalFormSubmit}
          onCancel={() => {
            setShowSubmittalForm(false);
            setEditingSubmittal(null);
          }}
        />
      )}
    </div>
  );
};

export default SubmittalsPage;


