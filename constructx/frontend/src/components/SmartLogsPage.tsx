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
  LayoutDashboard, 
  Loader2,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Signature,
  Settings
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import smartLogService from "../services/smartLogService";
import LogEntriesList from "./LogEntriesList";
import LogEntryForm from "./LogEntryForm";
// import LogTypeManager from "./LogTypeManager";
// import LogMetricsComponent from "./LogMetricsComponent";

interface SmartLogsPageProps {
  projectId?: string; // Optional - if provided, shows logs for specific project
}

const SmartLogsPage: React.FC<SmartLogsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entries");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLogType, setFilterLogType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogEntryForm, setShowLogEntryForm] = useState(false);
  const [editingLogEntry, setEditingLogEntry] = useState<any>(null);
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [logTypes, setLogTypes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    submittedEntries: 0,
    approvedEntries: 0,
    draftEntries: 0,
  });

  // Mock data for development
  const mockLogEntries = [
    {
      id: "log-1",
      projectId: "proj-1",
      logTypeId: "daily-log",
      entryNumber: "DL-001",
      entryDate: "2025-06-20",
      title: "Daily Site Activity",
      status: "Approved",
      createdBy: "John Doe",
      data: { weather: "Sunny", temperature: "25C", activities: "Foundation work, material delivery" }
    },
    {
      id: "log-2",
      projectId: "proj-1",
      logTypeId: "safety-log",
      entryNumber: "SL-001",
      entryDate: "2025-06-19",
      title: "Safety Incident Report",
      status: "Submitted",
      createdBy: "Jane Smith",
      data: { incidentType: "Minor Cut", affectedPersonnel: "Worker A", actionsTaken: "First aid applied" }
    },
    {
      id: "log-3",
      projectId: "proj-1",
      logTypeId: "daily-log",
      entryNumber: "DL-002",
      entryDate: "2025-06-21",
      title: "Morning Briefing",
      status: "Draft",
      createdBy: "John Doe",
      data: { attendees: "All site personnel", topics: "Today's tasks, safety reminders" }
    },
  ];

  const mockLogTypes = [
    { id: "daily-log", name: "Daily Log", description: "Records daily site activities." },
    { id: "safety-log", name: "Safety Log", description: "Records safety incidents and observations." },
    { id: "visitor-log", name: "Visitor Log", description: "Tracks visitors to the site." },
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "Submitted", label: "Submitted" },
    { value: "Approved", label: "Approved" },
    { value: "Archived", label: "Archived" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [logEntriesResponse, logTypesResponse, statusesResponse] = await Promise.all([
        smartLogService.getLogEntries(projectId || ""),
        smartLogService.getLogTypes(),
        smartLogService.getLogEntryStatuses(),
      ]);
      
      setLogEntries(logEntriesResponse);
      setLogTypes(logTypesResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setStats({
        totalEntries: logEntriesResponse.length,
        submittedEntries: logEntriesResponse.filter((log: any) => log.status === "Submitted").length,
        approvedEntries: logEntriesResponse.filter((log: any) => log.status === "Approved").length,
        draftEntries: logEntriesResponse.filter((log: any) => log.status === "Draft").length,
      });
    } catch (error) {
      console.error("Error loading smart log data:", error);
      toast({
        title: "Error",
        description: "Failed to load smart log data. Please try again.",
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
      case "logType":
        setFilterLogType(value);
        break;
    }
  };

  // Handle create Log Entry
  const handleCreateLogEntry = () => {
    setEditingLogEntry(null);
    setShowLogEntryForm(true);
  };

  // Handle edit Log Entry
  const handleEditLogEntry = (logEntry: any) => {
    setEditingLogEntry(logEntry);
    setShowLogEntryForm(true);
  };

  // Handle Log Entry form submit
  const handleLogEntryFormSubmit = async (logEntryData: any) => {
    setIsLoading(true);
    try {
      if (editingLogEntry) {
        await smartLogService.updateLogEntry(editingLogEntry.id, logEntryData);
        toast({
          title: "Success",
          description: "Log entry updated successfully."
        });
      } else {
        await smartLogService.createLogEntry(projectId || "", logEntryData);
        toast({
          title: "Success",
          description: "Log entry created successfully."
        });
      }
      setShowLogEntryForm(false);
      setEditingLogEntry(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving log entry:", error);
      toast({
        title: "Error",
        description: "Failed to save log entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Log Entries based on search and filters
  const filteredLogEntries = logEntries.filter(logEntry => {
    const matchesSearch = !searchTerm || 
      logEntry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logEntry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logEntry.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || logEntry.status === filterStatus;
    const matchesLogType = !filterLogType || logEntry.logTypeId === filterLogType;
    
    return matchesSearch && matchesStatus && matchesLogType;
  });

  if (isLoading && logEntries.length === 0) {
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
          <h1 className="text-3xl font-bold">Smart Logs</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage logs for this project" : "Manage all project logs"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateLogEntry}>
            <Plus className="h-4 w-4 mr-2" />
            Create Log Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submittedEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftEntries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="entries">Log Entries</TabsTrigger>
          <TabsTrigger value="types">Log Types</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search logs..."
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
              <Select value={filterLogType} onValueChange={(value) => handleFilterChange("logType", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Log Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Log Types</SelectItem>
                  {logTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Log Entries List */}
          <LogEntriesList 
            logEntries={filteredLogEntries}
            onEdit={handleEditLogEntry}
            onDelete={async (logEntry) => {
              try {
                await smartLogService.deleteLogEntry(logEntry.id);
                toast({
                  title: "Success",
                  description: "Log entry removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting log entry:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove log entry. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onSubmit={async (logEntry) => {
              try {
                await smartLogService.submitLogEntry(logEntry.id);
                toast({
                  title: "Success",
                  description: "Log entry submitted successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error submitting log entry:", error);
                toast({
                  title: "Error",
                  description: "Failed to submit log entry. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onApprove={async (logEntry) => {
              try {
                await smartLogService.approveLogEntry(logEntry.id);
                toast({
                  title: "Success",
                  description: "Log entry approved successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error approving log entry:", error);
                toast({
                  title: "Error",
                  description: "Failed to approve log entry. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {/* <LogTypeManager 
            logTypes={logTypes}
            onUpdate={() => loadData()} // Reload data after type changes
          /> */}
          <div>Log Type Management coming soon...</div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <LogMetricsComponent 
            logEntries={logEntries}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Log Entry Form Dialog */}
      {showLogEntryForm && (
        <LogEntryForm
          logEntry={editingLogEntry}
          logTypes={logTypes}
          onSubmit={handleLogEntryFormSubmit}
          onCancel={() => {
            setShowLogEntryForm(false);
            setEditingLogEntry(null);
          }}
        />
      )}
    </div>
  );
};

export default SmartLogsPage;


