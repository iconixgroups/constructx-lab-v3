import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Download, Edit, Trash2, GitBranch, MessageSquare, CheckSquare, Users, Settings, Info } from "lucide-react";
import DocumentPreviewComponent from "./DocumentPreviewComponent";
import VersionHistoryComponent from "./VersionHistoryComponent";
import DocumentCommentsComponent from "./DocumentCommentsComponent";
import ApprovalWorkflowComponent from "./ApprovalWorkflowComponent";
import AccessControlComponent from "./AccessControlComponent";
import DocumentMetadataComponent from "./DocumentMetadataComponent"; // Assuming this component exists

// Mock API (replace with actual API calls)
const mockApi = {
    getDocumentDetails: async (docId) => {
        console.log("Fetching details for document:", docId);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Find the mock document (or fetch from backend)
        const allDocs = [
            { id: "doc1", projectId: "proj1", folderId: "folder3", name: "Floor_Plan_Level1.pdf", fileSize: 1500000, fileType: "application/pdf", status: "Approved", category: "Drawing", tags: ["level1", "architectural"], createdBy: "user1", createdAt: "2024-01-20T09:00:00Z", updatedAt: "2024-01-22T14:00:00Z", isLatestVersion: true, description: "Final approved floor plan for level 1.", filePath: "/mock/Floor_Plan_Level1.pdf" },
            { id: "doc2", projectId: "proj1", folderId: "folder4", name: "Beam_Calculations.xlsx", fileSize: 85000, fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", status: "Under Review", category: "Calculation", tags: ["structural", "steel"], createdBy: "user2", createdAt: "2024-01-21T10:30:00Z", updatedAt: "2024-01-21T10:30:00Z", isLatestVersion: true, description: "Structural beam load calculations.", filePath: "/mock/Beam_Calculations.xlsx" },
            // Add other mock docs if needed for testing
        ];
        const doc = allDocs.find(d => d.id === docId);
        if (!doc) throw new Error("Document not found");
        return doc;
    },
    // Add mock functions for versions, comments, approvals, access if needed by child components
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "approved": return "success";
        case "under review": return "warning";
        case "draft": return "secondary";
        case "rejected": return "destructive";
        case "archived": return "outline";
        default: return "secondary";
    }
};

const DocumentDetailsPage = () => {
    const { documentId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [document, setDocument] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "preview");

    const fetchDocument = useCallback(async () => {
        if (!documentId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getDocumentDetails(documentId);
            setDocument(data);
        } catch (err) {
            console.error("Error fetching document details:", err);
            setError(err.message || "Failed to load document details.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    useEffect(() => {
        // Update URL when tab changes
        setSearchParams({ tab: activeTab }, { replace: true });
    }, [activeTab, setSearchParams]);

    const handleAction = (action) => {
        console.log(`Action: ${action} on document ${documentId}`);
        if (action === "back") {
            window.history.back(); // Or navigate to project documents page
        } else if (action === "download") {
            alert(`Download placeholder for ${documentId}`);
        } else if (action === "edit") {
            alert(`Edit placeholder for ${documentId}`);
        } else if (action === "delete") {
            if (window.confirm("Are you sure you want to delete this document?")) {
                alert(`Delete placeholder for ${documentId}`);
                // Call API: mockApi.deleteDocument(documentId).then(() => navigate('/documents'));
            }
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center">Loading document details...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    if (!document) {
        return <div className="p-6 text-center">Document not found.</div>;
    }

    return (
        <div className="flex flex-col h-full p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction("back")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold break-all">{document.name}</h1>
                        <Badge variant={getStatusBadgeVariant(document.status)} className="mt-1">{document.status}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAction("edit")}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAction("download")}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleAction("delete")}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            {/* Main Content - Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="mb-4 flex-shrink-0 overflow-x-auto justify-start">
                    <TabsTrigger value="preview"><Eye className="mr-1 h-4 w-4" />Preview</TabsTrigger>
                    <TabsTrigger value="metadata"><Info className="mr-1 h-4 w-4" />Metadata</TabsTrigger>
                    <TabsTrigger value="versions"><GitBranch className="mr-1 h-4 w-4" />Versions</TabsTrigger>
                    <TabsTrigger value="comments"><MessageSquare className="mr-1 h-4 w-4" />Comments</TabsTrigger>
                    <TabsTrigger value="approvals"><CheckSquare className="mr-1 h-4 w-4" />Approvals</TabsTrigger>
                    <TabsTrigger value="access"><Users className="mr-1 h-4 w-4" />Access</TabsTrigger>
                    {/* <TabsTrigger value="settings"><Settings className="mr-1 h-4 w-4" />Settings</TabsTrigger> */}
                </TabsList>

                <TabsContent value="preview" className="flex-1 overflow-y-auto">
                    <DocumentPreviewComponent document={document} />
                </TabsContent>
                <TabsContent value="metadata" className="flex-1 overflow-y-auto p-1">
                    <DocumentMetadataComponent document={document} onUpdate={fetchDocument} />
                </TabsContent>
                <TabsContent value="versions" className="flex-1 overflow-y-auto p-1">
                    <VersionHistoryComponent documentId={documentId} currentVersion={document} />
                </TabsContent>
                <TabsContent value="comments" className="flex-1 overflow-y-auto p-1">
                    <DocumentCommentsComponent documentId={documentId} />
                </TabsContent>
                <TabsContent value="approvals" className="flex-1 overflow-y-auto p-1">
                    <ApprovalWorkflowComponent documentId={documentId} documentVersionId={document.id} /> {/* Assuming current doc is latest version */} 
                </TabsContent>
                <TabsContent value="access" className="flex-1 overflow-y-auto p-1">
                    <AccessControlComponent documentId={documentId} />
                </TabsContent>
                {/* <TabsContent value="settings">Document Settings</TabsContent> */}
            </Tabs>
        </div>
    );
};

export default DocumentDetailsPage;

