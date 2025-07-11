import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface RFIsListProps {
  rfis: any[];
  onEdit: (rfi: any) => void;
  onDelete: (rfi: any) => void;
}

const RFIsList: React.FC<RFIsListProps> = ({ rfis, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RFI #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfis.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No RFIs found.
              </TableCell>
            </TableRow>
          ) : (
            rfis.map(rfi => (
              <TableRow key={rfi.id}>
                <TableCell className="font-medium">{rfi.rfiNumber}</TableCell>
                <TableCell>{rfi.title}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      rfi.status === "Closed" ? "outline" :
                      rfi.status === "Responded" ? "secondary" :
                      rfi.status === "Under Review" ? "default" :
                      "destructive"
                    }
                  >
                    {rfi.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      rfi.priority === "High" || rfi.priority === "Critical" ? "destructive" :
                      rfi.priority === "Medium" ? "default" :
                      "outline"
                    }
                  >
                    {rfi.priority}
                  </Badge>
                </TableCell>
                <TableCell>{rfi.category}</TableCell>
                <TableCell>{rfi.dueDate}</TableCell>
                <TableCell>{rfi.submittedBy}</TableCell>
                <TableCell>{rfi.assignedTo}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(rfi)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(rfi)} className="text-red-600">
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

export default RFIsList;


