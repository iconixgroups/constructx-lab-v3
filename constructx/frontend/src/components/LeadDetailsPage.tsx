import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming React Router for navigation
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Edit, Trash2, FileText, Users, MessageSquare, Activity, DollarSign, CheckSquare } from "lucide-react";
import LeadActivityTimeline from "./LeadActivityTimeline";
import LeadContactsList from "./LeadContactsList";
import LeadNotesSection from "./LeadNotesSection";
// Import other sections like Documents, Related Items etc. if needed
import LeadForm from "./LeadForm"; // For editing
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"; // For Edit Lead modal

// Mock API (replace with actual API calls)
const mockApi = {
    getLeadDetails: async (leadId) => {
        console.log("Fetching details for lead:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Find the lead from the mock list or return a detailed mock object
        const leads = [
            { id: "lead1", name: "Alpha Project Inquiry", clientCompanyId: "client1", source: "Website", description: "Initial inquiry about residential construction.", estimatedValue: 50000, status: "New", probability: 20, assignedTo: { id: "user1", name: "Alice Smith" }, createdAt: "2024-05-20T10:00:00Z", lastActivityAt: "2024-05-21T11:00:00Z", tags: ["residential", "new build"] },
            { id: "lead2", name: "Beta Corp Expansion", clientCompanyId: "client2", source: "Referral", description: "Referred by John Doe for office expansion project.", estimatedValue: 120000, status: "Qualified", probability: 60, assignedTo: { id: "user2", name: "Bob Johnson" }, createdAt: "2024-05-15T14:30:00Z", lastActivityAt: "2024-05-29T09:15:00Z", tags: ["commercial", "expansion"] },
            // Add other leads if needed for testing different IDs
        ];
        const lead = leads.find(l => l.id === leadId);
        if (!lead) throw new Error("Lead not found");
        return lead;
    },
    deleteLead: async (leadId) => {
        console.log("Deleting lead:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    // Add updateLead API call mock
};

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const LeadDetailsPage = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!leadId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await mockApi.getLeadDetails(leadId);
                setLead(data);
            } catch (err) {
                console.error("Error fetching lead details:", err);
                setError("Failed to load lead details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [leadId]);

    const handleEditSave = (updatedData) => {
        // Replace with actual API call
        console.log("Updating lead:", updatedData);
        setLead(prev => ({ ...prev, ...updatedData })); // Optimistic update
        setIsEditFormOpen(false);
        // Potentially refetch details after save
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await mockApi.deleteLead(leadId);
                navigate("/leads"); // Navigate back to leads list after delete
            } catch (err) {
                console.error("Error deleting lead:", err);
                alert("Failed to delete lead.");
            }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading lead details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!lead) {
        return <div className="p-8 text-center">Lead not found.</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">{lead.name}</h1>
                        <p className="text-sm text-muted-foreground">Client: {lead.clientCompanyId?.name || "Unknown"} | Source: {lead.source}</p>
                        {/* Add more key details like status, value, assigned to */}
                        <div className="flex gap-4 mt-2 text-sm">
                            <span>Status: <Badge variant={lead.status === "Won" ? "success" : lead.status === "Lost" ? "destructive" : "outline"}>{lead.status}</Badge></span>
                            <span>Value: {formatCurrency(lead.estimatedValue)}</span>
                            <span>Assigned: {lead.assignedTo?.name || "Unassigned"}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Lead</DialogTitle>
                                </DialogHeader>
                                <LeadForm
                                    initialData={lead}
                                    onSave={handleEditSave}
                                    onCancel={() => setIsEditFormOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                        {/* Add Convert to Project Button */}
                        {lead.status !== "Won" && lead.status !== "Lost" && (
                             <Button size="sm" variant="success"> {/* Custom variant or primary */}
                                <CheckSquare className="mr-2 h-4 w-4" /> Convert to Project
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="activity" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="activity"><Activity className="mr-2 h-4 w-4"/>Activity</TabsTrigger>
                    <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4"/>Details</TabsTrigger>
                    <TabsTrigger value="contacts"><Users className="mr-2 h-4 w-4"/>Contacts</TabsTrigger>
                    <TabsTrigger value="notes"><MessageSquare className="mr-2 h-4 w-4"/>Notes</TabsTrigger>
                    {/* Add more tabs: Documents, Financials (if applicable), Related Items */}
                </TabsList>

                <TabsContent value="activity">
                    <LeadActivityTimeline leadId={leadId} />
                </TabsContent>
                <TabsContent value="details">
                    {/* Display more detailed fields from the lead object */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold">Lead Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><span className="font-medium">Description:</span> {lead.description || "N/A"}</div>
                            <div><span className="font-medium">Probability:</span> {lead.probability}%</div>
                            <div><span className="font-medium">Est. Start Date:</span> {lead.estimatedStartDate ? new Date(lead.estimatedStartDate).toLocaleDateString() : "N/A"}</div>
                            <div><span className="font-medium">Tags:</span> {lead.tags?.join(", ") || "None"}</div>
                            <div><span className="font-medium">Created At:</span> {new Date(lead.createdAt).toLocaleString()}</div>
                            <div><span className="font-medium">Last Activity:</span> {lead.lastActivityAt ? new Date(lead.lastActivityAt).toLocaleString() : "N/A"}</div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="contacts">
                    <LeadContactsList leadId={leadId} />
                </TabsContent>
                <TabsContent value="notes">
                    <LeadNotesSection leadId={leadId} />
                </TabsContent>
                {/* Add TabsContent for other sections */}
            </Tabs>
        </div>
    );
};

export default LeadDetailsPage;

