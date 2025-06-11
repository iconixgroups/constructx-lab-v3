import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import bidService from "../services/bidService";

const BidSectionsComponent = ({ bidId }) => {
  const { toast } = useToast();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch sections
  useEffect(() => {
    fetchSections();
  }, [bidId]);

  // Fetch sections from API
  const fetchSections = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bidService.getBidSections(bidId);
      setSections(response.data);
    } catch (err) {
      console.error("Error fetching bid sections:", err);
      setError("Failed to load bid sections. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bid sections. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      order: sections.length
    });
    setShowAddDialog(true);
  };

  // Open edit dialog
  const handleEditClick = (section) => {
    setCurrentSection(section);
    setFormData({
      name: section.name,
      description: section.description || "",
      order: section.order
    });
    setShowEditDialog(true);
  };

  // Handle add section
  const handleAddSection = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Section name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await bidService.createBidSection(bidId, formData);
      setSections(prev => [...prev, response.data]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Section added successfully."
      });
    } catch (err) {
      console.error("Error adding section:", err);
      toast({
        title: "Error",
        description: "Failed to add section. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit section
  const handleEditSection = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Section name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await bidService.updateBidSection(bidId, currentSection.id, formData);
      setSections(prev => prev.map(section => 
        section.id === currentSection.id ? response.data : section
      ));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Section updated successfully."
      });
    } catch (err) {
      console.error("Error updating section:", err);
      toast({
        title: "Error",
        description: "Failed to update section. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete section
  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section? This will also delete all items in this section.")) {
      return;
    }
    
    try {
      await bidService.deleteBidSection(bidId, sectionId);
      setSections(prev => prev.filter(section => section.id !== sectionId));
      toast({
        title: "Success",
        description: "Section deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting section:", err);
      toast({
        title: "Error",
        description: "Failed to delete section. Please try again.",
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
    
    // Reorder the sections
    const newSections = Array.from(sections);
    const [removed] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, removed);
    
    // Update the order property
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    // Update the state optimistically
    setSections(updatedSections);
    
    try {
      // Update the order in the backend
      await bidService.updateBidSectionsOrder(bidId, updatedSections.map(section => ({
        id: section.id,
        order: section.order
      })));
    } catch (err) {
      console.error("Error updating section order:", err);
      toast({
        title: "Error",
        description: "Failed to update section order. Please try again.",
        variant: "destructive"
      });
      // Revert to original order on error
      fetchSections();
    }
  };

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (isLoading) {
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
        <Button onClick={fetchSections}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Bid Sections</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>
      
      {sections.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No sections found. Add your first section to get started.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border"
                      >
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-2 cursor-move"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-lg">{section.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSectionExpansion(section.id)}
                            >
                              {expandedSections[section.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(section)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedSections[section.id] && (
                          <CardContent className="p-4 pt-0">
                            {section.description && (
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground">Description:</p>
                                <p>{section.description}</p>
                              </div>
                            )}
                            <BidItemsComponent bidId={bidId} sectionId={section.id} />
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {/* Add Section Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add a new section to organize bid items.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSection}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Section Name <span className="text-red-500">*</span></Label>
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
                  "Add Section"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Section Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Make changes to the section details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSection}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Section Name <span className="text-red-500">*</span></Label>
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
                  "Update Section"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidSectionsComponent;
