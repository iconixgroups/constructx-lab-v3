import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Download,
  LayoutGrid,
  List,
  Loader2,
  CheckCircle,
  Hourglass,
  Users,
  Flag,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import taskService from '../services/taskService';

// import TasksList from './TasksList';
// import TasksBoard from './TasksBoard';
// import TaskForm from './TaskForm';

interface TasksPageProps {
  projectId?: string; // Optional - if provided, shows tasks for specific project
}

const TasksPage: React.FC<TasksPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]); // Mock for now
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksResponse, statusesResponse, prioritiesResponse] = await Promise.all([
        taskService.getTasks(projectId || ''),
        taskService.getTaskStatuses(),
        taskService.getTaskPriorities(),
      ]);

      setTasks(tasksResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setPriorities(prioritiesResponse.map((p: string) => ({ value: p, label: p })));

      // Mock assigned users for now
      setAssignedUsers([
        { id: 'user-1', name: 'John Doe' },
        { id: 'user-2', name: 'Jane Smith' },
      ]);

      // Calculate metrics (mock for now, ideally from API)
      const completed = tasksResponse.filter((t: any) => t.status === 'Completed').length;
      const inProgress = tasksResponse.filter((t: any) => t.status === 'In Progress').length;
      const overdue = tasksResponse.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

      setMetrics({
        totalTasks: tasksResponse.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        overdueTasks: overdue,
      });

    } catch (error) {
      console.error('Error loading task data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load task data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'status':
        setFilterStatus(value);
        break;
      case 'priority':
        setFilterPriority(value);
        break;
      case 'assignedTo':
        setFilterAssignedTo(value);
        break;
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskFormSubmit = async (taskData: any) => {
    setIsLoading(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        toast({
          title: 'Success',
          description: 'Task updated successfully.',
        });
      } else {
        await taskService.createTask(taskData);
        toast({
          title: 'Success',
          description: 'Task created successfully.',
        });
      }
      setShowTaskForm(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      await taskService.deleteTask(taskId);
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesAssignedTo = !filterAssignedTo || task.assignedTo === filterAssignedTo;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo;
  });

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage tasks for project ${projectId}` : 'Organize and track all your project tasks'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Hourglass className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inProgressTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAssignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  {assignedUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tasks List Component */}
          {/* <TasksList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onUpdateStatus={async (taskId, newStatus) => {
              try {
                await taskService.updateTask(taskId, { status: newStatus });
                toast({
                  title: 'Success',
                  description: 'Task status updated successfully.',
                });
                loadData();
              } catch (error) {
                console.error('Error updating task status:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to update task status. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
          /> */}
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <List className="mx-auto h-12 w-12 mb-4" />
              <p>Tasks List view coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="space-y-4">
          {/* Search and Filters (repeated for board view for now, can be refactored) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAssignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  {assignedUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tasks Board Component */}
          {/* <TasksBoard
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onUpdateStatus={async (taskId, newStatus) => {
              try {
                await taskService.updateTask(taskId, { status: newStatus });
                toast({
                  title: 'Success',
                  description: 'Task status updated successfully.',
                });
                loadData();
              } catch (error) {
                console.error('Error updating task status:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to update task status. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
          /> */}
          <Card className="min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <LayoutGrid className="mx-auto h-12 w-12 mb-4" />
              <p>Tasks Board view coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Form Modal */}
      {/* {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskFormSubmit}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )} */}
    </div>
  );
};

export default TasksPage;


