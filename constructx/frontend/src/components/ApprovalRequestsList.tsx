import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ApprovalRequestsListProps {
  requests: any[];
  onEdit: (request: any) => void;
  onCancel: (request: any) => void;
}

const ApprovalRequestsList: React.FC<ApprovalRequestsListProps> = ({ requests, onEdit, onCancel }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "In Progress":
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
      case "Cancelled":
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
            <TableHead>Request ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Entity Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No approval requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map(request => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.entityType}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                </TableCell>
                <TableCell>{request.dueDate}</TableCell>
                <TableCell>{request.requestedBy}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(request)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      {request.status !== "Approved" && request.status !== "Rejected" && request.status !== "Cancelled" && (
                        <DropdownMenuItem onClick={() => onCancel(request)} className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />Cancel
                        </DropdownMenuItem>
                      )}
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

export default ApprovalRequestsList;


