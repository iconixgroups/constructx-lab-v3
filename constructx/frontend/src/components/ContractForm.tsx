import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Calendar, DollarSign, TagIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "./ui/use-toast";
import { contractService } from "../services/contractService";

interface Client {
  id: string;
  name: string;
}

interface ContractFormProps {
  contract?: any;
  onSubmit: (contractData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  contract,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { toast } = useToast();
  const isEditMode = !!contract;
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  
  // Contract type options
  const contractTypeOptions = [
    { value: "Fixed Price", label: "Fixed Price" },
    { value: "Time & Materials", label: "Time & Materials" },
    { value: "Cost Plus", label: "Cost Plus" },
    { value: "Unit Price", label: "Unit Price" },
    { value: "Guaranteed Maximum Price", label: "Guaranteed Maximum Price" }
  ];
  
  // Initial form state
  const [formData, setFormData] = useState({
    name: contract?.name || "",
    description: contract?.description || "",
    clientId: contract?.clientId || "",
    contractType: contract?.contractType || "Fixed Price",
    value: contract?.value ? contract.value.toString() : "",
    startDate: contract?.startDate ? new Date(contract.startDate) : null,
    endDate: contract?.endDate ? new Date(contract.endDate) : null,
    executionDate: contract?.executionDate ? new Date(contract.executionDate) : null,
    tags: contract?.tags || []
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    name: "",
    clientId: "",
    value: "",
    startDate: "",
    endDate: ""
  });
  
  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const response = await contractService.getClients();
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    fetchClients();
  }, [toast]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  // Handle tag input change
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // Handle tag input keydown
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  // Add tag
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Convert to lowercase and remove spaces for consistency
    const formattedTag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    
    // Check if tag already exists
    if (!formData.tags.includes(formattedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, formattedTag]
      }));
    }
    
    setTagInput("");
  };
  
  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: "",
      clientId: "",
      value: "",
      startDate: "",
      endDate: ""
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Contract name is required";
      isValid = false;
    }
    
    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
      isValid = false;
    }
    
    if (!formData.value.trim()) {
      newErrors.value = "Contract value is required";
      isValid = false;
    } else if (isNaN(Number(formData.value)) || Number(formData.value) < 0) {
      newErrors.value = "Contract value must be a positive number";
      isValid = false;
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    } else if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date must be after start date";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submissionData = {
      ...formData,
      value: parseFloat(formData.value),
      startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : null,
      endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : null,
      executionDate: formData.executionDate ? format(formData.executionDate, "yyyy-MM-dd") : null
    };
    
    onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Contract Details</TabsTrigger>
          <TabsTrigger value="dates">Dates & Value</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
        </TabsList>
        
        {/* Contract Details Tab */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Contract Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter contract name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter contract description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">
              Client <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleSelectChange("clientId", value)}
              disabled={isLoading || isLoadingClients}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder={isLoadingClients ? "Loading clients..." : "Select client"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contractType">Contract Type</Label>
            <Select
              value={formData.contractType}
              onValueChange={(value) => handleSelectChange("contractType", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* Dates & Value Tab */}
        <TabsContent value="dates" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                id="startDate"
                selected={formData.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                disabled={isLoading}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                id="endDate"
                selected={formData.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                disabled={isLoading}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="executionDate">Execution Date</Label>
            <DatePicker
              id="executionDate"
              selected={formData.executionDate}
              onSelect={(date) => handleDateChange("executionDate", date)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The date when the contract was signed by all parties.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">
              Contract Value <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="value"
                name="value"
                type="text"
                inputMode="decimal"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter contract value"
                className="pl-8"
                disabled={isLoading}
              />
            </div>
            {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
          </div>
        </TabsContent>
        
        {/* Additional Info Tab */}
        <TabsContent value="additional" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags (press Enter)"
                  className="pl-8"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim() || isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeTag(tag)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {formData.tags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags added yet.</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tags help you categorize and filter contracts.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditMode ? "Update Contract" : "Create Contract"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContractForm;
