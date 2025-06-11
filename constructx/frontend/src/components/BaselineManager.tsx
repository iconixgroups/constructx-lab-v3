import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle, Calendar, Clock, ArrowUpDown } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getScheduleBaselines: async (scheduleId) => {
    console.log("Fetching baselines for schedule:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: "baseline1",
        name: "Initial Baseline",
        description: "Baseline created at project start",
        createdBy: "John Smith",
        createdAt: "2024-01-10T10:30:00Z"
      },
      {
        id: "baseline2",
        name: "Post-Planning Baseline",
        description: "Baseline after planning phase completion",
        createdBy: "Emily Johnson",
        createdAt: "2024-02-15T14:45:00Z"
      },
      {
        id: "baseline3",
        name: "Mid-Project Baseline",
        description: "Baseline after scope changes",
        createdBy: "Michael Chen",
        createdAt: "2024-03-22T09:15:00Z"
      }
    ];
  },
  createBaseline: async (scheduleId, baselineData) => {
    console.log("Creating baseline for schedule:", scheduleId, baselineData);
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: `baseline${Date.now()}`,
      ...baselineData,
      createdAt: new Date().toISOString()
    };
  },
  getBaselineComparison: async (scheduleId, baselineId) => {
    console.log("Fetching comparison for baseline:", baselineId);
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      summary: {
        totalTasks: 25,
        tasksOnSchedule: 12,
        tasksAhead: 3,
        tasksBehind: 10,
        daysAheadBehind: -5, // negative means behind schedule
        costVariance: -12500, // negative means over budget
      },
      itemComparisons: [
        {
          itemId: "item1",
          name: "Project Planning Phase",
          baselineStart: "2024-01-15",
          baselineEnd: "2024-02-10",
          currentStart: "2024-01-15",
          currentEnd: "2024-02-15",
          variance: 5, // days
          status: "behind"
        },
        {
          itemId: "item1-1",
          name: "Requirements Gathering",
          baselineStart: "2024-01-15",
          baselineEnd: "2024-01-22",
          currentStart: "2024-01-15",
          currentEnd: "2024-01-25",
          variance: 3,
          status: "behind"
        },
        {
          itemId: "item1-2",
          name: "Initial Design",
          baselineStart: "2024-01-23",
          baselineEnd: "2024-02-05",
          currentStart: "2024-01-20",
          currentEnd: "2024-02-05",
          variance: -3, // negative means ahead of schedule
          status: "ahead"
        },
        {
          itemId: "item2",
          name: "Foundation Work",
          baselineStart: "2024-02-15",
          baselineEnd: "2024-04-05",
          currentStart: "2024-02-20",
          currentEnd: "2024-04-10",
          variance: 10,
          status: "behind"
        }
      ]
    };
  }
};

