import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Search, Filter, Download, Edit, Trash2, Eye, DollarSign, Check, X, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import financialService from "../services/financialService";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Budget Status Badge Component
const BudgetStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// Budget Management Page Component
const BudgetManagementPage = () => {
  // Current project ID - in a real app, this would come from context or URL params
  const projectId = "project123";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);

  // Fetch budgets
  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await financialService.getBudgets(projectId);
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setError("Failed to load budgets. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load budgets. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch budgets on component mount
  useEffect(() => {
    fetchBudgets();
  }, [projectId]);

  // Filter budgets based on search query and status filter
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle budget creation
  const handleCreateBudget = async (formData) => {
    try {
      setIsLoading(true);
      await financialService.createBudget(projectId, formData);
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Budget created successfully."
      });
      fetchBudgets(); // Refresh the list
    } catch (err) {
      console.error("Error creating budget:", err);
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view budget details
  const handleViewBudget = (budget) => {
    navigate(`/financial/budgets/${budget.id}`);
  };

  // Handle edit budget
  const handleEditBudget = (budget) => {
    navigate(`/financial/budgets/${budget.id}/edit`);
  };

  // Handle delete budget confirmation
  const handleDeleteConfirmation = (budget) => {
    setSelectedBudget(budget);
    setShowDeleteDialog(true);
  };

  // Handle delete budget
  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;
    
    try {
      setIsLoading(true);
      await financialService.deleteBudget(selectedBudget.id);
      setShowDeleteDialog(false);
      setSelectedBudget(null);
      toast({
        title: "Success",
        description: "Budget deleted successfully."
      });
      fetchBudgets(); // Refresh the list
    } catch (err) {
      console.error("Error deleting budget:", err);
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export budgets
  const handleExportBudgets = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Your budget export is being prepared."
      });
      
      // In a real implementation, this would call an API to export budgets
      // For now, we'll just simulate it
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: "Your budgets have been exported successfully."
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export budgets. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Create and manage project budgets</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" /> Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Enter the details for the new budget. You can add categories and items after creation.
                </DialogDescription>
              </DialogHeader>
              <BudgetForm onSubmit={handleCreateBudget} onCancel={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Budget List</TabsTrigger>
          <TabsTrigger value="comparison">Budget vs. Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search budgets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" disabled={isLoading}>
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
            <Button variant="outline" onClick={handleExportBudgets} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>

          {/* Budgets Table */}
          <Card>
            <CardContent className="p-0">
              {error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchBudgets}>
                    Retry
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Budget Name</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No budgets found. Create your first budget to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBudgets.map((budget) => (
                        <TableRow key={budget.id}>
                          <TableCell className="font-medium">{budget.name}</TableCell>
                          <TableCell>{formatCurrency(budget.totalAmount)}</TableCell>
                          <TableCell>
                            <BudgetStatusBadge status={budget.status} />
                          </TableCell>
                          <TableCell>
                            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                          </TableCell>
                          <TableCell>{formatDate(budget.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewBudget(budget)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditBudget(budget)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-600"
                                onClick={() => handleDeleteConfirmation(budget)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-[400px]">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">Select a budget to view comparison data.</p>
                    <Button className="mt-4" onClick={() => setActiveTab("list")}>
                      View Budgets
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBudget && (
              <div className="border rounded-md p-4">
                <p><strong>Budget Name:</strong> {selectedBudget.name}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(selectedBudget.totalAmount)}</p>
                <p><strong>Status:</strong> {selectedBudget.status}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteBudget} 
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Budget"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Budget Form Component
const BudgetForm = ({ budgetData, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: budgetData?.name || "",
    description: budgetData?.description || "",
    totalAmount: budgetData?.totalAmount || "",
    startDate: budgetData?.startDate || new Date().toISOString().split('T')[0],
    endDate: budgetData?.endDate || "",
    status: budgetData?.status || "Draft"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Budget name is required";
    if (!formData.totalAmount || formData.totalAmount <= 0) newErrors.totalAmount = "Valid budget amount is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Budget Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Budget Amount <span className="text-red-500">*</span></Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="totalAmount"
              type="number"
              min="0"
              step="1000"
              className={`pl-8 ${errors.totalAmount ? "border-red-500" : ""}`}
              value={formData.totalAmount}
              onChange={(e) => handleChange("totalAmount", e.target.value)}
            />
          </div>
          {errors.totalAmount && <p className="text-red-500 text-sm">{errors.totalAmount}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Budget" : "Create Budget"}
        </Button>
      </div>
    </form>
  );
};

export default BudgetManagementPage;
