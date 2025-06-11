import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, Download, Edit, Trash2, Eye, GitBranch, FileText, FileImage, FileArchive, FileAudio, FileVideo, Paperclip } from "lucide-react";
import { format } from "date-fns";

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

// Helper to get file icon (larger version for grid)
const getFileIconLarge = (fileType) => {
    const iconProps = { className: "h-10 w-10 text-muted-foreground mb-2" };
    if (!fileType) return <Paperclip {...iconProps} />;
    if (fileType.startsWith("image/")) return <FileImage {...iconProps} className="h-10 w-10 text-blue-500 mb-2" />;
    if (fileType.startsWith("audio/")) return <FileAudio {...iconProps} className="h-10 w-10 text-purple-500 mb-2" />;
    if (fileType.startsWith("video/")) return <FileVideo {...iconProps} className="h-10 w-10 text-orange-500 mb-2" />;
    if (fileType === "application/pdf") return <FileText {...iconProps} className="h-10 w-10 text-red-500 mb-2" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return <FileText {...iconProps} className="h-10 w-10 text-green-500 mb-2" />;
    if (fileType.includes("document") || fileType.includes("word")) return <FileText {...iconProps} className="h-10 w-10 text-blue-600 mb-2" />;
    if (fileType.includes("zip") || fileType.includes("archive")) return <FileArchive {...iconProps} className="h-10 w-10 text-yellow-500 mb-2" />;
    return <Paperclip {...iconProps} className="h-10 w-10 text-gray-500 mb-2" />;
};

const DocumentCard = ({ doc }) => {
    const navigate = useNavigate();

    const handleAction = (action, docId) => {
        console.log(`Action: ${action} on document ${docId}`);
        if (action === "view") {
            navigate(`/documents/${docId}`);
        } else if (action === "download") {
            alert(`Download placeholder for ${docId}`);
        } else if (action === "edit") {
            alert(`Edit placeholder for ${docId}`);
        } else if (action === "delete") {
            if (window.confirm("Are you sure you want to delete this document?")) {
                alert(`Delete placeholder for ${docId}`);
            }
        } else if (action === "versions") {
             navigate(`/documents/${docId}?tab=versions`);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 flex flex-col">
            <CardHeader className="p-3 pb-1 flex-row items-start justify-between">
                <CardTitle className="text-sm font-medium leading-tight break-all pr-2 flex-grow">
                    <a href={`/documents/${doc.id}`} onClick={(e) => { e.preventDefault(); handleAction("view", doc.id); }} className="hover:underline">
                        {doc.name}
                    </a>
                </CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleAction("view", doc.id)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction("download", doc.id)}><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction("versions", doc.id)}><GitBranch className="mr-2 h-4 w-4" /> Version History</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction("edit", doc.id)}><Edit className="mr-2 h-4 w-4" /> Edit Metadata</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAction("delete", doc.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-3 pt-1 flex-grow flex flex-col items-center justify-center text-center">
                {/* Placeholder for Thumbnail or Icon */} 
                {/* <img src={doc.thumbnailUrl || getFileIconLarge(doc.fileType)} alt={doc.name} className="mb-2 h-16 object-contain" /> */} 
                {getFileIconLarge(doc.fileType)}
                <Badge variant={getStatusBadgeVariant(doc.status)} className="mt-1 text-xs">{doc.status}</Badge>
            </CardContent>
            <CardFooter className="p-3 pt-1 text-xs text-muted-foreground flex justify-between items-center border-t">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{doc.updatedAt ? format(new Date(doc.updatedAt), "PP") : "N/A"}</span>
            </CardFooter>
        </Card>
    );
};

const DocumentsGrid = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No documents to display.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
            ))}
        </div>
    );
};

export default DocumentsGrid;