// Helper functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const BaselineManager = ({ scheduleId }) => {
  const [baselines, setBaselines] = useState([]);
  const [selectedBaselineId, setSelectedBaselineId] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  
  // New baseline form state
  const [newBaseline, setNewBaseline] = useState({
    name: "",
    description: ""
  });
  
  // Load baselines
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    mockApi.getScheduleBaselines(scheduleId)
      .then(data => {
        setBaselines(data);
        if (data.length > 0) {
          setSelectedBaselineId(data[0].id);
        }
      })
      .catch(err => {
        console.error("Failed to load baselines:", err);
        setError("Failed to load baselines. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId]);
  
  // Load comparison data when baseline is selected
  useEffect(() => {
    if (!scheduleId || !selectedBaselineId) return;
    
    setIsComparisonLoading(true);
    
    mockApi.getBaselineComparison(scheduleId, selectedBaselineId)
      .then(data => {
        setComparisonData(data);
      })
      .catch(err => {
        console.error("Failed to load baseline comparison:", err);
        setError("Failed to load comparison data. Please try again.");
      })
      .finally(() => setIsComparisonLoading(false));
  }, [scheduleId, selectedBaselineId]);
  
  // Handle baseline selection
  const handleBaselineChange = (baselineId) => {
    setSelectedBaselineId(baselineId);
  };
  
  // Handle input changes for new baseline
  const handleInputChange = (field, value) => {
    setNewBaseline(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle create baseline
  const handleCreateBaseline = async () => {
    if (!newBaseline.name.trim()) {
      setError("Baseline name is required");
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      const createdBaseline = await mockApi.createBaseline(scheduleId, {
        name: newBaseline.name,
        description: newBaseline.description,
        createdBy: "Current User" // In a real app, get from auth context
      });
      
      setBaselines(prev => [createdBaseline, ...prev]);
      setSelectedBaselineId(createdBaseline.id);
      setShowCreateDialog(false);
      setNewBaseline({ name: "", description: "" });
    } catch (err) {
      console.error("Failed to create baseline:", err);
      setError("Failed to create baseline. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Render summary tab
  const renderSummaryTab = () => {
    if (!comparisonData) return null;
    
    const { summary } = comparisonData;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Schedule Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tasks On Schedule:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {summary.tasksOnSchedule} / {summary.totalTasks}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Tasks Ahead:</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {summary.tasksAhead} / {summary.totalTasks}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Tasks Behind:</span>
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  {summary.tasksBehind} / {summary.totalTasks}
                </Badge>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span>Overall Schedule:</span>
                {summary.daysAheadBehind === 0 ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    On Schedule
                  </Badge>
                ) : summary.daysAheadBehind < 0 ? (
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    {Math.abs(summary.daysAheadBehind)} Days Behind
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {summary.daysAheadBehind} Days Ahead
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cost Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center font-medium">
                <span>Budget Variance:</span>
                {summary.costVariance === 0 ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    On Budget
                  </Badge>
                ) : summary.costVariance < 0 ? (
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    ${Math.abs(summary.costVariance).toLocaleString()} Over
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    ${summary.costVariance.toLocaleString()} Under
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Baseline created on {formatDateTime(baselines.find(b => b.id === selectedBaselineId)?.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render details tab
  const renderDetailsTab = () => {
    if (!comparisonData) return null;
    
    const { itemComparisons } = comparisonData;
    
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2 border-b">Task Name</th>
                <th className="text-left p-2 border-b">Baseline Start</th>
                <th className="text-left p-2 border-b">Baseline End</th>
                <th className="text-left p-2 border-b">Current Start</th>
                <th className="text-left p-2 border-b">Current End</th>
                <th className="text-left p-2 border-b">Variance (Days)</th>
                <th className="text-left p-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {itemComparisons.map((item, index) => (
                <tr key={item.itemId} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">{formatDate(item.baselineStart)}</td>
                  <td className="p-2 border-b">{formatDate(item.baselineEnd)}</td>
                  <td className="p-2 border-b">{formatDate(item.currentStart)}</td>
                  <td className="p-2 border-b">{formatDate(item.currentEnd)}</td>
                  <td className="p-2 border-b">
                    {item.variance === 0 ? (
                      <span>0</span>
                    ) : item.variance > 0 ? (
                      <span className="text-red-600">+{item.variance}</span>
                    ) : (
                      <span className="text-green-600">{item.variance}</span>
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {item.status === "on-schedule" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        On Schedule
                      </Badge>
                    ) : item.status === "behind" ? (
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        Behind
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        Ahead
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Render create baseline dialog
  const renderCreateBaselineDialog = () => {
    return (
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Baseline</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Baseline Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newBaseline.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter baseline name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newBaseline.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter description (optional)"
              />
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-amber-800 text-sm">
                Creating a baseline will capture the current state of your schedule for future comparison. 
                This action cannot be undone.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateDialog(false);
                setNewBaseline({ name: "", description: "" });
                setError(null);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBaseline} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Baseline"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading baselines...</div>;
  }
  
  return (
    <div className="baseline-manager space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          {baselines.length === 0 ? (
            <div className="text-muted-foreground">No baselines available</div>
          ) : (
            <Select value={selectedBaselineId} onValueChange={handleBaselineChange}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Select baseline" />
              </SelectTrigger>
              <SelectContent>
                {baselines.map(baseline => (
                  <SelectItem key={baseline.id} value={baseline.id}>
                    {baseline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          Create New Baseline
        </Button>
      </div>
      
      {selectedBaselineId && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {formatDateTime(baselines.find(b => b.id === selectedBaselineId)?.createdAt)}
            </span>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              {isComparisonLoading ? (
                <div className="flex justify-center items-center h-64">
                  Loading comparison data...
                </div>
              ) : (
                <>
                  <TabsContent value="summary" className="mt-0">
                    {renderSummaryTab()}
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-0">
                    {renderDetailsTab()}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      )}
      
      {/* Create Baseline Dialog */}
      {renderCreateBaselineDialog()}
    </div>
  );
};

export default BaselineManager;
