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
  List, 
  CalendarDays, 
  Loader2,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Play,
  Flag
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import inspectionService from "../services/inspectionService";
import InspectionsList from "./InspectionsList";
import InspectionsCalendar from "./InspectionsCalendar";
import InspectionForm from "./InspectionForm";
import InspectionTemplateManager from "./InspectionTemplateManager";
import DeficienciesList from "./DeficienciesList";
import DeficiencyForm from "./DeficiencyForm";
// import InspectionMetricsComponent from "./InspectionMetricsComponent";

interface InspectionsPageProps {
  projectId?: string; // Optional - if provided, shows inspections for specific project
}

const InspectionsPage: React.FC<InspectionsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inspections");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [editingInspection, setEditingInspection] = useState<any>(null);
  const [showDeficiencyForm, setShowDeficiencyForm] = useState(false);
  const [editingDeficiency, setEditingDeficiency] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [deficiencies, setDeficiencies] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalInspections: 0,
    scheduledInspections: 0,
    completedInspections: 0,
    openDeficiencies: 0,
  });

  // Mock data for development
  const mockInspections = [
    {
      id: "insp-1",
      projectId: "proj-1",
      inspectionNumber: "QC-001",
      title: "Foundation Quality Check",
      type: "Quality Control",
      status: "Completed",
      scheduledDate: "2025-06-15",
      completedDate: "2025-06-15",
      location: "Area A",
      inspector: "Alice Johnson",
      overallResult: "Pass",
    },
    {
      id: "insp-2",
      projectId: "proj-1",
      inspectionNumber: "SF-001",
      title: "Scaffolding Safety Inspection",
      type: "Safety",
      status: "Scheduled",
      scheduledDate: "2025-06-25",
      location: "Building 1",
      inspector: "Bob Williams",
      overallResult: "N/A",
    },
    {
      id: "insp-3",
      projectId: "proj-1",
      inspectionNumber: "QC-002",
      title: "Electrical Rough-in Inspection",
      type: "Quality Control",
      status: "In Progress",
      scheduledDate: "2025-06-20",
      location: "Floor 2",
      inspector: "Alice Johnson",
      overallResult: "N/A",
    },
  ];

  const mockTemplates = [
    { id: "qc-template", name: "Standard QC Checklist", type: "Quality Control" },
    { id: "safety-template", name: "Daily Safety Walkthrough", type: "Safety" },
  ];

  const mockStatuses = [
    { value: "Scheduled", label: "Scheduled" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [inspectionsResponse, templatesResponse, statusesResponse] = await Promise.all([
        inspectionService.getInspections(projectId || ""),
        inspectionService.getInspectionTemplates(),
        inspectionService.getInspectionStatuses(),
      ]);
      
      setInspections(inspectionsResponse);
      setTemplates(templatesResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      
      // Fetch open deficiencies separately
      const deficienciesResponse = await inspectionService.getDeficiencies(projectId || "", { status: "Open" });

      setStats({
        totalInspections: inspectionsResponse.length,
        scheduledInspections: inspectionsResponse.filter((insp: any) => insp.status === "Scheduled").length,
        completedInspections: inspectionsResponse.filter((insp: any) => insp.status === "Completed").length,
        openDeficiencies: deficienciesResponse.length,
      });
    } catch (error) {
      console.error("Error loading inspection data:", error);
      toast({
        title: "Error",
        description: "Failed to load inspection data. Please try again.",
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
  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case "status":
        setFilterStatus(value);
        break;
      case "type":
        setFilterType(value);
        break;
    }
  };

  // Handle schedule Inspection
  const handleScheduleInspection = () => {
    setEditingInspection(null);
    setShowInspectionForm(true);
  };

  const handleEditDeficiency = (deficiency: any) => {
    setEditingDeficiency(deficiency);
    setShowDeficiencyForm(true);
  };

  // Handle Inspection form submit
  const handleInspectionFormSubmit = async (inspectionData: any) => {
    setIsLoading(true);
    try {
      if (editingInspection) {
        await inspectionService.updateInspection(editingInspection.id, inspectionData);
        toast({
          title: "Success",
          description: "Inspection updated successfully."
        });
      } else {
        await inspectionService.scheduleInspection(projectId || "", inspectionData);
        toast({
          title: "Success",
          description: "Inspection scheduled successfully."
        });
      }
      setShowInspectionForm(false);
      setEditingInspection(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving inspection:", error);
      toast({
        title: "Error",
        description: "Failed to save inspection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Inspections based on search and filters
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = !searchTerm || 
      inspection.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || inspection.status === filterStatus;
    const matchesType = !filterType || inspection.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading && inspections.length === 0) {
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
          <h1 className="text-3xl font-bold">Inspections Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage inspections for this project" : "Manage all project inspections"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleScheduleInspection}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledInspections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedInspections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Deficiencies</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openDeficiencies}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inspections">Inspections List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="deficiencies">Deficiencies</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search inspections..."
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
              <Select value={filterType} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.type}>
                      {template.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inspections List */}
          <InspectionsList 
            inspections={filteredInspections}
            onEdit={handleEditInspection}
            onDelete={async (inspection) => {
              try {
                await inspectionService.cancelInspection(inspection.id);
                toast({
                  title: "Success",
                  description: "Inspection cancelled successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error cancelling inspection:", error);
                toast({
                  title: "Error",
                  description: "Failed to cancel inspection. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onStart={async (inspection) => {
              try {
                await inspectionService.startInspection(inspection.id);
                toast({
                  title: "Success",
                  description: "Inspection started."
                });
                loadData();
              } catch (error) {
                console.error("Error starting inspection:", error);
                toast({
                  title: "Error",
                  description: "Failed to start inspection. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onComplete={async (inspection) => {
              try {
                await inspectionService.completeInspection(inspection.id);
                toast({
                  title: "Success",
                  description: "Inspection completed."
                });
                loadData();
              } catch (error) {
                console.error("Error completing inspection:", error);
                toast({
                  title: "Error",
                  description: "Failed to complete inspection. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <InspectionsCalendar 
            inspections={filteredInspections}
            onEdit={handleEditInspection}
          />
        </TabsContent>

        <TabsContent value="deficiencies" className="space-y-4">
          <DeficienciesList 
            deficiencies={deficiencies}
            onEdit={handleEditDeficiency}
            onDelete={async (deficiency) => {
              try {
                await inspectionService.deleteDeficiency(deficiency.id);
                toast({
                  title: "Success",
                  description: "Deficiency deleted successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting deficiency:", error);
                toast({
                  title: "Error",
                  description: "Failed to delete deficiency. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onUpdateStatus={async (deficiency, status) => {
              try {
                await inspectionService.updateDeficiencyStatus(deficiency.id, status);
                toast({
                  title: "Success",
                  description: `Deficiency status updated to ${status}.`
                });
                loadData();
              } catch (error) {
                console.error("Error updating deficiency status:", error);
                toast({
                  title: "Error",
                  description: "Failed to update deficiency status. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onAssign={async (deficiency, assignedTo) => {
              try {
                await inspectionService.assignDeficiency(deficiency.id, assignedTo);
                toast({
                  title: "Success",
                  description: `Deficiency assigned to ${assignedTo}.`
                });
                loadData();
              } catch (error) {
                console.error("Error assigning deficiency:", error);
                toast({
                  title: "Error",
                  description: "Failed to assign deficiency. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <InspectionTemplateManager 
            templates={templates}
            onUpdate={() => loadData()} // Reload data after template changes
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <InspectionMetricsComponent 
            inspections={inspections}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {showDeficiencyForm && (
        <DeficiencyForm
          deficiency={editingDeficiency}
          onSubmit={async (deficiencyData) => {
            try {
              if (editingDeficiency) {
                await inspectionService.updateDeficiency(editingDeficiency.id, deficiencyData);
                toast({
                  title: "Success",
                  description: "Deficiency updated successfully."
                });
              } else {
                // Assuming we create a deficiency from an inspection, need inspectionId
                // For now, this will be a standalone deficiency creation
                await inspectionService.createDeficiency("", deficiencyData); // Placeholder for inspectionId
                toast({
                  title: "Success",
                  description: "Deficiency created successfully."
                });
              }
              setShowDeficiencyForm(false);
              setEditingDeficiency(null);
              loadData();
            } catch (error) {
              console.error("Error saving deficiency:", error);
              toast({
                title: "Error",
                description: "Failed to save deficiency. Please try again.",
                variant: "destructive"
              });
            }
          }}
          onCancel={() => {
            setShowDeficiencyForm(false);
            setEditingDeficiency(null);
          }}
        />
      )}
      {showInspectionForm && (
        <InspectionForm
          inspection={editingInspection}
          templates={templates}
          onSubmit={handleInspectionFormSubmit}
          onCancel={() => {
            setShowInspectionForm(false);
            setEditingInspection(null);
          }}
        />
      )}
    </div>
  );
};

export default InspectionsPage;


