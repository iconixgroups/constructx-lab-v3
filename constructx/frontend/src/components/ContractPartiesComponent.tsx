import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Edit, Trash2, Building, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface ContractPartiesComponentProps {
  contractId: string;
}

const ContractPartiesComponent: React.FC<ContractPartiesComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [parties, setParties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentParty, setCurrentParty] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Client",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    },
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Party type options
  const partyTypeOptions = [
    { value: "Client", label: "Client" },
    { value: "Contractor", label: "Contractor" },
    { value: "Subcontractor", label: "Subcontractor" },
    { value: "Vendor", label: "Vendor" },
    { value: "Consultant", label: "Consultant" },
    { value: "Owner", label: "Owner" },
    { value: "Architect", label: "Architect" },
    { value: "Engineer", label: "Engineer" },
    { value: "Insurance", label: "Insurance" },
    { value: "Legal", label: "Legal" },
    { value: "Other", label: "Other" }
  ];
  
  // Mock data for initial development - will be replaced with API calls
  const mockParties = [
    {
      id: "party-1",
      contractId: "contract-1",
      name: "Acme Corporation",
      type: "Client",
      companyId: "company-1",
      contactName: "Jane Smith",
      contactEmail: "jane.smith@acme.com",
      contactPhone: "555-123-4567",
      address: {
        street: "123 Main St",
        city: "Metropolis",
        state: "NY",
        zip: "10001",
        country: "USA"
      },
      notes: "Primary client for the project.",
      createdAt: "2025-01-05T10:30:00Z",
      updatedAt: "2025-01-05T10:30:00Z"
    },
    {
      id: "party-2",
      contractId: "contract-1",
      name: "ConstructX",
      type: "Contractor",
      companyId: "company-2",
      contactName: "John Doe",
      contactEmail: "john.doe@constructx.com",
      contactPhone: "555-987-6543",
      address: {
        street: "456 Builder Ave",
        city: "Metropolis",
        state: "NY",
        zip: "10002",
        country: "USA"
      },
      notes: "Main contractor responsible for construction.",
      createdAt: "2025-01-05T10:35:00Z",
      updatedAt: "2025-01-05T10:35:00Z"
    },
    {
      id: "party-3",
      contractId: "contract-1",
      name: "City Architects",
      type: "Consultant",
      companyId: "company-3",
      contactName: "Robert Johnson",
      contactEmail: "robert@cityarchitects.com",
      contactPhone: "555-456-7890",
      address: {
        street: "789 Design Blvd",
        city: "Metropolis",
        state: "NY",
        zip: "10003",
        country: "USA"
      },
      notes: "Architectural design and consultation.",
      createdAt: "2025-01-05T10:40:00Z",
      updatedAt: "2025-01-05T10:40:00Z"
    }
  ];
  
  // Fetch parties
  useEffect(() => {
    const fetchParties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await contractService.getContractParties(contractId);
        // setParties(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setParties(mockParties);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching contract parties:", err);
        setError("Failed to load contract parties. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchParties();
  }, [contractId]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      name: "",
      type: "Client",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      },
      notes: ""
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (party: any) => {
    setCurrentParty(party);
    setFormData({
      name: party.name,
      type: party.type,
      contactName: party.contactName || "",
      contactEmail: party.contactEmail || "",
      contactPhone: party.contactPhone || "",
      address: {
        street: party.address?.street || "",
        city: party.address?.city || "",
        state: party.address?.state || "",
        zip: party.address?.zip || "",
        country: party.address?.country || ""
      },
      notes: party.notes || ""
    });
    setShowEditDialog(true);
  };
  
  // Handle add party
  const handleAddParty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Party name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const response = await contractService.createContractParty(contractId, formData);
      // setParties(prev => [...prev, response.data]);
      
      // Mock create for development
      const newParty = {
        id: `party-${parties.length + 1}`,
        contractId,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setParties(prev => [...prev, newParty]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Party added successfully."
      });
    } catch (err) {
      console.error("Error adding party:", err);
      toast({
        title: "Error",
        description: "Failed to add party. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle edit party
  const handleEditParty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Party name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const response = await contractService.updateContractParty(currentParty.id, formData);
      // setParties(prev => prev.map(party => party.id === currentParty.id ? response.data : party));
      
      // Mock update for development
      const updatedParty = {
        ...currentParty,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      setParties(prev => prev.map(party => party.id === currentParty.id ? updatedParty : party));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Party updated successfully."
      });
    } catch (err) {
      console.error("Error updating party:", err);
      toast({
        title: "Error",
        description: "Failed to update party. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete party
  const handleDeleteParty = async (partyId: string) => {
    if (!window.confirm("Are you sure you want to remove this party from the contract?")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractParty(partyId);
      
      // Mock delete for development
      setParties(prev => prev.filter(party => party.id !== partyId));
      toast({
        title: "Success",
        description: "Party removed successfully."
      });
    } catch (err) {
      console.error("Error deleting party:", err);
      toast({
        title: "Error",
        description: "Failed to remove party. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading && parties.length === 0) {
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
        <h2 className="text-xl font-bold">Contract Parties</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Party
        </Button>
      </div>
      
      {parties.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No parties added to this contract yet.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Party
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map(party => (
            <Card key={party.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{party.name}</CardTitle>
                    <Badge className="mt-1">{party.type}</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(party)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteParty(party.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {party.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{party.contactName}</span>
                  </div>
                )}
                {party.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{party.contactEmail}</span>
                  </div>
                )}
                {party.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{party.contactPhone}</span>
                  </div>
                )}
                {party.address && (party.address.street || party.address.city) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      {party.address.street && <div>{party.address.street}</div>}
                      {party.address.city && (
                        <div>
                          {party.address.city}
                          {party.address.state && `, ${party.address.state}`}
                          {party.address.zip && ` ${party.address.zip}`}
                        </div>
                      )}
                      {party.address.country && <div>{party.address.country}</div>}
                    </div>
                  </div>
                )}
                {party.notes && (
                  <div className="pt-2 mt-2 border-t text-sm text-muted-foreground">
                    {party.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Party Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Party</DialogTitle>
            <DialogDescription>
              Add a new party to this contract.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddParty}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Party Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Party Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partyTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    id="address.city"
                    name="address.city"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Input
                    id="address.state"
                    name="address.state"
                    placeholder="State/Province"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="address.zip"
                    name="address.zip"
                    placeholder="Zip/Postal Code"
                    value={formData.address.zip}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Input
                    id="address.country"
                    name="address.country"
                    placeholder="Country"
                    value={formData.address.country}
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
                  "Add Party"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Party Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
            <DialogDescription>
              Update party information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditParty}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Party Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Party Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partyTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactName">Contact Person</Label>
                <Input
                  id="edit-contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  id="edit-address.street"
                  name="address.street"
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    id="edit-address.city"
                    name="address.city"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Input
                    id="edit-address.state"
                    name="address.state"
                    placeholder="State/Province"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="edit-address.zip"
                    name="address.zip"
                    placeholder="Zip/Postal Code"
                    value={formData.address.zip}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Input
                    id="edit-address.country"
                    name="address.country"
                    placeholder="Country"
                    value={formData.address.country}
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
                  "Update Party"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractPartiesComponent;
