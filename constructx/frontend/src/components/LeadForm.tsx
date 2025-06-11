import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils"; // For shadcn utility

// Mock API functions (replace with actual API calls)
const mockApi = {
    getLeadStatuses: async () => ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
    getLeadSources: async () => ["Website", "Referral", "Cold Call", "Advertisement", "Event", "Other"],
    getUsers: async () => [
        { id: "user1", name: "Alice Smith" },
        { id: "user2", name: "Bob Johnson" },
    ],
    // Add getClientCompanies if needed
};

const LeadForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        clientCompanyId: "", // Or an object if fetching company details
        source: "",
        description: "",
        estimatedValue: "",
        estimatedStartDate: null,
        status: "New",
        probability: "",
        assignedTo: "",
        tags: "", // Store as comma-separated string for simplicity in form
        // Add fields for contacts if editing inline
    });
    const [statuses, setStatuses] = useState([]);
    const [sources, setSources] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load initial data if provided (for editing)
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                clientCompanyId: initialData.clientCompanyId || "",
                source: initialData.source || "",
                description: initialData.description || "",
                estimatedValue: initialData.estimatedValue?.toString() || "",
                estimatedStartDate: initialData.estimatedStartDate ? new Date(initialData.estimatedStartDate) : null,
                status: initialData.status || "New",
                probability: initialData.probability?.toString() || "",
                assignedTo: initialData.assignedTo || "",
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
            });
        } else {
            // Reset form for new lead
            setFormData({
                name: "", clientCompanyId: "", source: "", description: "",
                estimatedValue: "", estimatedStartDate: null, status: "New",
                probability: "", assignedTo: "", tags: "",
            });
        }
    }, [initialData]);

    useEffect(() => {
        // Fetch dropdown options
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [fetchedStatuses, fetchedSources, fetchedUsers] = await Promise.all([
                    mockApi.getLeadStatuses(),
                    mockApi.getLeadSources(),
                    mockApi.getUsers(),
                ]);
                setStatuses(fetchedStatuses);
                setSources(fetchedSources);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching form options:", error);
                // Handle error state
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

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, estimatedStartDate: date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.status) {
            alert("Lead Name and Status are required.");
            return;
        }
        // Prepare data for saving (e.g., parse numbers, split tags)
        const dataToSave = {
            ...formData,
            estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
            probability: formData.probability ? parseInt(formData.probability, 10) : null,
            tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            id: initialData?.id, // Include ID if editing
        };
        onSave(dataToSave);
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading form...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Lead Name*</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientCompanyId" className="text-right">Client Company</Label>
                {/* Replace with a proper searchable select or autocomplete component */}
                <Input id="clientCompanyId" name="clientCompanyId" value={formData.clientCompanyId} onChange={handleChange} placeholder="Search or enter client ID" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">Source</Label>
                <Select value={formData.source} onValueChange={(value) => handleSelectChange("source", value)}>
                    <SelectTrigger id="source" className="col-span-3">
                        <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                        {sources.map(source => (
                            <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedValue" className="text-right">Est. Value ($)</Label>
                <Input id="estimatedValue" name="estimatedValue" type="number" value={formData.estimatedValue} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedStartDate" className="text-right">Est. Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "col-span-3 justify-start text-left font-normal",
                                !formData.estimatedStartDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.estimatedStartDate ? format(formData.estimatedStartDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.estimatedStartDate}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status*</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                    <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="probability" className="text-right">Probability (%)</Label>
                <Input id="probability" name="probability" type="number" min="0" max="100" value={formData.probability} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleSelectChange("assignedTo", value)}>
                    <SelectTrigger id="assignedTo" className="col-span-3">
                        <SelectValue placeholder="Assign to user" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Tags</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="Comma-separated tags" className="col-span-3" />
            </div>

            <div className="flex justify-end gap-2 mt-4 col-span-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{initialData ? "Save Changes" : "Create Lead"}</Button>
            </div>
        </form>
    );
};

export default LeadForm;

