import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  assignee: string;
  projectId: string;
  projectName: string;
  progress: number;
}

const TasksModule: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Foundation Excavation',
      description: 'Excavate the site for building foundation',
      status: 'in_progress',
      priority: 'high',
      startDate: '2025-05-15',
      endDate: '2025-05-25',
      assignee: 'Mike Johnson',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      progress: 60
    },
    {
      id: '2',
      name: 'Electrical Wiring Plan',
      description: 'Create detailed electrical wiring plans for all floors',
      status: 'not_started',
      priority: 'medium',
      startDate: '2025-06-01',
      endDate: '2025-06-15',
      assignee: 'Sarah Williams',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      progress: 0
    },
    {
      id: '3',
      name: 'Site Survey',
      description: 'Complete topographical survey of the construction site',
      status: 'completed',
      priority: 'high',
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      assignee: 'David Chen',
      projectId: '2',
      projectName: 'Riverside Apartments',
      progress: 100
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    startDate: '',
    endDate: '',
    assignee: '',
    projectId: '',
    projectName: '',
    progress: 0
  });

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  const handleCreateTask = () => {
    const taskId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newTask.projectId);
    
    const createdTask = {
      ...newTask,
      id: taskId,
      projectName: selectedProject?.name || '',
    } as Task;
    
    setTasks([...tasks, createdTask]);
    setNewTask({
      name: '',
      description: '',
      status: 'not_started',
      priority: 'medium',
      startDate: '',
      endDate: '',
      assignee: '',
      projectId: '',
      projectName: '',
      progress: 0
    });
    setShowCreateForm(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    const selectedProject = projects.find(p => p.id === editingTask.projectId);
    const updatedTask = {
      ...editingTask,
      projectName: selectedProject?.name || editingTask.projectName
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'canceled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'medium':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'high':
        return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs';
      case 'critical':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getProgressBarClass = (progress: number) => {
    return {
      width: `${progress}%`,
      backgroundColor: progress === 100 ? '#10B981' : '#3B82F6',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Task</Button>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage your project tasks and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>{task.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(task.status)}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityBadgeClass(task.priority)}>
                      {task.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={getProgressBarClass(task.progress)}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.endDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingTask(task)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Task Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Enter the details for the new task</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Task Name</FormLabel>
                <Input 
                  value={newTask.name} 
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  placeholder="Enter task name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newTask.projectId} 
                  onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newTask.status} 
                    onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newTask.priority} 
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={newTask.startDate} 
                    onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={newTask.endDate} 
                    onChange={(e) => setNewTask({...newTask, endDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Assignee</FormLabel>
                <Input 
                  value={newTask.assignee} 
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  placeholder="Enter assignee name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Progress (%)</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={newTask.progress || 0} 
                  onChange={(e) => setNewTask({...newTask, progress: Number(e.target.value)})}
                />
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ width: `${newTask.progress || 0}%` }}
                  ></div>
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Task Form */}
      {editingTask && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Update the task details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Task Name</FormLabel>
                <Input 
                  value={editingTask.name} 
                  onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingTask.description} 
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingTask.projectId} 
                  onChange={(e) => setEditingTask({...editingTask, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingTask.status} 
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value as any})}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingTask.priority} 
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingTask.startDate} 
                    onChange={(e) => setEditingTask({...editingTask, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingTask.endDate} 
                    onChange={(e) => setEditingTask({...editingTask, endDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Assignee</FormLabel>
                <Input 
                  value={editingTask.assignee} 
                  onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Progress (%)</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={editingTask.progress} 
                  onChange={(e) => setEditingTask({...editingTask, progress: Number(e.target.value)})}
                />
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ width: `${editingTask.progress}%` }}
                  ></div>
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={handleUpdateTask}>Update Task</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TasksModule;
