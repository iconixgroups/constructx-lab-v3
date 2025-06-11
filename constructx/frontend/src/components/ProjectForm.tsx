import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"; // For sections

// Mock API functions (replace with actual API calls)
const mockApi = {
    getProjectStatuses: async () => ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
    getProjectTypes: async () => ["Commercial", "Residential", "Industrial", "Infrastructure", "Other"],
    getUsers: async () => [
        { id: "user1", name: "Alice Smith" },
        { id: "user2", name: "Bob Johnson" },
        { id: "user3", name: "Charlie Brown" },
    ],
    getClients: async () => [
        { id: "client1", name: "Alpha Construction Inc." },
        { id: "client2", name: "Beta Corp Developments" },
        { id: "client3", name: "Gamma Services Ltd." },
    ],
    // Add getProjectRoles if needed for team assignment
};

const ProjectForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        clientId: "",
        status: "Planning",
        startDate: null,
        targetCompletionDate: null,
        budget: "",
        location: "",
        // address: { street: "", city: "", state: "", zip: "", country: "" }, // Handle nested address later
        projectType: "",
        projectManager: "",
        tags: "", // Comma-separated
        phases: [], // Array of phase objects { name: string, startDate: date, endDate: date }
        teamMembers: [], // Array of member objects { userId: string, role: string }
        customFields: {}, // Key-value pairs
    });

    const [statuses, setStatuses] = useState([]);
    const [types, setTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load initial data if provided (for editing)
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                code: initialData.code || "",
                description: initialData.description || "",
                clientId: initialData.clientId || "",
                status: initialData.status || "Planning",
                startDate: initialData.startDate ? parseISO(initialData.startDate) : null,
                targetCompletionDate: initialData.targetCompletionDate ? parseISO(initialData.targetCompletionDate) : null,
                budget: initialData.budget?.toString() || "",
                location: initialData.location || "",
                projectType: initialData.projectType || "",
                projectManager: initialData.projectManager?.id || "", // Assuming manager is object in initialData
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
                phases: initialData.phases || [], // Assuming phases are passed if editing
                teamMembers: initialData.teamMembers || [], // Assuming members are passed if editing
                customFields: initialData.customFields || {},
            });
        } else {
            // Reset form for new project
            setFormData({
                name: "", code: "", description: "", clientId: "", status: "Planning",
                startDate: null, targetCompletionDate: null, budget: "", location: "",
                projectType: "", projectManager: "", tags: "", phases: [], teamMembers: [], customFields: {},
            });
        }
    }, [initialData]);

    useEffect(() => {
        // Fetch dropdown options
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [fetchedStatuses, fetchedTypes, fetchedUsers, fetchedClients] = await Promise.all([
                    mockApi.getProjectStatuses(),
                    mockApi.getProjectTypes(),
                    mockApi.getUsers(),
                    mockApi.getClients(),
                ]);
                setStatuses(fetchedStatuses);
                setTypes(fetchedTypes);
                setUsers(fetchedUsers);
                setClients(fetchedClients);
            } catch (error) {
                console.error("Error fetching form options:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

    // --- Phase Management ---
    const addPhase = () => {
        setFormData(prev => ({
            ...prev,
            phases: [...prev.phases, { id: `new_${Date.now()}`, name: "", startDate: null, endDate: null }]
        }));
    };

    const handlePhaseChange = (index, field, value) => {
        setFormData(prev => {
            const newPhases = [...prev.phases];
            newPhases[index] = { ...newPhases[index], [field]: value };
            return { ...prev, phases: newPhases };
        });
    };

    const removePhase = (index) => {
        setFormData(prev => ({
            ...prev,
            phases: prev.phases.filter((_, i) => i !== index)
        }));
    };
    // --- End Phase Management ---

    // --- Team Management (Simplified) ---
    const addTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { id: `new_${Date.now()}`, userId: "", role: "" }]
        }));
    };

    const handleTeamMemberChange = (index, field, value) => {
        setFormData(prev => {
            const newMembers = [...prev.teamMembers];
            newMembers[index] = { ...newMembers[index], [field]: value };
            return { ...prev, teamMembers: newMembers };
        });
    };

    const removeTeamMember = (index) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== index)
        }));
    };
    // --- End Team Management ---

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.code || !formData.projectManager) {
            alert("Project Name, Code, and Project Manager are required.");
            return;
        }
        // Prepare data for saving
        const dataToSave = {
            ...formData,
            budget: formData.budget ? parseFloat(formData.budget) : null,
            tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            // Format dates if needed by backend
            startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : null,
            targetCompletionDate: formData.targetCompletionDate ? format(formData.targetCompletionDate, "yyyy-MM-dd") : null,
            // Filter out temporary IDs from phases/members if needed
            phases: formData.phases.map(p => ({ ...p, id: p.id.startsWith("new_") ? undefined : p.id })),
            teamMembers: formData.teamMembers.map(m => ({ ...m, id: m.id.startsWith("new_") ? undefined : m.id })),
            id: initialData?.id, // Include ID if editing
        };
        onSave(dataToSave);
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading form...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[80vh] overflow-y-auto pr-4">
            <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
                {/* Basic Information Section */}
                <AccordionItem value="item-1">
                    <AccordionTrigger>Basic Information</AccordionTrigger>
                    <AccordionContent className="space-y-4 p-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Project Name*</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="code">Project Code*</Label>
                                <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="clientId">Client</Label>
                                <Select value={formData.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                                    <SelectTrigger id="clientId"><SelectValue placeholder="Select client" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No Client</SelectItem>
                                        {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="status">Status*</Label>
                                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                                    <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="projectType">Project Type</Label>
                                <Select value={formData.projectType} onValueChange={(value) => handleSelectChange("projectType", value)}>
                                    <SelectTrigger id="projectType"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {types.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="projectManager">Project Manager*</Label>
                                <Select value={formData.projectManager} onValueChange={(value) => handleSelectChange("projectManager", value)} required>
                                    <SelectTrigger id="projectManager"><SelectValue placeholder="Select manager" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Unassigned</SelectItem>
                                        {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dates & Budget Section */}
                <AccordionItem value="item-2">
                    <AccordionTrigger>Dates & Budget</AccordionTrigger>
                    <AccordionContent className="space-y-4 p-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
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
                                <Label htmlFor="targetCompletionDate">Target Completion Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.targetCompletionDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.targetCompletionDate ? format(formData.targetCompletionDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.targetCompletionDate} onSelect={(d) => handleDateChange("targetCompletionDate", d)} initialFocus /></PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="budget">Budget ($)</Label>
                            <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Location Section */}
                <AccordionItem value="item-3">
                    <AccordionTrigger>Location</AccordionTrigger>
                    <AccordionContent className="space-y-4 p-1">
                        <div>
                            <Label htmlFor="location">Location Description</Label>
                            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Downtown Site, Building A" />
                        </div>
                        {/* Add Address fields (Street, City, State, Zip, Country) here */}
                        {/* Add Map integration here if needed */}
                    </AccordionContent>
                </AccordionItem>

                {/* Phases Section */}
                <AccordionItem value="item-4">
                    <AccordionTrigger>Project Phases</AccordionTrigger>
                    <AccordionContent className="space-y-2 p-1">
                        {formData.phases.map((phase, index) => (
                            <div key={phase.id || index} className="flex items-end gap-2 border p-2 rounded">
                                <Input value={phase.name} onChange={(e) => handlePhaseChange(index, "name", e.target.value)} placeholder="Phase Name" className="flex-grow" />
                                {/* Add Start/End Date Pickers for Phases */}
                                <Button type="button" variant="ghost" size="icon" onClick={() => removePhase(index)} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Phase
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Team Section */}
                <AccordionItem value="item-5">
                    <AccordionTrigger>Team Members</AccordionTrigger>
                    <AccordionContent className="space-y-2 p-1">
                        {formData.teamMembers.map((member, index) => (
                            <div key={member.id || index} className="flex items-center gap-2 border p-2 rounded">
                                <Select value={member.userId} onValueChange={(value) => handleTeamMemberChange(index, "userId", value)} className="flex-grow">
                                    <SelectTrigger><SelectValue placeholder="Select Member" /></SelectTrigger>
                                    <SelectContent>
                                        {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input value={member.role} onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)} placeholder="Role" className="flex-grow" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeTeamMember(index)} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Add sections for Tags, Custom Fields if needed */}

            </Accordion>

            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{initialData ? "Save Changes" : "Create Project"}</Button>
            </div>
        </form>
    );
};

export default ProjectForm;

