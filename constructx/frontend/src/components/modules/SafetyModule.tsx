import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface SafetyItem {
  id: string;
  type: 'hazard' | 'incident' | 'near_miss' | 'safety_meeting' | 'training';
  title: string;
  description: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'scheduled' | 'completed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  projectName: string;
  location: string;
  reportedBy: string;
  assignedTo: string;
  dueDate?: string;
  completedDate?: string;
  actions: SafetyAction[];
  attachments: string[];
}

interface SafetyAction {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate?: string;
  completedDate?: string;
}

const SafetyModule: React.FC = () => {
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>([
    {
      id: '1',
      type: 'hazard',
      title: 'Exposed Electrical Wiring',
      description: 'Exposed electrical wiring found on 3rd floor near elevator shaft',
      date: '2025-06-05',
      status: 'in_progress',
      severity: 'high',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: '3rd Floor - Elevator Shaft',
      reportedBy: 'John Smith',
      assignedTo: 'Sarah Johnson',
      dueDate: '2025-06-07',
      actions: [
        {
          id: '1-1',
          description: 'Secure area with safety tape',
          status: 'completed',
          assignedTo: 'John Smith',
          completedDate: '2025-06-05'
        },
        {
          id: '1-2',
          description: 'Schedule electrician to fix wiring',
          status: 'completed',
          assignedTo: 'Sarah Johnson',
          completedDate: '2025-06-06'
        },
        {
          id: '1-3',
          description: 'Inspect and verify repair',
          status: 'pending',
          assignedTo: 'Michael Brown',
          dueDate: '2025-06-07'
        }
      ],
      attachments: ['hazard_photo.jpg', 'incident_report.pdf']
    },
    {
      id: '2',
      type: 'incident',
      title: 'Worker Slip and Fall',
      description: 'Worker slipped on wet surface in basement level',
      date: '2025-06-08',
      status: 'open',
      severity: 'medium',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Basement Level',
      reportedBy: 'Emily Davis',
      assignedTo: 'Robert Wilson',
      dueDate: '2025-06-15',
      actions: [
        {
          id: '2-1',
          description: 'Complete incident report',
          status: 'in_progress',
          assignedTo: 'Emily Davis',
          dueDate: '2025-06-10'
        },
        {
          id: '2-2',
          description: 'Review safety protocols for wet surfaces',
          status: 'pending',
          assignedTo: 'Robert Wilson',
          dueDate: '2025-06-12'
        }
      ],
      attachments: ['incident_form.pdf', 'medical_report.pdf']
    },
    {
      id: '3',
      type: 'safety_meeting',
      title: 'Weekly Safety Briefing',
      description: 'Regular weekly safety meeting for all site personnel',
      date: '2025-06-12',
      status: 'scheduled',
      severity: 'low',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Site Office - Conference Room',
      reportedBy: 'Robert Wilson',
      assignedTo: 'Robert Wilson',
      dueDate: '2025-06-12',
      actions: [
        {
          id: '3-1',
          description: 'Prepare meeting agenda',
          status: 'completed',
          assignedTo: 'Robert Wilson',
          completedDate: '2025-06-10'
        },
        {
          id: '3-2',
          description: 'Send meeting invites',
          status: 'completed',
          assignedTo: 'Emily Davis',
          completedDate: '2025-06-10'
        },
        {
          id: '3-3',
          description: 'Conduct meeting and record attendance',
          status: 'pending',
          assignedTo: 'Robert Wilson',
          dueDate: '2025-06-12'
        }
      ],
      attachments: ['safety_meeting_agenda.pdf']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSafety, setEditingSafety] = useState<SafetyItem | null>(null);
  const [newSafety, setNewSafety] = useState<Partial<SafetyItem>>({
    type: 'hazard',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'open',
    severity: 'medium',
    projectId: '',
    location: '',
    reportedBy: '',
    assignedTo: '',
    actions: [],
    attachments: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [newAction, setNewAction] = useState<Partial<SafetyAction>>({
    description: '',
    status: 'pending',
    assignedTo: '',
    dueDate: ''
  });

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

  const handleCreateSafety = () => {
    const safetyId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newSafety.projectId);
    
    // Add IDs to actions
    const actionsWithIds = (newSafety.actions || []).map(a => ({
      ...a,
      id: `${safetyId}-${Math.random().toString(36).substr(2, 5)}`
    }));
    
    const createdSafety = {
      ...newSafety,
      id: safetyId,
      projectName: selectedProject?.name || '',
      actions: actionsWithIds,
      attachments: newSafety.attachments || []
    } as SafetyItem;
    
    setSafetyItems([...safetyItems, createdSafety]);
    setNewSafety({
      type: 'hazard',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'open',
      severity: 'medium',
      projectId: '',
      location: '',
      reportedBy: '',
      assignedTo: '',
      actions: [],
      attachments: []
    });
    setAttachmentInput('');
    setNewAction({
      description: '',
      status: 'pending',
      assignedTo: '',
      dueDate: ''
    });
    setShowCreateForm(false);
  };

  const handleUpdateSafety = () => {
    if (!editingSafety) return;
    
    const selectedProject = projects.find(p => p.id === editingSafety.projectId);
    const updatedSafety = {
      ...editingSafety,
      projectName: selectedProject?.name || editingSafety.projectName
    };
    
    const updatedSafetyItems = safetyItems.map(item => 
      item.id === updatedSafety.id ? updatedSafety : item
    );
    
    setSafetyItems(updatedSafetyItems);
    setEditingSafety(null);
    setAttachmentInput('');
    setNewAction({
      description: '',
      status: 'pending',
      assignedTo: '',
      dueDate: ''
    });
  };

  const handleDeleteSafety = (id: string) => {
    const updatedSafetyItems = safetyItems.filter(item => item.id !== id);
    setSafetyItems(updatedSafetyItems);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingSafety) {
      const newAttachments = [...(editingSafety.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingSafety({...editingSafety, attachments: newAttachments});
    } else {
      const newAttachments = [...(newSafety.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewSafety({...newSafety, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingSafety) {
      const newAttachments = editingSafety.attachments.filter(a => a !== attachment);
      setEditingSafety({...editingSafety, attachments: newAttachments});
    } else {
      const newAttachments = (newSafety.attachments || []).filter(a => a !== attachment);
      setNewSafety({...newSafety, attachments: newAttachments});
    }
  };

  const handleAddAction = (isEditing: boolean) => {
    if (!newAction.description?.trim()) return;
    
    if (isEditing && editingSafety) {
      const actionId = `${editingSafety.id}-${Math.random().toString(36).substr(2, 5)}`;
      const action = {
        ...newAction,
        id: actionId
      } as SafetyAction;
      
      setEditingSafety({
        ...editingSafety,
        actions: [...editingSafety.actions, action]
      });
    } else {
      const actionId = `temp-${Math.random().toString(36).substr(2, 5)}`;
      const action = {
        ...newAction,
        id: actionId
      } as SafetyAction;
      
      setNewSafety({
        ...newSafety,
        actions: [...(newSafety.actions || []), action]
      });
    }
    
    setNewAction({
      description: '',
      status: 'pending',
      assignedTo: '',
      dueDate: ''
    });
  };

  const handleRemoveAction = (actionId: string, isEditing: boolean) => {
    if (isEditing && editingSafety) {
      const newActions = editingSafety.actions.filter(a => a.id !== actionId);
      setEditingSafety({...editingSafety, actions: newActions});
    } else {
      const newActions = (newSafety.actions || []).filter(a => a.id !== actionId);
      setNewSafety({...newSafety, actions: newActions});
    }
  };

  const handleUpdateActionStatus = (actionId: string, status: string, isEditing: boolean) => {
    if (isEditing && editingSafety) {
      const updatedActions = editingSafety.actions.map(a => {
        if (a.id === actionId) {
          const updatedAction = {...a, status: status as any};
          
          // If status is completed and no completed date, set it to today
          if (status === 'completed' && !updatedAction.completedDate) {
            updatedAction.completedDate = new Date().toISOString().split('T')[0];
          }
          
          return updatedAction;
        }
        return a;
      });
      
      setEditingSafety({...editingSafety, actions: updatedActions});
      
      // Update overall status based on actions
      updateOverallStatus(updatedActions, true);
    } else {
      const updatedActions = (newSafety.actions || []).map(a => {
        if (a.id === actionId) {
          const updatedAction = {...a, status: status as any};
          
          // If status is completed and no completed date, set it to today
          if (status === 'completed' && !updatedAction.completedDate) {
            updatedAction.completedDate = new Date().toISOString().split('T')[0];
          }
          
          return updatedAction;
        }
        return a;
      });
      
      setNewSafety({...newSafety, actions: updatedActions});
      
      // Update overall status based on actions
      updateOverallStatus(updatedActions, false);
    }
  };

  const updateOverallStatus = (actions: SafetyAction[], isEditing: boolean) => {
    // Skip empty actions lists
    if (!actions.length) return;
    
    // Count statuses
    const pending = actions.filter(a => a.status === 'pending').length;
    const inProgress = actions.filter(a => a.status === 'in_progress').length;
    const completed = actions.filter(a => a.status === 'completed').length;
    
    // Determine overall status
    let status: string;
    if (completed === actions.length) {
      status = 'resolved';
    } else if (inProgress > 0 || (pending < actions.length && completed > 0)) {
      status = 'in_progress';
    } else {
      status = 'open';
    }
    
    // Special case for meetings
    if (isEditing && editingSafety && editingSafety.type === 'safety_meeting') {
      if (status === 'resolved') {
        status = 'completed';
      } else if (status === 'open') {
        status = 'scheduled';
      }
    } else if (!isEditing && newSafety.type === 'safety_meeting') {
      if (status === 'resolved') {
        status = 'completed';
      } else if (status === 'open') {
        status = 'scheduled';
      }
    }
    
    // Update the state
    if (isEditing && editingSafety) {
      setEditingSafety({...editingSafety, status: status as any});
    } else {
      setNewSafety({...newSafety, status: status as any});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'resolved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'closed':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'hazard':
        return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs';
      case 'incident':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'near_miss':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'safety_meeting':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'training':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
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
        <h1 className="text-3xl font-bold">Safety Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New</Button>
      </div>

      {/* Safety Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Items</CardTitle>
          <CardDescription>Manage hazards, incidents, near misses, safety meetings, and training</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safetyItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    <div className="text-xs text-gray-500 mt-1">Location: {item.location}</div>
                    <div className="text-xs text-gray-500">Reported by: {item.reportedBy}</div>
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(item.type)}>
                      {item.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getSeverityBadgeClass(item.severity)}>
                      {item.severity.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingSafety(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteSafety(item.id)}
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

      {/* Create Safety Item Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Safety Item</CardTitle>
            <CardDescription>Enter the details for the new safety item</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newSafety.type} 
                  onChange={(e) => setNewSafety({...newSafety, type: e.target.value as any})}
                >
                  <option value="hazard">Hazard</option>
                  <option value="incident">Incident</option>
                  <option value="near_miss">Near Miss</option>
                  <option value="safety_meeting">Safety Meeting</option>
                  <option value="training">Training</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={newSafety.title} 
                  onChange={(e) => setNewSafety({...newSafety, title: e.target.value})}
                  placeholder="Enter title"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newSafety.description} 
                  onChange={(e) => setNewSafety({...newSafety, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newSafety.projectId} 
                  onChange={(e) => setNewSafety({...newSafety, projectId: e.target.value})}
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
                    value={newSafety.status} 
                    onChange={(e) => setNewSafety({...newSafety, status: e.target.value as any})}
                  >
                    {newSafety.type === 'safety_meeting' || newSafety.type === 'training' ? (
                      <>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </>
                    ) : (
                      <>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </>
                    )}
                  </select>
                  <FormDescription>
                    This will be automatically updated based on action statuses
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel>Severity</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newSafety.severity} 
                    onChange={(e) => setNewSafety({...newSafety, severity: e.target.value as any})}
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
                    value={newSafety.date} 
                    onChange={(e) => setNewSafety({...newSafety, date: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={newSafety.dueDate} 
                    onChange={(e) => setNewSafety({...newSafety, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={newSafety.location} 
                    onChange={(e) => setNewSafety({...newSafety, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Reported By</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newSafety.reportedBy} 
                    onChange={(e) => setNewSafety({...newSafety, reportedBy: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Assigned To</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newSafety.assignedTo} 
                  onChange={(e) => setNewSafety({...newSafety, assignedTo: e.target.value})}
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              {(newSafety.status === 'resolved' || newSafety.status === 'closed' || newSafety.status === 'completed') && (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={newSafety.completedDate} 
                    onChange={(e) => setNewSafety({...newSafety, completedDate: e.target.value})}
                  />
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Safety Actions</FormLabel>
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Actions List */}
                      {(newSafety.actions || []).length > 0 ? (
                        <div className="space-y-2">
                          {(newSafety.actions || []).map((action, index) => (
                            <div key={action.id} className="flex items-start p-2 border rounded">
                              <div className="flex-grow">
                                <div className="font-medium">{index + 1}. {action.description}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Assigned to: {action.assignedTo}
                                  {action.dueDate && ` | Due: ${action.dueDate}`}
                                  {action.completedDate && ` | Completed: ${action.completedDate}`}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select 
                                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                  value={action.status}
                                  onChange={(e) => handleUpdateActionStatus(action.id, e.target.value, false)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <button 
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveAction(action.id, false)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No actions added yet. Add actions below.
                        </div>
                      )}
                      
                      {/* Add New Action */}
                      <div className="border-t pt-4">
                        <div className="font-medium mb-2">Add New Action</div>
                        <div className="space-y-2">
                          <Input 
                            value={newAction.description} 
                            onChange={(e) => setNewAction({...newAction, description: e.target.value})}
                            placeholder="Enter action description"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newAction.status}
                              onChange={(e) => setNewAction({...newAction, status: e.target.value as any})}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newAction.assignedTo}
                              onChange={(e) => setNewAction({...newAction, assignedTo: e.target.value})}
                            >
                              <option value="">Assign to...</option>
                              {teamMembers.map(member => (
                                <option key={member.id} value={member.name}>{member.name}</option>
                              ))}
                            </select>
                            <Input 
                              type="date"
                              value={newAction.dueDate} 
                              onChange={(e) => setNewAction({...newAction, dueDate: e.target.value})}
                              placeholder="Due date"
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleAddAction(false)}
                            variant="outline"
                            className="w-full"
                          >
                            Add Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FormField>
              
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
                  {(newSafety.attachments || []).map(attachment => (
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
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateSafety}>Create Safety Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Safety Item Form */}
      {editingSafety && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Safety Item</CardTitle>
            <CardDescription>Update the safety item details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingSafety.type} 
                  onChange={(e) => setEditingSafety({...editingSafety, type: e.target.value as any})}
                >
                  <option value="hazard">Hazard</option>
                  <option value="incident">Incident</option>
                  <option value="near_miss">Near Miss</option>
                  <option value="safety_meeting">Safety Meeting</option>
                  <option value="training">Training</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={editingSafety.title} 
                  onChange={(e) => setEditingSafety({...editingSafety, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingSafety.description} 
                  onChange={(e) => setEditingSafety({...editingSafety, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingSafety.projectId} 
                  onChange={(e) => setEditingSafety({...editingSafety, projectId: e.target.value})}
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
                    value={editingSafety.status} 
                    onChange={(e) => setEditingSafety({...editingSafety, status: e.target.value as any})}
                  >
                    {editingSafety.type === 'safety_meeting' || editingSafety.type === 'training' ? (
                      <>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </>
                    ) : (
                      <>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </>
                    )}
                  </select>
                  <FormDescription>
                    This will be automatically updated based on action statuses
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel>Severity</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingSafety.severity} 
                    onChange={(e) => setEditingSafety({...editingSafety, severity: e.target.value as any})}
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
                    value={editingSafety.date} 
                    onChange={(e) => setEditingSafety({...editingSafety, date: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingSafety.dueDate} 
                    onChange={(e) => setEditingSafety({...editingSafety, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={editingSafety.location} 
                    onChange={(e) => setEditingSafety({...editingSafety, location: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Reported By</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingSafety.reportedBy} 
                    onChange={(e) => setEditingSafety({...editingSafety, reportedBy: e.target.value})}
                  >
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Assigned To</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingSafety.assignedTo} 
                  onChange={(e) => setEditingSafety({...editingSafety, assignedTo: e.target.value})}
                >
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              {(editingSafety.status === 'resolved' || editingSafety.status === 'closed' || editingSafety.status === 'completed') && (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingSafety.completedDate} 
                    onChange={(e) => setEditingSafety({...editingSafety, completedDate: e.target.value})}
                  />
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Safety Actions</FormLabel>
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Actions List */}
                      {editingSafety.actions.length > 0 ? (
                        <div className="space-y-2">
                          {editingSafety.actions.map((action, index) => (
                            <div key={action.id} className="flex items-start p-2 border rounded">
                              <div className="flex-grow">
                                <div className="font-medium">{index + 1}. {action.description}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Assigned to: {action.assignedTo}
                                  {action.dueDate && ` | Due: ${action.dueDate}`}
                                  {action.completedDate && ` | Completed: ${action.completedDate}`}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select 
                                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                  value={action.status}
                                  onChange={(e) => handleUpdateActionStatus(action.id, e.target.value, true)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <button 
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveAction(action.id, true)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No actions added yet. Add actions below.
                        </div>
                      )}
                      
                      {/* Add New Action */}
                      <div className="border-t pt-4">
                        <div className="font-medium mb-2">Add New Action</div>
                        <div className="space-y-2">
                          <Input 
                            value={newAction.description} 
                            onChange={(e) => setNewAction({...newAction, description: e.target.value})}
                            placeholder="Enter action description"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newAction.status}
                              onChange={(e) => setNewAction({...newAction, status: e.target.value as any})}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newAction.assignedTo}
                              onChange={(e) => setNewAction({...newAction, assignedTo: e.target.value})}
                            >
                              <option value="">Assign to...</option>
                              {teamMembers.map(member => (
                                <option key={member.id} value={member.name}>{member.name}</option>
                              ))}
                            </select>
                            <Input 
                              type="date"
                              value={newAction.dueDate} 
                              onChange={(e) => setNewAction({...newAction, dueDate: e.target.value})}
                              placeholder="Due date"
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleAddAction(true)}
                            variant="outline"
                            className="w-full"
                          >
                            Add Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FormField>
              
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
                  {editingSafety.attachments.map(attachment => (
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
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingSafety(null)}>Cancel</Button>
            <Button onClick={handleUpdateSafety}>Update Safety Item</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SafetyModule;
