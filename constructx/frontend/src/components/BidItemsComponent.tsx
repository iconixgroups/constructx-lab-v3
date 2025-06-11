import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Edit, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import bidService from "../services/bidService";

const BidItemsComponent = ({ bidId, sectionId }) => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "1",
    unit: "each",
    unitPrice: "0",
    totalPrice: "0",
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Units options
  const unitOptions = [
    { value: "each", label: "Each" },
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "sqft", label: "Square Foot" },
    { value: "sqm", label: "Square Meter" },
    { value: "cuft", label: "Cubic Foot" },
    { value: "cum", label: "Cubic Meter" },
    { value: "linear_ft", label: "Linear Foot" },
    { value: "linear_m", label: "Linear Meter" },
    { value: "lot", label: "Lot" }
  ];

  // Fetch items
  useEffect(() => {
    if (sectionId) {
      fetchItems();
    }
  }, [bidId, sectionId]);

  // Fetch items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bidService.getBidItems(bidId, sectionId);
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching bid items:", err);
      setError("Failed to load bid items. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bid items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Auto-calculate total price when quantity or unit price changes
      if (name === "quantity" || name === "unitPrice") {
        const quantity = parseFloat(newData.quantity) || 0;
        const unitPrice = parseFloat(newData.unitPrice) || 0;
        newData.totalPrice = (quantity * unitPrice).toString();
      }
      
      return newData;
    });
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      quantity: "1",
      unit: "each",
      unitPrice: "0",
      totalPrice: "0",
      order: items.length
    });
    setShowAddDialog(true);
  };

  // Open edit dialog
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity.toString(),
      unit: item.unit,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
      order: item.order
    });
    setShowEditDialog(true);
  };

  // Handle add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Item name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const itemData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: parseFloat(formData.totalPrice)
      };
      
      const response = await bidService.createBidItem(bidId, sectionId, itemData);
      setItems(prev => [...prev, response.data]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Item added successfully."
      });
    } catch (err) {
      console.error("Error adding item:", err);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Item name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const itemData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: parseFloat(formData.totalPrice)
      };
      
      const response = await bidService.updateBidItem(bidId, sectionId, currentItem.id, itemData);
      setItems(prev => prev.map(item => 
        item.id === currentItem.id ? response.data : item
      ));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Item updated successfully."
      });
    } catch (err) {
      console.error("Error updating item:", err);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    
    try {
      await bidService.deleteBidItem(bidId, sectionId, itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Success",
        description: "Item deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting item:", err);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside the list
    if (!destination) return;
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Reorder the items
    const newItems = Array.from(items);
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    
    // Update the order property
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    // Update the state optimistically
    setItems(updatedItems);
    
    try {
      // Update the order in the backend
      await bidService.updateBidItemsOrder(bidId, sectionId, updatedItems.map(item => ({
        id: item.id,
        order: item.order
      })));
    } catch (err) {
      console.error("Error updating item order:", err);
      toast({
        title: "Error",
        description: "Failed to update item order. Please try again.",
        variant: "destructive"
      });
      // Revert to original order on error
      fetchItems();
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchItems} size="sm">Retry</Button>
      </div>
    );
  }

  // Calculate total
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Items</h3>
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground mb-2">No items found in this section.</p>
          <Button size="sm" variant="outline" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" /> Add First Item
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <TableCell>
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell>{unitOptions.find(u => u.value === item.unit)?.label || item.unit}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
      
      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Add a new item to this section.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddItem}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
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
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => handleSelectChange("unit", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <Input
                    id="totalPrice"
                    name="totalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
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
                  "Add Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to the item details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditItem}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name <span className="text-red-500">*</span></Label>
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
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => handleSelectChange("unit", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unitPrice">Unit Price</Label>
                  <Input
                    id="edit-unitPrice"
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-totalPrice">Total Price</Label>
                  <Input
                    id="edit-totalPrice"
                    name="totalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
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
                  "Update Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidItemsComponent;
