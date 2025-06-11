import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";

interface ChangeOrdersComponentProps {
  contractId: string;
}

const ChangeOrdersComponent: React.FC<ChangeOrdersComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [changeOrders, setChangeOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentChangeOrder, setCurrentChangeOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestDate: new Date(),
    approvalDate: null as Date | null,
    status: "Pending",
    costImpact: "",
    scheduleImpact: "",
    requestedBy: "",
    approvedBy: "",
    reason: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Change order status options
  const changeOrderStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Under Review", label: "Under Review" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Implemented", label: "Implemented" }
  ];
  
  // Change order reason options
  const changeOrderReasonOptions = [
    { value: "Client Request", label: "Client Request" },
    { value: "Design Change", label: "Design Change" },
    { value: "Site Condition", label: "Site Condition" },
    { value: "Regulatory Requirement", label: "Regulatory Requirement" },
    { value: "Material Substitution", label: "Material Substitution" },
    { value: "Schedule Adjustment", label: "Schedule Adjustment" },
    { value: "Scope Addition", label: "Scope Addition" },
    { value: "Scope Reduction", label: "Scope Reduction" },
    { value: "Other", label: "Other" }
  ];
  
  // Mock data for initial development - will be replaced with API calls
  const mockChangeOrders = [
    {
      id: "co-1",
      contractId: "contract-1",
      title: "Additional Parking Area",
      description: "Addition of 15 parking spaces on the north side of the building.",
      requestDate: "2025-02-15",
      approvalDate: "2025-02-28",
      status: "Approved",
      costImpact: 75000,
      scheduleImpact: 14,
      requestedBy: "John Smith (Client)",
      approvedBy: "Robert Johnson (Project Manager)",
      reason: "Client Request",
      notes: "Client requested additional parking to accommodate increased staff.",
      createdAt: "2025-02-15T09:30:00Z",
      updatedAt: "2025-02-28T14:45:00Z"
    },
    {
      id: "co-2",
      contractId: "contract-1",
      title: "Upgraded HVAC System",
      description: "Upgrade from standard to high-efficiency HVAC system with improved filtration.",
      requestDate: "2025-03-10",
      approvalDate: "2025-03-25",
      status: "Approved",
      costImpact: 125000,
      scheduleImpact: 7,
      requestedBy: "Sarah Williams (Engineer)",
      approvedBy: "Robert Johnson (Project Manager)",
      reason: "Design Change",
      notes: "Upgraded system will provide better energy efficiency and air quality.",
      createdAt: "2025-03-10T11:15:00Z",
      updatedAt: "2025-03-25T16:30:00Z"
    },
    {
      id: "co-3",
      contractId: "contract-1",
      title: "Foundation Reinforcement",
      description: "Additional reinforcement required for foundation due to unexpected soil conditions.",
      requestDate: "2025-03-18",
      approvalDate: null,
      status: "Under Review",
      costImpact: 45000,
      scheduleImpact: 10,
      requestedBy: "Michael Brown (Structural Engineer)",
      approvedBy: "",
      reason: "Site Condition",
      notes: "Soil testing revealed unstable conditions requiring additional reinforcement.",
      createdAt: "2025-03-18T08:45:00Z",
      updatedAt: "2025-03-18T08:45:00Z"
    },
    {
      id: "co-4",
      contractId: "contract-1",
      title: "Roofing Material Change",
      description: "Change from asphalt shingles to metal roofing.",
      requestDate: "2025-04-05",
      approvalDate: null,
      status: "Pending",
      costImpact: 35000,
      scheduleImpact: 0,
      requestedBy: "John Smith (Client)",
      approvedBy: "",
      reason: "Material Substitution",
      notes: "Client requested change for improved durability and aesthetics.",
      createdAt: "2025-04-05T10:20:00Z",
      updatedAt: "2025-04-05T10:20:00Z"
    }
  ];
  
  // Fetch change orders
  useEffect(() => {
    const fetchChangeOrders = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await contractService.getContractChangeOrders(contractId);
        // setChangeOrders(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setChangeOrders(mockChangeOrders);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching contract change orders:", err);
        setError("Failed to load contract change orders. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchChangeOrders();
  }, [contractId]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Implemented":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "Under Review":
        return <Clock className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Rejected":
        return <AlertCircle className="h-4 w-4" />;
      case "Implemented":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Get cost impact icon and class
  const getCostImpactDisplay = (costImpact: number) => {
    if (costImpact > 0) {
      return {
        icon: <ArrowUp className="h-4 w-4 text-red-600" />,
        class: "text-red-600"
      };
    } else if (costImpact < 0) {
      return {
        icon: <ArrowDown className="h-4 w-4 text-green-600" />,
        class: "text-green-600"
      };
    } else {
      return {
        icon: <ArrowRight className="h-4 w-4 text-gray-600" />,
        class: "text-gray-600"
      };
    }
  };
  
  // Get schedule impact icon and class
  const getScheduleImpactDisplay = (scheduleImpact: number) => {
    if (scheduleImpact > 0) {
      return {
        icon: <ArrowUp className="h-4 w-4 text-red-600" />,
        class: "text-red-600",
        text: `+${scheduleImpact} days`
      };
    } else if (scheduleImpact < 0) {
      return {
        icon: <ArrowDown className="h-4 w-4 text-green-600" />,
        class: "text-green-600",
        text: `${scheduleImpact} days`
      };
    } else {
      return {
        icon: <ArrowRight className="h-4 w-4 text-gray-600" />,
        class: "text-gray-600",
        text: "No impact"
      };
    }
  };
  
  // Calculate total cost impact
  const calculateTotalCostImpact = () => {
    return changeOrders.reduce((total, co) => {
      if (co.status === "Approved" || co.status === "Implemented") {
        return total + (co.costImpact || 0);
      }
      return total;
    }, 0);
  };
  
  // Calculate total schedule impact
  const calculateTotalScheduleImpact = () => {
    return changeOrders.reduce((total, co) => {
      if (co.status === "Approved" || co.status === "Implemented") {
        return total + (co.scheduleImpact || 0);
      }
      return total;
    }, 0);
  };
  
  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      title: "",
      description: "",
      requestDate: new Date(),
      approvalDate: null,
      status: "Pending",
      costImpact: "",
      scheduleImpact: "",
      requestedBy: "",
      approvedBy: "",
      reason: "Client Request",
      notes: ""
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (changeOrder: any) => {
    setCurrentChangeOrder(changeOrder);
    setFormData({
      title: changeOrder.title,
      description: changeOrder.description || "",
      requestDate: changeOrder.requestDate ? new Date(changeOrder.requestDate) : new Date(),
      approvalDate: changeOrder.approvalDate ? new Date(changeOrder.approvalDate) : null,
      status: changeOrder.status,
      costImpact: changeOrder.costImpact ? changeOrder.costImpact.toString() : "",
      scheduleImpact: changeOrder.scheduleImpact ? changeOrder.scheduleImpact.toString() : "",
      requestedBy: changeOrder.requestedBy || "",
      approvedBy: changeOrder.approvedBy || "",
      reason: changeOrder.reason || "Client Request",
      notes: changeOrder.notes || ""
    });
    setShowEditDialog(true);
  };
  
  // Handle add change order
  const handleAddChangeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Change order title is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const dataToSend = {
      //   ...formData,
      //   requestDate: formData.requestDate ? format(formData.requestDate, "yyyy-MM-dd") : null,
      //   approvalDate: formData.approvalDate ? format(formData.approvalDate, "yyyy-MM-dd") : null,
      //   costImpact: formData.costImpact ? parseFloat(formData.costImpact) : 0,
      //   scheduleImpact: formData.scheduleImpact ? parseInt(formData.scheduleImpact) : 0
      // };
      // const response = await contractService.createContractChangeOrder(contractId, dataToSend);
      // setChangeOrders(prev => [...prev, response.data]);
      
      // Mock create for development
      const newChangeOrder = {
        id: `co-${Date.now()}`,
        contractId,
        title: formData.title,
        description: formData.description,
        requestDate: formData.requestDate ? format(formData.requestDate, "yyyy-MM-dd") : null,
        approvalDate: formData.approvalDate ? format(formData.approvalDate, "yyyy-MM-dd") : null,
        status: formData.status,
        costImpact: formData.costImpact ? parseFloat(formData.costImpact) : 0,
        scheduleImpact: formData.scheduleImpact ? parseInt(formData.scheduleImpact) : 0,
        requestedBy: formData.requestedBy,
        approvedBy: formData.approvedBy,
        reason: formData.reason,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setChangeOrders(prev => [...prev, newChangeOrder]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Change order added successfully."
      });
    } catch (err) {
      console.error("Error adding change order:", err);
      toast({
        title: "Error",
        description: "Failed to add change order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle edit change order
  const handleEditChangeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Change order title is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const dataToSend = {
      //   ...formData,
      //   requestDate: formData.requestDate ? format(formData.requestDate, "yyyy-MM-dd") : null,
      //   approvalDate: formData.approvalDate ? format(formData.approvalDate, "yyyy-MM-dd") : null,
      //   costImpact: formData.costImpact ? parseFloat(formData.costImpact) : 0,
      //   scheduleImpact: formData.scheduleImpact ? parseInt(formData.scheduleImpact) : 0
      // };
      // const response = await contractService.updateContractChangeOrder(currentChangeOrder.id, dataToSend);
      // setChangeOrders(prev => prev.map(co => co.id === currentChangeOrder.id ? response.data : co));
      
      // Mock update for development
      const updatedChangeOrder = {
        ...currentChangeOrder,
        title: formData.title,
        description: formData.description,
        requestDate: formData.requestDate ? format(formData.requestDate, "yyyy-MM-dd") : null,
        approvalDate: formData.approvalDate ? format(formData.approvalDate, "yyyy-MM-dd") : null,
        status: formData.status,
        costImpact: formData.costImpact ? parseFloat(formData.costImpact) : 0,
        scheduleImpact: formData.scheduleImpact ? parseInt(formData.scheduleImpact) : 0,
        requestedBy: formData.requestedBy,
        approvedBy: formData.approvedBy,
        reason: formData.reason,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };
      
      setChangeOrders(prev => prev.map(co => co.id === currentChangeOrder.id ? updatedChangeOrder : co));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Change order updated successfully."
      });
    } catch (err) {
      console.error("Error updating change order:", err);
      toast({
        title: "Error",
        description: "Failed to update change order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete change order
  const handleDeleteChangeOrder = async (changeOrderId: string) => {
    if (!window.confirm("Are you sure you want to delete this change order?")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractChangeOrder(changeOrderId);
      
      // Mock delete for development
      setChangeOrders(prev => prev.filter(co => co.id !== changeOrderId));
      toast({
        title: "Success",
        description: "Change order deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting change order:", err);
      toast({
        title: "Error",
        description: "Failed to delete change order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle approve change order
  const handleApproveChangeOrder = async (changeOrder: any) => {
    try {
      // This will be replaced with actual API call
      // const response = await contractService.updateContractChangeOrder(changeOrder.id, {
      //   status: "Approved",
      //   approvalDate: format(new Date(), "yyyy-MM-dd"),
      //   approvedBy: "Current User" // This would be the actual logged-in user
      // });
      // setChangeOrders(prev => prev.map(co => co.id === changeOrder.id ? response.data : co));
      
      // Mock update for development
      const updatedChangeOrder = {
        ...changeOrder,
        status: "Approved",
        approvalDate: format(new Date(), "yyyy-MM-dd"),
        approvedBy: "Current User", // This would be the actual logged-in user
        updatedAt: new Date().toISOString()
      };
      
      setChangeOrders(prev => prev.map(co => co.id === changeOrder.id ? updatedChangeOrder : co));
      toast({
        title: "Success",
        description: "Change order approved successfully."
      });
    } catch (err) {
      console.error("Error approving change order:", err);
      toast({
        title: "Error",
        description: "Failed to approve change order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle reject change order
  const handleRejectChangeOrder = async (changeOrder: any) => {
    try {
      // This will be replaced with actual API call
      // const response = await contractService.updateContractChangeOrder(changeOrder.id, {
      //   status: "Rejected",
      //   approvalDate: format(new Date(), "yyyy-MM-dd"),
      //   approvedBy: "Current User" // This would be the actual logged-in user
      // });
      // setChangeOrders(prev => prev.map(co => co.id === changeOrder.id ? response.data : co));
      
      // Mock update for development
      const updatedChangeOrder = {
        ...changeOrder,
        status: "Rejected",
        approvalDate: format(new Date(), "yyyy-MM-dd"),
        approvedBy: "Current User", // This would be the actual logged-in user
        updatedAt: new Date().toISOString()
      };
      
      setChangeOrders(prev => prev.map(co => co.id === changeOrder.id ? updatedChangeOrder : co));
      toast({
        title: "Success",
        description: "Change order rejected successfully."
      });
    } catch (err) {
      console.error("Error rejecting change order:", err);
      toast({
        title: "Error",
        description: "Failed to reject change order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading && changeOrders.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Change Orders</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Change Order
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Change Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{changeOrders.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {changeOrders.filter(co => co.status === "Approved" || co.status === "Implemented").length} approved
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cost Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${calculateTotalCostImpact() > 0 ? 'text-red-600' : calculateTotalCostImpact() < 0 ? 'text-green-600' : ''}`}>
              {formatCurrency(calculateTotalCostImpact())}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              From approved change orders
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Schedule Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${calculateTotalScheduleImpact() > 0 ? 'text-red-600' : calculateTotalScheduleImpact() < 0 ? 'text-green-600' : ''}`}>
              {calculateTotalScheduleImpact() > 0 ? '+' : ''}{calculateTotalScheduleImpact()} days
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              From approved change orders
            </div>
          </CardContent>
        </Card>
      </div>
      
      {changeOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No change orders added to this contract yet.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Change Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Change Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost Impact</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeOrders.map(changeOrder => {
                  const costImpactDisplay = getCostImpactDisplay(changeOrder.costImpact);
                  const scheduleImpactDisplay = getScheduleImpactDisplay(changeOrder.scheduleImpact);
                  
                  return (
                    <TableRow key={changeOrder.id}>
                      <TableCell>
                        <div className="font-medium">{changeOrder.title}</div>
                        {changeOrder.description && (
                          <div className="text-sm text-muted-foreground">{changeOrder.description}</div>
                        )}
                        {changeOrder.reason && (
                          <Badge variant="outline" className="mt-1">{changeOrder.reason}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">Requested: {formatDate(changeOrder.requestDate)}</div>
                        {changeOrder.approvalDate && (
                          <div className="text-sm text-muted-foreground">
                            {changeOrder.status === "Approved" || changeOrder.status === "Implemented" ? "Approved" : "Reviewed"}: {formatDate(changeOrder.approvalDate)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(changeOrder.status)}`}>
                          {getStatusIcon(changeOrder.status)}
                          <span className="ml-1">{changeOrder.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${costImpactDisplay.class}`}>
                          {costImpactDisplay.icon}
                          <span className="ml-1">{formatCurrency(changeOrder.costImpact)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${scheduleImpactDisplay.class}`}>
                          {scheduleImpactDisplay.icon}
                          <span className="ml-1">{scheduleImpactDisplay.text}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {(changeOrder.status === "Pending" || changeOrder.status === "Under Review") && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveChangeOrder(changeOrder)}
                                title="Approve"
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectChangeOrder(changeOrder)}
                                title="Reject"
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(changeOrder)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChangeOrder(changeOrder.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Add Change Order Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Change Order</DialogTitle>
            <DialogDescription>
              Add a new change order to this contract.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddChangeOrder}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Request Date</Label>
                  <DatePicker
                    id="requestDate"
                    selected={formData.requestDate}
                    onSelect={(date) => handleDateChange("requestDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {changeOrderStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => handleSelectChange("reason", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {changeOrderReasonOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costImpact">Cost Impact ($)</Label>
                  <Input
                    id="costImpact"
                    name="costImpact"
                    type="text"
                    inputMode="decimal"
                    value={formData.costImpact}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleImpact">Schedule Impact (days)</Label>
                  <Input
                    id="scheduleImpact"
                    name="scheduleImpact"
                    type="text"
                    inputMode="numeric"
                    value={formData.scheduleImpact}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                {(formData.status === "Approved" || formData.status === "Rejected" || formData.status === "Implemented") && (
                  <div className="space-y-2">
                    <Label htmlFor="approvedBy">Approved/Rejected By</Label>
                    <Input
                      id="approvedBy"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
              {(formData.status === "Approved" || formData.status === "Rejected" || formData.status === "Implemented") && (
                <div className="space-y-2">
                  <Label htmlFor="approvalDate">Approval/Rejection Date</Label>
                  <DatePicker
                    id="approvalDate"
                    selected={formData.approvalDate}
                    onSelect={(date) => handleDateChange("approvalDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Change Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Change Order Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Change Order</DialogTitle>
            <DialogDescription>
              Update change order information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditChangeOrder}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-requestDate">Request Date</Label>
                  <DatePicker
                    id="edit-requestDate"
                    selected={formData.requestDate}
                    onSelect={(date) => handleDateChange("requestDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {changeOrderStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reason">Reason</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => handleSelectChange("reason", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="edit-reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {changeOrderReasonOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-costImpact">Cost Impact ($)</Label>
                  <Input
                    id="edit-costImpact"
                    name="costImpact"
                    type="text"
                    inputMode="decimal"
                    value={formData.costImpact}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-scheduleImpact">Schedule Impact (days)</Label>
                  <Input
                    id="edit-scheduleImpact"
                    name="scheduleImpact"
                    type="text"
                    inputMode="numeric"
                    value={formData.scheduleImpact}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-requestedBy">Requested By</Label>
                  <Input
                    id="edit-requestedBy"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                {(formData.status === "Approved" || formData.status === "Rejected" || formData.status === "Implemented") && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-approvedBy">Approved/Rejected By</Label>
                    <Input
                      id="edit-approvedBy"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
              {(formData.status === "Approved" || formData.status === "Rejected" || formData.status === "Implemented") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-approvalDate">Approval/Rejection Date</Label>
                  <DatePicker
                    id="edit-approvalDate"
                    selected={formData.approvalDate}
                    onSelect={(date) => handleDateChange("approvalDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Change Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeOrdersComponent;
