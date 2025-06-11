import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Calendar, List, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ResourceAllocationForm from "./ResourceAllocationForm";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library
import { format, parseISO } from "date-fns";

// Helper functions
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch (e) {
    console.warn("Failed to parse date:", dateStr, e);
    return "Invalid Date";
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
  } catch (e) {
    console.warn("Failed to parse date:", dateStr, e);
    return "Invalid Date";
  }
};

// Status color mapping
const allocationStatusClasses = {
  "Planned": "text-yellow-700 border-yellow-300 bg-yellow-50",
  "Confirmed": "text-blue-700 border-blue-300 bg-blue-50",
  "In Use": "text-green-700 border-green-300 bg-green-50",
  "Completed": "text-gray-700 border-gray-300 bg-gray-50",
  "Cancelled": "text-red-700 border-red-300 bg-red-50"
};

const ResourceAllocationComponent = ({ resourceId }) => {
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // calendar, list
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // To trigger refetch

  // Fetch allocations
  const loadAllocations = useCallback(async () => {
    if (!resourceId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResourceAllocations(resourceId);
      setAllocations(data || []);
    } catch (err) {
      console.error("Failed to load allocations:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load allocations. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    loadAllocations();
  }, [loadAllocations, triggerRefetch]);

  // Handle add allocation
  const handleAddAllocation = () => {
    setSelectedAllocation(null); // Ensure we are adding, not editing
    setShowAddDialog(true);
  };

  // Handle edit allocation
  const handleEditAllocation = (allocation) => {
    setSelectedAllocation(allocation);
    setShowEditDialog(true);
  };

  // Handle delete allocation
  const handleDeleteAllocation = async (allocationId, allocationName) => {
    if (window.confirm(`Are you sure you want to delete this allocation for ${allocationName}?`)) {
      setIsProcessing(true);
      setError(null);
      try {
        await resourceService.deleteAllocation(allocationId);
        toast.success("Allocation deleted successfully");
        setTriggerRefetch(prev => prev + 1); // Trigger refetch
      } catch (err) {
        console.error("Failed to delete allocation:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to delete allocation. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle save allocation (from add/edit form)
  const handleSaveAllocation = async (savedAllocation) => {
    // The actual API call is handled in the form component
    // Here we just need to close the dialog and trigger a refetch
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedAllocation(null);
    setTriggerRefetch(prev => prev + 1); // Trigger refetch
  };

  // Render Calendar View (Placeholder)
  const renderCalendarView = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Calendar View Placeholder - Requires a calendar library (e.g., FullCalendar)
        </div>
        {/* Display basic allocation info for now */}
        <ul className="mt-4 space-y-2">
          {allocations.map(alloc => (
            <li key={alloc.id} className="text-sm border-l-4 pl-2" style={{ 
              borderColor: alloc.status === "Planned" ? "#fde68a" : 
                          alloc.status === "Confirmed" ? "#93c5fd" : 
                          alloc.status === "In Use" ? "#86efac" : 
                          alloc.status === "Completed" ? "#d1d5db" : 
                          alloc.status === "Cancelled" ? "#fca5a5" : "#d1d5db" 
            }}>
              {alloc.projectName || `Project ${alloc.projectId}`} / {alloc.taskName || "No Task"}: {formatDate(alloc.startDate)} - {formatDate(alloc.endDate)} ({alloc.status})
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  // Render List View
  const renderListView = () => (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Utilization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No allocations found for this resource.
              </TableCell>
            </TableRow>
          ) : (
            allocations.map(alloc => (
              <TableRow key={alloc.id}>
                <TableCell className="font-medium">{alloc.projectName || `Project ${alloc.projectId}`}</TableCell>
                <TableCell>{alloc.taskName || "No Task"}</TableCell>
                <TableCell>{formatDateTime(alloc.startDate)}</TableCell>
                <TableCell>{formatDateTime(alloc.endDate)}</TableCell>
                <TableCell>{alloc.utilization}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className={allocationStatusClasses[alloc.status] || "text-gray-700 border-gray-300 bg-gray-50"}>
                    {alloc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAllocation(alloc)} disabled={isProcessing}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600" 
                      onClick={() => handleDeleteAllocation(alloc.id, alloc.projectName || `Project ${alloc.projectId}`)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Resource Allocations</CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="calendar"><Calendar className="h-4 w-4 mr-1"/> Calendar</TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4 mr-1"/> List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={handleAddAllocation} disabled={isProcessing}>
            <Plus className="h-4 w-4 mr-2" /> Add Allocation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center p-8">Loading allocations...</div>
        ) : (
          <TabsContent value={activeTab} className="mt-0">
            {activeTab === "calendar" ? renderCalendarView() : renderListView()}
          </TabsContent>
        )}
      </CardContent>

      {/* Add Allocation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Allocation</DialogTitle>
          </DialogHeader>
          <ResourceAllocationForm 
            resourceId={resourceId} 
            onSave={handleSaveAllocation} 
            onCancel={() => setShowAddDialog(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Allocation Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Allocation</DialogTitle>
          </DialogHeader>
          {selectedAllocation && (
            <ResourceAllocationForm 
              resourceId={resourceId} 
              allocationData={selectedAllocation} 
              onSave={handleSaveAllocation} 
              onCancel={() => setShowEditDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResourceAllocationComponent;
