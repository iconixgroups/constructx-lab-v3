import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Play, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface InspectionsListProps {
  inspections: any[];
  onEdit: (inspection: any) => void;
  onDelete: (inspection: any) => void;
  onStart: (inspection: any) => void;
  onComplete: (inspection: any) => void;
}

const InspectionsList: React.FC<InspectionsListProps> = ({ inspections, onEdit, onDelete, onStart, onComplete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Pass":
        return "bg-green-500 text-white";
      case "Fail":
        return "bg-red-500 text-white";
      case "Pass with Deficiencies":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inspection #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No inspections found.
              </TableCell>
            </TableRow>
          ) : (
            inspections.map(inspection => (
              <TableRow key={inspection.id}>
                <TableCell className="font-medium">{inspection.inspectionNumber}</TableCell>
                <TableCell>{inspection.title}</TableCell>
                <TableCell>{inspection.type}</TableCell>
                <TableCell>{inspection.scheduledDate}</TableCell>
                <TableCell>{inspection.location}</TableCell>
                <TableCell>{inspection.inspector}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                </TableCell>
                <TableCell>
                  {inspection.overallResult && (
                    <Badge className={getResultColor(inspection.overallResult)}>{inspection.overallResult}</Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => onEdit(inspection)}>
                        <Edit className="mr-2 h-4 w-4" />Edit Schedule
                      </DropdownMenuItem>
                      {inspection.status === "Scheduled" && (
                        <DropdownMenuItem onClick={() => onStart(inspection)}>
                          <Play className="mr-2 h-4 w-4" />Start Inspection
                        </DropdownMenuItem>
                      )}
                      {inspection.status === "In Progress" && (
                        <DropdownMenuItem onClick={() => onComplete(inspection)}>
                          <CheckCircle className="mr-2 h-4 w-4" />Complete Inspection
                        </DropdownMenuItem>
                      )}
                      {(inspection.status === "Scheduled" || inspection.status === "In Progress") && (
                        <DropdownMenuItem onClick={() => onDelete(inspection)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />Cancel Inspection
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

export default InspectionsList;


