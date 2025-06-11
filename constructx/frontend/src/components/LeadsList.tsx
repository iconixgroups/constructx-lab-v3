import React, { useState } from "react";
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
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from 'date-fns'; // For date formatting

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const LeadsList = ({ leads, onEditLead, onDeleteLead }) => {
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" });

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelecteds = new Set(leads.map((lead) => lead.id));
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
            // Optional: Cycle back to no sort or keep descending
            direction = "ascending"; // Cycle back to ascending
        }
        setSortConfig({ key, direction });
        // TODO: Add actual sorting logic here or pass sortConfig up to parent to refetch sorted data
    };

    // Apply sorting (client-side example, ideally done server-side)
    const sortedLeads = React.useMemo(() => {
        let sortableItems = [...leads];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle different data types for sorting
                if (sortConfig.key === "createdAt" || sortConfig.key === "lastActivityAt") {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
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
    }, [leads, sortConfig]);

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
        }
        return sortConfig.direction === "ascending" ? 
            <ArrowUpDown className="ml-2 h-3 w-3" /> : 
            <ArrowUpDown className="ml-2 h-3 w-3" />; // Icons could be more specific (Up/Down)
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox
                                checked={selectedRows.size === leads.length && leads.length > 0}
                                indeterminate={selectedRows.size > 0 && selectedRows.size < leads.length}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedRows(new Set(leads.map(l => l.id)));
                                    } else {
                                        setSelectedRows(new Set());
                                    }
                                }}
                            />
                        </TableHead>
                        <TableHead onClick={() => requestSort("name")} className="cursor-pointer">
                            <div className="flex items-center">Lead Name {getSortIcon("name")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("status")} className="cursor-pointer">
                             <div className="flex items-center">Status {getSortIcon("status")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("estimatedValue")} className="cursor-pointer">
                             <div className="flex items-center">Est. Value {getSortIcon("estimatedValue")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("probability")} className="cursor-pointer">
                             <div className="flex items-center">Probability {getSortIcon("probability")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("assignedTo")} className="cursor-pointer">
                             <div className="flex items-center">Assigned To {getSortIcon("assignedTo")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("lastActivityAt")} className="cursor-pointer">
                             <div className="flex items-center">Last Activity {getSortIcon("lastActivityAt")}</div>
                        </TableHead>
                        <TableHead onClick={() => requestSort("createdAt")} className="cursor-pointer">
                             <div className="flex items-center">Created At {getSortIcon("createdAt")}</div>
                        </TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedLeads.map((lead) => (
                        <TableRow key={lead.id} data-state={selectedRows.has(lead.id) ? "selected" : ""}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedRows.has(lead.id)}
                                    onCheckedChange={() => handleSelectRow(lead.id)}
                                />
                            </TableCell>
                            <TableCell className="font-medium truncate max-w-[200px]" title={lead.name}>{lead.name}</TableCell>
                            <TableCell><Badge variant={lead.status === "Won" ? "success" : lead.status === "Lost" ? "destructive" : "outline"}>{lead.status}</Badge></TableCell>
                            <TableCell>{formatCurrency(lead.estimatedValue)}</TableCell>
                            <TableCell>{lead.probability}%</TableCell>
                            <TableCell>{lead.assignedTo?.name || "Unassigned"} {/* Replace with actual user lookup */}</TableCell>
                            <TableCell>{lead.lastActivityAt ? format(new Date(lead.lastActivityAt), "PPp") : "N/A"}</TableCell>
                            <TableCell>{format(new Date(lead.createdAt), "PP")}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEditLead(lead)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteLead(lead.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                        {/* Add Convert to Project action */} 
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {leads.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                                No leads found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Add Pagination controls here */} 
        </div>
    );
};

export default LeadsList;

