import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LayoutGrid, List, Upload, FolderPlus, Search, Filter } from "lucide-react";
import FolderTree from "./FolderTree";
import DocumentsList from "./DocumentsList";
import DocumentsGrid from "./DocumentsGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import DocumentUploadForm from "./DocumentUploadForm";
import FolderForm from "./FolderForm"; // Assuming a FolderForm component exists

// Mock API (replace with actual API calls)
const mockApi = {
    getFolders: async (projectId) => {
        console.log("Fetching folders for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock folder structure
        return [
            { id: "folder1", projectId: projectId, parentFolderId: null, name: "Project Plans", createdAt: "2024-01-10T10:00:00Z" },
            { id: "folder2", projectId: projectId, parentFolderId: null, name: "Contracts", createdAt: "2024-01-11T11:00:00Z" },
            { id: "folder3", projectId: projectId, parentFolderId: "folder1", name: "Architectural", createdAt: "2024-01-12T12:00:00Z" },
            { id: "folder4", projectId: projectId, parentFolderId: "folder1", name: "Structural", createdAt: "2024-01-13T13:00:00Z" },
            { id: "folder5", projectId: projectId, parentFolderId: null, name: "Permits", createdAt: "2024-01-14T14:00:00Z" },
            { id: "folder6", projectId: projectId, parentFolderId: "folder2", name: "Client Agreement", createdAt: "2024-01-15T15:00:00Z" },
        ];
    },
    getDocuments: async (projectId, folderId = null, filters = {}) => {
        console.log("Fetching documents for project:", projectId, "folder:", folderId, "filters:", filters);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock documents
        let docs = [
            { id: "doc1", projectId: projectId, folderId: "folder3", name: "Floor_Plan_Level1.pdf", fileSize: 1500000, fileType: "application/pdf", status: "Approved", category: "Drawing", tags: ["level1", "architectural"], createdBy: "user1", createdAt: "2024-01-20T09:00:00Z", updatedAt: "2024-01-22T14:00:00Z", isLatestVersion: true },
            { id: "doc2", projectId: projectId, folderId: "folder4", name: "Beam_Calculations.xlsx", fileSize: 85000, fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", status: "Under Review", category: "Calculation", tags: ["structural", "steel"], createdBy: "user2", createdAt: "2024-01-21T10:30:00Z", updatedAt: "2024-01-21T10:30:00Z", isLatestVersion: true },
            { id: "doc3", projectId: projectId, folderId: "folder6", name: "Main_Contract_Signed.pdf", fileSize: 3200000, fileType: "application/pdf", status: "Approved", category: "Contract", tags: ["legal", "signed"], createdBy: "user3", createdAt: "2024-01-18T16:00:00Z", updatedAt: "2024-01-18T16:00:00Z", isLatestVersion: true },
            { id: "doc4", projectId: projectId, folderId: "folder5", name: "Building_Permit_App.pdf", fileSize: 500000, fileType: "application/pdf", status: "Draft", category: "Permit", tags: ["application"], createdBy: "user1", createdAt: "2024-01-25T11:00:00Z", updatedAt: "2024-01-25T11:00:00Z", isLatestVersion: true },
            { id: "doc5", projectId: projectId, folderId: null, name: "Project_Kickoff_Slides.pptx", fileSize: 5500000, fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", status: "Approved", category: "Presentation", tags: ["kickoff"], createdBy: "user2", createdAt: "2024-01-05T15:00:00Z", updatedAt: "2024-01-05T15:00:00Z", isLatestVersion: true }, // Root level doc
        ];
        // Apply folder filter
        if (folderId) {
            docs = docs.filter(doc => doc.folderId === folderId);
        } else {
            // If no folder selected, show root documents (folderId is null)
            docs = docs.filter(doc => !doc.folderId);
        }
        // Apply other filters (search, category, status, etc.) - simplified
        if (filters.search) {
            docs = docs.filter(doc => doc.name.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.category) {
            docs = docs.filter(doc => doc.category === filters.category);
        }
        // Add more filters as needed
        return docs;
    },
    getDocumentCategories: async () => ["Drawing", "Specification", "Contract", "Permit", "Report", "Calculation", "Presentation", "Other"],
    getDocumentStatuses: async () => ["Draft", "Under Review", "Approved", "Rejected", "Archived"],
};

const DocumentsPage = ({ projectId }) => {
    const [folders, setFolders] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null); // null for root
    const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
    const [isLoadingFolders, setIsLoadingFolders] = useState(true);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ category: "", status: "" });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const fetchFolders = useCallback(async () => {
        setIsLoadingFolders(true);
        try {
            const data = await mockApi.getFolders(projectId);
            setFolders(data);
        } catch (err) {
            console.error("Error fetching folders:", err);
            setError("Failed to load folders.");
        } finally {
            setIsLoadingFolders(false);
        }
    }, [projectId]);

    const fetchDocuments = useCallback(async () => {
        setIsLoadingDocuments(true);
        try {
            const currentFilters = { ...filters, search: searchTerm };
            const data = await mockApi.getDocuments(projectId, selectedFolderId, currentFilters);
            setDocuments(data);
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError("Failed to load documents.");
        } finally {
            setIsLoadingDocuments(false);
        }
    }, [projectId, selectedFolderId, searchTerm, filters]);

    const fetchFilterOptions = useCallback(async () => {
        try {
            const [fetchedCategories, fetchedStatuses] = await Promise.all([
                mockApi.getDocumentCategories(),
                mockApi.getDocumentStatuses(),
            ]);
            setCategories(fetchedCategories);
            setStatuses(fetchedStatuses);
        } catch (err) {
            console.error("Error fetching filter options:", err);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
        fetchFilterOptions();
    }, [fetchFolders, fetchFilterOptions]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]); // Refetch documents when folder or filters change

    const handleSelectFolder = (folderId) => {
        setSelectedFolderId(folderId);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchDocuments(); // Trigger refetch on explicit search submit (or could do on change)
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        fetchDocuments(); // Refresh documents list
    };

    const handleCreateFolderSuccess = () => {
        setIsCreateFolderModalOpen(false);
        fetchFolders(); // Refresh folder tree
    };

    return (
        <div className="flex h-[calc(100vh-var(--header-height))]"> {/* Adjust height based on layout */} 
            {/* Folder Tree Sidebar */}
            <aside className="w-64 border-r p-4 overflow-y-auto flex-shrink-0">
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                {isLoadingFolders ? (
                    <div>Loading folders...</div>
                ) : error && !folders.length ? (
                    <div className="text-red-500">Error loading folders.</div>
                ) : (
                    <FolderTree 
                        folders={folders} 
                        selectedFolderId={selectedFolderId} 
                        onSelectFolder={handleSelectFolder} 
                        onFolderCreated={fetchFolders} // Callback to refresh tree
                        onFolderDeleted={fetchFolders}
                        onFolderRenamed={fetchFolders}
                    />
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                {/* Header and Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h1 className="text-2xl font-bold">Documents</h1>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="flex gap-1">
                            <Input 
                                type="search" 
                                placeholder="Search documents..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-9 w-40 md:w-56"
                            />
                            <Button type="submit" variant="ghost" size="icon" className="h-9 w-9">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        {/* Filters (Example: Category) */}
                        <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                            <SelectTrigger className="h-9 w-36 text-xs">
                                <Filter className="h-3 w-3 mr-1"/>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         {/* Add more filters (Status, Tags, etc.) */}
                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-md h-9">
                            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="h-full w-9 rounded-r-none border-r">
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="h-full w-9 rounded-l-none">
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* Action Buttons */}
                        <Dialog open={isCreateFolderModalOpen} onOpenChange={setIsCreateFolderModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <FolderPlus className="mr-2 h-4 w-4" /> Create Folder
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Create New Folder</DialogTitle></DialogHeader>
                                <FolderForm 
                                    projectId={projectId} 
                                    parentFolderId={selectedFolderId} 
                                    onSuccess={handleCreateFolderSuccess} 
                                    onCancel={() => setIsCreateFolderModalOpen(false)} 
                                />
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-9">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Document
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader><DialogTitle>Upload New Document</DialogTitle></DialogHeader>
                                <DocumentUploadForm 
                                    projectId={projectId} 
                                    targetFolderId={selectedFolderId} 
                                    onSuccess={handleUploadSuccess} 
                                    onCancel={() => setIsUploadModalOpen(false)} 
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Document List/Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingDocuments ? (
                        <div className="text-center p-8">Loading documents...</div>
                    ) : error && !documents.length ? (
                        <div className="text-center p-8 text-red-500">Error loading documents.</div>
                    ) : !documents.length ? (
                        <div className="text-center p-8 text-muted-foreground">No documents found in this folder or matching filters.</div>
                    ) : viewMode === "list" ? (
                        <DocumentsList documents={documents} />
                    ) : (
                        <DocumentsGrid documents={documents} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default DocumentsPage;

