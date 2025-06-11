import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Clock, Calendar, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "../lib/utils";

// Helper to get initials
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
};

// Helper function to determine badge variant based on priority
const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
        case "critical": return "destructive";
        case "high": return "warning";
        case "medium": return "default";
        case "low": return "secondary";
        default: return "secondary";
    }
};

const TaskCard = ({ task, onEdit, onDelete }) => {
    const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== "Completed";

    return (
        <Card className="mb-2 hover:shadow-md transition-shadow duration-200 bg-card">
            <CardHeader className="p-3 pb-1">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium leading-tight break-words">{task.title}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            {/* Add View Details action */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {task.priority && (
                    <Badge variant={getPriorityBadgeVariant(task.priority)} className="mt-1 w-fit text-xs px-1.5 py-0.5 h-auto">
                        {task.priority}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="p-3 pt-1 pb-2 text-xs space-y-2">
                {/* Progress Bar */} 
                {task.completionPercentage !== undefined && task.completionPercentage !== null && (
                    <div className="flex items-center gap-1.5">
                        <Progress value={task.completionPercentage} className="h-1 flex-grow" />
                        <span className="text-muted-foreground">{task.completionPercentage}%</span>
                    </div>
                )}
                {/* Due Date */} 
                {task.dueDate && (
                    <div className={cn("flex items-center gap-1 text-muted-foreground", isOverdue && "text-destructive font-medium")}>
                        <Calendar className="h-3 w-3" />
                        <span>{format(parseISO(task.dueDate), "MMM d")}</span>
                        {isOverdue && <span className="text-xs">(Overdue)</span>}
                    </div>
                )}
                {/* Estimated/Actual Hours (Optional) */} 
                {(task.estimatedHours || task.actualHours) && (
                     <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{task.actualHours || 0}h / {task.estimatedHours || "."}h</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                {/* Placeholder for tags or other info */}
                <div className="text-xs text-muted-foreground">ID: {task.id.substring(0, 6)}...</div>
                {task.assignedTo ? (
                    <Avatar className="h-6 w-6 border text-xs" title={task.assignedTo.name}>
                        <AvatarImage src={task.assignedTo.avatarUrl} />
                        <AvatarFallback>{getInitials(task.assignedTo.name)}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="h-6 w-6 border bg-muted" title="Unassigned">
                        <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                )}
            </CardFooter>
        </Card>
    );
};

export default TaskCard;

