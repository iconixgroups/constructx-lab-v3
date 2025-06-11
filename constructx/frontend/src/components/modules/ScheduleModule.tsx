import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface ScheduleItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'milestone' | 'phase' | 'activity';
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  projectId: string;
  projectName: string;
  dependencies: string[];
  assignedTo: string;
  progress: number;
}

const ScheduleModule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      name: 'Pre-Construction Phase',
      description: 'Planning and preparation before construction begins',
      startDate: '2025-06-01',
      endDate: '2025-07-15',
      type: 'phase',
      status: 'in_progress',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      dependencies: [],
      assignedTo: 'Project Team',
      progress: 40
    },
    {
      id: '2',
      name: 'Foundation Complete',
      description: 'Completion of building foundation',
      startDate: '2025-07-20',
      endDate: '2025-07-20',
      type: 'milestone',
      status: 'not_started',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      dependencies: ['1'],
      assignedTo: 'Construction Team',
      progress: 0
    },
    {
      id: '3',
      name: 'Structural Steel Installation',
      description: 'Installation of primary structural steel components',
      startDate: '2025-07-25',
      endDate: '2025-09-15',
      type: 'activity',
      status: 'not_started',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      dependencies: ['2'],
      assignedTo: 'Steel Contractors',
      progress: 0
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'activity',
    status: 'not_started',
    projectId: '',
    dependencies: [],
    assignedTo: '',
    progress: 0
  });
  const [dependencyInput, setDependencyInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  const handleCreateItem = () => {
    const itemId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newItem.projectId);
    
    const createdItem = {
      ...newItem,
      id: itemId,
      projectName: selectedProject?.name || '',
      dependencies: newItem.dependencies || []
    } as ScheduleItem;
    
    setScheduleItems([...scheduleItems, createdItem]);
    setNewItem({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'activity',
      status: 'not_started',
      projectId: '',
      dependencies: [],
      assignedTo: '',
      progress: 0
    });
    setDependencyInput('');
    setShowCreateForm(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const selectedProject = projects.find(p => p.id === editingItem.projectId);
    const updatedItem = {
      ...editingItem,
      projectName: selectedProject?.name || editingItem.projectName
    };
    
    const updatedItems = scheduleItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setScheduleItems(updatedItems);
    setEditingItem(null);
    setDependencyInput('');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = scheduleItems.filter(item => item.id !== id);
    setScheduleItems(updatedItems);
  };

  const handleAddDependency = (isEditing: boolean) => {
    if (!dependencyInput.trim()) return;
    
    // Check if the dependency exists in the schedule items
    const dependencyExists = scheduleItems.some(item => item.id === dependencyInput.trim());
    
    if (!dependencyExists) {
      alert('Dependency ID does not exist in schedule items');
      return;
    }
    
    if (isEditing && editingItem) {
      const newDependencies = [...(editingItem.dependencies || [])];
      if (!newDependencies.includes(dependencyInput.trim())) {
        newDependencies.push(dependencyInput.trim());
      }
      setEditingItem({...editingItem, dependencies: newDependencies});
    } else {
      const newDependencies = [...(newItem.dependencies || [])];
      if (!newDependencies.includes(dependencyInput.trim())) {
        newDependencies.push(dependencyInput.trim());
      }
      setNewItem({...newItem, dependencies: newDependencies});
    }
    
    setDependencyInput('');
  };

  const handleRemoveDependency = (dependency: string, isEditing: boolean) => {
    if (isEditing && editingItem) {
      const newDependencies = editingItem.dependencies.filter(d => d !== dependency);
      setEditingItem({...editingItem, dependencies: newDependencies});
    } else {
      const newDependencies = (newItem.dependencies || []).filter(d => d !== dependency);
      setNewItem({...newItem, dependencies: newDependencies});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'delayed':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'phase':
        return 'bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs';
      case 'activity':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
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

  const getDependencyNames = (dependencies: string[]) => {
    return dependencies.map(depId => {
      const item = scheduleItems.find(item => item.id === depId);
      return item ? item.name : depId;
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Schedule Item</Button>
      </div>

      {/* Schedule Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Schedule</CardTitle>
          <CardDescription>Manage your project timeline, milestones, and phases</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(item.type)}>
                      {item.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={getProgressBarClass(item.progress)}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{item.progress}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {item.dependencies.length > 0 ? getDependencyNames(item.dependencies) : 'None'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
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

      {/* Create Schedule Item Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule Item</CardTitle>
            <CardDescription>Enter the details for the new schedule item</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Name</FormLabel>
                <Input 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter schedule item name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newItem.description} 
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newItem.projectId} 
                  onChange={(e) => setNewItem({...newItem, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Type</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.type} 
                    onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                  >
                    <option value="activity">Activity</option>
                    <option value="milestone">Milestone</option>
                    <option value="phase">Phase</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.status} 
                    onChange={(e) => setNewItem({...newItem, status: e.target.value as any})}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.startDate} 
                    onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.endDate} 
                    onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Assigned To</FormLabel>
                <Input 
                  value={newItem.assignedTo} 
                  onChange={(e) => setNewItem({...newItem, assignedTo: e.target.value})}
                  placeholder="Enter assignee or team"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Progress (%)</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={newItem.progress || 0} 
                  onChange={(e) => setNewItem({...newItem, progress: Number(e.target.value)})}
                />
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ width: `${newItem.progress || 0}%` }}
                  ></div>
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Dependencies</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={dependencyInput} 
                    onChange={(e) => setDependencyInput(e.target.value)}
                    placeholder="Enter dependency ID"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddDependency(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  Enter the ID of schedule items that must be completed before this one can start
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newItem.dependencies || []).map(dep => {
                    const depItem = scheduleItems.find(item => item.id === dep);
                    return (
                      <div key={dep} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {depItem ? `${dep}: ${depItem.name}` : dep}
                        <button 
                          type="button"
                          className="ml-1 text-blue-700 hover:text-blue-900"
                          onClick={() => handleRemoveDependency(dep, false)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateItem}>Create Schedule Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Schedule Item Form */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Schedule Item</CardTitle>
            <CardDescription>Update the schedule item details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Name</FormLabel>
                <Input 
                  value={editingItem.name} 
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingItem.description} 
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingItem.projectId} 
                  onChange={(e) => setEditingItem({...editingItem, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Type</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.type} 
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value as any})}
                  >
                    <option value="activity">Activity</option>
                    <option value="milestone">Milestone</option>
                    <option value="phase">Phase</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.status} 
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.startDate} 
                    onChange={(e) => setEditingItem({...editingItem, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.endDate} 
                    onChange={(e) => setEditingItem({...editingItem, endDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Assigned To</FormLabel>
                <Input 
                  value={editingItem.assignedTo} 
                  onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Progress (%)</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.progress} 
                  onChange={(e) => setEditingItem({...editingItem, progress: Number(e.target.value)})}
                />
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{ width: `${editingItem.progress}%` }}
                  ></div>
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Dependencies</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={dependencyInput} 
                    onChange={(e) => setDependencyInput(e.target.value)}
                    placeholder="Enter dependency ID"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddDependency(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  Enter the ID of schedule items that must be completed before this one can start
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingItem.dependencies.map(dep => {
                    const depItem = scheduleItems.find(item => item.id === dep);
                    return (
                      <div key={dep} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {depItem ? `${dep}: ${depItem.name}` : dep}
                        <button 
                          type="button"
                          className="ml-1 text-blue-700 hover:text-blue-900"
                          onClick={() => handleRemoveDependency(dep, true)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleUpdateItem}>Update Schedule Item</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ScheduleModule;
