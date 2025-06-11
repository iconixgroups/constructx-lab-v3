import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, Tag, Calendar, MapPin, Wrench, User, Package } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar"; // Renamed to avoid conflict
import { format, parseISO } from "date-fns";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library

const ResourceForm = ({ resourceData = null, onSave, onCancel, isSaving: parentIsSaving }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Labor",
    category: "",
    description: "",
    status: "Available",
    cost: 0,
    costUnit: "Hour",
    tags: [],
    // Labor specific
    userId: "",
    role: "",
    skills: [],
    certifications: [],
    maxHoursPerDay: 8,
    maxHoursPerWeek: 40,
    // Equipment specific
    model: "",
    serialNumber: "",
    purchaseDate: null,
    warrantyExpiration: null,
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    location: "",
    condition: "Good",
    ownedBy: "Company",
    // Material specific
    unit: "Unit",
    quantity: 0,
    reorderPoint: 0,
    supplier: "",
    materialLocation: "",
    expirationDate: null
  });

  const [resourceTypes, setResourceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load categories based on type
  const loadCategories = useCallback(async (type) => {
    if (!type) {
      setCategories([]);
      return;
    }
    try {
      const cats = await resourceService.getResourceCategories(type);
      setCategories(cats || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]); // Set empty on error
      toast.error("Failed to load resource categories.");
    }
  }, []);

  // Load initial data and dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const [typesData, statusesData] = await Promise.all([
          resourceService.getResourceTypes(),
          resourceService.getResourceStatuses()
        ]);
        setResourceTypes(typesData || []);
        setStatuses(statusesData || []);
        
        let initialType = typesData?.[0] || "Labor";
        let initialCategory = "";
        
        if (resourceData) {
          // Parse date strings into Date objects
          const parsedData = { ...resourceData };
          const dateFields = ["purchaseDate", "warrantyExpiration", "lastMaintenanceDate", "nextMaintenanceDate", "expirationDate"];
          dateFields.forEach(field => {
            if (parsedData[field] && typeof parsedData[field] === "string") {
              try {
                parsedData[field] = parseISO(parsedData[field]);
              } catch (dateError) {
                console.warn(`Failed to parse date string for ${field}:`, parsedData[field], dateError);
                parsedData[field] = null; // Set to null if parsing fails
              }
            } else if (!parsedData[field]) {
                 parsedData[field] = null; // Ensure null if empty/undefined
            }
          });
          
          setFormData(prev => ({ ...prev, ...parsedData }));
          initialType = resourceData.type || initialType;
          initialCategory = resourceData.category || "";
        } else {
          // Set default type and status for new resource
          setFormData(prev => ({ 
              ...prev, 
              type: initialType, 
              status: statusesData?.[0] || "Available" 
          }));
        }
        
        // Load categories for the initial/determined type
        await loadCategories(initialType);
        // Set category after categories are loaded
        setFormData(prev => ({ ...prev, category: initialCategory }));

      } catch (error) {
        console.error("Failed to load resource options:", error);
        setErrors(prev => ({ ...prev, load: "Failed to load form options. Please try again." }));
        toast.error("Failed to load form options.");
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [resourceData, loadCategories]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Load categories when type changes
    if (field === "type") {
      loadCategories(value);
      // Reset category when type changes
      setFormData(prev => ({ ...prev, category: "" }));
    }
  };
  
  // Handle date changes
  const handleDateChange = (field, date) => {
      handleChange(field, date);
  };

  // Handle array inputs (tags, skills, certifications)
  const handleArrayInputChange = (e, setInputState) => {
    setInputState(e.target.value);
  };

  const addArrayItem = (field, value, setInputState) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setInputState("");
    }
  };

  const removeArrayItem = (field, itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== itemToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.cost < 0) newErrors.cost = "Cost cannot be negative";
    
    if (formData.type === "Material") {
      if (formData.quantity < 0) newErrors.quantity = "Quantity cannot be negative";
      if (formData.reorderPoint < 0) newErrors.reorderPoint = "Reorder point cannot be negative";
    }
    
    // Date validations
    if (formData.warrantyExpiration && formData.purchaseDate && formData.warrantyExpiration < formData.purchaseDate) {
        newErrors.warrantyExpiration = "Warranty cannot expire before purchase date";
    }
    if (formData.nextMaintenanceDate && formData.lastMaintenanceDate && formData.nextMaintenanceDate < formData.lastMaintenanceDate) {
        newErrors.nextMaintenanceDate = "Next maintenance cannot be before last maintenance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        toast.warning("Please fix the errors in the form.");
        return;
    }

    setIsSaving(true);
    setErrors({}); // Clear previous submit errors
    try {
      // Format dates to ISO strings for API, handle nulls
      const apiData = { ...formData };
      const dateFields = ["purchaseDate", "warrantyExpiration", "lastMaintenanceDate", "nextMaintenanceDate", "expirationDate"];
      dateFields.forEach(field => {
        if (apiData[field] instanceof Date) {
          apiData[field] = apiData[field].toISOString();
        } else {
          apiData[field] = null; // Ensure null if not a valid date
        }
      });
      
      await onSave(apiData); // Call the save function passed from parent (which calls the service)
      
    } catch (error) {
      console.error("Failed to save resource:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to save resource. Please try again.";
      setErrors(prev => ({ ...prev, submit: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading form...</div>;
  }
  
  if (errors.load) {
      return <div className="p-8 text-center text-red-500">{errors.load}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Common Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} disabled={categories.length === 0}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" value={formData.cost} onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)} min="0" step="0.01" className={errors.cost ? "border-red-500" : ""} />
              {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="costUnit">Cost Unit</Label>
              <Select value={formData.costUnit} onValueChange={(value) => handleChange("costUnit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hour">Hour</SelectItem>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Unit">Unit</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="m³">m³</SelectItem>
                  <SelectItem value="Ton">Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="tags"
                value={tagInput}
                onChange={(e) => handleArrayInputChange(e, setTagInput)}
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("tags", tagInput, setTagInput);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addArrayItem("tags", tagInput, setTagInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeArrayItem("tags", tag)}>x</button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Specific Fields */}
      {formData.type === "Labor" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><User className="h-5 w-5 mr-2" /> Labor Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={(e) => handleChange("role", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">Linked User (Optional)</Label>
                <Input id="userId" value={formData.userId} onChange={(e) => handleChange("userId", e.target.value)} placeholder="Enter user ID" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxHoursPerDay">Max Hours/Day</Label>
                <Input id="maxHoursPerDay" type="number" value={formData.maxHoursPerDay} onChange={(e) => handleChange("maxHoursPerDay", parseInt(e.target.value) || 0)} min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxHoursPerWeek">Max Hours/Week</Label>
                <Input id="maxHoursPerWeek" type="number" value={formData.maxHoursPerWeek} onChange={(e) => handleChange("maxHoursPerWeek", parseInt(e.target.value) || 0)} min="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex items-center space-x-2">
                <Input id="skills" value={skillInput} onChange={(e) => handleArrayInputChange(e, setSkillInput)} placeholder="Add skill and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArrayItem("skills", skillInput, setSkillInput); } }} />
                <Button type="button" variant="outline" onClick={() => addArrayItem("skills", skillInput, setSkillInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => <Badge key={skill} variant="secondary">{skill}<button type="button" className="ml-1" onClick={() => removeArrayItem("skills", skill)}>x</button></Badge>)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <div className="flex items-center space-x-2">
                <Input id="certifications" value={certificationInput} onChange={(e) => handleArrayInputChange(e, setCertificationInput)} placeholder="Add certification and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArrayItem("certifications", certificationInput, setCertificationInput); } }} />
                <Button type="button" variant="outline" onClick={() => addArrayItem("certifications", certificationInput, setCertificationInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certifications.map(cert => <Badge key={cert} variant="secondary">{cert}<button type="button" className="ml-1" onClick={() => removeArrayItem("certifications", cert)}>x</button></Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {formData.type === "Equipment" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Wrench className="h-5 w-5 mr-2" /> Equipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleChange("serialNumber", e.target.value)} />
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.purchaseDate && "text-muted-foreground"}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.purchaseDate ? format(formData.purchaseDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={formData.purchaseDate} onSelect={(date) => handleDateChange("purchaseDate", date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.warrantyExpiration && "text-muted-foreground"} ${errors.warrantyExpiration ? "border-red-500" : ""}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.warrantyExpiration ? format(formData.warrantyExpiration, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={formData.warrantyExpiration} onSelect={(date) => handleDateChange("warrantyExpiration", date)} disabled={{ before: formData.purchaseDate }} initialFocus />
                        </PopoverContent>
                    </Popover>
                    {errors.warrantyExpiration && <p className="text-red-500 text-sm">{errors.warrantyExpiration}</p>}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lastMaintenanceDate">Last Maintenance</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.lastMaintenanceDate && "text-muted-foreground"}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.lastMaintenanceDate ? format(formData.lastMaintenanceDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={formData.lastMaintenanceDate} onSelect={(date) => handleDateChange("lastMaintenanceDate", date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nextMaintenanceDate">Next Maintenance</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.nextMaintenanceDate && "text-muted-foreground"} ${errors.nextMaintenanceDate ? "border-red-500" : ""}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.nextMaintenanceDate ? format(formData.nextMaintenanceDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={formData.nextMaintenanceDate} onSelect={(date) => handleDateChange("nextMaintenanceDate", date)} disabled={{ before: formData.lastMaintenanceDate }} initialFocus />
                        </PopoverContent>
                    </Popover>
                    {errors.nextMaintenanceDate && <p className="text-red-500 text-sm">{errors.nextMaintenanceDate}</p>}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input id="location" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="ownedBy">Ownership</Label>
                    <Select value={formData.ownedBy} onValueChange={(value) => handleChange("ownedBy", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Company">Company Owned</SelectItem>
                            <SelectItem value="Rented">Rented</SelectItem>
                            <SelectItem value="Leased">Leased</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
          </CardContent>
        </Card>
      )}

      {formData.type === "Material" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Package className="h-5 w-5 mr-2" /> Material Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" value={formData.unit} onChange={(e) => handleChange("unit", e.target.value)} placeholder="e.g., kg, m, unit" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)} min="0" step="any" className={errors.quantity ? "border-red-500" : ""} />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input id="reorderPoint" type="number" value={formData.reorderPoint} onChange={(e) => handleChange("reorderPoint", parseFloat(e.target.value) || 0)} min="0" step="any" className={errors.reorderPoint ? "border-red-500" : ""} />
                    {errors.reorderPoint && <p className="text-red-500 text-sm">{errors.reorderPoint}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input id="supplier" value={formData.supplier} onChange={(e) => handleChange("supplier", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="materialLocation">Storage Location</Label>
                    <Input id="materialLocation" value={formData.materialLocation} onChange={(e) => handleChange("materialLocation", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.expirationDate && "text-muted-foreground"}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.expirationDate ? format(formData.expirationDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={formData.expirationDate} onSelect={(date) => handleDateChange("expirationDate", date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error message */} 
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Actions */} 
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || parentIsSaving}>Cancel</Button>
        <Button type="submit" disabled={isSaving || parentIsSaving}>
          {(isSaving || parentIsSaving) ? "Saving..." : resourceData ? "Update Resource" : "Add Resource"}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
