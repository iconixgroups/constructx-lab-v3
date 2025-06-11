import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PlusCircle, Trash2, GitBranch, ArrowRight } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getTaskDependencies: async (taskId) => {
        console.log("Fetching dependencies for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock dependencies
        return [
            { id: "dep1", predecessorTaskId: "task1", successorTaskId: taskId, type: "Finish-to-Start", lag: 0, predecessorTask: { id: "task1", title: "Setup Project Structure" } },
            { id: "dep2", predecessorTaskId: taskId, successorTaskId: "task3", type: "Finish-to-Start", lag: 2, successorTask: { id: "task3", title: "Order Steel Beams" } },
        ].filter(dep => dep.predecessorTaskId === taskId || dep.successorTaskId === taskId);
    },
    getTasksForDependency: async (projectId, currentTaskId) => {
        // Fetch tasks that can be linked (exclude current task)
        console.log("Fetching tasks for dependency linking:", projectId, currentTaskId);
        await new Promise(resolve => setTimeout(resolve, 200));
        let tasks = [
            { id: "task1", title: "Setup Project Structure" },
            { id: "task2", title: "Develop Foundation Plan" },
            { id: "task3", title: "Order Steel Beams" },
            { id: "task4", title: "Site Preparation" },
            { id: "task5", title: "Client Meeting - Phase 1 Review" },
            { id: "task6", title: "Submit Permit Application" },
        ];
        return tasks.filter(t => t.id !== currentTaskId);
    },
    getDependencyTypes: async () => ["Finish-to-Start", "Start-to-Start", "Finish-to-Finish", "Start-to-Finish"],
    addDependency: async (taskId, dependencyData) => {
        console.log("Adding dependency:", taskId, dependencyData);
        await new Promise(resolve => setTimeout(resolve, 300));
        const newDep = { 
            ...dependencyData, 
            id: `dep${Math.random().toString(36).substring(7)}`, 
            // Need to fetch task details for display
            predecessorTask: dependencyData.predecessorTaskId ? { id: dependencyData.predecessorTaskId, title: "Fetched Predecessor" } : null,
            successorTask: dependencyData.successorTaskId ? { id: dependencyData.successorTaskId, title: "Fetched Successor" } : null,
        };
        return newDep;
    },
    removeDependency: async (dependencyId) => {
        console.log("Removing dependency:", dependencyId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
};

const DependencyForm = ({ taskId, onSave, onCancel, availableTasks, dependencyTypes }) => {
    const [formData, setFormData] = useState({
        linkedTaskId: "",
        relationship: "predecessor", // "predecessor" or "successor"
        type: "Finish-to-Start",
        lag: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.linkedTaskId || !formData.type) {
            alert("Please select a task and dependency type.");
            return;
        }
        const dependencyData = {
            predecessorTaskId: formData.relationship === "predecessor" ? formData.linkedTaskId : taskId,
            successorTaskId: formData.relationship === "successor" ? formData.linkedTaskId : taskId,
            type: formData.type,
            lag: parseInt(formData.lag) || 0,
        };
        onSave(dependencyData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/40 mb-4">
            <h3 className="text-lg font-semibold">Add Dependency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="depRelationship" className="text-sm font-medium">Relationship</label>
                    <Select value={formData.relationship} onValueChange={(value) => handleSelectChange("relationship", value)}>
                        <SelectTrigger id="depRelationship"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="predecessor">This task depends on (Predecessor)</SelectItem>
                            <SelectItem value="successor">Task depends on this task (Successor)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="depLinkedTask" className="text-sm font-medium">{formData.relationship === "predecessor" ? "Predecessor Task" : "Successor Task"}*</label>
                    <Select value={formData.linkedTaskId} onValueChange={(value) => handleSelectChange("linkedTaskId", value)} required>
                        <SelectTrigger id="depLinkedTask"><SelectValue placeholder="Select task" /></SelectTrigger>
                        <SelectContent>
                            {availableTasks.map(task => <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="depType" className="text-sm font-medium">Type*</label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                        <SelectTrigger id="depType"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            {dependencyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="depLag" className="text-sm font-medium">Lag (days)</label>
                    <Input id="depLag" name="lag" type="number" value={formData.lag} onChange={handleChange} />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Add Dependency</Button>
            </div>
        </form>
    );
};

const TaskDependenciesComponent = ({ taskId, initialDependencies }) => {
    const [dependencies, setDependencies] = useState(initialDependencies || []);
    const [isLoading, setIsLoading] = useState(!initialDependencies);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [dependencyTypes, setDependencyTypes] = useState([]);

    const fetchDependencies = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setError(null);
        try {
            // Assume projectId is available or fetch task details first to get it
            const taskDetails = await mockApi.getTaskDetails(taskId); // Need projectId
            const projectId = taskDetails.projectId;

            const [fetchedDeps, fetchedTasks, fetchedTypes] = await Promise.all([
                mockApi.getTaskDependencies(taskId),
                mockApi.getTasksForDependency(projectId, taskId),
                mockApi.getDependencyTypes(),
            ]);
            setDependencies(fetchedDeps);
            setAvailableTasks(fetchedTasks);
            setDependencyTypes(fetchedTypes);
        } catch (err) {
            console.error("Error fetching dependencies data:", err);
            setError("Failed to load dependencies.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        if (!initialDependencies) {
            fetchDependencies();
        } else {
            // Still fetch available tasks and types if deps are provided
            const fetchOptions = async () => {
                 try {
                    const taskDetails = await mockApi.getTaskDetails(taskId);
                    const projectId = taskDetails.projectId;
                    const [fetchedTasks, fetchedTypes] = await Promise.all([
                        mockApi.getTasksForDependency(projectId, taskId),
                        mockApi.getDependencyTypes(),
                    ]);
                    setAvailableTasks(fetchedTasks);
                    setDependencyTypes(fetchedTypes);
                } catch (err) {
                    console.error("Error fetching dependency options:", err);
                }
            };
            fetchOptions();
        }
    }, [taskId, initialDependencies, fetchDependencies]);

    const handleAddDependency = async (dependencyData) => {
        try {
            const addedDep = await mockApi.addDependency(taskId, dependencyData);
            // Refetch or update state locally
            fetchDependencies(); // Easiest way to get updated list with task titles
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding dependency:", err);
            alert("Failed to add dependency.");
        }
    };

    const handleRemoveDependency = async (dependencyId) => {
        if (window.confirm("Are you sure you want to remove this dependency?")) {
            try {
                await mockApi.removeDependency(dependencyId);
                setDependencies(prev => prev.filter(dep => dep.id !== dependencyId));
            } catch (err) {
                console.error("Error removing dependency:", err);
                alert("Failed to remove dependency.");
            }
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Dependencies</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Cancel" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Dependency</>}
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <DependencyForm 
                        taskId={taskId} 
                        onSave={handleAddDependency} 
                        onCancel={() => setShowAddForm(false)} 
                        availableTasks={availableTasks} 
                        dependencyTypes={dependencyTypes} 
                    />
                )}

                {isLoading && <div className="text-center p-4">Loading dependencies...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && dependencies.length === 0 && !showAddForm && (
                    <div className="text-center p-8 text-muted-foreground">No dependencies defined for this task.</div>
                )}

                {!isLoading && !error && dependencies.length > 0 && (
                    <div className="mt-4 border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Predecessor</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Successor</TableHead>
                                    <TableHead>Lag</TableHead>
                                    <TableHead className="w-[50px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dependencies.map((dep) => (
                                    <TableRow key={dep.id}>
                                        <TableCell className="font-medium">
                                            {dep.predecessorTask?.title || dep.predecessorTaskId}
                                            {dep.predecessorTaskId === taskId && " (This Task)"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <GitBranch className="h-3 w-3" /> {dep.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {dep.successorTask?.title || dep.successorTaskId}
                                            {dep.successorTaskId === taskId && " (This Task)"}
                                        </TableCell>
                                        <TableCell>{dep.lag}d</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveDependency(dep.id)} title="Remove Dependency">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                 {/* Placeholder for Gantt/Network Diagram View */}
                 <div className="mt-6 p-4 border rounded-lg text-center text-muted-foreground">
                    Dependency Visualization (Gantt/Network) placeholder.
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskDependenciesComponent;

