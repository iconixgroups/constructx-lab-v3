import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LeadCardProps {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source: string;
  score?: number;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  lastContactDate?: Date;
  estimatedValue?: number;
  tags?: string[];
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: string) => void;
  onAssigneeChange?: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  id,
  name,
  company,
  email,
  phone,
  status,
  source,
  score,
  assignedTo,
  createdAt,
  lastContactDate,
  estimatedValue,
  tags = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAssigneeChange
}) => {
  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'qualified': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'proposal': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'won': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Format score as stars
  const renderScore = () => {
    if (score === undefined) return null;
    
    const maxScore = 5;
    const scoreValue = Math.min(Math.max(0, score), maxScore);
    
    return (
      <div className="flex items-center">
        {[...Array(maxScore)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={i < scoreValue ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 ${i < scoreValue ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ))}
      </div>
    );
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
            {company && (
              <div className="text-sm text-muted-foreground">{company}</div>
            )}
          </div>
          <div className="flex space-x-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
                <span className="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Badge variant="outline">
            Source: {source}
          </Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>{email}</span>
          </div>
          
          {phone && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{phone}</span>
            </div>
          )}
          
          {estimatedValue !== undefined && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"></path>
                <path d="M12 18v2"></path>
                <path d="M12 6V4"></path>
              </svg>
              <span>Est. Value: {formatCurrency(estimatedValue)}</span>
            </div>
          )}
          
          {score !== undefined && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12 2v20"></path>
                <path d="m17 5-5-3-5 3"></path>
                <path d="m17 19-5 3-5-3"></path>
                <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
              </svg>
              <span>Score: </span>
              <span className="ml-1">{renderScore()}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span>Created: {createdAt.toLocaleDateString()}</span>
          </div>
          
          {lastContactDate && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Last Contact: {lastContactDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t flex justify-between items-center">
        <div className="flex items-center">
          {assignedTo ? (
            <div className="flex items-center" onClick={onAssigneeChange}>
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={assignedTo.avatarUrl} alt={assignedTo.name} />
                <AvatarFallback>{assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{assignedTo.name}</span>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onAssigneeChange}>
              Assign
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onStatusChange && (
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Change Status
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onView} className="h-7 text-xs">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LeadCard;
