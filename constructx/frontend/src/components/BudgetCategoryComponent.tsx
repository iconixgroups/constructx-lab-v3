import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Edit, Trash2, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
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

// Budget Category Component
const BudgetCategoryComponent = ({ budgetId }) => {
  const { toast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    if (!budgetId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await financialService.getBudgetCategories(budgetId);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching budget categories:", err);
      setError("Failed to load budget categories. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load budget categories. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when budget ID changes
  useEffect(() => {
    fetchCategories();
  }, [budgetId]);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Calculate category totals
  const calculateCategoryTotal = (category) => {
    return category.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return categories.reduce((sum, category) => sum + calculateCategoryTotal(category), 0);
  };

  // Handle add category
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddCategoryDialog(true);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditCategoryDialog(true);
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsLoading(true);
      await financialService.deleteBudgetCategory(budgetId, categoryId);
      toast({
        title: "Success",
        description: "Budget category deleted successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error deleting budget category:", err);
      toast({
        title: "Error",
        description: "Failed to delete budget category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add item
  const handleAddItem = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null);
    setShowAddItemDialog(true);
  };

  // Handle edit item
  const handleEditItem = (category, item) => {
    setSelectedCategory(category);
    setSelectedItem(item);
    setShowEditItemDialog(true);
  };

  // Handle delete item
  const handleDeleteItem = async (categoryId, itemId) => {
    try {
      setIsLoading(true);
      await financialService.deleteBudgetItem(budgetId, categoryId, itemId);
      toast({
        title: "Success",
        description: "Budget item deleted successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error deleting budget item:", err);
      toast({
        title: "Error",
        description: "Failed to delete budget item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add category submission
  const handleAddCategorySubmit = async (data) => {
    try {
      setIsLoading(true);
      await financialService.createBudgetCategory(budgetId, data);
      setShowAddCategoryDialog(false);
      toast({
        title: "Success",
        description: "Budget category created successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error creating budget category:", err);
      toast({
        title: "Error",
        description: "Failed to create budget category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit category submission
  const handleEditCategorySubmit = async (categoryId, data) => {
    try {
      setIsLoading(true);
      await financialService.updateBudgetCategory(budgetId, categoryId, data);
      setShowEditCategoryDialog(false);
      toast({
        title: "Success",
        description: "Budget category updated successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error updating budget category:", err);
      toast({
        title: "Error",
        description: "Failed to update budget category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add item submission
  const handleAddItemSubmit = async (categoryId, data) => {
    try {
      setIsLoading(true);
      await financialService.createBudgetItem(budgetId, categoryId, data);
      setShowAddItemDialog(false);
      toast({
        title: "Success",
        description: "Budget item created successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error creating budget item:", err);
      toast({
        title: "Error",
        description: "Failed to create budget item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit item submission
  const handleEditItemSubmit = async (categoryId, itemId, data) => {
    try {
      setIsLoading(true);
      await financialService.updateBudgetItem(budgetId, categoryId, itemId, data);
      setShowEditItemDialog(false);
      toast({
        title: "Success",
        description: "Budget item updated successfully."
      });
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error updating budget item:", err);
      toast({
        title: "Error",
        description: "Failed to update budget item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchCategories}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Budget Categories & Items</h3>
        <Button onClick={handleAddCategory} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No budget categories defined. Add your first category to get started.
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                onClick={() => toggleCategory(category.id)}
              >
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(calculateCategoryTotal(category))}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((calculateCategoryTotal(category) / category.amount) * 100)}% of budget
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (window.confirm("Are you sure you want to delete this category? All items within it will also be deleted.")) {
                          handleDeleteCategory(category.id);
                        }
                      }}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Items */}
              {expandedCategories[category.id] && (
                <div className="border-t">
                  <div className="p-4 bg-muted/30 flex justify-between items-center">
                    <h5 className="font-medium text-sm">Items</h5>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddItem(category)}
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No items in this category. Add your first item to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        category.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.unit}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditItem(category, item)}
                                  disabled={isLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600" 
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this item?")) {
                                      handleDeleteItem(category.id, item.id);
                                    }
                                  }}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="font-medium text-right">Category Total:</TableCell>
                        <TableCell className="font-medium text-right">{formatCurrency(calculateCategoryTotal(category))}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          ))
        )}

        {/* Grand Total */}
        {categories.length > 0 && (
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <h4 className="font-medium">Grand Total</h4>
              <p className="font-bold text-lg">{formatCurrency(calculateGrandTotal())}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
            <DialogDescription>
              Create a new budget category to organize your budget items.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            onSubmit={handleAddCategorySubmit} 
            onCancel={() => setShowAddCategoryDialog(false)} 
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Budget Category</DialogTitle>
            <DialogDescription>
              Update the details of this budget category.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm 
              categoryData={selectedCategory} 
              isEditing={true}
              onSubmit={(data) => handleEditCategorySubmit(selectedCategory.id, data)} 
              onCancel={() => setShowEditCategoryDialog(false)} 
              isSubmitting={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Budget Item</DialogTitle>
            <DialogDescription>
              Add a new item to the {selectedCategory?.name} category.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <BudgetItemForm 
              categoryId={selectedCategory.id}
              onSubmit={(data) => handleAddItemSubmit(selectedCategory.id, data)} 
              onCancel={() => setShowAddItemDialog(false)} 
              isSubmitting={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Budget Item</DialogTitle>
            <DialogDescription>
              Update the details of this budget item.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && selectedItem && (
            <BudgetItemForm 
              categoryId={selectedCategory.id}
              itemData={selectedItem}
              isEditing={true}
              onSubmit={(data) => handleEditItemSubmit(selectedCategory.id, selectedItem.id, data)} 
              onCancel={() => setShowEditItemDialog(false)} 
              isSubmitting={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Category Form Component
const CategoryForm = ({ categoryData, onSubmit, onCancel, isEditing = false, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: categoryData?.name || "",
    description: categoryData?.description || "",
    amount: categoryData?.amount || "",
    order: categoryData?.order || 0
  });
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
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid budget amount is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Budget Amount <span className="text-red-500">*</span></Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              min="0"
              step="1000"
              className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            min="0"
            step="1"
            value={formData.order}
            onChange={(e) => handleChange("order", parseInt(e.target.value))}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </form>
  );
};

// Budget Item Form Component
const BudgetItemForm = ({ categoryId, itemData, onSubmit, onCancel, isEditing = false, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: itemData?.name || "",
    description: itemData?.description || "",
    quantity: itemData?.quantity || 1,
    unit: itemData?.unit || "",
    unitPrice: itemData?.unitPrice || "",
    order: itemData?.order || 0
  });
  const [errors, setErrors] = useState({});

  // Calculate total price
  const calculateTotalPrice = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    return quantity * unitPrice;
  };

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
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = "Valid unit price is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Add calculated total price to form data
    const finalData = {
      ...formData,
      totalPrice: calculateTotalPrice()
    };
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              className={errors.quantity ? "border-red-500" : ""}
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unit <span className="text-red-500">*</span></Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className={errors.unit ? "border-red-500" : ""}
              placeholder="e.g., hours, pieces, lots"
              disabled={isSubmitting}
            />
            {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price <span className="text-red-500">*</span></Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                className={`pl-8 ${errors.unitPrice ? "border-red-500" : ""}`}
                value={formData.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalPrice">Total Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="totalPrice"
                type="text"
                value={formatCurrency(calculateTotalPrice()).replace('$', '')}
                readOnly
                className="pl-8 bg-muted/50"
              />
            </div>
            <p className="text-xs text-muted-foreground">Calculated automatically</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            min="0"
            step="1"
            value={formData.order}
            onChange={(e) => handleChange("order", parseInt(e.target.value))}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
};

export default BudgetCategoryComponent;
