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
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Milestone, 
  Loader2,
  ChevronRight,
  ChevronDown,
  Flag
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format, isAfter, isBefore, isToday } from "date-fns";

interface ContractMilestonesComponentProps {
  contractId: string;
}

const ContractMilestonesComponent: React.FC<ContractMilestonesComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: null as Date | null,
    completionDate: null as Date | null,
    status: "Pending",
    paymentAmount: "",
    paymentPercentage: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Milestone status options
  const milestoneStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Delayed", label: "Delayed" },
    { value: "Cancelled", label: "Cancelled" }
  ];
  
  // Mock data for initial development - will be replaced with API calls
  const mockMilestones = [
    {
      id: "milestone-1",
      contractId: "contract-1",
      name: "Project Kickoff",
      description: "Initial meeting with all stakeholders to align on project goals and timeline.",
      dueDate: "2025-01-20",
      completionDate: "2025-01-18",
      status: "Completed",
      paymentAmount: 250000,
      paymentPercentage: 10,
      notes: "All stakeholders attended and approved project plan.",
      createdAt: "2025-01-05T10:30:00Z",
      updatedAt: "2025-01-18T15:45:00Z"
    },
    {
      id: "milestone-2",
      contractId: "contract-1",
      name: "Foundation Complete",
      description: "Completion of all foundation work including concrete pouring and curing.",
      dueDate: "2025-03-15",
      completionDate: "2025-03-20",
      status: "Completed",
      paymentAmount: 500000,
      paymentPercentage: 20,
      notes: "Slight delay due to unexpected ground conditions, but quality verified by inspector.",
      createdAt: "2025-01-05T10:35:00Z",
      updatedAt: "2025-03-20T16:30:00Z"
    },
    {
      id: "milestone-3",
      contractId: "contract-1",
      name: "Structural Framing",
      description: "Completion of all structural framing work including steel and concrete elements.",
      dueDate: "2025-05-30",
      completionDate: null,
      status: "In Progress",
      paymentAmount: 625000,
      paymentPercentage: 25,
      notes: "Work proceeding according to schedule.",
      createdAt: "2025-01-05T10:40:00Z",
      updatedAt: "2025-04-15T09:20:00Z"
    },
    {
      id: "milestone-4",
      contractId: "contract-1",
      name: "Building Envelope",
      description: "Completion of exterior walls, windows, and roof.",
      dueDate: "2025-08-15",
      completionDate: null,
      status: "Pending",
      paymentAmount: 375000,
      paymentPercentage: 15,
      notes: "",
      createdAt: "2025-01-05T10:45:00Z",
      updatedAt: "2025-01-05T10:45:00Z"
    },
    {
      id: "milestone-5",
      contractId: "contract-1",
      name: "Interior Finishes",
      description: "Completion of all interior finishes including drywall, paint, flooring, and fixtures.",
      dueDate: "2025-11-30",
      completionDate: null,
      status: "Pending",
      paymentAmount: 500000,
      paymentPercentage: 20,
      notes: "",
      createdAt: "2025-01-05T10:50:00Z",
      updatedAt: "2025-01-05T10:50:00Z"
    },
    {
      id: "milestone-6",
      contractId: "contract-1",
      name: "Project Completion",
      description: "Final inspection, punch list completion, and handover to client.",
      dueDate: "2026-01-15",
      completionDate: null,
      status: "Pending",
      paymentAmount: 250000,
      paymentPercentage: 10,
      notes: "",
      createdAt: "2025-01-05T10:55:00Z",
      updatedAt: "2025-01-05T10:55:00Z"
    }
  ];
  
  // Fetch milestones
  useEffect(() => {
    const fetchMilestones = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await contractService.getContractMilestones(contractId);
        // setMilestones(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setMilestones(mockMilestones);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching contract milestones:", err);
        setError("Failed to load contract milestones. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchMilestones();
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
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Delayed":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Pending":
        return <Calendar className="h-4 w-4" />;
      case "Delayed":
        return <AlertCircle className="h-4 w-4" />;
      case "Cancelled":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  // Get milestone status based on dates
  const getMilestoneStatus = (milestone: any) => {
    if (milestone.status === "Completed" || milestone.status === "Cancelled") {
      return milestone.status;
    }
    
    const today = new Date();
    const dueDate = new Date(milestone.dueDate);
    
    if (isAfter(today, dueDate)) {
      return "Delayed";
    }
    
    return milestone.status;
  };
  
  // Calculate overall contract progress
  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    
    const completedMilestones = milestones.filter(m => m.status === "Completed");
    const totalPercentage = milestones.reduce((sum, m) => sum + (m.paymentPercentage || 0), 0);
    const completedPercentage = completedMilestones.reduce((sum, m) => sum + (m.paymentPercentage || 0), 0);
    
    return totalPercentage > 0 ? Math.round((completedPercentage / totalPercentage) * 100) : 0;
  };
  
  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      dueDate: null,
      completionDate: null,
      status: "Pending",
      paymentAmount: "",
      paymentPercentage: "",
      notes: ""
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (milestone: any) => {
    setCurrentMilestone(milestone);
    setFormData({
      name: milestone.name,
      description: milestone.description || "",
      dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
      completionDate: milestone.completionDate ? new Date(milestone.completionDate) : null,
      status: milestone.status,
      paymentAmount: milestone.paymentAmount ? milestone.paymentAmount.toString() : "",
      paymentPercentage: milestone.paymentPercentage ? milestone.paymentPercentage.toString() : "",
      notes: milestone.notes || ""
    });
    setShowEditDialog(true);
  };
  
  // Handle add milestone
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Milestone name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Due date is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const dataToSend = {
      //   ...formData,
      //   dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : null,
      //   completionDate: formData.completionDate ? format(formData.completionDate, "yyyy-MM-dd") : null,
      //   paymentAmount: formData.paymentAmount ? parseFloat(formData.paymentAmount) : null,
      //   paymentPercentage: formData.paymentPercentage ? parseFloat(formData.paymentPercentage) : null
      // };
      // const response = await contractService.createContractMilestone(contractId, dataToSend);
      // setMilestones(prev => [...prev, response.data]);
      
      // Mock create for development
      const newMilestone = {
        id: `milestone-${Date.now()}`,
        contractId,
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : null,
        completionDate: formData.completionDate ? format(formData.completionDate, "yyyy-MM-dd") : null,
        status: formData.status,
        paymentAmount: formData.paymentAmount ? parseFloat(formData.paymentAmount) : null,
        paymentPercentage: formData.paymentPercentage ? parseFloat(formData.paymentPercentage) : null,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => [...prev, newMilestone]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Milestone added successfully."
      });
    } catch (err) {
      console.error("Error adding milestone:", err);
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle edit milestone
  const handleEditMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Milestone name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Due date is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const dataToSend = {
      //   ...formData,
      //   dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : null,
      //   completionDate: formData.completionDate ? format(formData.completionDate, "yyyy-MM-dd") : null,
      //   paymentAmount: formData.paymentAmount ? parseFloat(formData.paymentAmount) : null,
      //   paymentPercentage: formData.paymentPercentage ? parseFloat(formData.paymentPercentage) : null
      // };
      // const response = await contractService.updateContractMilestone(currentMilestone.id, dataToSend);
      // setMilestones(prev => prev.map(m => m.id === currentMilestone.id ? response.data : m));
      
      // Mock update for development
      const updatedMilestone = {
        ...currentMilestone,
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : null,
        completionDate: formData.completionDate ? format(formData.completionDate, "yyyy-MM-dd") : null,
        status: formData.status,
        paymentAmount: formData.paymentAmount ? parseFloat(formData.paymentAmount) : null,
        paymentPercentage: formData.paymentPercentage ? parseFloat(formData.paymentPercentage) : null,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => prev.map(m => m.id === currentMilestone.id ? updatedMilestone : m));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Milestone updated successfully."
      });
    } catch (err) {
      console.error("Error updating milestone:", err);
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete milestone
  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractMilestone(milestoneId);
      
      // Mock delete for development
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      toast({
        title: "Success",
        description: "Milestone deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting milestone:", err);
      toast({
        title: "Error",
        description: "Failed to delete milestone. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle mark as complete
  const handleMarkComplete = async (milestone: any) => {
    try {
      // This will be replaced with actual API call
      // const response = await contractService.updateContractMilestone(milestone.id, {
      //   status: "Completed",
      //   completionDate: format(new Date(), "yyyy-MM-dd")
      // });
      // setMilestones(prev => prev.map(m => m.id === milestone.id ? response.data : m));
      
      // Mock update for development
      const updatedMilestone = {
        ...milestone,
        status: "Completed",
        completionDate: format(new Date(), "yyyy-MM-dd"),
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => prev.map(m => m.id === milestone.id ? updatedMilestone : m));
      toast({
        title: "Success",
        description: "Milestone marked as completed."
      });
    } catch (err) {
      console.error("Error updating milestone:", err);
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading && milestones.length === 0) {
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
        <h2 className="text-xl font-bold">Contract Milestones</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Milestone
        </Button>
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contract Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-medium">{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Start: {formatDate(milestones[0]?.dueDate)}</span>
              <span>End: {formatDate(milestones[milestones.length - 1]?.dueDate)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <div className="text-2xl font-bold">{milestones.length}</div>
              <div className="text-sm text-muted-foreground">Total Milestones</div>
            </div>
            <div className="text-center p-2 bg-green-100 dark:bg-green-900 rounded-md">
              <div className="text-2xl font-bold">{milestones.filter(m => m.status === "Completed").length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
              <div className="text-2xl font-bold">{milestones.filter(m => m.status === "In Progress").length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-2 bg-amber-100 dark:bg-amber-900 rounded-md">
              <div className="text-2xl font-bold">{milestones.filter(m => getMilestoneStatus(m) === "Delayed").length}</div>
              <div className="text-sm text-muted-foreground">Delayed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {milestones.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No milestones added to this contract yet.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Milestone
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map(milestone => {
                  const currentStatus = getMilestoneStatus(milestone);
                  return (
                    <TableRow key={milestone.id}>
                      <TableCell>
                        <div className="font-medium">{milestone.name}</div>
                        {milestone.description && (
                          <div className="text-sm text-muted-foreground">{milestone.description}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatDate(milestone.dueDate)}</div>
                        {milestone.completionDate && (
                          <div className="text-sm text-muted-foreground">
                            Completed: {formatDate(milestone.completionDate)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(currentStatus)}`}>
                          {getStatusIcon(currentStatus)}
                          <span className="ml-1">{currentStatus}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {milestone.paymentAmount && (
                          <div className="font-medium">{formatCurrency(milestone.paymentAmount)}</div>
                        )}
                        {milestone.paymentPercentage && (
                          <div className="text-sm text-muted-foreground">{milestone.paymentPercentage}% of contract</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {milestone.status !== "Completed" && milestone.status !== "Cancelled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkComplete(milestone)}
                              title="Mark as Complete"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(milestone)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMilestone(milestone.id)}
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
      
      {/* Add Milestone Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to this contract.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMilestone}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Milestone Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
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
                  <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
                  <DatePicker
                    id="dueDate"
                    selected={formData.dueDate}
                    onSelect={(date) => handleDateChange("dueDate", date)}
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
                      {milestoneStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.status === "Completed" && (
                <div className="space-y-2">
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <DatePicker
                    id="completionDate"
                    selected={formData.completionDate}
                    onSelect={(date) => handleDateChange("completionDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    name="paymentAmount"
                    type="text"
                    inputMode="decimal"
                    value={formData.paymentAmount}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentPercentage">Payment Percentage</Label>
                  <Input
                    id="paymentPercentage"
                    name="paymentPercentage"
                    type="text"
                    inputMode="decimal"
                    value={formData.paymentPercentage}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
                  "Add Milestone"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Milestone Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
            <DialogDescription>
              Update milestone information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditMilestone}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Milestone Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
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
                  <Label htmlFor="edit-dueDate">Due Date <span className="text-red-500">*</span></Label>
                  <DatePicker
                    id="edit-dueDate"
                    selected={formData.dueDate}
                    onSelect={(date) => handleDateChange("dueDate", date)}
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
                      {milestoneStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.status === "Completed" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-completionDate">Completion Date</Label>
                  <DatePicker
                    id="edit-completionDate"
                    selected={formData.completionDate}
                    onSelect={(date) => handleDateChange("completionDate", date)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentAmount">Payment Amount</Label>
                  <Input
                    id="edit-paymentAmount"
                    name="paymentAmount"
                    type="text"
                    inputMode="decimal"
                    value={formData.paymentAmount}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentPercentage">Payment Percentage</Label>
                  <Input
                    id="edit-paymentPercentage"
                    name="paymentPercentage"
                    type="text"
                    inputMode="decimal"
                    value={formData.paymentPercentage}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
                  "Update Milestone"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractMilestonesComponent;
