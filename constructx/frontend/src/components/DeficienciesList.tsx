import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Flag, User, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface DeficienciesListProps {
  deficiencies: any[];
  onEdit: (deficiency: any) => void;
  onDelete: (deficiency: any) => void;
  onUpdateStatus: (deficiency: any, status: string) => void;
  onAssign: (deficiency: any, assignedTo: string) => void;
}

const DeficienciesList: React.FC<DeficienciesListProps> = ({ deficiencies, onEdit, onDelete, onUpdateStatus, onAssign }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-blue-100 text-blue-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      case "Void":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deficiency #</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deficiencies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No deficiencies found.
              </TableCell>
            </TableRow>
          ) : (
            deficiencies.map(deficiency => (
              <TableRow key={deficiency.id}>
                <TableCell className="font-medium">{deficiency.deficiencyNumber}</TableCell>
                <TableCell>{deficiency.description}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(deficiency.status)}>{deficiency.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${getPriorityColor(deficiency.priority)}`}>{deficiency.priority}</span>
                </TableCell>
                <TableCell>{deficiency.assignedTo || "Unassigned"}</TableCell>
                <TableCell>{deficiency.dueDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(deficiency)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      {deficiency.status !== "Closed" && deficiency.status !== "Void" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(deficiency, "Resolved")}>
                          <Check className="mr-2 h-4 w-4" />Mark as Resolved
                        </DropdownMenuItem>
                      )}
                      {deficiency.status === "Resolved" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(deficiency, "Closed")}>
                          <Check className="mr-2 h-4 w-4" />Mark as Closed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(deficiency)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeficienciesList;


