import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye, DollarSign, Check, X, AlertCircle, Loader2 } from "lucide-react";
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

// Status Badge Component
const StatusBadge = ({ status, type }) => {
  const getStatusStyles = () => {
    if (type === "approval") {
      switch (status) {
        case "Approved":
          return "bg-green-100 text-green-800 border-green-200";
        case "Pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Rejected":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else if (type === "payment") {
      switch (status) {
        case "Paid":
          return "bg-green-100 text-green-800 border-green-200";
        case "Pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Rejected":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// Expense Management Page Component
const ExpenseManagementPage = () => {
  // Current project ID - in a real app, this would come from context or URL params
  const projectId = "project123";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for data
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Fetch expenses
  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters = {
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        approvalStatus: approvalFilter !== "all" ? approvalFilter : undefined,
        search: searchQuery || undefined
      };
      
      const data = await financialService.getExpenses(projectId, filters);
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load expenses. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and vendors
  const fetchCategoriesAndVendors = async () => {
    try {
      const [categoriesData, vendorsData] = await Promise.all([
        financialService.getAvailableCategories(projectId),
        financialService.getVendors(projectId)
      ]);
      
      setCategories(categoriesData);
      setVendors(vendorsData);
    } catch (err) {
      console.error("Error fetching categories and vendors:", err);
      toast({
        title: "Warning",
        description: "Some reference data could not be loaded. You may experience limited functionality.",
        variant: "warning"
      });
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchExpenses();
  }, [projectId, categoryFilter, approvalFilter, searchQuery]);

  // Fetch reference data on component mount
  useEffect(() => {
    fetchCategoriesAndVendors();
  }, [projectId]);

  // Handle expense creation
  const handleCreateExpense = async (formData) => {
    try {
      setIsLoading(true);
      await financialService.createExpense(projectId, formData);
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Expense created successfully."
      });
      fetchExpenses(); // Refresh the list
    } catch (err) {
      console.error("Error creating expense:", err);
      toast({
        title: "Error",
        description: "Failed to create expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view expense
  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowViewDialog(true);
  };

  // Handle edit expense
  const handleEditExpense = (expense) => {
    navigate(`/financial/expenses/${expense.id}/edit`);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteDialog(true);
  };

  // Handle delete expense
  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;
    
    try {
      setIsLoading(true);
      await financialService.deleteExpense(selectedExpense.id);
      setShowDeleteDialog(false);
      setSelectedExpense(null);
      toast({
        title: "Success",
        description: "Expense deleted successfully."
      });
      fetchExpenses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approve expense
  const handleApproveExpense = async (expenseId) => {
    try {
      setIsLoading(true);
      await financialService.approveExpense(expenseId);
      toast({
        title: "Success",
        description: "Expense approved successfully."
      });
      fetchExpenses(); // Refresh the list
      
      // Close view dialog if open
      if (showViewDialog && selectedExpense?.id === expenseId) {
        setShowViewDialog(false);
        setSelectedExpense(null);
      }
    } catch (err) {
      console.error("Error approving expense:", err);
      toast({
        title: "Error",
        description: "Failed to approve expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject expense
  const handleRejectExpense = async (expenseId) => {
    try {
      setIsLoading(true);
      await financialService.rejectExpense(expenseId);
      toast({
        title: "Success",
        description: "Expense rejected successfully."
      });
      fetchExpenses(); // Refresh the list
      
      // Close view dialog if open
      if (showViewDialog && selectedExpense?.id === expenseId) {
        setShowViewDialog(false);
        setSelectedExpense(null);
      }
    } catch (err) {
      console.error("Error rejecting expense:", err);
      toast({
        title: "Error",
        description: "Failed to reject expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export expenses
  const handleExportExpenses = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Your expense export is being prepared."
      });
      
      // In a real implementation, this would call an API to export expenses
      // For now, we'll just simulate it
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: "Your expenses have been exported successfully."
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export expenses. Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Filter for pending approval expenses
  const pendingApprovalExpenses = expenses.filter(e => e.approvalStatus === "Pending");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">Track and manage project expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the expense details and upload a receipt if available.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={handleCreateExpense} 
                onCancel={() => setShowCreateDialog(false)} 
                categories={categories}
                vendors={vendors}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Expense List</TabsTrigger>
          <TabsTrigger value="approval">
            Approval Queue
            {pendingApprovalExpenses.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {pendingApprovalExpenses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analysis">Expense Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={approvalFilter} onValueChange={setApprovalFilter} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" disabled={isLoading}>
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
            <Button variant="outline" onClick={handleExportExpenses} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>

          {/* Expenses Table */}
          <Card>
            <CardContent className="p-0">
              {error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchExpenses}>
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
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No expenses found. Add your first expense to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell>{expense.vendor}</TableCell>
                          <TableCell>{expense.budgetCategory}</TableCell>
                          <TableCell>
                            <StatusBadge status={expense.paymentStatus} type="payment" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={expense.approvalStatus} type="approval" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewExpense(expense)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-600"
                                onClick={() => handleDeleteConfirmation(expense)}
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

        <TabsContent value="approval" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses Pending Approval</CardTitle>
              <CardDescription>Review and approve expense submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchExpenses}>
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
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovalExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No expenses pending approval.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingApprovalExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell>{expense.vendor}</TableCell>
                          <TableCell>{expense.budgetCategory}</TableCell>
                          <TableCell>
                            {expense.receiptUrl ? (
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" /> View
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">No receipt</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600" 
                                onClick={() => handleApproveExpense(expense.id)}
                                disabled={isLoading}
                              >
                                <Check className="h-3 w-3 mr-1" /> Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600" 
                                onClick={() => handleRejectExpense(expense.id)}
                                disabled={isLoading}
                              >
                                <X className="h-3 w-3 mr-1" /> Reject
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

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-[400px]">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">Expense analysis and reporting will be implemented here.</p>
                    <Button className="mt-4" onClick={() => navigate("/financial/reports")}>
                      View Financial Reports
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Expense Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedExpense && (
            <>
              <DialogHeader>
                <DialogTitle>Expense Details</DialogTitle>
                <DialogDescription>
                  Viewing details for expense #{selectedExpense.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="font-medium">{selectedExpense.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
                  <p className="font-medium">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <p className="font-medium">{formatDate(selectedExpense.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Vendor</h4>
                  <p className="font-medium">{selectedExpense.vendor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                  <p className="font-medium">{selectedExpense.budgetCategory}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                  <p className="font-medium">{selectedExpense.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h4>
                  <StatusBadge status={selectedExpense.paymentStatus} type="payment" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Approval Status</h4>
                  <StatusBadge status={selectedExpense.approvalStatus} type="approval" />
                </div>
              </div>
              {selectedExpense.receiptUrl && (
                <div className="border rounded-md p-4 mt-2">
                  <h4 className="text-sm font-medium mb-2">Receipt</h4>
                  <div className="flex justify-center items-center h-[200px] bg-gray-100 rounded-md">
                    <p className="text-muted-foreground">Receipt preview placeholder</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download Receipt
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                {selectedExpense.approvalStatus === "Pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-green-600" 
                      onClick={() => handleApproveExpense(selectedExpense.id)}
                      disabled={isLoading}
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600" 
                      onClick={() => handleRejectExpense(selectedExpense.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedExpense && (
              <div className="border rounded-md p-4">
                <p><strong>Description:</strong> {selectedExpense.description}</p>
                <p><strong>Amount:</strong> {formatCurrency(selectedExpense.amount)}</p>
                <p><strong>Date:</strong> {formatDate(selectedExpense.date)}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteExpense} 
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Expense Form Component
const ExpenseForm = ({ expenseData, onSubmit, onCancel, isEditing = false, categories = [], vendors = [] }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    description: expenseData?.description || "",
    amount: expenseData?.amount || "",
    date: expenseData?.date || new Date().toISOString().split("T")[0],
    vendor: expenseData?.vendor || "",
    budgetCategory: expenseData?.budgetCategory || "",
    paymentMethod: expenseData?.paymentMethod || "Credit Card",
    paymentStatus: expenseData?.paymentStatus || "Pending",
    notes: expenseData?.notes || "",
    receipt: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [otherVendor, setOtherVendor] = useState("");

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Receipt file must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    
    // Handle vendor validation
    if (formData.vendor === "other" && !otherVendor.trim()) {
      newErrors.vendor = "Vendor name is required";
    } else if (!formData.vendor) {
      newErrors.vendor = "Vendor is required";
    }
    
    if (!formData.budgetCategory) newErrors.budgetCategory = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Prepare final form data
    const finalFormData = {
      ...formData,
      vendor: formData.vendor === "other" ? otherVendor : formData.vendor
    };
    
    // Submit the form
    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.vendor} 
              onValueChange={(value) => handleChange("vendor", value)}
            >
              <SelectTrigger className={errors.vendor ? "border-red-500" : ""}>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor, index) => (
                  <SelectItem key={index} value={vendor}>{vendor}</SelectItem>
                ))}
                <SelectItem value="other">Other (Enter manually)</SelectItem>
              </SelectContent>
            </Select>
            {formData.vendor === "other" && (
              <Input
                placeholder="Enter vendor name"
                className={`mt-2 ${errors.vendor ? "border-red-500" : ""}`}
                value={otherVendor}
                onChange={(e) => setOtherVendor(e.target.value)}
              />
            )}
            {errors.vendor && <p className="text-red-500 text-sm">{errors.vendor}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budgetCategory">Budget Category <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.budgetCategory} 
              onValueChange={(value) => handleChange("budgetCategory", value)}
            >
              <SelectTrigger className={errors.budgetCategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.budgetCategory && <p className="text-red-500 text-sm">{errors.budgetCategory}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => handleChange("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Payroll">Payroll</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select 
            value={formData.paymentStatus} 
            onValueChange={(value) => handleChange("paymentStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receipt">Receipt</Label>
          <div className="flex items-center gap-2">
            <Input
              id="receipt"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Upload receipt image or PDF (max 5MB)</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseManagementPage;
