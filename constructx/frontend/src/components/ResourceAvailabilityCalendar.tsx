import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar as CalendarIcon, List, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import ResourceAvailabilityForm from "./ResourceAvailabilityForm";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library
import { format, parseISO } from "date-fns";

// Helper functions
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
  } catch (e) {
    console.warn("Failed to parse date:", dateStr, e);
    return "Invalid Date";
  }
};

const ResourceAvailabilityCalendar = ({ resourceId }) => {
  const [availabilityData, setAvailabilityData] = useState({ exceptions: [], allocations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // calendar, list
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedException, setSelectedException] = useState(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // To trigger refetch

  // Fetch availability data
  const loadAvailability = useCallback(async () => {
    if (!resourceId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResourceAvailability(resourceId);
      setAvailabilityData(data || { exceptions: [], allocations: [] });
    } catch (err) {
      console.error("Failed to load availability:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load availability data. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability, triggerRefetch]);

  // Handle add exception
  const handleAddException = () => {
    setSelectedException(null);
    setShowAddDialog(true);
  };

  // Handle edit exception
  const handleEditException = (exception) => {
    setSelectedException(exception);
    setShowEditDialog(true);
  };

  // Handle delete exception
  const handleDeleteException = async (exceptionId, reason) => {
    if (window.confirm(`Are you sure you want to delete this availability exception for "${reason}"?`)) {
      setIsProcessing(true);
      setError(null);
      try {
        await resourceService.deleteAvailabilityException(exceptionId);
        toast.success("Availability exception deleted successfully");
        setTriggerRefetch(prev => prev + 1); // Trigger refetch
      } catch (err) {
        console.error("Failed to delete exception:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to delete availability exception. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle save exception (from add/edit form)
  const handleSaveException = async (savedExceptionData) => {
    // The actual API call is handled in the form component
    // Here we just need to close the dialog and trigger a refetch
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedException(null);
    setTriggerRefetch(prev => prev + 1); // Trigger refetch
  };

  // Render Calendar View (Placeholder)
  const renderCalendarView = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Availability Calendar View Placeholder - Requires a calendar library
        </div>
        {/* Display basic exception info for now */}
        <h4 className="mt-4 font-medium">Availability Exceptions:</h4>
        <ul className="mt-2 space-y-1 text-sm">
          {availabilityData.exceptions.map(ex => (
            <li key={ex.id}>
              <strong>{ex.reason}:</strong> {formatDateTime(ex.startDate)} - {formatDateTime(ex.endDate)}
            </li>
          ))}
        </ul>
        <h4 className="mt-4 font-medium">Allocations (Busy):</h4>
         <ul className="mt-2 space-y-1 text-sm">
          {availabilityData.allocations.map(alloc => (
            <li key={alloc.id}>
              <strong>{alloc.taskName || "Task"} ({alloc.projectName || `Project ${alloc.projectId}`}):</strong> {formatDateTime(alloc.startDate)} - {formatDateTime(alloc.endDate)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  // Render List View of Exceptions
  const renderListView = () => (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reason</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availabilityData.exceptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No availability exceptions defined.
              </TableCell>
            </TableRow>
          ) : (
            availabilityData.exceptions.map(ex => (
              <TableRow key={ex.id}>
                <TableCell className="font-medium">{ex.reason}</TableCell>
                <TableCell>{formatDateTime(ex.startDate)}</TableCell>
                <TableCell>{formatDateTime(ex.endDate)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{ex.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditException(ex)}
                      disabled={isProcessing}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600" 
                      onClick={() => handleDeleteException(ex.id, ex.reason)}
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
        <CardTitle>Resource Availability</CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="calendar"><CalendarIcon className="h-4 w-4 mr-1"/> Calendar</TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4 mr-1"/> Exceptions List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={handleAddException} disabled={isProcessing}>
            <Plus className="h-4 w-4 mr-2" /> Add Exception
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
          <div className="text-center p-8">Loading availability...</div>
        ) : (
          <TabsContent value={activeTab} className="mt-0">
            {activeTab === "calendar" ? renderCalendarView() : renderListView()}
          </TabsContent>
        )}
      </CardContent>

      {/* Add Exception Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Availability Exception</DialogTitle>
          </DialogHeader>
          <ResourceAvailabilityForm 
            resourceId={resourceId} 
            onSave={handleSaveException} 
            onCancel={() => setShowAddDialog(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Exception Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Availability Exception</DialogTitle>
          </DialogHeader>
          {selectedException && (
            <ResourceAvailabilityForm 
              resourceId={resourceId} 
              exceptionData={selectedException} 
              onSave={handleSaveException} 
              onCancel={() => setShowEditDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResourceAvailabilityCalendar;
