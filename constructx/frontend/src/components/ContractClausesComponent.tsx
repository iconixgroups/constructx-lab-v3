import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Loader2,
  Copy
} from "lucide-react";
import { useToast } from "./ui/use-toast";

interface ContractClausesComponentProps {
  contractId: string;
  sectionId: string;
  clauses: any[];
}

const ContractClausesComponent: React.FC<ContractClausesComponentProps> = ({ 
  contractId, 
  sectionId,
  clauses: initialClauses 
}) => {
  const { toast } = useToast();
  const [clauses, setClauses] = useState<any[]>(initialClauses || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentClause, setCurrentClause] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isStandard: false,
    isRequired: false,
    riskLevel: "Low",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Risk level options
  const riskLevelOptions = [
    { value: "Low", label: "Low Risk" },
    { value: "Medium", label: "Medium Risk" },
    { value: "High", label: "High Risk" }
  ];
  
  // Update clauses when initialClauses changes
  useEffect(() => {
    setClauses(initialClauses || []);
  }, [initialClauses]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      title: "",
      content: "",
      isStandard: false,
      isRequired: false,
      riskLevel: "Low",
      notes: ""
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (clause: any) => {
    setCurrentClause(clause);
    setFormData({
      title: clause.title,
      content: clause.content,
      isStandard: clause.isStandard,
      isRequired: clause.isRequired,
      riskLevel: clause.riskLevel || "Low",
      notes: clause.notes || ""
    });
    setShowEditDialog(true);
  };
  
  // Handle add clause
  const handleAddClause = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Clause title is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Clause content is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const response = await contractService.createContractClause(contractId, sectionId, formData);
      // setClauses(prev => [...prev, response.data]);
      
      // Mock create for development
      const newClause = {
        id: `clause-${Date.now()}`,
        contractId,
        sectionId,
        title: formData.title,
        content: formData.content,
        isStandard: formData.isStandard,
        isRequired: formData.isRequired,
        riskLevel: formData.riskLevel,
        notes: formData.notes,
        order: clauses.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setClauses(prev => [...prev, newClause]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Clause added successfully."
      });
    } catch (err) {
      console.error("Error adding clause:", err);
      toast({
        title: "Error",
        description: "Failed to add clause. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle edit clause
  const handleEditClause = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Clause title is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Clause content is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const response = await contractService.updateContractClause(currentClause.id, formData);
      // setClauses(prev => prev.map(clause => clause.id === currentClause.id ? response.data : clause));
      
      // Mock update for development
      const updatedClause = {
        ...currentClause,
        title: formData.title,
        content: formData.content,
        isStandard: formData.isStandard,
        isRequired: formData.isRequired,
        riskLevel: formData.riskLevel,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };
      
      setClauses(prev => prev.map(clause => clause.id === currentClause.id ? updatedClause : clause));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Clause updated successfully."
      });
    } catch (err) {
      console.error("Error updating clause:", err);
      toast({
        title: "Error",
        description: "Failed to update clause. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete clause
  const handleDeleteClause = async (clauseId: string) => {
    if (!window.confirm("Are you sure you want to delete this clause?")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractClause(clauseId);
      
      // Mock delete for development
      setClauses(prev => prev.filter(clause => clause.id !== clauseId));
      toast({
        title: "Success",
        description: "Clause deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting clause:", err);
      toast({
        title: "Error",
        description: "Failed to delete clause. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle reorder clauses
  const handleReorderClauses = async (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    
    const draggedIndex = clauses.findIndex(clause => clause.id === draggedId);
    const targetIndex = clauses.findIndex(clause => clause.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newClauses = [...clauses];
    const [draggedClause] = newClauses.splice(draggedIndex, 1);
    newClauses.splice(targetIndex, 0, draggedClause);
    
    // Update order property
    const reorderedClauses = newClauses.map((clause, index) => ({
      ...clause,
      order: index + 1
    }));
    
    setClauses(reorderedClauses);
    
    try {
      // This will be replaced with actual API call
      // await contractService.updateContractClausesOrder(sectionId, reorderedClauses.map(c => ({ id: c.id, order: c.order })));
      
      toast({
        title: "Success",
        description: "Clauses reordered successfully."
      });
    } catch (err) {
      console.error("Error reordering clauses:", err);
      toast({
        title: "Error",
        description: "Failed to reorder clauses. Please try again.",
        variant: "destructive"
      });
      // Revert to original order on error
      setClauses(clauses);
    }
  };
  
  // Drag and drop handlers
  const [draggedClauseId, setDraggedClauseId] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent, clauseId: string) => {
    setDraggedClauseId(clauseId);
    e.dataTransfer.effectAllowed = "move";
    // Use a transparent image as drag ghost
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e: React.DragEvent, clauseId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent, targetClauseId: string) => {
    e.preventDefault();
    if (draggedClauseId) {
      handleReorderClauses(draggedClauseId, targetClauseId);
      setDraggedClauseId(null);
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Get risk level icon
  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "Medium":
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "High":
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
    }
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
        <p className="text-red-600 mb-2">{error}</p>
        <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Clauses</h3>
        <Button onClick={handleAddClick} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Clause
        </Button>
      </div>
      
      {clauses.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-2">No clauses added to this section yet.</p>
          <Button onClick={handleAddClick} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Add Clause
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {clauses.map(clause => (
            <Card 
              key={clause.id}
              className={`${draggedClauseId === clause.id ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, clause.id)}
              onDragOver={(e) => handleDragOver(e, clause.id)}
              onDrop={(e) => handleDrop(e, clause.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{clause.title}</h4>
                        <Badge className={`${getRiskLevelColor(clause.riskLevel)}`}>
                          {getRiskLevelIcon(clause.riskLevel)}
                          <span className="ml-1">{clause.riskLevel}</span>
                        </Badge>
                        {clause.isStandard && (
                          <Badge variant="outline">Standard</Badge>
                        )}
                        {clause.isRequired && (
                          <Badge variant="outline">Required</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(clause)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClause(clause.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm">
                      {clause.content}
                    </div>
                    {clause.notes && (
                      <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                        <strong>Notes:</strong> {clause.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Clause Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Clause</DialogTitle>
            <DialogDescription>
              Add a new clause to this section.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClause}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Clause Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Clause Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value) => handleSelectChange("riskLevel", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="riskLevel">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevelOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isStandard" className="block mb-2">Standard Clause</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isStandard"
                      checked={formData.isStandard}
                      onCheckedChange={(checked) => handleSwitchChange("isStandard", checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="isStandard">
                      {formData.isStandard ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isRequired" className="block mb-2">Required Clause</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isRequired"
                      checked={formData.isRequired}
                      onCheckedChange={(checked) => handleSwitchChange("isRequired", checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="isRequired">
                      {formData.isRequired ? "Yes" : "No"}
                    </Label>
                  </div>
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
                  "Add Clause"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Clause Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Clause</DialogTitle>
            <DialogDescription>
              Update clause information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClause}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Clause Title <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Clause Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-riskLevel">Risk Level</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value) => handleSelectChange("riskLevel", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-riskLevel">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevelOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-isStandard" className="block mb-2">Standard Clause</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-isStandard"
                      checked={formData.isStandard}
                      onCheckedChange={(checked) => handleSwitchChange("isStandard", checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="edit-isStandard">
                      {formData.isStandard ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-isRequired" className="block mb-2">Required Clause</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-isRequired"
                      checked={formData.isRequired}
                      onCheckedChange={(checked) => handleSwitchChange("isRequired", checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="edit-isRequired">
                      {formData.isRequired ? "Yes" : "No"}
                    </Label>
                  </div>
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
                  "Update Clause"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractClausesComponent;
