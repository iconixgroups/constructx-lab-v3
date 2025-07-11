import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Plus, Edit, Trash2, Check, X, List, GripVertical } from "lucide-react";
import { useToast } from "./ui/use-toast";
import inspectionService from "../services/inspectionService";

interface InspectionTemplateManagerProps {
  templates: any[];
  onUpdate: () => void;
}

const InspectionTemplateManager: React.FC<InspectionTemplateManagerProps> = ({ templates, onUpdate }) => {
  const { toast } = useToast();
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateFormData, setTemplateFormData] = useState({
    name: "",
    description: "",
    type: "",
    category: "",
    isActive: true,
  });
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [checklistSections, setChecklistSections] = useState<any[]>([]);
  const [showChecklistItemForm, setShowChecklistItemForm] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState<any>(null);
  const [checklistItemFormData, setChecklistItemFormData] = useState({
    description: "",
    expectedResult: "",
    responseType: "Pass/Fail",
    order: 0,
    isRequired: false,
    reference: "",
    sectionId: "",
  });

  useEffect(() => {
    if (editingTemplate) {
      setTemplateFormData({
        name: editingTemplate.name,
        description: editingTemplate.description,
        type: editingTemplate.type,
        category: editingTemplate.category,
        isActive: editingTemplate.isActive,
      });
      fetchChecklist(editingTemplate.id);
    } else {
      setTemplateFormData({
        name: "",
        description: "",
        type: "",
        category: "",
        isActive: true,
      });
      setChecklistItems([]);
      setChecklistSections([]);
    }
  }, [editingTemplate]);

  const fetchChecklist = async (templateId: string) => {
    try {
      const response = await inspectionService.getInspectionTemplateById(templateId);
      setChecklistItems(response.checklistItems || []);
      setChecklistSections(response.checklistSections || []);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      toast({
        title: "Error",
        description: "Failed to load checklist items. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setTemplateFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTemplateSelectChange = (name: string, value: string | boolean) => {
    setTemplateFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await inspectionService.updateInspectionTemplate(editingTemplate.id, templateFormData);
        toast({
          title: "Success",
          description: "Template updated successfully."
        });
      } else {
        await inspectionService.createInspectionTemplate(templateFormData);
        toast({
          title: "Success",
          description: "Template created successfully."
        });
      }
      setShowTemplateForm(false);
      setEditingTemplate(null);
      onUpdate();
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      try {
        await inspectionService.deleteInspectionTemplate(templateId);
        toast({
          title: "Success",
          description: "Template deleted successfully."
        });
        onUpdate();
      } catch (error) {
        console.error("Error deleting template:", error);
        toast({
          title: "Error",
          description: "Failed to delete template. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddChecklistItem = () => {
    setEditingChecklistItem(null);
    setChecklistItemFormData({
      description: "",
      expectedResult: "",
      responseType: "Pass/Fail",
      order: checklistItems.length + 1,
      isRequired: false,
      reference: "",
      sectionId: checklistSections.length > 0 ? checklistSections[0].id : "",
    });
    setShowChecklistItemForm(true);
  };

  const handleEditChecklistItem = (item: any) => {
    setEditingChecklistItem(item);
    setChecklistItemFormData({
      description: item.description,
      expectedResult: item.expectedResult,
      responseType: item.responseType,
      order: item.order,
      isRequired: item.isRequired,
      reference: item.reference,
      sectionId: item.sectionId,
    });
    setShowChecklistItemForm(true);
  };

  const handleChecklistItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setChecklistItemFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChecklistItemSelectChange = (name: string, value: string | boolean) => {
    setChecklistItemFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChecklistItem) {
        await inspectionService.updateChecklistItem(editingChecklistItem.id, checklistItemFormData);
        toast({
          title: "Success",
          description: "Checklist item updated successfully."
        });
      } else {
        await inspectionService.addChecklistItem(editingTemplate.id, checklistItemFormData);
        toast({
          title: "Success",
          description: "Checklist item added successfully."
        });
      }
      setShowChecklistItemForm(false);
      setEditingChecklistItem(null);
      fetchChecklist(editingTemplate.id);
    } catch (error) {
      console.error("Error saving checklist item:", error);
      toast({
        title: "Error",
        description: "Failed to save checklist item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this checklist item?")) {
      try {
        await inspectionService.deleteChecklistItem(itemId);
        toast({
          title: "Success",
          description: "Checklist item deleted successfully."
        });
        fetchChecklist(editingTemplate.id);
      } catch (error) {
        console.error("Error deleting checklist item:", error);
        toast({
          title: "Error",
          description: "Failed to delete checklist item. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddChecklistSection = async () => {
    const sectionName = prompt("Enter new section name:");
    if (sectionName && editingTemplate) {
      try {
        await inspectionService.addChecklistSection(editingTemplate.id, { name: sectionName, order: checklistSections.length + 1 });
        toast({
          title: "Success",
          description: "Checklist section added successfully."
        });
        fetchChecklist(editingTemplate.id);
      } catch (error) {
        console.error("Error adding section:", error);
        toast({
          title: "Error",
          description: "Failed to add section. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getItemsForSection = (sectionId: string) => {
    return checklistItems.filter(item => item.sectionId === sectionId).sort((a, b) => a.order - b.order);
  };

  const getUncategorizedItems = () => {
    return checklistItems.filter(item => !item.sectionId).sort((a, b) => a.order - b.order);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inspection Templates</h2>
        <Button onClick={() => {
          setEditingTemplate(null);
          setShowTemplateForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" /> Create New Template
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No templates found.
              </TableCell>
            </TableRow>
          ) : (
            templates.map(template => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.type}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{template.isActive ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                    <Edit className="h-4 w-4 mr-2" />Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Template Form Dialog */}
      {showTemplateForm && (
        <Dialog open={true} onOpenChange={setShowTemplateForm}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Edit Inspection Template" : "Create New Inspection Template"}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? "Edit the details and checklist of this template." : "Define a new inspection template and its checklist."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTemplateSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" value={templateFormData.name} onChange={handleTemplateFormChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select name="type" value={templateFormData.type} onValueChange={(value) => handleTemplateSelectChange("type", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input id="category" name="category" value={templateFormData.category} onChange={handleTemplateFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={templateFormData.description} onChange={handleTemplateFormChange} className="col-span-3" rows={3} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Active</Label>
                <input type="checkbox" id="isActive" name="isActive" checked={templateFormData.isActive} onChange={handleTemplateFormChange} className="col-span-3 w-4 h-4" />
              </div>
            </form>

            {editingTemplate && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-4">Checklist Items</h3>
                <div className="flex justify-end mb-4 space-x-2">
                  <Button variant="outline" onClick={handleAddChecklistSection}>
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                  </Button>
                  <Button onClick={handleAddChecklistItem}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>

                {checklistSections.map(section => (
                  <div key={section.id} className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-semibold text-lg mb-2 flex items-center">
                      <GripVertical className="h-5 w-5 mr-2 text-muted-foreground" />{section.name}
                    </h4>
                    <ul className="space-y-2">
                      {getItemsForSection(section.id).map(item => (
                        <li key={item.id} className="flex justify-between items-center p-2 border rounded-md bg-white dark:bg-gray-900">
                          <span>{item.description} ({item.responseType})</span>
                          <div>
                            <Button variant="ghost" size="sm" onClick={() => handleEditChecklistItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteChecklistItem(item.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {getUncategorizedItems().length > 0 && (
                  <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-semibold text-lg mb-2 flex items-center">
                      <List className="h-5 w-5 mr-2 text-muted-foreground" />Uncategorized Items
                    </h4>
                    <ul className="space-y-2">
                      {getUncategorizedItems().map(item => (
                        <li key={item.id} className="flex justify-between items-center p-2 border rounded-md bg-white dark:bg-gray-900">
                          <span>{item.description} ({item.responseType})</span>
                          <div>
                            <Button variant="ghost" size="sm" onClick={() => handleEditChecklistItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteChecklistItem(item.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateForm(false)}>Cancel</Button>
              <Button type="submit">
                {editingTemplate ? "Save Changes" : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Checklist Item Form Dialog */}
      {showChecklistItemForm && (
        <Dialog open={true} onOpenChange={setShowChecklistItemForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingChecklistItem ? "Edit Checklist Item" : "Add New Checklist Item"}</DialogTitle>
              <DialogDescription>
                {editingChecklistItem ? "Edit the details of this checklist item." : "Fill in the details for a new checklist item."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChecklistItemSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={checklistItemFormData.description} onChange={handleChecklistItemFormChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responseType" className="text-right">Response Type</Label>
                <Select name="responseType" value={checklistItemFormData.responseType} onValueChange={(value) => handleChecklistItemSelectChange("responseType", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select response type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass/Fail">Pass/Fail</SelectItem>
                    <SelectItem value="Yes/No">Yes/No</SelectItem>
                    <SelectItem value="Rating Scale">Rating Scale</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                    <SelectItem value="Number">Number</SelectItem>
                    <SelectItem value="Photo">Photo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expectedResult" className="text-right">Expected Result</Label>
                <Input id="expectedResult" name="expectedResult" value={checklistItemFormData.expectedResult} onChange={handleChecklistItemFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference" className="text-right">Reference</Label>
                <Input id="reference" name="reference" value={checklistItemFormData.reference} onChange={handleChecklistItemFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sectionId" className="text-right">Section</Label>
                <Select name="sectionId" value={checklistItemFormData.sectionId} onValueChange={(value) => handleChecklistItemSelectChange("sectionId", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Section</SelectItem>
                    {checklistSections.map(section => (
                      <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isRequired" className="text-right">Required</Label>
                <input type="checkbox" id="isRequired" name="isRequired" checked={checklistItemFormData.isRequired} onChange={handleChecklistItemFormChange} className="col-span-3 w-4 h-4" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowChecklistItemForm(false)}>Cancel</Button>
              <Button type="submit">
                {editingChecklistItem ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InspectionTemplateManager;


