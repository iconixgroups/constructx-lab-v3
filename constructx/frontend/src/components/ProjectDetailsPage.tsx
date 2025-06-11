import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Edit, Trash2, Settings, BarChart2, Users, GanttChartSquare, LayoutDashboard } from "lucide-react";
import ProjectForm from "./ProjectForm"; // For editing
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { format } from "date-fns";

// Import Tab Components (assuming they will be created)
import ProjectOverviewTab from "./ProjectOverviewTab";
import ProjectPhasesTab from "./ProjectPhasesTab";
import ProjectTeamTab from "./ProjectTeamTab";
import ProjectSettingsTab from "./ProjectSettingsTab";
// Import other related module components if needed (e.g., Tasks, Documents)

// Mock API (replace with actual API calls)
const mockApi = {
    getProjectDetails: async (projectId) => {
        console.log("Fetching details for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Find the project from the mock list or return a detailed mock object
        const projects = [
            { id: "proj1", name: "Downtown Office Tower", code: "DOT-001", status: "Active", projectManager: { id: "user1", name: "Alice Smith" }, startDate: "2024-01-15", targetCompletionDate: "2025-06-30", budget: 5000000, progress: 65, location: "New York, NY", description: "Construction of a 20-story office building.", clientId: "client1", type: "Commercial", tags: ["High-rise", "Office"], phases: [{id: "phase1", name: "Foundation", status: "Completed"}, {id: "phase2", name: "Structure", status: "In Progress"}], teamMembers: [{userId: "user1", role: "PM"}, {userId: "user3", role: "Engineer"}] },
            { id: "proj2", name: "Residential Complex Alpha", code: "RCA-005", status: "Planning", projectManager: { id: "user2", name: "Bob Johnson" }, startDate: "2024-07-01", targetCompletionDate: "2026-12-31", budget: 12000000, progress: 5, location: "Los Angeles, CA", description: "Development of a 50-unit residential complex.", clientId: "client2", type: "Residential", tags: ["Multi-family", "New Build"], phases: [], teamMembers: [] },
        ];
        const project = projects.find(p => p.id === projectId);
        if (!project) throw new Error("Project not found");
        return project;
    },
    deleteProject: async (projectId) => {
        console.log("Deleting project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    // Add updateProject API call mock
};

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "active": return "success";
        case "completed": return "default";
        case "planning": return "info";
        case "on hold": return "warning";
        case "cancelled": return "destructive";
        default: return "secondary";
    }
};

const ProjectDetailsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!projectId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await mockApi.getProjectDetails(projectId);
                setProject(data);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("Failed to load project details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [projectId]);

    const handleEditSave = (updatedData) => {
        // Replace with actual API call
        console.log("Updating project:", updatedData);
        setProject(prev => ({ ...prev, ...updatedData })); // Optimistic update
        setIsEditFormOpen(false);
        // Potentially refetch details after save
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            try {
                await mockApi.deleteProject(projectId);
                navigate("/projects"); // Navigate back to projects list after delete
            } catch (err) {
                console.error("Error deleting project:", err);
                alert("Failed to delete project.");
            }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading project details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!project) {
        return <div className="p-8 text-center">Project not found.</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6">
                <Button variant="outline" size="sm" onClick={() => navigate("/projects")} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">{project.name} <span className="text-lg text-muted-foreground">({project.code})</span></h1>
                        <p className="text-sm text-muted-foreground">{project.location} | Type: {project.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>Status: <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge></span>
                            <span>Manager: {project.projectManager?.name || "N/A"}</span>
                            <span>Budget: {formatCurrency(project.budget)}</span>
                        </div>
                        <div className="mt-2">
                            <Progress value={project.progress} className="h-2 w-full max-w-md" />
                            <span className="text-xs text-muted-foreground">{project.progress}% Complete</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" /> Edit Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Project</DialogTitle>
                                </DialogHeader>
                                <ProjectForm
                                    initialData={project}
                                    onSave={handleEditSave}
                                    onCancel={() => setIsEditFormOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                        {/* Settings might be a tab or a separate button */}
                        {/* <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Settings</Button> */}
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4 flex-wrap h-auto justify-start">
                    <TabsTrigger value="overview"><LayoutDashboard className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
                    <TabsTrigger value="phases"><GanttChartSquare className="mr-2 h-4 w-4"/>Phases & Schedule</TabsTrigger>
                    <TabsTrigger value="team"><Users className="mr-2 h-4 w-4"/>Team</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger> {/* Link to Tasks Module filtered by project */} 
                    <TabsTrigger value="documents">Documents</TabsTrigger> {/* Link to Documents Module filtered by project */} 
                    <TabsTrigger value="financials">Financials</TabsTrigger> {/* Link to Financial Module filtered by project */} 
                    <TabsTrigger value="metrics"><BarChart2 className="mr-2 h-4 w-4"/>Metrics</TabsTrigger>
                    <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
                    {/* Add more tabs for other integrated modules: RFIs, Submittals, etc. */}
                </TabsList>

                <TabsContent value="overview">
                    {/* Pass project data to the overview component */}
                    <ProjectOverviewTab project={project} />
                </TabsContent>
                <TabsContent value="phases">
                    {/* Pass projectId or phases data */}
                    <ProjectPhasesTab projectId={projectId} initialPhases={project.phases} />
                </TabsContent>
                <TabsContent value="team">
                    {/* Pass projectId or team data */}
                    <ProjectTeamTab projectId={projectId} initialMembers={project.teamMembers} />
                </TabsContent>
                <TabsContent value="tasks">
                    <div className="p-4 border rounded-lg text-center text-muted-foreground">
                        Tasks Module integration placeholder. (Would show tasks filtered for this project)
                    </div>
                </TabsContent>
                 <TabsContent value="documents">
                    <div className="p-4 border rounded-lg text-center text-muted-foreground">
                        Documents Module integration placeholder. (Would show documents filtered for this project)
                    </div>
                </TabsContent>
                 <TabsContent value="financials">
                    <div className="p-4 border rounded-lg text-center text-muted-foreground">
                        Financial Module integration placeholder. (Would show financials filtered for this project)
                    </div>
                </TabsContent>
                <TabsContent value="metrics">
                     <div className="p-4 border rounded-lg text-center text-muted-foreground">
                        Project Metrics component placeholder.
                    </div>
                    {/* <ProjectMetricsComponent projectId={projectId} /> */}
                </TabsContent>
                <TabsContent value="settings">
                    {/* Pass projectId */}
                    <ProjectSettingsTab projectId={projectId} />
                </TabsContent>
                {/* Add TabsContent for other sections */}
            </Tabs>
        </div>
    );
};

export default ProjectDetailsPage;

