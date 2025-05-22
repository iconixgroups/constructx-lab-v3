import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  projectId: string;
  projectName: string;
  tasks?: {
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
  }[];
  isLoading?: boolean;
  onCreateTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatus: string) => void;
  onAssigneeChange?: (taskId: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  projectId,
  projectName,
  tasks = [],
  isLoading = false,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onTaskStatusChange,
  onAssigneeChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  // Filter tasks based on active tab, search query, and priority filter
  const filteredTasks = tasks.filter(task => {
    // Filter by tab (status)
    if (activeTab !== 'all' && task.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority && task.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  // Group tasks by status for board view
  const tasksByStatus = {
    backlog: filteredTasks.filter(task => task.status === 'backlog'),
    todo: filteredTasks.filter(task => task.status === 'todo'),
    in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
    blocked: filteredTasks.filter(task => task.status === 'blocked')
  };

  // Format status label
  const formatStatus = (status: string): string => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{projectName} Tasks</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            <select 
              value={filterPriority || ''} 
              onChange={(e) => setFilterPriority(e.target.value || null)}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {onCreateTask && (
              <Button onClick={onCreateTask}>
                New Task
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="backlog">Backlog</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-3">
                  <h3 className="text-lg font-medium mb-2">All Tasks ({filteredTasks.length})</h3>
                </div>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      assignee={task.assignee}
                      tags={task.tags}
                      estimatedHours={task.estimatedHours}
                      actualHours={task.actualHours}
                      subtasks={task.subtasks}
                      onEdit={() => onEditTask && onEditTask(task.id)}
                      onDelete={() => onDeleteTask && onDeleteTask(task.id)}
                      onStatusChange={(newStatus) => onTaskStatusChange && onTaskStatusChange(task.id, newStatus)}
                      onAssigneeChange={() => onAssigneeChange && onAssigneeChange(task.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center h-[200px] space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                    <p className="text-muted-foreground">No tasks found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Kanban board view for specific status tabs */}
            {['backlog', 'todo', 'in_progress', 'review', 'completed', 'blocked'].map(status => (
              <TabsContent key={status} value={status}>
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">
                    {formatStatus(status)} ({tasksByStatus[status as keyof typeof tasksByStatus].length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasksByStatus[status as keyof typeof tasksByStatus].length > 0 ? (
                      tasksByStatus[status as keyof typeof tasksByStatus].map(task => (
                        <TaskCard
                          key={task.id}
                          id={task.id}
                          title={task.title}
                          description={task.description}
                          status={task.status}
                          priority={task.priority}
                          dueDate={task.dueDate}
                          assignee={task.assignee}
                          tags={task.tags}
                          estimatedHours={task.estimatedHours}
                          actualHours={task.actualHours}
                          subtasks={task.subtasks}
                          onEdit={() => onEditTask && onEditTask(task.id)}
                          onDelete={() => onDeleteTask && onDeleteTask(task.id)}
                          onStatusChange={(newStatus) => onTaskStatusChange && onTaskStatusChange(task.id, newStatus)}
                          onAssigneeChange={() => onAssigneeChange && onAssigneeChange(task.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center h-[200px] space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                          <path d="M8 12h8"></path>
                        </svg>
                        <p className="text-muted-foreground">No tasks in {formatStatus(status)}</p>
                        {onCreateTask && (
                          <Button onClick={onCreateTask}>
                            Create Task
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskBoard;
