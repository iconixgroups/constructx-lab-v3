import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface RFIKanbanBoardProps {
  rfis: any[];
  onEdit: (rfi: any) => void;
  onStatusChange: (rfiId: string, newStatus: string) => void;
}

const RFIKanbanBoard: React.FC<RFIKanbanBoardProps> = ({ rfis, onEdit, onStatusChange }) => {
  const statuses = ["Draft", "Submitted", "Under Review", "Responded", "Closed"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-200 text-gray-800";
      case "Submitted": return "bg-blue-200 text-blue-800";
      case "Under Review": return "bg-yellow-200 text-yellow-800";
      case "Responded": return "bg-green-200 text-green-800";
      case "Closed": return "bg-purple-200 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-white";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {statuses.map(status => (
        <div key={status} className="flex-shrink-0 w-80">
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                {status}
                <Badge variant="secondary">{rfis.filter(r => r.status === status).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[200px]">
              {rfis.filter(r => r.status === status).map(rfi => (
                <Card key={rfi.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-semibold">{rfi.rfiNumber}</CardTitle>
                      <Badge className={getPriorityColor(rfi.priority)}>{rfi.priority}</Badge>
                    </div>
                    <CardDescription className="text-xs">{rfi.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-sm">
                    <p className="text-muted-foreground text-xs">Due: {rfi.dueDate}</p>
                    <p className="text-muted-foreground text-xs">Assigned: {rfi.assignedTo}</p>
                    <div className="flex justify-end mt-2">
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
                          <DropdownMenuSeparator />
                          {statuses.map(s => s !== rfi.status && (
                            <DropdownMenuItem key={s} onClick={() => onStatusChange(rfi.id, s)}>
                              Move to {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RFIKanbanBoard;


