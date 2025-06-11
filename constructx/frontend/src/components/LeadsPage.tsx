import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"; // For view toggle
import { PlusCircle, List, LayoutGrid, Search, Filter } from "lucide-react";
import LeadPipeline from "./LeadPipeline"; // Kanban view
import LeadsList from "./LeadsList"; // Table view
import LeadForm from "./LeadForm"; // Modal or drawer for adding/editing leads
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"; // For Add/Edit Lead

// Mock API functions (replace with actual API calls)
const mockApi = {
    getLeads: async (filters) => {
        console.log("Fetching leads with filters:", filters);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate filtering/sorting based on filters object
        return [
            { id: "lead1", name: "Alpha Project Inquiry", clientCompanyId: "client1", source: "Website", estimatedValue: 50000, status: "New", probability: 20, assignedTo: "user1", createdAt: "2024-05-20T10:00:00Z", lastActivityAt: "2024-05-21T11:00:00Z" },
            { id: "lead2", name: "Beta Corp Expansion", clientCompanyId: "client2", source: "Referral", estimatedValue: 120000, status: "Qualified", probability: 60, assignedTo: "user2", createdAt: "2024-05-15T14:30:00Z", lastActivityAt: "2024-05-29T09:15:00Z" },
            { id: "lead3", name: "Gamma Services RFQ", clientCompanyId: "client3", source: "Cold Call", estimatedValue: 75000, status: "Proposal", probability: 75, assignedTo: "user1", createdAt: "2024-05-10T08:00:00Z", lastActivityAt: "2024-05-30T16:45:00Z" },
            { id: "lead4", name: "Delta Renovation Bid", clientCompanyId: "client4", source: "Website", estimatedValue: 25000, status: "Contacted", probability: 40, assignedTo: "user2", createdAt: "2024-05-25T12:00:00Z", lastActivityAt: "2024-05-26T10:30:00Z" },
        ];
    },
    getLeadStatuses: async () => ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
    // Add other mock API calls: createLead, updateLead, deleteLead, etc.
};

const LeadsPage = () => {
    const [viewMode, setViewMode] = useState("pipeline"); // 'pipeline' or 'list'
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "", source: "", assignedTo: "" });
    const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null); // Lead object to edit, null for new

    const fetchLeads = useCallback(async () => {
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
            const data = await mockApi.getLeads(params);
            setLeads(data);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Failed to load leads.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, filters, sort]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]); // Refetch when filters/sort/search change

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleSortChange = (value) => {
        const [field, order] = value.split("_");
        setSort({ field, order });
    };

    const openAddLeadForm = () => {
        setEditingLead(null);
        setIsFormOpen(true);
    };

    const openEditLeadForm = (lead) => {
        setEditingLead(lead);
        setIsFormOpen(true);
    };

    const handleFormSave = (leadData) => {
        // Replace with actual API call (create or update)
        console.log("Saving lead:", leadData);
        setIsFormOpen(false);
        setEditingLead(null);
        fetchLeads(); // Refresh list after save
    };

    const handleLeadUpdate = (updatedLead) => {
        // Optimistic update or refetch
        setLeads(prevLeads => prevLeads.map(l => l.id === updatedLead.id ? updatedLead : l));
        // Or call fetchLeads();
    };

    const handleLeadDelete = (leadId) => {
        // Replace with actual API call
        console.log("Deleting lead:", leadId);
        setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
        // Or call fetchLeads();
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-semibold">Leads Management</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddLeadForm}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
                        </DialogHeader>
                        <LeadForm
                            initialData={editingLead}
                            onSave={handleFormSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and View Toggle */} 
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                        prefix={<Search className="h-4 w-4 text-muted-foreground" />} // Custom Input with prefix?
                    />
                    {/* Add Filter Button/Dropdown here */}
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="pipeline"><LayoutGrid className="mr-2 h-4 w-4" /> Pipeline</TabsTrigger>
                        <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Add more filter controls if needed (Status, Source, Assigned To) */} 

            {/* Content Area */} 
            <div className="mt-4">
                {isLoading && <div className="text-center p-4">Loading leads...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && (
                    viewMode === "pipeline" ? (
                        <LeadPipeline leads={leads} onUpdateLead={handleLeadUpdate} onEditLead={openEditLeadForm} />
                    ) : (
                        <LeadsList leads={leads} onEditLead={openEditLeadForm} onDeleteLead={handleLeadDelete} />
                    )
                )}
            </div>
        </div>
    );
};

export default LeadsPage;

