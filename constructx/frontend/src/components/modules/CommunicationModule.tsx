import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Communication {
  id: string;
  type: 'email' | 'message' | 'notification' | 'meeting' | 'announcement';
  title: string;
  content: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'scheduled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  projectName: string;
  sender: string;
  recipients: string[];
  createdDate: string;
  sentDate?: string;
  scheduledDate?: string;
  attachments: string[];
  tags: string[];
  responses?: CommunicationResponse[];
}

interface CommunicationResponse {
  id: string;
  content: string;
  sender: string;
  date: string;
}

const CommunicationModule: React.FC = () => {
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      type: 'email',
      title: 'Weekly Project Update - Downtown Office Tower',
      content: 'Here is the weekly progress update for the Downtown Office Tower project. We are currently on schedule with the foundation work and will begin structural steel installation next week.',
      status: 'sent',
      priority: 'medium',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      sender: 'John Smith',
      recipients: ['Project Team', 'Client Representatives'],
      createdDate: '2025-06-05',
      sentDate: '2025-06-05',
      attachments: ['weekly_report.pdf', 'schedule_update.xlsx'],
      tags: ['weekly-update', 'progress-report'],
      responses: [
        {
          id: '1-1',
          content: 'Thanks for the update. Looking forward to the steel installation.',
          sender: 'Client Representative',
          date: '2025-06-06'
        }
      ]
    },
    {
      id: '2',
      type: 'meeting',
      title: 'Site Safety Coordination Meeting',
      content: 'Mandatory safety coordination meeting to discuss new safety protocols and recent incidents.',
      status: 'scheduled',
      priority: 'high',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      sender: 'Sarah Johnson',
      recipients: ['All Site Personnel', 'Safety Officers'],
      createdDate: '2025-06-07',
      scheduledDate: '2025-06-12',
      attachments: ['safety_agenda.pdf', 'incident_reports.pdf'],
      tags: ['safety', 'mandatory']
    },
    {
      id: '3',
      type: 'notification',
      title: 'Material Delivery Alert',
      content: 'The structural steel delivery has been confirmed for June 15th. Please ensure the site is prepared for receiving and storage.',
      status: 'delivered',
      priority: 'medium',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      sender: 'Michael Brown',
      recipients: ['Site Managers', 'Logistics Team'],
      createdDate: '2025-06-08',
      sentDate: '2025-06-08',
      attachments: ['delivery_details.pdf'],
      tags: ['logistics', 'materials']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingComm, setEditingComm] = useState<Communication | null>(null);
  const [newComm, setNewComm] = useState<Partial<Communication>>({
    type: 'email',
    title: '',
    content: '',
    status: 'draft',
    priority: 'medium',
    projectId: '',
    sender: '',
    recipients: [],
    createdDate: new Date().toISOString().split('T')[0],
    attachments: [],
    tags: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [recipientInput, setRecipientInput] = useState('');
  const [responseInput, setResponseInput] = useState('');

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

  // Mock recipient groups for dropdown
  const recipientGroups = [
    { id: '1', name: 'Project Team' },
    { id: '2', name: 'Client Representatives' },
    { id: '3', name: 'Site Managers' },
    { id: '4', name: 'Logistics Team' },
    { id: '5', name: 'All Site Personnel' },
    { id: '6', name: 'Safety Officers' }
  ];

  const handleCreateComm = () => {
    const commId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newComm.projectId);
    
    const createdComm = {
      ...newComm,
      id: commId,
      projectName: selectedProject?.name || '',
      attachments: newComm.attachments || [],
      tags: newComm.tags || [],
      recipients: newComm.recipients || []
    } as Communication;
    
    setCommunications([...communications, createdComm]);
    setNewComm({
      type: 'email',
      title: '',
      content: '',
      status: 'draft',
      priority: 'medium',
      projectId: '',
      sender: '',
      recipients: [],
      createdDate: new Date().toISOString().split('T')[0],
      attachments: [],
      tags: []
    });
    setAttachmentInput('');
    setTagInput('');
    setRecipientInput('');
    setShowCreateForm(false);
  };

  const handleUpdateComm = () => {
    if (!editingComm) return;
    
    const selectedProject = projects.find(p => p.id === editingComm.projectId);
    const updatedComm = {
      ...editingComm,
      projectName: selectedProject?.name || editingComm.projectName
    };
    
    const updatedComms = communications.map(comm => 
      comm.id === updatedComm.id ? updatedComm : comm
    );
    
    setCommunications(updatedComms);
    setEditingComm(null);
    setAttachmentInput('');
    setTagInput('');
    setRecipientInput('');
    setResponseInput('');
  };

  const handleDeleteComm = (id: string) => {
    const updatedComms = communications.filter(comm => comm.id !== id);
    setCommunications(updatedComms);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingComm) {
      const newAttachments = [...(editingComm.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingComm({...editingComm, attachments: newAttachments});
    } else {
      const newAttachments = [...(newComm.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewComm({...newComm, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingComm) {
      const newAttachments = editingComm.attachments.filter(a => a !== attachment);
      setEditingComm({...editingComm, attachments: newAttachments});
    } else {
      const newAttachments = (newComm.attachments || []).filter(a => a !== attachment);
      setNewComm({...newComm, attachments: newAttachments});
    }
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingComm) {
      const newTags = [...(editingComm.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingComm({...editingComm, tags: newTags});
    } else {
      const newTags = [...(newComm.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewComm({...newComm, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingComm) {
      const newTags = editingComm.tags.filter(t => t !== tag);
      setEditingComm({...editingComm, tags: newTags});
    } else {
      const newTags = (newComm.tags || []).filter(t => t !== tag);
      setNewComm({...newComm, tags: newTags});
    }
  };

  const handleAddRecipient = (isEditing: boolean) => {
    if (!recipientInput.trim()) return;
    
    if (isEditing && editingComm) {
      const newRecipients = [...(editingComm.recipients || [])];
      if (!newRecipients.includes(recipientInput.trim())) {
        newRecipients.push(recipientInput.trim());
      }
      setEditingComm({...editingComm, recipients: newRecipients});
    } else {
      const newRecipients = [...(newComm.recipients || [])];
      if (!newRecipients.includes(recipientInput.trim())) {
        newRecipients.push(recipientInput.trim());
      }
      setNewComm({...newComm, recipients: newRecipients});
    }
    
    setRecipientInput('');
  };

  const handleRemoveRecipient = (recipient: string, isEditing: boolean) => {
    if (isEditing && editingComm) {
      const newRecipients = editingComm.recipients.filter(r => r !== recipient);
      setEditingComm({...editingComm, recipients: newRecipients});
    } else {
      const newRecipients = (newComm.recipients || []).filter(r => r !== recipient);
      setNewComm({...newComm, recipients: newRecipients});
    }
  };

  const handleAddResponse = () => {
    if (!responseInput.trim() || !editingComm) return;
    
    const responseId = `${editingComm.id}-${Math.random().toString(36).substr(2, 5)}`;
    const newResponse: CommunicationResponse = {
      id: responseId,
      content: responseInput,
      sender: 'Current User', // In a real app, this would be the logged-in user
      date: new Date().toISOString().split('T')[0]
    };
    
    const currentResponses = editingComm.responses || [];
    setEditingComm({
      ...editingComm,
      responses: [...currentResponses, newResponse]
    });
    
    setResponseInput('');
  };

  const handleStatusChange = (status: string, isEditing: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (isEditing && editingComm) {
      let updatedComm = {...editingComm, status: status as any};
      
      // Set appropriate dates based on status
      if ((status === 'sent' || status === 'delivered' || status === 'read') && !updatedComm.sentDate) {
        updatedComm.sentDate = today;
      }
      
      setEditingComm(updatedComm);
    } else {
      let updatedComm = {...newComm, status: status as any};
      
      // Set appropriate dates based on status
      if ((status === 'sent' || status === 'delivered' || status === 'read') && !updatedComm.sentDate) {
        updatedComm.sentDate = today;
      }
      
      setNewComm(updatedComm);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'sent':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'delivered':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'read':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'cancelled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'message':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'notification':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'meeting':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'announcement':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
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
      case 'urgent':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communication Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New</Button>
      </div>

      {/* Communications List */}
      <Card>
        <CardHeader>
          <CardTitle>Communications</CardTitle>
          <CardDescription>Manage emails, messages, notifications, meetings, and announcements</CardDescription>
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
                <TableHead>Sender</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell className="font-medium">
                    <div>{comm.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{comm.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Recipients: {comm.recipients.join(', ')}
                    </div>
                    {comm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {comm.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(comm.type)}>
                      {comm.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{comm.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(comm.status)}>
                      {comm.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityBadgeClass(comm.priority)}>
                      {comm.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{comm.sender}</TableCell>
                  <TableCell>
                    {comm.status === 'scheduled' ? comm.scheduledDate : 
                     comm.status === 'draft' ? comm.createdDate : 
                     comm.sentDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingComm(comm)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteComm(comm.id)}
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

      {/* Create Communication Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Communication</CardTitle>
            <CardDescription>Enter the details for the new communication</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newComm.type} 
                  onChange={(e) => setNewComm({...newComm, type: e.target.value as any})}
                >
                  <option value="email">Email</option>
                  <option value="message">Message</option>
                  <option value="notification">Notification</option>
                  <option value="meeting">Meeting</option>
                  <option value="announcement">Announcement</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={newComm.title} 
                  onChange={(e) => setNewComm({...newComm, title: e.target.value})}
                  placeholder="Enter title"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Content</FormLabel>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newComm.content} 
                  onChange={(e) => setNewComm({...newComm, content: e.target.value})}
                  placeholder="Enter content"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newComm.projectId} 
                  onChange={(e) => setNewComm({...newComm, projectId: e.target.value})}
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
                    value={newComm.status} 
                    onChange={(e) => handleStatusChange(e.target.value, false)}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="read">Read</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newComm.priority} 
                    onChange={(e) => setNewComm({...newComm, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Created Date</FormLabel>
                  <Input 
                    type="date"
                    value={newComm.createdDate} 
                    onChange={(e) => setNewComm({...newComm, createdDate: e.target.value})}
                  />
                </FormField>
                
                {newComm.status === 'scheduled' && (
                  <FormField>
                    <FormLabel required>Scheduled Date</FormLabel>
                    <Input 
                      type="date"
                      value={newComm.scheduledDate} 
                      onChange={(e) => setNewComm({...newComm, scheduledDate: e.target.value})}
                    />
                  </FormField>
                )}
                
                {(newComm.status === 'sent' || newComm.status === 'delivered' || newComm.status === 'read') && (
                  <FormField>
                    <FormLabel>Sent Date</FormLabel>
                    <Input 
                      type="date"
                      value={newComm.sentDate} 
                      onChange={(e) => setNewComm({...newComm, sentDate: e.target.value})}
                    />
                  </FormField>
                )}
              </div>
              
              <FormField>
                <FormLabel>Sender</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newComm.sender} 
                  onChange={(e) => setNewComm({...newComm, sender: e.target.value})}
                >
                  <option value="">Select sender</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Recipients</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={recipientInput} 
                    onChange={(e) => setRecipientInput(e.target.value)}
                  >
                    <option value="">Select recipient</option>
                    {recipientGroups.map(group => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                    {teamMembers.map(member => (
                      <option key={`member-${member.id}`} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddRecipient(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newComm.recipients || []).map(recipient => (
                    <div key={recipient} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {recipient}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveRecipient(recipient, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
                  {(newComm.attachments || []).map(attachment => (
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
                    placeholder="Enter tag (e.g., urgent, follow-up)"
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
                  {(newComm.tags || []).map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                      <button 
                        type="button"
                        className="ml-1 text-gray-700 hover:text-gray-900"
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
            <Button onClick={handleCreateComm}>Create Communication</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Communication Form */}
      {editingComm && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Communication</CardTitle>
            <CardDescription>Update the communication details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingComm.type} 
                  onChange={(e) => setEditingComm({...editingComm, type: e.target.value as any})}
                >
                  <option value="email">Email</option>
                  <option value="message">Message</option>
                  <option value="notification">Notification</option>
                  <option value="meeting">Meeting</option>
                  <option value="announcement">Announcement</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={editingComm.title} 
                  onChange={(e) => setEditingComm({...editingComm, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Content</FormLabel>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingComm.content} 
                  onChange={(e) => setEditingComm({...editingComm, content: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingComm.projectId} 
                  onChange={(e) => setEditingComm({...editingComm, projectId: e.target.value})}
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
                    value={editingComm.status} 
                    onChange={(e) => handleStatusChange(e.target.value, true)}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="read">Read</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingComm.priority} 
                    onChange={(e) => setEditingComm({...editingComm, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Created Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingComm.createdDate} 
                    onChange={(e) => setEditingComm({...editingComm, createdDate: e.target.value})}
                  />
                </FormField>
                
                {editingComm.status === 'scheduled' && (
                  <FormField>
                    <FormLabel required>Scheduled Date</FormLabel>
                    <Input 
                      type="date"
                      value={editingComm.scheduledDate} 
                      onChange={(e) => setEditingComm({...editingComm, scheduledDate: e.target.value})}
                    />
                  </FormField>
                )}
                
                {(editingComm.status === 'sent' || editingComm.status === 'delivered' || editingComm.status === 'read') && (
                  <FormField>
                    <FormLabel>Sent Date</FormLabel>
                    <Input 
                      type="date"
                      value={editingComm.sentDate} 
                      onChange={(e) => setEditingComm({...editingComm, sentDate: e.target.value})}
                    />
                  </FormField>
                )}
              </div>
              
              <FormField>
                <FormLabel>Sender</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingComm.sender} 
                  onChange={(e) => setEditingComm({...editingComm, sender: e.target.value})}
                >
                  <option value="">Select sender</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Recipients</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={recipientInput} 
                    onChange={(e) => setRecipientInput(e.target.value)}
                  >
                    <option value="">Select recipient</option>
                    {recipientGroups.map(group => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                    {teamMembers.map(member => (
                      <option key={`member-${member.id}`} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddRecipient(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingComm.recipients.map(recipient => (
                    <div key={recipient} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {recipient}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveRecipient(recipient, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
                  {editingComm.attachments.map(attachment => (
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
                    placeholder="Enter tag (e.g., urgent, follow-up)"
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
                  {editingComm.tags.map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                      <button 
                        type="button"
                        className="ml-1 text-gray-700 hover:text-gray-900"
                        onClick={() => handleRemoveTag(tag, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              {/* Responses Section */}
              {editingComm.type !== 'meeting' && editingComm.type !== 'announcement' && (
                <FormField>
                  <FormLabel>Responses</FormLabel>
                  <Card className="border border-gray-200">
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {/* Responses List */}
                        {(editingComm.responses || []).length > 0 ? (
                          <div className="space-y-3">
                            {(editingComm.responses || []).map((response, index) => (
                              <div key={response.id} className="p-3 border rounded">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{response.sender}</div>
                                  <div className="text-xs text-gray-500">{response.date}</div>
                                </div>
                                <div className="mt-1">{response.content}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No responses yet.
                          </div>
                        )}
                        
                        {/* Add New Response */}
                        <div className="border-t pt-4">
                          <div className="font-medium mb-2">Add Response</div>
                          <div className="space-y-2">
                            <textarea 
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={responseInput} 
                              onChange={(e) => setResponseInput(e.target.value)}
                              placeholder="Enter your response"
                            />
                            <Button 
                              type="button" 
                              onClick={handleAddResponse}
                              variant="outline"
                              className="w-full"
                            >
                              Add Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FormField>
              )}
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingComm(null)}>Cancel</Button>
            <Button onClick={handleUpdateComm}>Update Communication</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CommunicationModule;
