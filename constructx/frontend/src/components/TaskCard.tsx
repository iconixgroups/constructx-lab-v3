import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  subtasks?: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: string) => void;
  onAssigneeChange?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  tags = [],
  estimatedHours,
  actualHours,
  subtasks = [],
  onEdit,
  onDelete,
  onStatusChange,
  onAssigneeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'backlog': return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
      case 'todo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  // Priority colors
  const getPriorityColor = () => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'high': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Format due date
  const formatDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDay = new Date(date);
    dueDay.setHours(0, 0, 0, 0);
    
    const diffTime = dueDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600 dark:text-red-400">Overdue by {Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''}</span>;
    } else if (diffDays === 0) {
      return <span className="text-amber-600 dark:text-amber-400">Due today</span>;
    } else if (diffDays === 1) {
      return <span className="text-amber-600 dark:text-amber-400">Due tomorrow</span>;
    } else if (diffDays <= 7) {
      return <span>Due in {diffDays} days</span>;
    } else {
      return <span>Due on {date.toLocaleDateString()}</span>;
    }
  };

  // Calculate completion percentage for subtasks
  const completedSubtasks = subtasks.filter(subtask => subtask.isCompleted).length;
  const subtaskPercentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="text-xs mt-1">Task ID: {id}</CardDescription>
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
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge className={getPriorityColor()}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        
        {description && (isExpanded ? (
          <Text className="text-sm mb-3">{description}</Text>
        ) : (
          <Text className="text-sm mb-3 line-clamp-2">{description}</Text>
        ))}
        
        {description && description.length > 100 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-6 px-2 mb-3"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}

        <div className="flex flex-col space-y-3">
          {dueDate && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              {formatDueDate(dueDate)}
            </div>
          )}
          
          {(estimatedHours !== undefined || actualHours !== undefined) && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {estimatedHours !== undefined && (
                <span>Est: {estimatedHours}h</span>
              )}
              {estimatedHours !== undefined && actualHours !== undefined && (
                <span className="mx-1">|</span>
              )}
              {actualHours !== undefined && (
                <span>Actual: {actualHours}h</span>
              )}
            </div>
          )}
          
          {subtasks.length > 0 && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Subtasks: {completedSubtasks}/{subtasks.length}</span>
                <span>{subtaskPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${subtaskPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center">
          {assignee ? (
            <div className="flex items-center" onClick={onAssigneeChange}>
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{assignee.name}</span>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onAssigneeChange}>
              Assign
            </Button>
          )}
        </div>
        
        {onStatusChange && (
          <Button variant="outline" size="sm" className="h-6 text-xs">
            Change Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
