import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LeadCard from "./LeadCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

// Mock API (replace with actual call if statuses are dynamic)
const mockApi = {
    getLeadStatuses: async () => ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
};

const LeadPipeline = ({ leads, onUpdateLead, onEditLead }) => {
    const [columns, setColumns] = useState({});
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        // Fetch statuses
        mockApi.getLeadStatuses().then(fetchedStatuses => {
            setStatuses(fetchedStatuses);
            // Initialize columns based on statuses
            const initialColumns = fetchedStatuses.reduce((acc, status) => {
                acc[status] = { id: status, title: status, leads: [] };
                return acc;
            }, {});

            // Distribute leads into columns
            leads.forEach(lead => {
                if (initialColumns[lead.status]) {
                    initialColumns[lead.status].leads.push(lead);
                } else {
                    // Handle leads with unknown status if necessary
                    console.warn(`Lead ${lead.id} has unknown status: ${lead.status}`);
                }
            });

            // Sort leads within each column (e.g., by last activity or value)
            Object.values(initialColumns).forEach(column => {
                column.leads.sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));
            });

            setColumns(initialColumns);
        });
    }, [leads]); // Re-process columns when leads array changes

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.leads];
        const destItems = [...destColumn.leads];
        const [removed] = sourceItems.splice(source.index, 1);

        // Dropped in the same column
        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    leads: sourceItems,
                },
            });
            // Optionally call API to update order within status if needed
        } else {
            // Dropped in a different column (status change)
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    leads: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    leads: destItems,
                },
            });

            // Call the update function passed via props
            onUpdateLead({ ...removed, status: destination.droppableId });
        }
    };

    if (Object.keys(columns).length === 0) {
        return <div className="text-center p-4">Loading pipeline...</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-4">
                    {statuses.map(status => {
                        const column = columns[status];
                        if (!column) return null; // Should not happen if initialized correctly
                        return (
                            <Droppable key={column.id} droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex flex-col w-72 bg-muted rounded-lg p-2 ${snapshot.isDraggingOver ? "bg-primary/10" : ""}`}
                                    >
                                        <h3 className="font-semibold text-sm px-2 py-1 mb-2">{column.title} ({column.leads.length})</h3>
                                        <ScrollArea className="h-[calc(100vh-250px)] pr-2"> {/* Adjust height as needed */}
                                            {column.leads.map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-2 ${snapshot.isDragging ? "shadow-lg" : ""}`}
                                                            style={{
                                                                userSelect: "none",
                                                                ...provided.draggableProps.style,
                                                            }}
                                                            onClick={() => onEditLead(lead)} // Open edit form on click
                                                        >
                                                            <LeadCard lead={lead} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ScrollArea>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </DragDropContext>
    );
};

export default LeadPipeline;

