import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Loader2 
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import ContractClausesComponent from "./ContractClausesComponent";

interface ContractSectionsComponentProps {
  contractId: string;
}

const ContractSectionsComponent: React.FC<ContractSectionsComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for initial development - will be replaced with API calls
  const mockSections = [
    {
      id: "section-1",
      contractId: "contract-1",
      name: "General Provisions",
      description: "General terms and conditions applicable to the entire contract.",
      order: 1,
      createdAt: "2025-01-05T10:30:00Z",
      updatedAt: "2025-01-05T10:30:00Z",
      clauses: [
        {
          id: "clause-1",
          contractId: "contract-1",
          sectionId: "section-1",
          title: "Definitions",
          content: "For the purposes of this Contract, the following terms shall have the meanings indicated below:\n\n1.1 \"Contract\" means this agreement between the parties.\n1.2 \"Client\" means Acme Corporation.\n1.3 \"Contractor\" means ConstructX.\n1.4 \"Project\" means the construction of a 10-story office building.",
          isStandard: true,
          isRequired: true,
          riskLevel: "Low",
          notes: "Standard definitions clause.",
          order: 1
        },
        {
          id: "clause-2",
          contractId: "contract-1",
          sectionId: "section-1",
          title: "Scope of Work",
          content: "The Contractor shall furnish all labor, materials, equipment, and services necessary for the construction of the Project as described in the Contract Documents.",
          isStandard: true,
          isRequired: true,
          riskLevel: "Medium",
          notes: "Defines the overall scope of the project.",
          order: 2
        }
      ]
    },
    {
      id: "section-2",
      contractId: "contract-1",
      name: "Payment Terms",
      description: "Terms related to payment schedule, invoicing, and financial matters.",
      order: 2,
      createdAt: "2025-01-05T10:35:00Z",
      updatedAt: "2025-01-05T10:35:00Z",
      clauses: [
        {
          id: "clause-3",
          contractId: "contract-1",
          sectionId: "section-2",
          title: "Contract Sum",
          content: "The Client shall pay the Contractor the sum of $2,500,000 for the performance of the Contract, subject to additions and deductions as provided in the Contract Documents.",
          isStandard: true,
          isRequired: true,
          riskLevel: "Medium",
          notes: "Defines the total contract value.",
          order: 1
        },
        {
          id: "clause-4",
          contractId: "contract-1",
          sectionId: "section-2",
          title: "Progress Payments",
          content: "Based on applications for payment submitted by the Contractor, the Client shall make progress payments on account of the Contract Sum to the Contractor as provided below and elsewhere in the Contract Documents.\n\nPayments shall be made within 30 days of approval of the Contractor's application for payment.",
          isStandard: true,
          isRequired: true,
          riskLevel: "High",
          notes: "Critical clause for cash flow management.",
          order: 2
        }
      ]
    },
    {
      id: "section-3",
      contractId: "contract-1",
      name: "Schedule and Delays",
      description: "Terms related to project timeline, milestones, and delay provisions.",
      order: 3,
      createdAt: "2025-01-05T10:40:00Z",
      updatedAt: "2025-01-05T10:40:00Z",
      clauses: [
        {
          id: "clause-5",
          contractId: "contract-1",
          sectionId: "section-3",
          title: "Contract Time",
          content: "The Contractor shall achieve Substantial Completion of the entire Work not later than June 30, 2026, subject to adjustments of the Contract Time as provided in the Contract Documents.",
          isStandard: true,
          isRequired: true,
          riskLevel: "Medium",
          notes: "Establishes the completion deadline.",
          order: 1
        },
        {
          id: "clause-6",
          contractId: "contract-1",
          sectionId: "section-3",
          title: "Delays and Extensions of Time",
          content: "If the Contractor is delayed at any time in the progress of the Work by changes ordered in the Work, by labor disputes, fire, unusual delay in deliveries, adverse weather conditions not reasonably anticipatable, unavoidable casualties, or any causes beyond the Contractor's control, then the Contract Time shall be extended by Change Order for such reasonable time as the Architect may determine.",
          isStandard: false,
          isRequired: false,
          riskLevel: "High",
          notes: "Custom clause with potential risk implications.",
          order: 2
        }
      ]
    }
  ];
  
  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await contractService.getContractSections(contractId);
        // setSections(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setSections(mockSections);
          // Expand the first section by default
          if (mockSections.length > 0) {
            setExpandedSections([mockSections[0].id]);
          }
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching contract sections:", err);
        setError("Failed to load contract sections. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchSections();
  }, [contractId]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      name: "",
      description: ""
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (section: any) => {
    setCurrentSection(section);
    setFormData({
      name: section.name,
      description: section.description || ""
    });
    setShowEditDialog(true);
  };
  
  // Handle add section
  const handleAddSection = async (e: React.FormEvent) => {
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
      // This will be replaced with actual API call
      // const response = await contractService.createContractSection(contractId, formData);
      // setSections(prev => [...prev, response.data]);
      
      // Mock create for development
      const newSection = {
        id: `section-${sections.length + 1}`,
        contractId,
        name: formData.name,
        description: formData.description,
        order: sections.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clauses: []
      };
      
      setSections(prev => [...prev, newSection]);
      setExpandedSections(prev => [...prev, newSection.id]);
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
  const handleEditSection = async (e: React.FormEvent) => {
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
      // This will be replaced with actual API call
      // const response = await contractService.updateContractSection(currentSection.id, formData);
      // setSections(prev => prev.map(section => section.id === currentSection.id ? response.data : section));
      
      // Mock update for development
      const updatedSection = {
        ...currentSection,
        name: formData.name,
        description: formData.description,
        updatedAt: new Date().toISOString()
      };
      
      setSections(prev => prev.map(section => section.id === currentSection.id ? updatedSection : section));
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
  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this section? This will also delete all clauses within this section.")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractSection(sectionId);
      
      // Mock delete for development
      setSections(prev => prev.filter(section => section.id !== sectionId));
      setExpandedSections(prev => prev.filter(id => id !== sectionId));
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
  
  // Handle reorder sections
  const handleReorderSections = async (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    
    const draggedIndex = sections.findIndex(section => section.id === draggedId);
    const targetIndex = sections.findIndex(section => section.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);
    
    // Update order property
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setSections(reorderedSections);
    
    try {
      // This will be replaced with actual API call
      // await contractService.updateContractSectionsOrder(contractId, reorderedSections.map(s => ({ id: s.id, order: s.order })));
      
      toast({
        title: "Success",
        description: "Sections reordered successfully."
      });
    } catch (err) {
      console.error("Error reordering sections:", err);
      toast({
        title: "Error",
        description: "Failed to reorder sections. Please try again.",
        variant: "destructive"
      });
      // Revert to original order on error
      setSections(sections);
    }
  };
  
  // Drag and drop handlers
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = "move";
    // Use a transparent image as drag ghost
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (draggedSectionId) {
      handleReorderSections(draggedSectionId, targetSectionId);
      setDraggedSectionId(null);
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
  
  if (isLoading && sections.length === 0) {
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
        <h2 className="text-xl font-bold">Contract Sections & Clauses</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>
      
      {sections.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No sections added to this contract yet.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map(section => (
            <Card 
              key={section.id}
              className={`${draggedSectionId === section.id ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDrop={(e) => handleDrop(e, section.id)}
            >
              <CardHeader className="p-4 cursor-pointer" onClick={() => toggleSectionExpansion(section.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {section.clauses?.length || 0} clauses
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(section);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {section.description && (
                  <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                )}
              </CardHeader>
              
              {expandedSections.includes(section.id) && (
                <CardContent className="pt-0 pb-4 px-4">
                  <Separator className="mb-4" />
                  <ContractClausesComponent 
                    contractId={contractId} 
                    sectionId={section.id} 
                    clauses={section.clauses || []} 
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Section Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add a new section to this contract.
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update section information.
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

export default ContractSectionsComponent;
