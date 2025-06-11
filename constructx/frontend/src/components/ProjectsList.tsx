import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { format } from 'date-fns';

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

const ProjectsList = ({ projects, onEditProject, onDeleteProject }) => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: "startDate", direction: "descending" });

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelecteds = new Set(projects.map((project) => project.id));
            setSelectedRows(newSelecteds);
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (id) => {
        const newSelecteds = new Set(selectedRows);
        if (newSelecteds.has(id)) {
            newSelecteds.delete(id);
        } else {
            newSelecteds.add(id);
        }
        setSelectedRows(newSelecteds);
    };

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        } else if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
        // TODO: Add actual sorting logic here or pass sortConfig up to parent to refetch sorted data
    };

    // Apply sorting (client-side example, ideally done server-side)
    const sortedProjects = React.useMemo(() => {
        let sortableItems = [...projects];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested objects like projectManager
                if (sortConfig.key === "projectManager") {
                    aValue = a.projectManager?.name || "";
                    bValue = b.projectManager?.name || "";
                }
                // Handle dates
                if (["startDate", "targetCompletionDate", "actualCompletionDate"].includes(sortConfig.key)) {
                    aValue = aValue ? new Date(aValue) : new Date(0); // Handle null dates
                    bValue = bValue ? new Date(bValue) : new Date(0);
                }
                // Handle numbers
                if (["budget", "progress"].includes(sortConfig.key)) {
                    aValue = Number(aValue) || 0;
                    bValue = Number(bValue) || 0;
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
    }, [projects, sortConfig]);

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
        }
        return sortConfig.direction === "ascending" ?
            <ArrowUpDown className="ml-2 h-3 w-3" /> : // Replace with specific up/down icons if desired
            <ArrowUpDown className="ml-2 h-3 w-3" />;
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox
                                checked={selectedRows.size === projects.length && projects.length > 0}
                                indeterminate={selectedRows.size > 0 && selectedRows.size < projects.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedRows(new Set(projects.map(p => p.id)));
                                    } else {
                                        setSelectedRows(new Set());
                                    }
                                }}
                            />
                        </TableHead>
                        <TableHead onClick={() => requestSort("name")} className="cursor-pointer">
                            <div className="flex items-center">Project Name {getSortIcon("name")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("code")} className="cursor-pointer">
                            <div className="flex items-center">Code {getSortIcon("code")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("status")} className="cursor-pointer">
                             <div className="flex items-center">Status {getSortIcon("status")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("progress")} className="cursor-pointer">
                             <div className="flex items-center">Progress {getSortIcon("progress")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("projectManager")} className="cursor-pointer">
                             <div className="flex items-center">Manager {getSortIcon("projectManager")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("startDate")} className="cursor-pointer">
                             <div className="flex items-center">Start Date {getSortIcon("startDate")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("targetCompletionDate")} className="cursor-pointer">
                             <div className="flex items-center">Target Date {getSortIcon("targetCompletionDate")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("budget")} className="cursor-pointer">
                             <div className="flex items-center">Budget {getSortIcon("budget")}</div>
                        </TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedProjects.map((project) => (
                        <TableRow
                            key={project.id}
                            data-state={selectedRows.has(project.id) ? "selected" : ""}
                            className="cursor-pointer"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <TableCell onClick={(e) => e.stopPropagation()}> {/* Prevent row click */} 
                                <Checkbox
                                    checked={selectedRows.has(project.id)}
                                    onCheckedChange={() => handleSelectRow(project.id)}
                                />
                            </TableCell>
                            <TableCell className="font-medium truncate max-w-[250px]" title={project.name}>{project.name}</TableCell>
                            <TableCell>{project.code}</TableCell>
                            <TableCell><Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={project.progress} className="h-1.5 w-16" />
                                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                </div>
                            </TableCell>
                            <TableCell>{project.projectManager?.name || "N/A"}</TableCell>
                            <TableCell>{project.startDate ? format(new Date(project.startDate), "PP") : "N/A"}</TableCell>
                            <TableCell>{project.targetCompletionDate ? format(new Date(project.targetCompletionDate), "PP") : "N/A"}</TableCell>
                            <TableCell>{formatCurrency(project.budget)}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}> {/* Prevent row click */} 
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                                            <ExternalLink className="mr-2 h-4 w-4" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEditProject(project)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {projects.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center">
                                No projects found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Add Pagination controls here */} 
        </div>
    );
};

export default ProjectsList;

