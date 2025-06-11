import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { PlusCircle, Trash2, CalendarIcon, Edit, GripVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";
// Consider a Gantt chart library (e.g., dhtmlx-gantt, react-gantt-timeline) or build a simplified one

// Mock API (replace with actual API calls)
const mockApi = {
    getProjectPhases: async (projectId) => {
        console.log("Fetching phases for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock phases if initialPhases aren't provided or need refresh
        return [
            { id: "phase1", projectId: projectId, name: "Foundation", description: "Lay foundation and groundwork", order: 1, startDate: "2024-01-15", endDate: "2024-03-15", status: "Completed", completionPercentage: 100, budget: 500000 },
            { id: "phase2", projectId: projectId, name: "Structure", description: "Build structural frame", order: 2, startDate: "2024-03-16", endDate: "2024-07-31", status: "In Progress", completionPercentage: 75, budget: 1500000 },
            { id: "phase3", projectId: projectId, name: "Exterior", description: "Cladding and windows", order: 3, startDate: "2024-08-01", endDate: "2024-11-30", status: "Not Started", completionPercentage: 0, budget: 1000000 },
            { id: "phase4", projectId: projectId, name: "Interior & Finishing", description: "MEP, drywall, finishes", order: 4, startDate: "2024-12-01", endDate: "2025-05-31", status: "Not Started", completionPercentage: 0, budget: 1800000 },
            { id: "phase5", projectId: projectId, name: "Handover", description: "Final checks and handover", order: 5, startDate: "2025-06-01", endDate: "2025-06-30", status: "Not Started", completionPercentage: 0, budget: 200000 },
        ].sort((a, b) => a.order - b.order);
    },
    addProjectPhase: async (projectId, phaseData) => {
        console.log("Adding phase:", projectId, phaseData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...phaseData, id: `phase${Math.random().toString(36).substring(7)}`, projectId: projectId };
    },
    updateProjectPhase: async (phaseId, phaseData) => {
        console.log("Updating phase:", phaseId, phaseData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...phaseData, id: phaseId };
    },
    deleteProjectPhase: async (phaseId) => {
        console.log("Deleting phase:", phaseId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    reorderProjectPhases: async (projectId, orderedPhaseIds) => {
        console.log("Reordering phases:", projectId, orderedPhaseIds);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    getPhaseStatuses: async () => ["Not Started", "In Progress", "Completed", "On Hold"],
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "completed": return "default";
        case "in progress": return "success";
        case "not started": return "secondary";
        case "on hold": return "warning";
        default: return "secondary";
    }
};

const PhaseForm = ({ phase, onSave, onCancel, statuses }) => {
    const [formData, setFormData] = useState({
        name: phase?.name || "",
        description: phase?.description || "",
        startDate: phase?.startDate ? parseISO(phase.startDate) : null,
        endDate: phase?.endDate ? parseISO(phase.endDate) : null,
        status: phase?.status || "Not Started",
        budget: phase?.budget?.toString() || "",
        completionPercentage: phase?.completionPercentage || 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "number" ? parseInt(value) : value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert("Phase Name is required.");
            return;
        }
        onSave({ 
            ...formData, 
            budget: formData.budget ? parseFloat(formData.budget) : null,
            startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : null,
            endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/40">
            <h3 className="text-lg font-semibold mb-2">{phase?.id ? "Edit Phase" : "Add New Phase"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phaseName" className="text-sm font-medium">Name*</label>
                    <Input id="phaseName" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="phaseStatus" className="text-sm font-medium">Status</label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger id="phaseStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <label htmlFor="phaseDescription" className="text-sm font-medium">Description</label>
                <Input id="phaseDescription" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phaseStartDate" className="text-sm font-medium">Start Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.startDate} onSelect={(d) => handleDateChange("startDate", d)} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div>
                    <label htmlFor="phaseEndDate" className="text-sm font-medium">End Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.endDate} onSelect={(d) => handleDateChange("endDate", d)} initialFocus /></PopoverContent>
                    </Popover>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phaseBudget" className="text-sm font-medium">Budget ($)</label>
                    <Input id="phaseBudget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
                </div>
                 <div>
                    <label htmlFor="phaseCompletion" className="text-sm font-medium">Completion (%)</label>
                    <Input id="phaseCompletion" name="completionPercentage" type="number" min="0" max="100" value={formData.completionPercentage} onChange={handleChange} />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{phase?.id ? "Save Changes" : "Add Phase"}</Button>
            </div>
        </form>
    );
};

const ProjectPhasesTab = ({ projectId, initialPhases }) => {
    const [phases, setPhases] = useState(initialPhases || []);
    const [isLoading, setIsLoading] = useState(!initialPhases);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPhase, setEditingPhase] = useState(null); // Phase object to edit
    const [statuses, setStatuses] = useState([]);

    const fetchPhases = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        setError(null);
        try {
            const [fetchedPhases, fetchedStatuses] = await Promise.all([
                mockApi.getProjectPhases(projectId),
                mockApi.getPhaseStatuses(),
            ]);
            setPhases(fetchedPhases);
            setStatuses(fetchedStatuses);
        } catch (err) {
            console.error("Error fetching phases:", err);
            setError("Failed to load phases.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (!initialPhases) {
            fetchPhases();
        } else {
            // Still fetch statuses if phases are provided initially
            const fetchStatuses = async () => {
                try {
                    const fetchedStatuses = await mockApi.getPhaseStatuses();
                    setStatuses(fetchedStatuses);
                } catch (err) {
                    console.error("Error fetching statuses:", err);
                }
            };
            fetchStatuses();
        }
    }, [projectId, initialPhases, fetchPhases]);

    const handleAddPhase = async (phaseData) => {
        try {
            const addedPhase = await mockApi.addProjectPhase(projectId, { ...phaseData, order: phases.length + 1 });
            setPhases([...phases, addedPhase].sort((a, b) => a.order - b.order));
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding phase:", err);
            alert("Failed to add phase.");
        }
    };

    const handleUpdatePhase = async (phaseData) => {
        if (!editingPhase) return;
        try {
            const updatedPhase = await mockApi.updateProjectPhase(editingPhase.id, phaseData);
            setPhases(phases.map(p => p.id === editingPhase.id ? { ...p, ...updatedPhase } : p).sort((a, b) => a.order - b.order));
            setEditingPhase(null);
        } catch (err) {
            console.error("Error updating phase:", err);
            alert("Failed to update phase.");
        }
    };

    const handleDeletePhase = async (phaseId) => {
        if (window.confirm("Are you sure you want to delete this phase?")) {
            try {
                await mockApi.deleteProjectPhase(phaseId);
                setPhases(phases.filter(p => p.id !== phaseId));
                // Optionally re-order remaining phases
            } catch (err) {
                console.error("Error deleting phase:", err);
                alert("Failed to delete phase.");
            }
        }
    };

    const startEditing = (phase) => {
        setEditingPhase(phase);
        setShowAddForm(false); // Close add form if open
    };

    // TODO: Implement drag-and-drop reordering logic
    // const handleDragEnd = (result) => { ... };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Project Phases</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => { setShowAddForm(!showAddForm); setEditingPhase(null); }}>
                        {showAddForm ? "Cancel" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Phase</>}
                    </Button>
                </CardHeader>
                <CardContent>
                    {showAddForm && <PhaseForm onSave={handleAddPhase} onCancel={() => setShowAddForm(false)} statuses={statuses} />}
                    {editingPhase && <PhaseForm phase={editingPhase} onSave={handleUpdatePhase} onCancel={() => setEditingPhase(null)} statuses={statuses} />}

                    {isLoading && <div className="text-center p-4">Loading phases...</div>}
                    {error && <div className="text-center p-4 text-red-500">{error}</div>}
                    {!isLoading && !error && phases.length === 0 && !showAddForm && !editingPhase && (
                        <div className="text-center p-8 text-muted-foreground">No phases defined for this project yet.</div>
                    )}

                    {!isLoading && !error && phases.length > 0 && (
                        <div className="mt-4 border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30px]"></TableHead> {/* Drag Handle */} 
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Completion</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {/* TODO: Wrap TableBody with DragDropContext for reordering */} 
                                <TableBody>
                                    {phases.map((phase, index) => (
                                        // TODO: Wrap TableRow with Draggable
                                        <TableRow key={phase.id}>
                                            <TableCell className="cursor-grab text-muted-foreground">
                                                {/* TODO: Add {...provided.dragHandleProps} */} 
                                                <GripVertical className="h-4 w-4" />
                                            </TableCell>
                                            <TableCell className="font-medium">{phase.name}</TableCell>
                                            <TableCell><Badge variant={getStatusBadgeVariant(phase.status)}>{phase.status}</Badge></TableCell>
                                            <TableCell>{phase.startDate ? format(parseISO(phase.startDate), "PP") : "N/A"}</TableCell>
                                            <TableCell>{phase.endDate ? format(parseISO(phase.endDate), "PP") : "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={phase.completionPercentage} className="h-1.5 w-16" />
                                                    <span className="text-xs text-muted-foreground">{phase.completionPercentage}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{phase.budget ? `$${phase.budget.toLocaleString()}` : "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(phase)} title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeletePhase(phase.id)} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Placeholder for Gantt Chart Visualization */}
            <Card>
                <CardHeader>
                    <CardTitle>Gantt Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-8 border rounded-lg text-center text-muted-foreground">
                        Gantt Chart visualization placeholder.
                        (Requires integrating a Gantt chart library)
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectPhasesTab;

