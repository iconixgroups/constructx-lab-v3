import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface FieldOperation {
  id: string;
  type: 'inspection' | 'report' | 'issue' | 'rfi';
  title: string;
  description: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending_approval';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  projectName: string;
  location: string;
  assignedTo: string;
  dueDate?: string;
  completedDate?: string;
  attachments: string[];
  tags: string[];
}

const FieldOperationsModule: React.FC = () => {
  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([
    {
      id: '1',
      type: 'inspection',
      title: 'Foundation Inspection',
      description: 'Inspection of completed foundation work',
      date: '2025-06-10',
      status: 'closed',
      priority: 'high',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Foundation Area',
      assignedTo: 'John Smith',
      dueDate: '2025-06-10',
      completedDate: '2025-06-10',
      attachments: ['foundation_inspection_report.pdf', 'foundation_photos.zip'],
      tags: ['foundation', 'structural', 'completed']
    },
    {
      id: '2',
      type: 'issue',
      title: 'Water Leak in Basement',
      description: 'Water seepage detected in northeast corner of basement level',
      date: '2025-06-12',
      status: 'in_progress',
      priority: 'critical',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Basement Level - Northeast Corner',
      assignedTo: 'Sarah Johnson',
      dueDate: '2025-06-15',
      attachments: ['water_leak_photos.jpg', 'moisture_readings.xlsx'],
      tags: ['leak', 'basement', 'urgent']
    },
    {
      id: '3',
      type: 'rfi',
      title: 'Structural Steel Connection Detail',
      description: 'Request for information regarding connection detail for beam B-23 to column C-12',
      date: '2025-06-14',
      status: 'pending_approval',
      priority: 'medium',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Level 3 - Grid C/12',
      assignedTo: 'Michael Brown',
      dueDate: '2025-06-20',
      attachments: ['connection_detail_drawing.pdf', 'site_photo.jpg'],
      tags: ['structural', 'steel', 'connection']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOperation, setEditingOperation] = useState<FieldOperation | null>(null);
  const [newOperation, setNewOperation] = useState<Partial<FieldOperation>>({
    type: 'inspection',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'open',
    priority: 'medium',
    projectId: '',
    location: '',
    assignedTo: '',
    attachments: [],
    tags: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock team members for dropdown
  const teamMembers = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Emily Davis' },
    { id: '5', name: 'Robert Wilson' }
  ];

  const handleCreateOperation = () => {
    const operationId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newOperation.projectId);
    
    const createdOperation = {
      ...newOperation,
      id: operationId,
      projectName: selectedProject?.name || '',
      attachments: newOperation.attachments || [],
      tags: newOperation.tags || []
    } as FieldOperation;
    
    setFieldOperations([...fieldOperations, createdOperation]);
    setNewOperation({
      type: 'inspection',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'open',
      priority: 'medium',
      projectId: '',
      location: '',
      assignedTo: '',
      attachments: [],
      tags: []
    });
    setAttachmentInput('');
    setTagInput('');
    setShowCreateForm(false);
  };

  const handleUpdateOperation = () => {
    if (!editingOperation) return;
    
    const selectedProject = projects.find(p => p.id === editingOperation.projectId);
    const updatedOperation = {
      ...editingOperation,
      projectName: selectedProject?.name || editingOperation.projectName
    };
    
    const updatedOperations = fieldOperations.map(operation => 
      operation.id === updatedOperation.id ? updatedOperation : operation
    );
    
    setFieldOperations(updatedOperations);
    setEditingOperation(null);
    setAttachmentInput('');
    setTagInput('');
  };

  const handleDeleteOperation = (id: string) => {
    const updatedOperations = fieldOperations.filter(operation => operation.id !== id);
    setFieldOperations(updatedOperations);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingOperation) {
      const newAttachments = [...(editingOperation.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingOperation({...editingOperation, attachments: newAttachments});
    } else {
      const newAttachments = [...(newOperation.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewOperation({...newOperation, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingOperation) {
      const newAttachments = editingOperation.attachments.filter(a => a !== attachment);
      setEditingOperation({...editingOperation, attachments: newAttachments});
    } else {
      const newAttachments = (newOperation.attachments || []).filter(a => a !== attachment);
      setNewOperation({...newOperation, attachments: newAttachments});
    }
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingOperation) {
      const newTags = [...(editingOperation.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingOperation({...editingOperation, tags: newTags});
    } else {
      const newTags = [...(newOperation.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewOperation({...newOperation, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingOperation) {
      const newTags = editingOperation.tags.filter(t => t !== tag);
      setEditingOperation({...editingOperation, tags: newTags});
    } else {
      const newTags = (newOperation.tags || []).filter(t => t !== tag);
      setNewOperation({...newOperation, tags: newTags});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'resolved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'closed':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'pending_approval':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'report':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'issue':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'rfi':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'high':
        return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs';
      case 'critical':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Field Operations</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New</Button>
      </div>

      {/* Field Operations List */}
      <Card>
        <CardHeader>
          <CardTitle>Field Operations</CardTitle>
          <CardDescription>Manage inspections, reports, issues, and RFIs from the field</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldOperations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell className="font-medium">
                    <div>{operation.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{operation.description}</div>
                    {operation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {operation.tags.map(tag => (
                          <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(operation.type)}>
                      {operation.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{operation.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(operation.status)}>
                      {operation.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityBadgeClass(operation.priority)}>
                      {operation.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{operation.date}</TableCell>
                  <TableCell>{operation.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingOperation(operation)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteOperation(operation.id)}
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

      {/* Create Field Operation Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Field Operation</CardTitle>
            <CardDescription>Enter the details for the new field operation</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newOperation.type} 
                  onChange={(e) => setNewOperation({...newOperation, type: e.target.value as any})}
                >
                  <option value="inspection">Inspection</option>
                  <option value="report">Report</option>
                  <option value="issue">Issue</option>
                  <option value="rfi">RFI</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={newOperation.title} 
                  onChange={(e) => setNewOperation({...newOperation, title: e.target.value})}
                  placeholder="Enter title"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newOperation.description} 
                  onChange={(e) => setNewOperation({...newOperation, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newOperation.projectId} 
                  onChange={(e) => setNewOperation({...newOperation, projectId: e.target.value})}
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
                    value={newOperation.status} 
                    onChange={(e) => setNewOperation({...newOperation, status: e.target.value as any})}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newOperation.priority} 
                    onChange={(e) => setNewOperation({...newOperation, priority: e.target.value as any})}
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
                  <FormLabel required>Date</FormLabel>
                  <Input 
                    type="date"
                    value={newOperation.date} 
                    onChange={(e) => setNewOperation({...newOperation, date: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={newOperation.dueDate} 
                    onChange={(e) => setNewOperation({...newOperation, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={newOperation.location} 
                    onChange={(e) => setNewOperation({...newOperation, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newOperation.assignedTo} 
                    onChange={(e) => setNewOperation({...newOperation, assignedTo: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              {newOperation.status === 'resolved' || newOperation.status === 'closed' ? (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={newOperation.completedDate} 
                    onChange={(e) => setNewOperation({...newOperation, completedDate: e.target.value})}
                  />
                </FormField>
              ) : null}
              
              <FormField>
                <FormLabel>Attachments</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={attachmentInput} 
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    placeholder="Enter attachment filename"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddAttachment(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  In a real implementation, this would allow file uploads
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newOperation.attachments || []).map(attachment => (
                    <div key={attachment} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="mr-1">📎</span> {attachment}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveAttachment(attachment, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Tags</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newOperation.tags || []).map(tag => (
                    <div key={tag} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {tag}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveTag(tag, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateOperation}>Create Field Operation</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Field Operation Form */}
      {editingOperation && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Field Operation</CardTitle>
            <CardDescription>Update the field operation details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingOperation.type} 
                  onChange={(e) => setEditingOperation({...editingOperation, type: e.target.value as any})}
                >
                  <option value="inspection">Inspection</option>
                  <option value="report">Report</option>
                  <option value="issue">Issue</option>
                  <option value="rfi">RFI</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={editingOperation.title} 
                  onChange={(e) => setEditingOperation({...editingOperation, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingOperation.description} 
                  onChange={(e) => setEditingOperation({...editingOperation, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingOperation.projectId} 
                  onChange={(e) => setEditingOperation({...editingOperation, projectId: e.target.value})}
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
                    value={editingOperation.status} 
                    onChange={(e) => setEditingOperation({...editingOperation, status: e.target.value as any})}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingOperation.priority} 
                    onChange={(e) => setEditingOperation({...editingOperation, priority: e.target.value as any})}
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
                  <FormLabel required>Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingOperation.date} 
                    onChange={(e) => setEditingOperation({...editingOperation, date: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingOperation.dueDate} 
                    onChange={(e) => setEditingOperation({...editingOperation, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={editingOperation.location} 
                    onChange={(e) => setEditingOperation({...editingOperation, location: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingOperation.assignedTo} 
                    onChange={(e) => setEditingOperation({...editingOperation, assignedTo: e.target.value})}
                  >
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              {editingOperation.status === 'resolved' || editingOperation.status === 'closed' ? (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingOperation.completedDate} 
                    onChange={(e) => setEditingOperation({...editingOperation, completedDate: e.target.value})}
                  />
                </FormField>
              ) : null}
              
              <FormField>
                <FormLabel>Attachments</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={attachmentInput} 
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    placeholder="Enter attachment filename"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddAttachment(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  In a real implementation, this would allow file uploads
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingOperation.attachments.map(attachment => (
                    <div key={attachment} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="mr-1">📎</span> {attachment}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveAttachment(attachment, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Tags</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingOperation.tags.map(tag => (
                    <div key={tag} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {tag}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveTag(tag, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingOperation(null)}>Cancel</Button>
            <Button onClick={handleUpdateOperation}>Update Field Operation</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FieldOperationsModule;
