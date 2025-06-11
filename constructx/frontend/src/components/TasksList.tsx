import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// Helper to get initials
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "completed": return "default";
        case "in progress": return "success";
        case "not started": return "secondary";
        case "on hold": return "warning";
        case "cancelled": return "destructive";
        default: return "secondary";
    }
};

// Helper function to determine badge variant based on priority
const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
        case "critical": return "destructive";
        case "high": return "warning"; // Or maybe a different color like orange
        case "medium": return "default";
        case "low": return "secondary";
        default: return "secondary";
    }
};

const TasksList = ({ tasks, onEditTask, onDeleteTask }) => {
    if (!tasks || tasks.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No tasks found matching your criteria.</div>;
    }

    // TODO: Add sorting logic based on props
    // TODO: Add pagination logic
    // TODO: Add hierarchical view for subtasks

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell><Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge></TableCell>
                            <TableCell><Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge></TableCell>
                            <TableCell>
                                {task.assignedTo ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 border text-xs">
                                            <AvatarImage src={task.assignedTo.avatarUrl} />
                                            <AvatarFallback>{getInitials(task.assignedTo.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{task.assignedTo.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">Unassigned</span>
                                )}
                            </TableCell>
                            <TableCell>{task.dueDate ? format(parseISO(task.dueDate), "PP") : "N/A"}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={task.completionPercentage} className="h-1.5 w-16" />
                                    <span className="text-xs text-muted-foreground">{task.completionPercentage}%</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEditTask(task)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                        {/* Add other actions like View Details, Add Subtask, etc. */}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Add Pagination controls here */}
        </div>
    );
};

export default TasksList;

