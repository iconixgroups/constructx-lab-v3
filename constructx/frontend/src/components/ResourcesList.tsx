import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, PlusCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ResourceForm from "./ResourceForm";
import ResourceAllocationForm from "./ResourceAllocationForm";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming a toast library like sonner is used

// Helper function to format cost
const formatCost = (cost, unit) => {
  if (cost === null || cost === undefined) return "N/A";
  return `$${cost.toFixed(2)} / ${unit}`;
};

// Status color mapping
const statusColors = {
  "Available": "bg-green-100 text-green-800 border-green-300",
  "Allocated": "bg-blue-100 text-blue-800 border-blue-300",
  "Unavailable": "bg-gray-100 text-gray-800 border-gray-300",
  "Maintenance": "bg-amber-100 text-amber-800 border-amber-300",
  "Low Stock": "bg-red-100 text-red-800 border-red-300"
};

const ResourcesList = ({ resources, requestRefetch }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Handle item selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === resources.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(resources.map(res => res.id));
    }
  };

  // Handle edit action
  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setShowEditDialog(true);
  };

  // Handle delete action
  const handleDelete = async (resourceId, resourceName) => {
    if (window.confirm(`Are you sure you want to delete resource: ${resourceName}?`)) {
      setIsProcessing(true);
      setError(null);
      try {
        await resourceService.deleteResource(resourceId);
        toast.success(`Resource "${resourceName}" deleted successfully.`);
        requestRefetch(); // Trigger refetch in parent component
      } catch (err) {
        console.error("Failed to delete resource:", err);
        setError(`Failed to delete resource: ${err.message || "Unknown error"}`);
        toast.error(`Failed to delete resource "${resourceName}".`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle allocate action
  const handleAllocate = (resource) => {
    setSelectedResource(resource);
    setShowAllocateDialog(true);
  };

  // Handle save resource (from edit form)
  const handleSaveResource = async (updatedResourceData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await resourceService.updateResource(selectedResource.id, updatedResourceData);
      toast.success(`Resource "${selectedResource.name}" updated successfully.`);
      setShowEditDialog(false);
      requestRefetch(); // Trigger refetch
    } catch (saveError) {
      console.error("Failed to update resource:", saveError);
      setError(`Failed to update resource: ${saveError.message || "Unknown error"}`);
      toast.error(`Failed to update resource "${selectedResource.name}".`);
      // Keep dialog open on error to allow user to retry or see the error
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle save allocation
  const handleSaveAllocation = async (allocationData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await resourceService.createAllocation(selectedResource.id, allocationData);
      toast.success(`Resource "${selectedResource.name}" allocated successfully.`);
      setShowAllocateDialog(false);
      // Optionally refetch allocations or resource status if needed
      requestRefetch(); // Refetch resource list if status might change
    } catch (saveError) {
      console.error("Failed to create allocation:", saveError);
      setError(`Failed to create allocation: ${saveError.message || "Unknown error"}`);
      toast.error(`Failed to allocate resource "${selectedResource.name}".`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedItems.length === resources.length && resources.length > 0}
                onCheckedChange={handleSelectAll}
                disabled={resources.length === 0}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map(resource => (
            <TableRow key={resource.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedItems.includes(resource.id)}
                  onCheckedChange={() => handleSelectItem(resource.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{resource.name}</TableCell>
              <TableCell>{resource.type}</TableCell>
              <TableCell>{resource.category}</TableCell>
              <TableCell>
                <Badge className={statusColors[resource.status] || "bg-gray-100 text-gray-800 border-gray-300"}>
                  {resource.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCost(resource.cost, resource.costUnit)}</TableCell>
              <TableCell>
                {resource.type === "Material" ? `${resource.quantity ?? "N/A"} ${resource.unit || resource.costUnit || "units"}` : "N/A"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isProcessing}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(resource)} disabled={isProcessing}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAllocate(resource)} disabled={isProcessing}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Allocate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(resource.id, resource.name)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Resource Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Resource: {selectedResource?.name}</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <ResourceForm 
              resourceData={selectedResource} 
              onSave={handleSaveResource} 
              onCancel={() => setShowEditDialog(false)} 
              isSaving={isProcessing} // Pass saving state to form
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Allocate Resource Dialog */}
      <Dialog open={showAllocateDialog} onOpenChange={setShowAllocateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Allocate Resource: {selectedResource?.name}</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <ResourceAllocationForm 
              resourceId={selectedResource.id} 
              onSave={handleSaveAllocation} 
              onCancel={() => setShowAllocateDialog(false)} 
              isSaving={isProcessing} // Pass saving state to form
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesList;
