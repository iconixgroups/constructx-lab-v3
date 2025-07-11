import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, FileText, CheckCircle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface LogEntriesListProps {
  logEntries: any[];
  onEdit: (logEntry: any) => void;
  onDelete: (logEntry: any) => void;
  onSubmit: (logEntry: any) => void;
  onApprove: (logEntry: any) => void;
}

const LogEntriesList: React.FC<LogEntriesListProps> = ({ logEntries, onEdit, onDelete, onSubmit, onApprove }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-orange-100 text-orange-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Archived":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entry #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Log Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No log entries found.
              </TableCell>
            </TableRow>
          ) : (
            logEntries.map(logEntry => (
              <TableRow key={logEntry.id}>
                <TableCell className="font-medium">{logEntry.entryNumber}</TableCell>
                <TableCell>{logEntry.title}</TableCell>
                <TableCell>{logEntry.logTypeId}</TableCell>
                <TableCell>{logEntry.entryDate}</TableCell>
                <TableCell>{logEntry.createdBy}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(logEntry.status)}>{logEntry.status}</Badge>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(logEntry)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      {logEntry.status === "Draft" && (
                        <DropdownMenuItem onClick={() => onSubmit(logEntry)}>
                          <FileText className="mr-2 h-4 w-4" />Submit
                        </DropdownMenuItem>
                      )}
                      {logEntry.status === "Submitted" && (
                        <DropdownMenuItem onClick={() => onApprove(logEntry)}>
                          <CheckCircle className="mr-2 h-4 w-4" />Approve
                        </DropdownMenuItem>
                      )}
                      {(logEntry.status === "Draft" || logEntry.status === "Submitted") && (
                        <DropdownMenuItem onClick={() => onDelete(logEntry)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      )}
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

export default LogEntriesList;


