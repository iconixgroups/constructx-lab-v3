import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Download, GitCommit, History, Eye } from "lucide-react";
import { format } from "date-fns";

// Mock API (replace with actual API calls)
const mockApi = {
    getDocumentVersions: async (docId) => {
        console.log("Fetching versions for document:", docId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock versions (assuming docId 'doc1' from previous examples)
        if (docId === "doc1") {
            return [
                { id: "v3", documentId: "doc1", versionNumber: 3, fileSize: 1500000, filePath: "/mock/Floor_Plan_Level1_v3.pdf", changeDescription: "Final approved version.", createdBy: "user1", createdAt: "2024-01-22T14:00:00Z", status: "Approved" },
                { id: "v2", documentId: "doc1", versionNumber: 2, fileSize: 1450000, filePath: "/mock/Floor_Plan_Level1_v2.pdf", changeDescription: "Incorporated feedback from structural team.", createdBy: "user1", createdAt: "2024-01-21T11:00:00Z", status: "Superseded" },
                { id: "v1", documentId: "doc1", versionNumber: 1, fileSize: 1400000, filePath: "/mock/Floor_Plan_Level1_v1.pdf", changeDescription: "Initial draft.", createdBy: "user1", createdAt: "2024-01-20T09:00:00Z", status: "Superseded" },
            ];
        }
        return [];
    },
    restoreVersion: async (docId, versionId) => {
        console.log(`Restoring document ${docId} to version ${versionId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, this would update the main document record
        // and potentially create a new version based on the restored one.
        return { success: true, message: "Document restored successfully." };
    },
    // Add API for version comparison if needed
};

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const VersionHistoryComponent = ({ documentId, currentVersion }) => {
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const fetchVersions = useCallback(async () => {
        if (!documentId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getDocumentVersions(documentId);
            setVersions(data);
        } catch (err) {
            console.error("Error fetching versions:", err);
            setError("Failed to load version history.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    const handleRestore = async (versionId, versionNumber) => {
        if (isRestoring) return;
        if (window.confirm(`Are you sure you want to restore to Version ${versionNumber}? This will make it the current version.`)) {
            setIsRestoring(true);
            try {
                await mockApi.restoreVersion(documentId, versionId);
                alert("Version restored successfully!");
                // Potentially refetch document details on the parent page
                // or update the currentVersion prop if possible
                fetchVersions(); // Refetch versions to show updated status if applicable
            } catch (err) {
                console.error("Error restoring version:", err);
                alert("Failed to restore version.");
            } finally {
                setIsRestoring(false);
            }
        }
    };

    const handleAction = (action, version) => {
        console.log(`Action: ${action} on version ${version.versionNumber}`);
        if (action === "download") {
            alert(`Download placeholder for version ${version.versionNumber}`);
            // Call API: GET /api/documents/versions/:id/download
        } else if (action === "preview") {
            alert(`Preview placeholder for version ${version.versionNumber}`);
            // Open preview modal/page for specific version
            // Needs URL like /api/documents/versions/:id/preview
        }
        // Add compare action if implemented
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading version history...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    if (!versions || versions.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No version history available.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Optional: Add button to upload new version */} 
            {/* <Button size="sm">Upload New Version</Button> */}
            
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Version</TableHead>
                            <TableHead>Change Description</TableHead>
                            <TableHead className="w-[150px]">Modified By</TableHead>
                            <TableHead className="w-[180px]">Modified Date</TableHead>
                            <TableHead className="w-[100px]">Size</TableHead>
                            <TableHead className="w-[180px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {versions.map((version) => (
                            <TableRow key={version.id} className={currentVersion?.id === version.id ? "bg-muted/50 font-semibold" : ""}>
                                <TableCell>
                                    <Badge variant={currentVersion?.id === version.id ? "default" : "secondary"}>
                                        V{version.versionNumber}
                                        {currentVersion?.id === version.id && " (Current)"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{version.changeDescription || "-"}</TableCell>
                                <TableCell className="text-sm">{version.createdBy}</TableCell> {/* Replace with actual user name */} 
                                <TableCell className="text-sm">{format(new Date(version.createdAt), "PP pp")}</TableCell>
                                <TableCell className="text-sm">{formatFileSize(version.fileSize)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Preview Version" onClick={() => handleAction("preview", version)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Download Version" onClick={() => handleAction("download", version)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    {currentVersion?.id !== version.id && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7" 
                                            title={`Restore to V${version.versionNumber}`}
                                            onClick={() => handleRestore(version.id, version.versionNumber)}
                                            disabled={isRestoring}
                                        >
                                            <History className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {/* Add Compare Button if applicable */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default VersionHistoryComponent;

