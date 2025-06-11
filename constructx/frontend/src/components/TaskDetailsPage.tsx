import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Edit, Trash2, Calendar, User, Clock, Tag, Paperclip, MessageSquare, GitBranch, Timer } from "lucide-react";
import { format, parseISO } from "date-fns";
import TaskDependenciesComponent from "./TaskDependenciesComponent";
import TaskCommentsSection from "./TaskCommentsSection";
import TaskAttachmentsSection from "./TaskAttachmentsSection";
import TimeTrackingComponent from "./TimeTrackingComponent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import TaskForm from "./TaskForm";

// Mock API (replace with actual API calls)
const mockApi = {
    getTaskDetails: async (taskId) => {
        console.log("Fetching details for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Find task from a mock list or return a detailed mock object
        const tasks = [
            { id: "task1", projectId: "proj1", title: "Setup Project Structure", description: "Initialize project folders, Git repository, and basic configuration.", status: "Completed", priority: "High", assignedTo: { id: "user1", name: "Alice Smith" }, createdBy: { id: "user1", name: "Alice Smith" }, startDate: "2024-01-15", dueDate: "2024-01-20", completedDate: "2024-01-19", estimatedHours: 8, actualHours: 6, completionPercentage: 100, tags: ["setup", "config"], createdAt: "2024-01-14T10:00:00Z", updatedAt: "2024-01-19T15:30:00Z" },
            { id: "task2", projectId: "proj1", title: "Develop Foundation Plan", description: "Create detailed architectural plans for the building foundation.", status: "In Progress", priority: "High", assignedTo: { id: "user3", name: "Charlie Brown" }, createdBy: { id: "user1", name: "Alice Smith" }, startDate: "2024-01-21", dueDate: "2024-02-15", completedDate: null, estimatedHours: 40, actualHours: 25, completionPercentage: 60, tags: ["planning", "architecture"], createdAt: "2024-01-20T11:00:00Z", updatedAt: "2024-02-10T09:00:00Z" },
            // Add other tasks...
        ];
        const task = tasks.find(t => t.id === taskId);
        if (!task) throw new Error("Task not found");
        // Simulate fetching related data
        task.subtasks = []; // Add mock subtasks if needed
        task.dependencies = []; // Add mock dependencies
        task.comments = []; // Add mock comments
        task.attachments = []; // Add mock attachments
        task.timeEntries = []; // Add mock time entries
        return task;
    },
    deleteTask: async (taskId) => {
        console.log("Deleting task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    // Add updateTask mock if needed
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "completed": return "default";
        case "in progress": return "success";
        case "not started": return "secondary";
        case "on hold": return "warning";
        case "cancelled": return "destructive";
        default: return "secondary";
    }
};

// Helper function to determine badge variant based on priority
const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
        case "critical": return "destructive";
        case "high": return "warning";
        case "medium": return "default";
        case "low": return "secondary";
        default: return "secondary";
    }
};

const TaskDetailsPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchTaskDetails = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getTaskDetails(taskId);
            setTask(data);
        } catch (err) {
            console.error("Error fetching task details:", err);
            setError(err.message || "Failed to load task details.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchTaskDetails();
    }, [fetchTaskDetails]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await mockApi.deleteTask(taskId);
                alert("Task deleted successfully.");
                navigate(-1); // Go back to the previous page (likely the tasks list/board)
            } catch (err) {
                console.error("Error deleting task:", err);
                alert("Failed to delete task.");
            }
        }
    };

    const handleFormSave = (savedTaskData) => {
        // Update the task state with the saved data
        setTask(prev => ({ ...prev, ...savedTaskData }));
        setIsFormOpen(false);
        // Optionally, could call fetchTaskDetails() again, but updating locally is faster
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading task details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!task) {
        return <div className="p-8 text-center">Task not found.</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" /> Edit Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] lg:max-w-[900px]">
                            <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                            </DialogHeader>
                            <TaskForm
                                initialData={task} // Pass current task data
                                projectId={task.projectId}
                                onSave={handleFormSave}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                    </Button>
                </div>
            </div>

            {/* Task Title and Key Info */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl mb-1">{task.title}</CardTitle>
                        <div className="flex gap-2 flex-shrink-0 ml-4">
                            <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                        </div>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                        Created by {task.createdBy?.name || "Unknown"} on {task.createdAt ? format(parseISO(task.createdAt), "PP") : "N/A"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Assignee:</strong> {task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Start:</strong> {task.startDate ? format(parseISO(task.startDate), "PP") : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Due:</strong> {task.dueDate ? format(parseISO(task.dueDate), "PP") : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Est. Hours:</strong> {task.estimatedHours ?? "N/A"}h</span>
                    </div>
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-2 col-span-full sm:col-span-1">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                                {task.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="description">Details</TabsTrigger>
                    <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                    <TabsTrigger value="dependencies"><GitBranch className="mr-1 h-4 w-4"/>Dependencies</TabsTrigger>
                    <TabsTrigger value="comments"><MessageSquare className="mr-1 h-4 w-4"/>Comments</TabsTrigger>
                    <TabsTrigger value="attachments"><Paperclip className="mr-1 h-4 w-4"/>Attachments</TabsTrigger>
                    <TabsTrigger value="time"><Timer className="mr-1 h-4 w-4"/>Time Tracking</TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                    <Card>
                        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{task.description || "No description provided."}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subtasks">
                    <Card>
                        <CardHeader><CardTitle>Subtasks</CardTitle></CardHeader>
                        <CardContent>
                            {/* TODO: Implement Subtasks List/Management Component */}
                            <p className="text-sm text-muted-foreground">Subtasks section placeholder.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dependencies">
                    <TaskDependenciesComponent taskId={taskId} initialDependencies={task.dependencies} />
                </TabsContent>

                <TabsContent value="comments">
                    <TaskCommentsSection taskId={taskId} initialComments={task.comments} />
                </TabsContent>

                <TabsContent value="attachments">
                    <TaskAttachmentsSection taskId={taskId} initialAttachments={task.attachments} />
                </TabsContent>

                <TabsContent value="time">
                    <TimeTrackingComponent taskId={taskId} initialTimeEntries={task.timeEntries} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TaskDetailsPage;

