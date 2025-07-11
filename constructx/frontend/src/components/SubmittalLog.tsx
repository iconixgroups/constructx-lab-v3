import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SubmittalLogProps {
  submittals: any[];
  onEdit: (submittal: any) => void;
  onDelete: (submittal: any) => void;
}

const SubmittalLog: React.FC<SubmittalLogProps> = ({ submittals, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Approved as Noted":
        return "bg-green-100 text-green-800";
      case "Under Review":
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Revise and Resubmit":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-orange-500 text-white";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submittal #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Spec Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Ball-in-Court</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submittals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No submittals found.
              </TableCell>
            </TableRow>
          ) : (
            submittals.map(submittal => (
              <TableRow key={submittal.id}>
                <TableCell className="font-medium">{submittal.submittalNumber}</TableCell>
                <TableCell>{submittal.title}</TableCell>
                <TableCell>{submittal.specificationSection}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(submittal.status)}>{submittal.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(submittal.priority)}>{submittal.priority}</Badge>
                </TableCell>
                <TableCell>{submittal.dueDate}</TableCell>
                <TableCell>{submittal.ballInCourt}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(submittal)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(submittal)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />View Details
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

export default SubmittalLog;


