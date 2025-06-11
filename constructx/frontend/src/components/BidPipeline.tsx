import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DollarSign, Calendar, BarChart, ArrowRight } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Helper function to calculate days until due
const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const BidPipeline = ({ bids, statuses, onBidClick, onStatusChange }) => {
  // Group bids by status
  const [groupedBids, setGroupedBids] = useState(() => {
    const grouped = {};
    statuses.forEach(status => {
      grouped[status.value] = bids.filter(bid => bid.status === status.value);
    });
    return grouped;
  });

  // Calculate column totals
  const calculateColumnTotal = (statusBids) => {
    return statusBids.reduce((sum, bid) => sum + bid.estimatedValue, 0);
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Get the bid that was dragged
    const bidId = draggableId;
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;
    
    // If status changed, update it
    if (sourceStatus !== destinationStatus) {
      // Find the bid
      const bid = groupedBids[sourceStatus].find(b => b.id === bidId);
      
      // Remove from source status
      const newSourceBids = groupedBids[sourceStatus].filter(b => b.id !== bidId);
      
      // Add to destination status
      const newDestinationBids = [...groupedBids[destinationStatus]];
      newDestinationBids.splice(destination.index, 0, { ...bid, status: destinationStatus });
      
      // Update state
      setGroupedBids({
        ...groupedBids,
        [sourceStatus]: newSourceBids,
        [destinationStatus]: newDestinationBids
      });
      
      // Call the callback
      onStatusChange(bidId, destinationStatus);
    } else {
      // Reorder within the same status
      const reorderedBids = [...groupedBids[sourceStatus]];
      const [removed] = reorderedBids.splice(source.index, 1);
      reorderedBids.splice(destination.index, 0, removed);
      
      // Update state
      setGroupedBids({
        ...groupedBids,
        [sourceStatus]: reorderedBids
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {statuses.map((status) => (
          <div key={status.value} className="min-w-[300px]">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center">
                <Badge className={`${status.color} mr-2`}>{status.label}</Badge>
                <span className="text-sm text-muted-foreground">{groupedBids[status.value]?.length || 0}</span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(calculateColumnTotal(groupedBids[status.value] || []))}</span>
            </div>
            
            <Droppable droppableId={status.value}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 p-2 rounded-md min-h-[500px] ${snapshot.isDraggingOver ? 'bg-muted/50' : ''}`}
                >
                  {groupedBids[status.value]?.map((bid, index) => (
                    <Draggable key={bid.id} draggableId={bid.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onBidClick(bid.id)}
                          className={`${snapshot.isDragging ? 'opacity-70' : ''}`}
                        >
                          <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium line-clamp-2">{bid.name}</h4>
                                  <p className="text-sm text-muted-foreground">{bid.clientName}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {bid.bidNumber}
                                </Badge>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                                  <span className="text-sm font-medium">{formatCurrency(bid.estimatedValue)}</span>
                                </div>
                                <div className="flex items-center">
                                  <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
                                  <span className="text-sm">{bid.probability}%</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                                  <span className="text-xs text-muted-foreground">
                                    {getDaysUntilDue(bid.dueDate)} days left
                                  </span>
                                </div>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={`/avatars/${bid.assignedTo}.png`} alt={bid.assignedToName} />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(bid.assignedToName)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              
                              {bid.tags && bid.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {bid.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BidPipeline;
