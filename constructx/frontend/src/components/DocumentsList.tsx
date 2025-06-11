import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Download, Edit, Trash2, Eye, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

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

const DocumentsList = ({ documents }) => {
    const navigate = useNavigate();
    const [selectedRowIds, setSelectedRowIds] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const newSelectedRowIds = {};
        if (isChecked) {
            documents.forEach(doc => newSelectedRowIds[doc.id] = true);
        }
        setSelectedRowIds(newSelectedRowIds);
    };

    const handleSelectRow = (id) => {
        setSelectedRowIds(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedDocuments = useMemo(() => {
        let sortableItems = [...documents];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle different data types for sorting
                if (typeof aValue === "string" && typeof bValue === "string") {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                } else if (sortConfig.key === "fileSize") {
                    aValue = a.fileSize || 0;
                    bValue = b.fileSize || 0;
                } else if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
                    aValue = a[sortConfig.key] ? new Date(a[sortConfig.key]) : new Date(0);
                    bValue = b[sortConfig.key] ? new Date(b[sortConfig.key]) : new Date(0);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [documents, sortConfig]);

    const handleAction = (action, docId) => {
        console.log(`Action: ${action} on document ${docId}`);
        if (action === "view") {
            navigate(`/documents/${docId}`); // Navigate to details page
        } else if (action === "download") {
            // Trigger download API call
            alert(`Download placeholder for ${docId}`);
        } else if (action === "edit") {
            // Open edit modal or navigate to edit page
            alert(`Edit placeholder for ${docId}`);
        } else if (action === "delete") {
            // Show confirmation and call delete API
            if (window.confirm("Are you sure you want to delete this document?")) {
                alert(`Delete placeholder for ${docId}`);
                // Call API: mockApi.deleteDocument(docId).then(() => fetchDocuments());
            }
        } else if (action === "versions") {
             navigate(`/documents/${docId}?tab=versions`); // Navigate to details page, versions tab
        }
    };

    const numSelected = Object.values(selectedRowIds).filter(Boolean).length;
    const rowCount = sortedDocuments.length;

    return (
        <div className="border rounded-lg">
            {/* TODO: Add Bulk Action Bar when numSelected > 0 */}
            {numSelected > 0 && (
                <div className="p-2 bg-muted border-b flex items-center gap-2">
                    <span className="text-sm font-medium">{numSelected} selected</span>
                    <Button variant="outline" size="xs">Archive</Button>
                    <Button variant="destructive" size="xs">Delete</Button>
                    {/* Add more bulk actions */} 
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead padding="checkbox" className="w-[40px]">
                            <Checkbox
                                checked={numSelected === rowCount && rowCount > 0}
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                onCheckedChange={(checked) => handleSelectAll({ target: { checked } })}
                            />
                        </TableHead>
                        <TableHead onClick={() => requestSort("name")} className="cursor-pointer hover:bg-muted/50">
                            Name <ArrowUpDown className="ml-1 h-3 w-3 inline-block" />
                        </TableHead>
                        <TableHead onClick={() => requestSort("status")} className="cursor-pointer hover:bg-muted/50">
                            Status <ArrowUpDown className="ml-1 h-3 w-3 inline-block" />
                        </TableHead>
                        <TableHead onClick={() => requestSort("category")} className="cursor-pointer hover:bg-muted/50">
                            Category <ArrowUpDown className="ml-1 h-3 w-3 inline-block" />
                        </TableHead>
                        <TableHead onClick={() => requestSort("fileSize")} className="cursor-pointer hover:bg-muted/50">
                            Size <ArrowUpDown className="ml-1 h-3 w-3 inline-block" />
                        </TableHead>
                        <TableHead onClick={() => requestSort("updatedAt")} className="cursor-pointer hover:bg-muted/50">
                            Last Updated <ArrowUpDown className="ml-1 h-3 w-3 inline-block" />
                        </TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedDocuments.map((doc) => (
                        <TableRow key={doc.id} data-state={selectedRowIds[doc.id] ? "selected" : ""}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={!!selectedRowIds[doc.id]}
                                    onCheckedChange={() => handleSelectRow(doc.id)}
                                />
                            </TableCell>
                            <TableCell className="font-medium break-all">
                                <a href={`/documents/${doc.id}`} onClick={(e) => { e.preventDefault(); handleAction("view", doc.id); }} className="hover:underline">
                                    {doc.name}
                                </a>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                            </TableCell>
                            <TableCell>{doc.category}</TableCell>
                            <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                            <TableCell>{doc.updatedAt ? format(new Date(doc.updatedAt), "PP pp") : "N/A"}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleAction("view", doc.id)}>
                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("download", doc.id)}>
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("versions", doc.id)}>
                                            <GitBranch className="mr-2 h-4 w-4" /> Version History
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("edit", doc.id)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Metadata
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("delete", doc.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* TODO: Add Pagination Controls */}
            <div className="p-2 border-t text-sm text-muted-foreground">
                {rowCount} document(s)
            </div>
        </div>
    );
};

export default DocumentsList;

