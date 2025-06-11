import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Edit, Trash2, Users, Wrench, Package, AlertTriangle } from "lucide-react";
import ResourceAllocationComponent from "./ResourceAllocationComponent"; // Needs integration
import ResourceAvailabilityCalendar from "./ResourceAvailabilityCalendar"; // Needs integration
import ResourceUtilizationChart from "./ResourceUtilizationChart"; // Needs integration
import ResourceForm from "./ResourceForm"; // Already integrated
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library
import { format, parseISO } from "date-fns";

// Helper function to format cost
const formatCost = (cost, unit) => {
  if (cost === null || cost === undefined) return "N/A";
  return `$${cost.toFixed(2)} / ${unit || "unit"}`;
};

// Helper function to format date strings safely
const formatDateSafe = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return format(parseISO(dateStr), "PPP"); // Format as Jan 1, 2023
  } catch (e) {
    console.warn("Failed to parse date:", dateStr, e);
    return "Invalid Date";
  }
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
  "Labor": <Users className="h-5 w-5 mr-2" />,
  "Equipment": <Wrench className="h-5 w-5 mr-2" />,
  "Material": <Package className="h-5 w-5 mr-2" />
};

const ResourceDetailsPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // For delete/save actions
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // To refetch data after edits

  // Fetch resource details
  const loadResource = useCallback(async () => {
    if (!resourceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResourceById(resourceId);
      setResource(data);
    } catch (err) {
      console.error("Failed to load resource details:", err);
      setError(err.response?.data?.message || err.message || "Failed to load resource details. Please try again or go back.");
      toast.error("Failed to load resource details.");
    } finally {
      setIsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    loadResource();
  }, [loadResource, triggerRefetch]); // Refetch when triggerRefetch changes

  // Handle delete
  const handleDelete = async () => {
    if (!resource) return;
    if (window.confirm(`Are you sure you want to delete resource: ${resource.name}?`)) {
      setIsProcessing(true);
      setError(null);
      try {
        await resourceService.deleteResource(resource.id);
        toast.success(`Resource "${resource.name}" deleted successfully.`);
        navigate("/resources"); // Navigate back to the list page
      } catch (err) {
        console.error("Failed to delete resource:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to delete resource. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle save resource (from edit form)
  const handleSaveResource = async (updatedResourceData) => {
    // The actual saving is handled by the ResourceForm component now
    // We just need to close the dialog and trigger a refetch
    setShowEditDialog(false);
    setTriggerRefetch(prev => prev + 1); // Trigger refetch of details
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading resource details...</div>;
  }

  if (error && !resource) { // Show error prominently if resource couldn't be loaded at all
    return (
      <div className="p-8 text-center text-red-500">
        <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
        {error}
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!resource) {
    return <div className="p-8 text-center">Resource not found.</div>;
  }

  // Render details tab content
  const renderDetailsTab = () => (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div><strong>Type:</strong> {resource.type}</div>
          <div><strong>Category:</strong> {resource.category}</div>
          <div><strong>Status:</strong> <Badge variant="outline" className={statusClasses[resource.status] || "text-gray-700 border-gray-300 bg-gray-50"}>{resource.status}</Badge></div>
          <div><strong>Cost:</strong> {formatCost(resource.cost, resource.costUnit)}</div>
        </div>
        {resource.description && <p><strong>Description:</strong> {resource.description}</p>}
        {resource.tags && resource.tags.length > 0 && (
          <div>
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {resource.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          </div>
        )}

        {/* Type Specific Details */}
        {resource.type === "Labor" && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <h3 className="font-semibold text-md">Labor Specifics</h3>
            <div><strong>Role:</strong> {resource.role || "N/A"}</div>
            <div><strong>Linked User ID:</strong> {resource.userId || "N/A"}</div>
            <div><strong>Max Hours/Day:</strong> {resource.maxHoursPerDay ?? "N/A"}</div>
            <div><strong>Max Hours/Week:</strong> {resource.maxHoursPerWeek ?? "N/A"}</div>
            {resource.skills && resource.skills.length > 0 && <div><strong>Skills:</strong> {resource.skills.join(", ")}</div>}
            {resource.certifications && resource.certifications.length > 0 && <div><strong>Certifications:</strong> {resource.certifications.join(", ")}</div>}
          </div>
        )}
        {resource.type === "Equipment" && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <h3 className="font-semibold text-md">Equipment Specifics</h3>
            <div><strong>Model:</strong> {resource.model || "N/A"}</div>
            <div><strong>Serial Number:</strong> {resource.serialNumber || "N/A"}</div>
            <div><strong>Purchase Date:</strong> {formatDateSafe(resource.purchaseDate)}</div>
            <div><strong>Warranty Expiration:</strong> {formatDateSafe(resource.warrantyExpiration)}</div>
            <div><strong>Last Maintenance:</strong> {formatDateSafe(resource.lastMaintenanceDate)}</div>
            <div><strong>Next Maintenance:</strong> {formatDateSafe(resource.nextMaintenanceDate)}</div>
            <div><strong>Location:</strong> {resource.location || "N/A"}</div>
            <div><strong>Condition:</strong> {resource.condition || "N/A"}</div>
            <div><strong>Ownership:</strong> {resource.ownedBy || "N/A"}</div>
          </div>
        )}
        {resource.type === "Material" && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <h3 className="font-semibold text-md">Material Specifics</h3>
            <div><strong>Unit:</strong> {resource.unit || "N/A"}</div>
            <div><strong>Quantity:</strong> {resource.quantity ?? "N/A"} {resource.unit || "units"}</div>
            <div><strong>Reorder Point:</strong> {resource.reorderPoint ?? "N/A"} {resource.unit || "units"}</div>
            <div><strong>Supplier:</strong> {resource.supplier || "N/A"}</div>
            <div><strong>Location:</strong> {resource.materialLocation || "N/A"}</div>
            <div><strong>Expiration Date:</strong> {formatDateSafe(resource.expirationDate)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            {typeIcons[resource.type]}
            <h1 className="text-2xl font-semibold">{resource.name}</h1>
          </div>
          <Badge variant="outline" className={statusClasses[resource.status] || "text-gray-700 border-gray-300 bg-gray-50"}>{resource.status}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Resource: {resource.name}</DialogTitle>
              </DialogHeader>
              {/* ResourceForm handles its own saving via resourceService.updateResource */}
              <ResourceForm 
                resourceData={resource} 
                onSave={handleSaveResource} // Parent handles dialog close and refetch
                onCancel={() => setShowEditDialog(false)} 
              />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isProcessing}>
            {isProcessing ? "Deleting..." : <><Trash2 className="h-4 w-4 mr-2" /> Delete</>}
          </Button>
        </div>
      </div>
      
      {/* Display error from delete action if any */}
      {error && resource && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
          </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          {resource.type === "Equipment" && <TabsTrigger value="maintenance">Maintenance</TabsTrigger>}
        </TabsList>

        <TabsContent value="details" className="mt-4">
          {renderDetailsTab()}
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          {/* Pass resourceId and potentially requestRefetch if allocations affect resource status */}
          <ResourceAllocationComponent resourceId={resource.id} />
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          {/* Pass resourceId */}
          <ResourceAvailabilityCalendar resourceId={resource.id} />
        </TabsContent>

        <TabsContent value="utilization" className="mt-4">
          {/* Pass resourceId */}
          <ResourceUtilizationChart resourceId={resource.id} />
        </TabsContent>

        {resource.type === "Equipment" && (
          <TabsContent value="maintenance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for Maintenance History Component - Needs Implementation */}
                <p className="text-muted-foreground">Maintenance history component not yet implemented.</p>
                <div><strong>Last Maintenance:</strong> {formatDateSafe(resource.lastMaintenanceDate)}</div>
                <div><strong>Next Maintenance:</strong> {formatDateSafe(resource.nextMaintenanceDate)}</div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ResourceDetailsPage;
