import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DollarSign, Calendar, BarChart, Edit, Trash2, Copy } from "lucide-react";

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

// Helper function to get status badge color
const getStatusBadgeClass = (status, statuses) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.color : "bg-gray-200 text-gray-800";
};

const BidCard = ({ bid, statuses, onClick, onEdit, onDelete, onDuplicate }) => {
  const daysUntilDue = getDaysUntilDue(bid.dueDate);
  const statusLabel = statuses.find(s => s.value === bid.status)?.label || bid.status;
  const statusColor = getStatusBadgeClass(bid.status, statuses);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div onClick={onClick}>
            <h4 className="font-medium line-clamp-2">{bid.name}</h4>
            <p className="text-sm text-muted-foreground">{bid.clientName}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {bid.bidNumber}
          </Badge>
        </div>
        
        {/* Status */}
        <div onClick={onClick}>
          <Badge className={statusColor}>
            {statusLabel}
          </Badge>
        </div>
        
        {/* Value and Probability */}
        <div className="flex justify-between items-center" onClick={onClick}>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm font-medium">{formatCurrency(bid.estimatedValue)}</span>
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm">{bid.probability}%</span>
          </div>
        </div>
        
        {/* Due Date */}
        <div className="flex justify-between items-center" onClick={onClick}>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs">
              Due: {formatDate(bid.dueDate)}
            </span>
          </div>
          <span className={`text-xs ${daysUntilDue < 3 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
            {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
          </span>
        </div>
        
        {/* Assigned To */}
        <div className="flex justify-between items-center" onClick={onClick}>
          <span className="text-xs text-muted-foreground">Assigned to:</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/avatars/${bid.assignedTo}.png`} alt={bid.assignedToName} />
              <AvatarFallback className="text-xs">
                {getInitials(bid.assignedToName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{bid.assignedToName}</span>
          </div>
        </div>
        
        {/* Tags */}
        {bid.tags && bid.tags.length > 0 && (
          <div className="flex flex-wrap gap-1" onClick={onClick}>
            {bid.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end gap-1 pt-2 border-t">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(bid.id); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDuplicate(bid.id); }}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-600" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(bid.id); 
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BidCard;
