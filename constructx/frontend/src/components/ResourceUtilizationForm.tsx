import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";

// Mock API (replace with actual API calls)
const mockApi = {
  getProjects: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { id: "proj1", name: "Downtown Tower Construction" },
      { id: "proj2", name: "Suburban Housing Development" },
      { id: "proj3", name: "Bridge Renovation Project" }
    ];
  },
  getProjectTasks: async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (projectId === "proj1") return [{ id: "task1-1", name: "Foundation Pouring" }, { id: "task1-5", name: "Structural Steel Erection" }];
    if (projectId === "proj2") return [{ id: "task2-3", name: "Site Grading" }, { id: "task2-4", name: "Utility Installation" }];
    return [];
  },
  // Assume we know the resource type to determine if hours or quantity is needed
  getResourceType: async (resourceId) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      if (resourceId.includes("mat")) return "Material";
      if (resourceId.includes("eqp")) return "Equipment";
      return "Labor";
  }
};

const ResourceUtilizationForm = ({ resourceId, utilizationData = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    hours: 0,
    quantity: 0,
    projectId: "",
    taskId: "",
    notes: ""
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resourceType, setResourceType] = useState("Labor"); // Default or fetch based on resourceId
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load initial data and options
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, resType] = await Promise.all([
          mockApi.getProjects(),
          mockApi.getResourceType(resourceId) // Determine if hours or quantity needed
        ]);
        setProjects(projectsData);
        setResourceType(resType);

        if (utilizationData) {
          setFormData({
            ...formData,
            ...utilizationData,
            date: utilizationData.date ? new Date(utilizationData.date) : new Date(),
          });
          if (utilizationData.projectId) {
            const tasksData = await mockApi.getProjectTasks(utilizationData.projectId);
            setTasks(tasksData);
          }
        }
      } catch (error) {
        console.error("Failed to load utilization form options:", error);
        setErrors(prev => ({ ...prev, load: "Failed to load options" }));
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [resourceId, utilizationData]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Load tasks when project changes
    if (field === "projectId") {
      loadTasks(value);
      setFormData(prev => ({ ...prev, taskId: "" })); // Reset task selection
    }
  };

  // Load tasks based on project
  const loadTasks = async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    try {
      const tasksData = await mockApi.getProjectTasks(projectId);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (resourceType === "Material") {
      if (formData.quantity <= 0) newErrors.quantity = "Quantity must be positive";
    } else {
      if (formData.hours <= 0) newErrors.hours = "Hours must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // In a real app, save data to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Format date back to ISO string if needed by the API
      const saveData = {
          ...formData,
          date: formData.date?.toISOString(),
          id: utilizationData?.id // Include ID if editing
      };
      onSave(saveData);
    } catch (error) {
      console.error("Failed to save utilization record:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to save record" }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!formData.date && "text-muted-foreground"} ${errors.date ? "border-red-500" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => handleChange("date", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      {resourceType === "Material" ? (
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity Used <span className="text-red-500">*</span></Label>
          <Input 
            id="quantity" 
            type="number" 
            value={formData.quantity} 
            onChange={(e) => handleChange("quantity", parseFloat(e.target.value))} 
            min="0" 
            step="any"
            className={errors.quantity ? "border-red-500" : ""} 
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="hours">Hours Used <span className="text-red-500">*</span></Label>
          <Input 
            id="hours" 
            type="number" 
            value={formData.hours} 
            onChange={(e) => handleChange("hours", parseFloat(e.target.value))} 
            min="0" 
            step="0.1"
            className={errors.hours ? "border-red-500" : ""} 
          />
          {errors.hours && <p className="text-red-500 text-sm">{errors.hours}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="projectId">Project (Optional)</Label>
        <Select value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {projects.map(proj => <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskId">Task (Optional)</Label>
        <Select value={formData.taskId} onValueChange={(value) => handleChange("taskId", value)} disabled={tasks.length === 0 || !formData.projectId}>
          <SelectTrigger>
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="">None</SelectItem>
            {tasks.map(task => <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={3} />
      </div>

      {/* Error message */} 
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Actions */} 
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : utilizationData ? "Update Record" : "Record Utilization"}
        </Button>
      </div>
    </form>
  );
};

export default ResourceUtilizationForm;
