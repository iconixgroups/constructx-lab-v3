import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle, List, LayoutGrid, Search, Filter } from "lucide-react";
import ProjectsList from "./ProjectsList"; // Table view
import ProjectsGrid from "./ProjectsGrid"; // Grid view
import ProjectForm from "./ProjectForm"; // Modal or drawer for adding/editing projects
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

// Mock API functions (replace with actual API calls)
const mockApi = {
    getProjects: async (filters) => {
        console.log("Fetching projects with filters:", filters);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Simulate filtering/sorting based on filters object
        return [
            { id: "proj1", name: "Downtown Office Tower", code: "DOT-001", status: "Active", projectManager: { id: "user1", name: "Alice Smith" }, startDate: "2024-01-15", targetCompletionDate: "2025-06-30", budget: 5000000, progress: 65, location: "New York, NY" },
            { id: "proj2", name: "Residential Complex Alpha", code: "RCA-005", status: "Planning", projectManager: { id: "user2", name: "Bob Johnson" }, startDate: "2024-07-01", targetCompletionDate: "2026-12-31", budget: 12000000, progress: 5, location: "Los Angeles, CA" },
            { id: "proj3", name: "Industrial Warehouse Build", code: "IWB-002", status: "On Hold", projectManager: { id: "user1", name: "Alice Smith" }, startDate: "2023-11-01", targetCompletionDate: "2024-11-30", budget: 3500000, progress: 40, location: "Chicago, IL" },
            { id: "proj4", name: "Retail Store Fit-out", code: "RSF-010", status: "Completed", projectManager: { id: "user3", name: "Charlie Brown" }, startDate: "2024-02-01", targetCompletionDate: "2024-05-31", actualCompletionDate: "2024-05-28", budget: 850000, progress: 100, location: "Miami, FL" },
        ];
    },
    getProjectStatuses: async () => ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
    // Add other mock API calls: createProject, updateProject, deleteProject, etc.
};

const ProjectsPage = () => {
    const [viewMode, setViewMode] = useState("grid"); // Default to grid view
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ status: "", projectManager: "", type: "" });
    const [sort, setSort] = useState({ field: "startDate", order: "desc" });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // Project object to edit, null for new

    const fetchProjects = useCallback(async () => {
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
            const data = await mockApi.getProjects(params);
            setProjects(data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, filters, sort]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Refetch when filters/sort/search change

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleSortChange = (value) => {
        const [field, order] = value.split("_");
        setSort({ field, order });
    };

    const openAddProjectForm = () => {
        setEditingProject(null);
        setIsFormOpen(true);
    };

    const openEditProjectForm = (project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleFormSave = (projectData) => {
        // Replace with actual API call (create or update)
        console.log("Saving project:", projectData);
        setIsFormOpen(false);
        setEditingProject(null);
        fetchProjects(); // Refresh list after save
    };

    const handleProjectDelete = (projectId) => {
        // Replace with actual API call
        if (window.confirm("Are you sure you want to delete this project?")) {
            console.log("Deleting project:", projectId);
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
            // Or call fetchProjects();
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-semibold">Projects Management</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddProjectForm}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px]">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        </DialogHeader>
                        <ProjectForm
                            initialData={editingProject}
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
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                        prefix={<Search className="h-4 w-4 text-muted-foreground" />} // Assuming custom Input
                    />
                    {/* Add Filter Button/Dropdown here */}
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="grid"><LayoutGrid className="mr-2 h-4 w-4" /> Grid</TabsTrigger>
                        <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Add more filter controls: Status, Manager, Type etc. */}

            {/* Content Area */} 
            <div className="mt-4">
                {isLoading && <div className="text-center p-4">Loading projects...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && (
                    viewMode === "grid" ? (
                        <ProjectsGrid projects={projects} onEditProject={openEditProjectForm} onDeleteProject={handleProjectDelete} />
                    ) : (
                        <ProjectsList projects={projects} onEditProject={openEditProjectForm} onDeleteProject={handleProjectDelete} />
                    )
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;

