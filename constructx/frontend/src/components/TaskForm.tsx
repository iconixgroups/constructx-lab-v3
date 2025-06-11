import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, Link, Paperclip, Clock, Users, Tag } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";

// Mock API (replace with actual API calls)
const mockApi = {
    getUsers: async () => [
        { id: "user1", name: "Alice Smith" },
        { id: "user2", name: "Bob Johnson" },
        { id: "user3", name: "Charlie Brown" },
        { id: "user4", name: "Diana Prince" },
    ],
    getTaskStatuses: async () => ["Not Started", "In Progress", "On Hold", "Completed", "Cancelled"],
    getTaskPriorities: async () => ["Low", "Medium", "High", "Critical"],
    getProjectPhases: async (projectId) => [
        { id: "phase1", name: "Foundation" },
        { id: "phase2", name: "Structure" },
        { id: "phase3", name: "Exterior" },
        { id: "phase4", name: "Interior & Finishing" },
        { id: "phase5", name: "Handover" },
    ],
    getParentTasks: async (projectId, currentTaskId = null) => {
        // Fetch tasks that can be parents (exclude current task and its descendants)
        let tasks = [
            { id: "task1", title: "Setup Project Structure" },
            { id: "task2", title: "Develop Foundation Plan" },
            { id: "task3", title: "Order Steel Beams" },
            { id: "task4", title: "Site Preparation" },
            { id: "task5", title: "Client Meeting - Phase 1 Review" },
            { id: "task6", title: "Submit Permit Application" },
        ];
        if (currentTaskId) {
            tasks = tasks.filter(t => t.id !== currentTaskId);
            // Add logic to filter out descendants if necessary
        }
        return tasks;
    },
    // Mock save function
    saveTask: async (taskData) => {
        console.log("Saving task data:", taskData);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...taskData, id: taskData.id || `task_${Math.random().toString(36).substring(7)}`, updatedAt: new Date().toISOString() };
    }
};

const TaskForm = ({ initialData, projectId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        projectId: projectId,
        phaseId: initialData?.phaseId || "",
        parentTaskId: initialData?.parentTaskId || "",
        status: initialData?.status || "Not Started",
        priority: initialData?.priority || "Medium",
        assignedTo: initialData?.assignedTo?.id || "",
        startDate: initialData?.startDate ? parseISO(initialData.startDate) : null,
        dueDate: initialData?.dueDate ? parseISO(initialData.dueDate) : null,
        estimatedHours: initialData?.estimatedHours || "",
        tags: initialData?.tags ? initialData.tags.join(", ") : "", // Join tags for input
    });
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState({ users: [], statuses: [], priorities: [], phases: [], parentTasks: [] });

    // Fetch options for dropdowns
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [users, statuses, priorities, phases, parentTasks] = await Promise.all([
                    mockApi.getUsers(),
                    mockApi.getTaskStatuses(),
                    mockApi.getTaskPriorities(),
                    mockApi.getProjectPhases(projectId),
                    mockApi.getParentTasks(projectId, initialData?.id),
                ]);
                setOptions({ users, statuses, priorities, phases, parentTasks });
            } catch (error) {
                console.error("Failed to load form options:", error);
                // Handle error display
            }
        };
        fetchOptions();
    }, [projectId, initialData?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert("Task Title is required.");
            return;
        }
        setIsLoading(true);
        try {
            const dataToSave = {
                ...formData,
                id: initialData?.id, // Include ID if editing
                estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
                startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : null,
                dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : null,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag), // Split tags back into array
            };
            const savedTask = await mockApi.saveTask(dataToSave);
            onSave(savedTask);
        } catch (error) {
            console.error("Failed to save task:", error);
            alert("Error saving task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1 max-h-[70vh] overflow-y-auto pr-3">
            {/* Title */}
            <div>
                <label htmlFor="taskTitle" className="text-sm font-medium">Title*</label>
                <Input id="taskTitle" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter task title" />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="taskDescription" className="text-sm font-medium">Description</label>
                <Textarea id="taskDescription" name="description" value={formData.description} onChange={handleChange} placeholder="Add task details" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                    <label htmlFor="taskStatus" className="text-sm font-medium">Status</label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger id="taskStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                            {options.statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority */}
                <div>
                    <label htmlFor="taskPriority" className="text-sm font-medium">Priority</label>
                    <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                        <SelectTrigger id="taskPriority"><SelectValue placeholder="Select priority" /></SelectTrigger>
                        <SelectContent>
                            {options.priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assignee */}
                <div>
                    <label htmlFor="taskAssignee" className="text-sm font-medium">Assignee</label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleSelectChange("assignedTo", value)}>
                        <SelectTrigger id="taskAssignee"><SelectValue placeholder="Assign user" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            {options.users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Estimated Hours */}
                <div>
                    <label htmlFor="taskEstimatedHours" className="text-sm font-medium">Estimated Hours</label>
                    <Input id="taskEstimatedHours" name="estimatedHours" type="number" step="0.5" min="0" value={formData.estimatedHours} onChange={handleChange} placeholder="e.g., 8" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                    <label htmlFor="taskStartDate" className="text-sm font-medium">Start Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a start date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.startDate} onSelect={(d) => handleDateChange("startDate", d)} initialFocus /></PopoverContent>
                    </Popover>
                </div>

                {/* Due Date */}
                <div>
                    <label htmlFor="taskDueDate" className="text-sm font-medium">Due Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.dueDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a due date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.dueDate} onSelect={(d) => handleDateChange("dueDate", d)} initialFocus /></PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Phase */}
                <div>
                    <label htmlFor="taskPhase" className="text-sm font-medium">Project Phase</label>
                    <Select value={formData.phaseId} onValueChange={(value) => handleSelectChange("phaseId", value)}>
                        <SelectTrigger id="taskPhase"><SelectValue placeholder="Select phase (optional)" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {options.phases.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Parent Task */}
                <div>
                    <label htmlFor="taskParent" className="text-sm font-medium">Parent Task</label>
                    <Select value={formData.parentTaskId} onValueChange={(value) => handleSelectChange("parentTaskId", value)}>
                        <SelectTrigger id="taskParent"><SelectValue placeholder="Select parent task (optional)" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {options.parentTasks.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tags */}
            <div>
                <label htmlFor="taskTags" className="text-sm font-medium">Tags</label>
                <Input id="taskTags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., design, client-approval, urgent" />
                <p className="text-xs text-muted-foreground mt-1">Separate tags with commas.</p>
            </div>

            {/* Add sections for Dependencies, Attachments if needed directly in the form */}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : (initialData?.id ? "Save Changes" : "Create Task")}</Button>
            </div>
        </form>
    );
};

export default TaskForm;

