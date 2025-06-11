import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Assuming this library is installed
import TaskCard from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

// Helper function to group tasks by status
const groupTasksByStatus = (tasks, statuses) => {
    const grouped = {};
    // Initialize columns based on provided statuses to maintain order
    statuses.forEach(status => {
        grouped[status] = [];
    });
    // Group tasks
    tasks.forEach(task => {
        if (grouped[task.status]) {
            grouped[task.status].push(task);
        } else {
            // Handle tasks with statuses not in the main list (e.g., "Cancelled")
            if (!grouped[task.status]) {
                grouped[task.status] = [];
            }
            grouped[task.status].push(task);
        }
    });
    return grouped;
};

const TasksBoard = ({ tasks, statuses, onEditTask, onDeleteTask, onStatusChange }) => {
    const [columns, setColumns] = useState({});

    useEffect(() => {
        // Ensure statuses is an array before grouping
        const validStatuses = Array.isArray(statuses) ? statuses : [];
        setColumns(groupTasksByStatus(tasks || [], validStatuses));
    }, [tasks, statuses]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // Dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumnStatus = source.droppableId;
        const endColumnStatus = destination.droppableId;
        const taskId = draggableId;

        // Moving within the same column (reordering - optional)
        if (startColumnStatus === endColumnStatus) {
            // TODO: Implement reordering logic if needed
            console.log(`Reordering task ${taskId} within status ${startColumnStatus}`);
            // Update local state for immediate feedback (optional)
            const column = columns[startColumnStatus];
            const newTasks = Array.from(column);
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);

            const newColumns = {
                ...columns,
                [startColumnStatus]: newTasks,
            };
            setColumns(newColumns);
            // API call to update order might be needed here
            return;
        }

        // Moving to a different column (status change)
        console.log(`Moving task ${taskId} from ${startColumnStatus} to ${endColumnStatus}`);
        onStatusChange(taskId, endColumnStatus);

        // Update local state for immediate feedback
        const startColumnTasks = Array.from(columns[startColumnStatus]);
        const [movedTask] = startColumnTasks.splice(source.index, 1);
        const endColumnTasks = Array.from(columns[endColumnStatus]);
        endColumnTasks.splice(destination.index, 0, { ...movedTask, status: endColumnStatus }); // Update status locally

        const newColumns = {
            ...columns,
            [startColumnStatus]: startColumnTasks,
            [endColumnStatus]: endColumnTasks,
        };
        setColumns(newColumns);
    };

    // Ensure statuses is an array before mapping
    const orderedStatuses = Array.isArray(statuses) ? statuses : Object.keys(columns);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-4">
                    {orderedStatuses.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <Card
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`w-72 flex-shrink-0 h-full ${snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/20"}`}
                                >
                                    <CardHeader className="sticky top-0 bg-muted/20 z-10 backdrop-blur-sm px-4 py-3 border-b">
                                        <CardTitle className="text-sm font-medium flex justify-between items-center">
                                            <span>{status}</span>
                                            <span className="text-xs font-normal text-muted-foreground bg-background border rounded-full px-1.5 py-0.5">
                                                {columns[status]?.length || 0}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}> {/* Adjust maxHeight as needed */} 
                                        {(columns[status] || []).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            userSelect: "none",
                                                            ...provided.draggableProps.style,
                                                        }}
                                                        className={`mb-2 ${snapshot.isDragging ? "opacity-80 shadow-lg" : ""}`}
                                                    >
                                                        <TaskCard
                                                            task={task}
                                                            onEdit={() => onEditTask(task)}
                                                            onDelete={() => onDeleteTask(task.id)}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {columns[status]?.length === 0 && (
                                            <div className="text-center text-xs text-muted-foreground p-4">
                                                No tasks in this status.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </Droppable>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </DragDropContext>
    );
};

export default TasksBoard;

