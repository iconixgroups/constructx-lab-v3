import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./ui/date-picker"; // Assuming this component exists
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { Calendar, Users, AlertCircle } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: "user1", name: "John Smith", role: "Project Manager" },
      { id: "user2", name: "Emily Johnson", role: "Designer" },
      { id: "user3", name: "Michael Chen", role: "Engineer" },
      { id: "user4", name: "Sarah Wilson", role: "Site Supervisor" },
      { id: "user5", name: "Robert Davis", role: "Contractor" },
      { id: "user6", name: "Jessica Brown", role: "Architect" }
    ];
  },
  getScheduleItems: async (scheduleId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: "item1", name: "Project Planning Phase", type: "Phase" },
      { id: "item2", name: "Foundation Work", type: "Phase" },
      { id: "item3", name: "Framing", type: "Phase" },
      { id: "item1-1", name: "Requirements Gathering", type: "Task" },
      { id: "item1-2", name: "Initial Design", type: "Task" },
      { id: "item1-3", name: "Planning Complete", type: "Milestone" }
    ];
  }
};

// Helper functions
const formatDate = (date) => {
  if (!date) return "";
  return date.toISOString().split('T')[0];
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
};

const ScheduleItemForm = ({ 
  scheduleId, 
  itemId = null, 
  parentItemId = null, 
  onSave, 
  onCancel 
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Task", // Task, Milestone, Phase, Summary
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    duration: 1,
    completionPercentage: 0,
    status: "Not Started", // Not Started, In Progress, Completed, On Hold, Delayed
    assignedTo: "",
    parentItemId: parentItemId || "",
    order: 0
  });
  
  // Additional state
  const [users, setUsers] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [autoCalculateDuration, setAutoCalculateDuration] = useState(true);
  const [autoCalculateEndDate, setAutoCalculateEndDate] = useState(false);
  
  // Load existing item data if editing
  useEffect(() => {
    if (itemId) {
      setIsLoading(true);
      // In a real app, fetch the item data
      // For now, we'll use mock data
      setTimeout(() => {
        setFormData({
          name: "Sample Task",
          description: "This is a sample task description",
          type: "Task",
          startDate: "2024-06-10",
          endDate: "2024-06-20",
          duration: 11,
          completionPercentage: 0,
          status: "Not Started",
          assignedTo: "user3",
          parentItemId: "item2",
          order: 1
        });
        setIsLoading(false);
      }, 500);
    }
  }, [itemId]);
  
  // Load users and schedule items for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, itemsData] = await Promise.all([
          mockApi.getUsers(),
          mockApi.getScheduleItems(scheduleId)
        ]);
        
        setUsers(usersData);
        // Filter out the current item if editing
        setScheduleItems(itemsData.filter(item => item.id !== itemId));
      } catch (error) {
        console.error("Failed to load form data:", error);
      }
    };
    
    loadData();
  }, [scheduleId, itemId]);
  
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
    
    // Special handling for dates and duration
    if (field === "startDate" || field === "endDate" || field === "duration") {
      handleDateDurationChange(field, value);
    }
    
    // For milestones, ensure start and end dates are the same
    if (field === "type" && value === "Milestone") {
      const startDate = formData.startDate;
      setFormData(prev => ({
        ...prev,
        endDate: startDate,
        duration: 0
      }));
    }
  };
  
  // Handle date and duration calculations
  const handleDateDurationChange = (field, value) => {
    if (formData.type === "Milestone") {
      // For milestones, start and end dates are the same
      if (field === "startDate") {
        setFormData(prev => ({
          ...prev,
          endDate: value,
          duration: 0
        }));
      }
      return;
    }
    
    if (autoCalculateDuration && (field === "startDate" || field === "endDate")) {
      // Calculate duration based on start and end dates
      const startDate = field === "startDate" ? value : formData.startDate;
      const endDate = field === "endDate" ? value : formData.endDate;
      
      if (startDate && endDate) {
        const duration = calculateDuration(startDate, endDate);
        setFormData(prev => ({
          ...prev,
          duration
        }));
      }
    } else if (autoCalculateEndDate && field === "duration") {
      // Calculate end date based on start date and duration
      const { startDate } = formData;
      if (startDate && value > 0) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(value) - 1); // -1 because duration includes start day
        
        setFormData(prev => ({
          ...prev,
          endDate: formatDate(end)
        }));
      }
    } else if (autoCalculateEndDate && field === "startDate") {
      // Recalculate end date when start date changes
      const { duration } = formData;
      if (value && duration > 0) {
        const start = new Date(value);
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(duration) - 1);
        
        setFormData(prev => ({
          ...prev,
          endDate: formatDate(end)
        }));
      }
    }
  };
  
  // Toggle calculation modes
  const toggleAutoCalculateDuration = () => {
    setAutoCalculateDuration(prev => !prev);
    setAutoCalculateEndDate(false);
  };
  
  const toggleAutoCalculateEndDate = () => {
    setAutoCalculateEndDate(prev => !prev);
    setAutoCalculateDuration(false);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (formData.type !== "Milestone" && !formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    
    if (formData.type !== "Milestone" && parseDate(formData.endDate) < parseDate(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, save the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error("Failed to save schedule item:", error);
      setErrors(prev => ({
        ...prev,
        submit: "Failed to save. Please try again."
      }));
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Loading item data...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter item name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">
              Item Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Milestone">Milestone</SelectItem>
                <SelectItem value="Phase">Phase</SelectItem>
                <SelectItem value="Summary">Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                  )}
                </div>
                
                {formData.type !== "Milestone" && (
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      disabled={formData.type === "Milestone" || autoCalculateEndDate}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm">{errors.endDate}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.type !== "Milestone" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center">
                      Duration (days)
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => handleChange("duration", e.target.value)}
                        disabled={formData.type === "Milestone" || autoCalculateDuration}
                      />
                    </div>
                  </div>
                )}
                
                {formData.type !== "Milestone" && (
                  <div className="space-y-2">
                    <Label>Calculation Mode</Label>
                    <RadioGroup 
                      defaultValue={autoCalculateDuration ? "auto-duration" : autoCalculateEndDate ? "auto-end" : "manual"}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="auto-duration" 
                          id="auto-duration"
                          checked={autoCalculateDuration}
                          onClick={toggleAutoCalculateDuration}
                        />
                        <Label htmlFor="auto-duration" className="text-sm cursor-pointer">
                          Auto-calculate duration from dates
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="auto-end" 
                          id="auto-end"
                          checked={autoCalculateEndDate}
                          onClick={toggleAutoCalculateEndDate}
                        />
                        <Label htmlFor="auto-end" className="text-sm cursor-pointer">
                          Auto-calculate end date from duration
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="manual" 
                          id="manual"
                          checked={!autoCalculateDuration && !autoCalculateEndDate}
                          onClick={() => {
                            setAutoCalculateDuration(false);
                            setAutoCalculateEndDate(false);
                          }}
                        />
                        <Label htmlFor="manual" className="text-sm cursor-pointer">
                          Manual entry
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Assigned To
            </Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => handleChange("assignedTo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentItemId">Parent Item</Label>
            <Select
              value={formData.parentItemId}
              onValueChange={(value) => handleChange("parentItemId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Parent (Top Level)</SelectItem>
                {scheduleItems
                  .filter(item => item.type === "Phase" || item.type === "Summary")
                  .map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {formData.status !== "Not Started" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="completionPercentage">Completion Percentage</Label>
              <span>{formData.completionPercentage}%</span>
            </div>
            <Slider
              id="completionPercentage"
              min={0}
              max={100}
              step={5}
              value={[formData.completionPercentage]}
              onValueChange={(value) => handleChange("completionPercentage", value[0])}
            />
          </div>
        )}
        
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : itemId ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleItemForm;
