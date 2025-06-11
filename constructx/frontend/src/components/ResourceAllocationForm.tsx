import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library

const ResourceAllocationForm = ({ resourceId, allocationData = null, onSave, onCancel, isSaving: parentIsSaving }) => {
  const [formData, setFormData] = useState({
    projectId: "",
    taskId: "",
    startDate: null,
    endDate: null,
    quantity: 1,
    utilization: 100,
    notes: "",
    status: "Planned"
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [errors, setErrors] = useState({});

  // Load tasks based on project
  const loadTasks = useCallback(async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    try {
      const tasksData = await resourceService.getProjectTasks(projectId);
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
      toast.error("Failed to load project tasks");
    }
  }, []);

  // Check for conflicts
  const checkConflicts = useCallback(async (startDate, endDate) => {
    if (!resourceId || !startDate || !endDate) return;
    setConflictWarning(null);
    try {
      const result = await resourceService.checkAllocationConflicts(
        resourceId, 
        startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate instanceof Date ? endDate.toISOString() : endDate
      );
      if (result.hasConflict) {
        setConflictWarning(`Potential conflict with: ${result.conflictingAllocation}`);
      }
    } catch (error) {
      console.error("Failed to check conflicts:", error);
      // Don't show error toast for conflict checks - just log it
    }
  }, [resourceId]);

  // Load initial data and dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const [projectsData, statusesData] = await Promise.all([
          resourceService.getProjects(),
          resourceService.getAllocationStatuses()
        ]);
        setProjects(projectsData || []);
        setStatuses(statusesData || []);

        if (allocationData) {
          // Parse date strings into Date objects if needed
          const parsedData = { ...allocationData };
          if (typeof parsedData.startDate === 'string') {
            try {
              parsedData.startDate = parseISO(parsedData.startDate);
            } catch (e) {
              console.warn("Failed to parse start date:", parsedData.startDate);
              parsedData.startDate = null;
            }
          }
          if (typeof parsedData.endDate === 'string') {
            try {
              parsedData.endDate = parseISO(parsedData.endDate);
            } catch (e) {
              console.warn("Failed to parse end date:", parsedData.endDate);
              parsedData.endDate = null;
            }
          }
          
          setFormData(prev => ({
            ...prev,
            ...parsedData
          }));
          
          if (parsedData.projectId) {
            await loadTasks(parsedData.projectId);
          }
        } else {
          // Set default status for new allocation
          setFormData(prev => ({ 
            ...prev, 
            status: statusesData?.[0] || "Planned" 
          }));
        }
      } catch (error) {
        console.error("Failed to load allocation options:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to load options";
        setErrors(prev => ({ ...prev, load: errorMsg }));
        toast.error("Failed to load allocation form options");
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [allocationData, loadTasks]);

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
    
    // Check for conflicts when dates change
    if ((field === "startDate" || field === "endDate") && formData.startDate && formData.endDate) {
      const start = field === "startDate" ? value : formData.startDate;
      const end = field === "endDate" ? value : formData.endDate;
      checkConflicts(start, end);
    }
  };
  
  // Handle date changes
  const handleDateChange = (field, date) => {
    handleChange(field, date);
    // Check conflicts immediately after date change
    const otherDateField = field === "startDate" ? "endDate" : "startDate";
    if (date && formData[otherDateField]) {
      const start = field === "startDate" ? date : formData.startDate;
      const end = field === "endDate" ? date : formData.endDate;
      checkConflicts(start, end);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = "Project is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date cannot be before start date";
    }
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be positive";
    if (formData.utilization < 0 || formData.utilization > 100) newErrors.utilization = "Utilization must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Please fix the errors in the form");
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      // Format dates to ISO strings for API
      const saveData = {
        ...formData,
        resourceId, // Ensure resourceId is included
        startDate: formData.startDate instanceof Date ? formData.startDate.toISOString() : formData.startDate,
        endDate: formData.endDate instanceof Date ? formData.endDate.toISOString() : formData.endDate,
      };
      
      if (allocationData?.id) {
        // Update existing allocation
        await resourceService.updateAllocation(allocationData.id, saveData);
        toast.success("Allocation updated successfully");
      } else {
        // Create new allocation
        await resourceService.createAllocation(resourceId, saveData);
        toast.success("Allocation created successfully");
      }
      
      onSave(saveData); // Notify parent component
    } catch (error) {
      console.error("Failed to save allocation:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to save allocation";
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
    return (
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
        {errors.load}
        <Button variant="outline" size="sm" onClick={onCancel} className="mt-4">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="projectId">Project <span className="text-red-500">*</span></Label>
        <Select value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
          <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(proj => <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-red-500 text-sm">{errors.projectId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskId">Task (Optional)</Label>
        <Select value={formData.taskId} onValueChange={(value) => handleChange("taskId", value)} disabled={tasks.length === 0 || !formData.projectId}>
          <SelectTrigger>
            <SelectValue placeholder={!formData.projectId ? "Select a project first" : tasks.length === 0 ? "No tasks available" : "Select task"} />
          </SelectTrigger>
          <SelectContent>
            {tasks.map(task => <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!formData.startDate && "text-muted-foreground"} ${errors.startDate ? "border-red-500" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!formData.endDate && "text-muted-foreground"} ${errors.endDate ? "border-red-500" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                disabled={{ before: formData.startDate }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </div>
      </div>
      
      {conflictWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <p className="text-yellow-800 text-sm">{conflictWarning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            type="number" 
            value={formData.quantity} 
            onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)} 
            min="1" 
            className={errors.quantity ? "border-red-500" : ""} 
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="utilization">Utilization (%)</Label>
          <Input 
            id="utilization" 
            type="number" 
            value={formData.utilization} 
            onChange={(e) => handleChange("utilization", parseInt(e.target.value) || 0)} 
            min="0" 
            max="100" 
            className={errors.utilization ? "border-red-500" : ""} 
          />
           {errors.utilization && <p className="text-red-500 text-sm">{errors.utilization}</p>}
        </div>
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
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || parentIsSaving}>Cancel</Button>
        <Button type="submit" disabled={isSaving || parentIsSaving}>
          {(isSaving || parentIsSaving) ? "Saving..." : allocationData ? "Update Allocation" : "Add Allocation"}
        </Button>
      </div>
    </form>
  );
};

export default ResourceAllocationForm;
