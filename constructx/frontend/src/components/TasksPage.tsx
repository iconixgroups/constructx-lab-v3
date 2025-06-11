import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle, List, KanbanSquare, Search, Filter } from "lucide-react";
import TasksList from "./TasksList"; // Table view
import TasksBoard from "./TasksBoard"; // Kanban board view
import TaskForm from "./TaskForm"; // Modal or drawer for adding/editing tasks
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useParams } from "react-router-dom"; // To get projectId if needed

// Mock API functions (replace with actual API calls)
const mockApi = {
    getTasks: async (projectId, filters) => {
        console.log(`Fetching tasks for project ${projectId} with filters:`, filters);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate filtering/sorting based on filters object
        return [
            { id: "task1", projectId: projectId, title: "Setup Project Structure", status: "Completed", priority: "High", assignedTo: { id: "user1", name: "Alice Smith" }, dueDate: "2024-01-20", estimatedHours: 8, actualHours: 6, completionPercentage: 100 },
            { id: "task2", projectId: projectId, title: "Develop Foundation Plan", status: "In Progress", priority: "High", assignedTo: { id: "user3", name: "Charlie Brown" }, dueDate: "2024-02-15", estimatedHours: 40, actualHours: 25, completionPercentage: 60 },
            { id: "task3", projectId: projectId, title: "Order Steel Beams", status: "Not Started", priority: "Medium", assignedTo: { id: "user4", name: "Diana Prince" }, dueDate: "2024-03-01", estimatedHours: 4, actualHours: 0, completionPercentage: 0 },
            { id: "task4", projectId: projectId, title: "Site Preparation", status: "In Progress", priority: "Medium", assignedTo: { id: "user4", name: "Diana Prince" }, dueDate: "2024-02-28", estimatedHours: 80, actualHours: 50, completionPercentage: 62 },
            { id: "task5", projectId: projectId, title: "Client Meeting - Phase 1 Review", status: "Completed", priority: "Low", assignedTo: { id: "user1", name: "Alice Smith" }, dueDate: "2024-03-10", estimatedHours: 2, actualHours: 2, completionPercentage: 100 },
            { id: "task6", projectId: projectId, title: "Submit Permit Application", status: "On Hold", priority: "High", assignedTo: { id: "user2", name: "Bob Johnson" }, dueDate: "2024-02-01", estimatedHours: 16, actualHours: 4, completionPercentage: 10 },
        ];
    },
    getTaskStatuses: async () => ["Not Started", "In Progress", "On Hold", "Completed", "Cancelled"],
    getTaskPriorities: async () => ["Low", "Medium", "High", "Critical"],
    getUsers: async () => [
        { id: "user1", name: "Alice Smith" },
        { id: "user2", name: "Bob Johnson" },
        { id: "user3", name: "Charlie Brown" },
        { id: "user4", name: "Diana Prince" },
    ],
    // Add other mock API calls: createTask, updateTask, deleteTask, etc.
};

const TasksPage = () => {
    const { projectId } = useParams(); // Get projectId from URL if viewing tasks for a specific project
    const [viewMode, setViewMode] = useState("board"); // Default to board view
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "", priority: "", assignedTo: "" });
    const [sort, setSort] = useState({ field: "dueDate", order: "asc" }); // Default sort for tasks
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Task object to edit, null for new

    // Fetch users, statuses, priorities for filters
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [fetchedUsers, fetchedStatuses, fetchedPriorities] = await Promise.all([
                    mockApi.getUsers(),
                    mockApi.getTaskStatuses(),
                    mockApi.getTaskPriorities(),
                ]);
                setUsers(fetchedUsers);
                setStatuses(fetchedStatuses);
                setPriorities(fetchedPriorities);
            } catch (err) {
                console.error("Error fetching filter options:", err);
            }
        };
        fetchFilterOptions();
    }, []);

    const fetchTasks = useCallback(async () => {
        // Use a default projectId if not provided by URL, or handle accordingly
        const currentProjectId = projectId || "proj1"; // Example: default to proj1 if no ID in URL
        if (!currentProjectId) {
            setError("Project ID is required to view tasks.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const params = {
                search: searchTerm,
                ...filters,
                sortBy: sort.field,
                sortOrder: sort.order,
                // Add pagination params if needed
            };
            const data = await mockApi.getTasks(currentProjectId, params);
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("Failed to load tasks.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId, searchTerm, filters, sort]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // Refetch when filters/sort/search change

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleSortChange = (value) => {
        const [field, order] = value.split("_");
        setSort({ field, order });
    };

    const openAddTaskForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const openEditTaskForm = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleFormSave = (taskData) => {
        // Replace with actual API call (create or update)
        console.log("Saving task:", taskData);
        setIsFormOpen(false);
        setEditingTask(null);
        fetchTasks(); // Refresh list after save
    };

    const handleTaskDelete = (taskId) => {
        // Replace with actual API call
        if (window.confirm("Are you sure you want to delete this task?")) {
            console.log("Deleting task:", taskId);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            // Or call fetchTasks();
        }
    };

    const handleTaskStatusUpdate = (taskId, newStatus) => {
        // API call to update status, then update local state or refetch
        console.log(`Updating task ${taskId} status to ${newStatus}`);
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
        // Consider refetching if backend logic is complex
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-semibold">Tasks Management {projectId ? `(Project: ${projectId})` : ""}</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddTaskForm}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] lg:max-w-[900px]">
                        <DialogHeader>
                            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                        </DialogHeader>
                        <TaskForm
                            initialData={editingTask}
                            projectId={projectId || "proj1"} // Pass current project ID
                            onSave={handleFormSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and View Toggle */} 
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2 flex-wrap">
                <div className="flex gap-2 flex-grow md:flex-grow-0">
                    <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                        prefix={<Search className="h-4 w-4 text-muted-foreground" />} 
                    />
                    {/* Add Filter Button/Dropdown here */}
                    <Button variant="outline" size="icon" title="Filters"><Filter className="h-4 w-4" /></Button>
                </div>
                
                {/* Simple Filters Example */} 
                <div className="flex gap-2 flex-wrap">
                     <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Priorities</SelectItem>
                            {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange("assignedTo", value)}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Assignee" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Assignees</SelectItem>
                            {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto mt-2 md:mt-0">
                    <TabsList>
                        <TabsTrigger value="board"><KanbanSquare className="mr-2 h-4 w-4" /> Board</TabsTrigger>
                        <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Content Area */} 
            <div className="mt-4">
                {isLoading && <div className="text-center p-4">Loading tasks...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && (
                    viewMode === "board" ? (
                        <TasksBoard 
                            tasks={tasks} 
                            statuses={statuses} // Pass statuses for columns
                            onEditTask={openEditTaskForm} 
                            onDeleteTask={handleTaskDelete} 
                            onStatusChange={handleTaskStatusUpdate} // For drag-and-drop
                        />
                    ) : (
                        <TasksList 
                            tasks={tasks} 
                            onEditTask={openEditTaskForm} 
                            onDeleteTask={handleTaskDelete} 
                            // Pass sort config and handler if list handles sorting
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default TasksPage;

