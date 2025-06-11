import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, PlusCircle, Users, Wrench, Package, Circle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ResourceForm from "./ResourceForm";
import ResourceAllocationForm from "./ResourceAllocationForm";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library
import { useNavigate } from "react-router-dom"; // For navigating to details page

// Helper function to format cost
const formatCost = (cost, unit) => {
  if (cost === null || cost === undefined) return "N/A";
  return `$${cost.toFixed(2)} / ${unit}`;
};

// Status color mapping (using text/border for better visibility)
const statusClasses = {
  "Available": "text-green-700 border-green-300 bg-green-50",
  "Allocated": "text-blue-700 border-blue-300 bg-blue-50",
  "Unavailable": "text-gray-700 border-gray-300 bg-gray-50",
  "Maintenance": "text-amber-700 border-amber-300 bg-amber-50",
  "Low Stock": "text-red-700 border-red-300 bg-red-50"
};

// Type icon mapping
const typeIcons = {
  "Labor": <Users className="h-4 w-4 text-muted-foreground" />,
  "Equipment": <Wrench className="h-4 w-4 text-muted-foreground" />,
  "Material": <Package className="h-4 w-4 text-muted-foreground" />
};

const ResourceCard = ({ resource, requestRefetch }) => {
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Handle edit action (open dialog)
  const handleEdit = () => {
    setShowEditDialog(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete resource: ${resource.name}?`)) {
      setIsProcessing(true);
      setError(null);
      try {
        await resourceService.deleteResource(resource.id);
        toast.success(`Resource "${resource.name}" deleted successfully.`);
        requestRefetch(); // Trigger refetch in parent
      } catch (err) {
        console.error("Failed to delete resource:", err);
        setError(`Failed to delete resource: ${err.message || "Unknown error"}`);
        toast.error(`Failed to delete resource "${resource.name}".`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle allocate action (open dialog)
  const handleAllocate = () => {
    setShowAllocateDialog(true);
  };

  // Handle save resource (from edit form)
  const handleSaveResource = async (updatedResourceData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await resourceService.updateResource(resource.id, updatedResourceData);
      toast.success(`Resource "${resource.name}" updated successfully.`);
      setShowEditDialog(false);
      requestRefetch(); // Trigger refetch
    } catch (saveError) {
      console.error("Failed to update resource:", saveError);
      setError(`Failed to update resource: ${saveError.message || "Unknown error"}`);
      toast.error(`Failed to update resource "${resource.name}".`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle save allocation
  const handleSaveAllocation = async (allocationData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await resourceService.createAllocation(resource.id, allocationData);
      toast.success(`Resource "${resource.name}" allocated successfully.`);
      setShowAllocateDialog(false);
      requestRefetch(); // Refetch resource list if status might change
    } catch (saveError) {
      console.error("Failed to create allocation:", saveError);
      setError(`Failed to create allocation: ${saveError.message || "Unknown error"}`);
      toast.error(`Failed to allocate resource "${resource.name}".`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Navigate to details page
  const goToDetails = () => {
      navigate(`/resources/${resource.id}`);
  };

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 mr-2">
            <CardTitle 
                className="text-sm font-medium truncate cursor-pointer hover:underline" 
                onClick={goToDetails}
                title={resource.name}
            >
                {resource.name}
            </CardTitle>
            <div className="text-xs text-muted-foreground mt-1">{resource.category}</div>
        </div>
        <div className="flex items-center space-x-1">
          {typeIcons[resource.type] || <Users className="h-4 w-4 text-muted-foreground" />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isProcessing}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={goToDetails} disabled={isProcessing}>
                <Edit className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} disabled={isProcessing}>
                <Edit className="h-4 w-4 mr-2" /> Quick Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAllocate} disabled={isProcessing}>
                <PlusCircle className="h-4 w-4 mr-2" /> Allocate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={handleDelete}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
         <Badge variant="outline" className={`text-xs ${statusClasses[resource.status] || "text-gray-700 border-gray-300 bg-gray-50"}`}>
            {resource.status}
          </Badge>
        <div className="text-sm">
          {formatCost(resource.cost, resource.costUnit)}
        </div>
        {resource.type === "Material" && (
          <div className="text-sm text-muted-foreground">
            Quantity: {resource.quantity ?? "N/A"} {resource.unit || resource.costUnit || "units"}
          </div>
        )}
        {error && (
            <div className="text-xs text-red-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" /> Error
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" size="sm" onClick={handleAllocate} disabled={isProcessing}>Allocate</Button>
        <Button variant="default" size="sm" onClick={goToDetails} disabled={isProcessing}>Details</Button>
      </CardFooter>

      {/* Edit Resource Dialog (Quick Edit) */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quick Edit Resource: {resource.name}</DialogTitle>
          </DialogHeader>
          <ResourceForm 
            resourceData={resource} 
            onSave={handleSaveResource} 
            onCancel={() => setShowEditDialog(false)} 
            isSaving={isProcessing}
          />
        </DialogContent>
      </Dialog>

      {/* Allocate Resource Dialog */}
      <Dialog open={showAllocateDialog} onOpenChange={setShowAllocateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Allocate Resource: {resource.name}</DialogTitle>
          </DialogHeader>
          <ResourceAllocationForm 
            resourceId={resource.id} 
            onSave={handleSaveAllocation} 
            onCancel={() => setShowAllocateDialog(false)} 
            isSaving={isProcessing}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const ResourcesGrid = ({ resources, requestRefetch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {resources.map(resource => (
        <ResourceCard key={resource.id} resource={resource} requestRefetch={requestRefetch} />
      ))}
    </div>
  );
};

export default ResourcesGrid;
