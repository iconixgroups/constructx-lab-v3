import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface QualityItem {
  id: string;
  type: 'inspection' | 'test' | 'checklist' | 'audit';
  title: string;
  projectId: string;
  projectName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'passed' | 'requires_action';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  description: string;
  criteria: { id: string; description: string; result: 'pass' | 'fail' | 'n/a' | 'pending'; notes?: string }[];
  score?: number;
  attachments: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const QualityManagementModule: React.FC = () => {
  const [qualityItems, setQualityItems] = useState<QualityItem[]>([
    {
      id: '1',
      type: 'inspection',
      title: 'Structural Steel Welding Inspection',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      status: 'passed',
      assignedTo: 'Sarah Johnson',
      dueDate: '2025-06-15',
      completedDate: '2025-06-14',
      description: 'Visual and NDT inspection of critical structural welds on level 10.',
      criteria: [
        { id: 'c1', description: 'Weld appearance conforms to standards', result: 'pass' },
        { id: 'c2', description: 'NDT results within acceptable limits', result: 'pass' },
        { id: 'c3', description: 'Dimensions and alignment correct', result: 'pass' }
      ],
      score: 100,
      attachments: ['inspection_report_1.pdf', 'ndt_results.xlsx'],
      tags: ['structural', 'welding', 'level10'],
      createdBy: 'John Smith',
      createdAt: '2025-06-10T09:00:00Z',
      updatedAt: '2025-06-14T15:30:00Z'
    },
    {
      id: '2',
      type: 'test',
      title: 'Concrete Strength Test - Batch #45',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      status: 'failed',
      assignedTo: 'Michael Brown',
      dueDate: '2025-06-20',
      completedDate: '2025-06-19',
      description: '7-day and 28-day compressive strength tests for concrete batch #45 used in foundation.',
      criteria: [
        { id: 'c1', description: '7-day strength meets minimum requirement', result: 'pass' },
        { id: 'c2', description: '28-day strength meets minimum requirement', result: 'fail', notes: 'Result was 15% below required strength.' }
      ],
      score: 50,
      attachments: ['concrete_test_results_45.pdf'],
      tags: ['concrete', 'foundation', 'strength_test'],
      createdBy: 'Emily Davis',
      createdAt: '2025-06-12T11:00:00Z',
      updatedAt: '2025-06-19T10:00:00Z'
    },
    {
      id: '3',
      type: 'checklist',
      title: 'Pre-Pour Checklist - Level 11 Slab',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      dueDate: '2025-06-25',
      completedDate: '2025-06-24',
      description: 'Verification checklist before pouring concrete for the level 11 slab.',
      criteria: [
        { id: 'c1', description: 'Formwork secure and clean', result: 'pass' },
        { id: 'c2', description: 'Rebar placement and tying correct', result: 'pass' },
        { id: 'c3', description: 'Embedded items installed correctly', result: 'pass' },
        { id: 'c4', description: 'Weather conditions acceptable', result: 'pass' }
      ],
      score: 100,
      attachments: ['prepour_checklist_L11.pdf'],
      tags: ['checklist', 'concrete_pour', 'level11'],
      createdBy: 'John Smith',
      createdAt: '2025-06-23T14:00:00Z',
      updatedAt: '2025-06-24T16:00:00Z'
    },
    {
      id: '4',
      type: 'audit',
      title: 'Safety Procedures Audit - Site Wide',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      status: 'requires_action',
      assignedTo: 'Robert Wilson',
      dueDate: '2025-07-01',
      completedDate: '2025-06-30',
      description: 'Monthly audit of site safety procedures and compliance.',
      criteria: [
        { id: 'c1', description: 'PPE usage compliance', result: 'pass' },
        { id: 'c2', description: 'Fall protection measures adequate', result: 'fail', notes: 'Guardrails missing on level 12 west side.' },
        { id: 'c3', description: 'Emergency procedures known by staff', result: 'pass' },
        { id: 'c4', description: 'Toolbox talks conducted regularly', result: 'pass' }
      ],
      score: 75,
      attachments: ['safety_audit_june.pdf', 'corrective_actions.docx'],
      tags: ['safety', 'audit', 'compliance'],
      createdBy: 'Emily Davis',
      createdAt: '2025-06-28T08:00:00Z',
      updatedAt: '2025-06-30T17:00:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<QualityItem | null>(null);
  const [viewingItem, setViewingItem] = useState<QualityItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<QualityItem>>({
    type: 'inspection',
    title: '',
    projectId: '',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    description: '',
    criteria: [],
    attachments: [],
    tags: []
  });
  const [criteriaInput, setCriteriaInput] = useState('');
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

  const handleCreateItem = () => {
    const itemId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    const selectedProject = projects.find(p => p.id === newItem.projectId);
    
    const createdItem = {
      ...newItem,
      id: itemId,
      projectName: selectedProject?.name || '',
      criteria: newItem.criteria || [],
      attachments: newItem.attachments || [],
      tags: newItem.tags || [],
      createdBy: 'Current User',
      createdAt: createdAt,
      updatedAt: createdAt
    } as QualityItem;
    
    setQualityItems([...qualityItems, createdItem]);
    setNewItem({
      type: 'inspection',
      title: '',
      projectId: '',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      description: '',
      criteria: [],
      attachments: [],
      tags: []
    });
    setCriteriaInput('');
    setAttachmentInput('');
    setTagInput('');
    setShowCreateForm(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedAt = new Date().toISOString();
    const selectedProject = projects.find(p => p.id === editingItem.projectId);
    const updatedItem = {
      ...editingItem,
      projectName: selectedProject?.name || editingItem.projectName,
      updatedAt: updatedAt
    };
    
    const updatedItems = qualityItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setQualityItems(updatedItems);
    setEditingItem(null);
    setCriteriaInput('');
    setAttachmentInput('');
    setTagInput('');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = qualityItems.filter(item => item.id !== id);
    setQualityItems(updatedItems);
  };

  const handleAddCriteria = (isEditing: boolean) => {
    if (!criteriaInput.trim()) return;
    const newCriteriaItem = { 
      id: Math.random().toString(36).substr(2, 9), 
      description: criteriaInput.trim(), 
      result: 'pending' as const 
    };
    
    if (isEditing && editingItem) {
      const newCriteria = [...editingItem.criteria, newCriteriaItem];
      setEditingItem({...editingItem, criteria: newCriteria});
    } else {
      const newCriteria = [...(newItem.criteria || []), newCriteriaItem];
      setNewItem({...newItem, criteria: newCriteria});
    }
    
    setCriteriaInput('');
  };

  const handleRemoveCriteria = (criteriaId: string, isEditing: boolean) => {
    if (isEditing && editingItem) {
      const newCriteria = editingItem.criteria.filter(c => c.id !== criteriaId);
      setEditingItem({...editingItem, criteria: newCriteria});
    } else {
      const newCriteria = (newItem.criteria || []).filter(c => c.id !== criteriaId);
      setNewItem({...newItem, criteria: newCriteria});
    }
  };

  const handleUpdateCriteriaResult = (criteriaId: string, result: 'pass' | 'fail' | 'n/a' | 'pending', notes?: string) => {
    if (!editingItem) return;
    const updatedCriteria = editingItem.criteria.map(c => 
      c.id === criteriaId ? { ...c, result, notes } : c
    );
    setEditingItem({...editingItem, criteria: updatedCriteria});
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingItem) {
      const newAttachments = [...editingItem.attachments, attachmentInput.trim()];
      setEditingItem({...editingItem, attachments: newAttachments});
    } else {
      const newAttachments = [...(newItem.attachments || []), attachmentInput.trim()];
      setNewItem({...newItem, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingItem) {
      const newAttachments = editingItem.attachments.filter(a => a !== attachment);
      setEditingItem({...editingItem, attachments: newAttachments});
    } else {
      const newAttachments = (newItem.attachments || []).filter(a => a !== attachment);
      setNewItem({...newItem, attachments: newAttachments});
    }
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingItem) {
      const newTags = [...editingItem.tags, tagInput.trim()];
      setEditingItem({...editingItem, tags: newTags});
    } else {
      const newTags = [...(newItem.tags || []), tagInput.trim()];
      setNewItem({...newItem, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingItem) {
      const newTags = editingItem.tags.filter(t => t !== tag);
      setEditingItem({...editingItem, tags: newTags});
    } else {
      const newTags = (newItem.tags || []).filter(t => t !== tag);
      setNewItem({...newItem, tags: newTags});
    }
  };

  const handleStatusChange = (status: string, isEditing: boolean) => {
    const newStatus = status as QualityItem['status'];
    const completedDate = ['completed', 'passed', 'failed'].includes(newStatus) ? new Date().toISOString().split('T')[0] : undefined;
    
    if (isEditing && editingItem) {
      setEditingItem({...editingItem, status: newStatus, completedDate: completedDate || editingItem.completedDate });
    } else {
      setNewItem({...newItem, status: newStatus, completedDate: completedDate || newItem.completedDate });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'requires_action': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'test': return 'bg-indigo-100 text-indigo-800';
      case 'checklist': return 'bg-teal-100 text-teal-800';
      case 'audit': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'n/a': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateScore = (criteria: QualityItem['criteria']) => {
    const relevantCriteria = criteria.filter(c => c.result !== 'n/a' && c.result !== 'pending');
    if (relevantCriteria.length === 0) return null;
    const passedCount = relevantCriteria.filter(c => c.result === 'pass').length;
    return Math.round((passedCount / relevantCriteria.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quality Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Quality Item</Button>
      </div>

      {/* Quality Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Items</CardTitle>
          <CardDescription>Manage inspections, tests, checklists, and audits</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`${getTypeBadgeClass(item.type)} px-2 py-1 rounded-full text-xs`}>
                      {item.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>
                    <span className={`${getStatusBadgeClass(item.status)} px-2 py-1 rounded-full text-xs`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>{calculateScore(item.criteria) !== null ? `${calculateScore(item.criteria)}%` : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setViewingItem(item)}
                      >
                        View
                      </Button>
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

      {/* Create Quality Item Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Quality Item</CardTitle>
            <CardDescription>Enter the details for the new quality item</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newItem.type} 
                  onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                >
                  <option value="inspection">Inspection</option>
                  <option value="test">Test</option>
                  <option value="checklist">Checklist</option>
                  <option value="audit">Audit</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={newItem.title} 
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  placeholder="Enter title"
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
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newItem.description} 
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.assignedTo} 
                    onChange={(e) => setNewItem({...newItem, assignedTo: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel required>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.dueDate} 
                    onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Criteria</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={criteriaInput} 
                    onChange={(e) => setCriteriaInput(e.target.value)}
                    placeholder="Enter criteria description"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddCriteria(false)}
                    variant="outline"
                  >
                    Add Criteria
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {(newItem.criteria || []).map(criteria => (
                    <div key={criteria.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{criteria.description}</span>
                      <button 
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveCriteria(criteria.id, false)}
                      >
                        Remove
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
                  {(newItem.attachments || []).map(attachment => (
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
                    placeholder="Enter tag (e.g., structural, concrete)"
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
                  {(newItem.tags || []).map(tag => (
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
            <Button onClick={handleCreateItem}>Create Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Quality Item Form */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Quality Item</CardTitle>
            <CardDescription>Update the quality item details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingItem.type} 
                  onChange={(e) => setEditingItem({...editingItem, type: e.target.value as any})}
                >
                  <option value="inspection">Inspection</option>
                  <option value="test">Test</option>
                  <option value="checklist">Checklist</option>
                  <option value="audit">Audit</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Title</FormLabel>
                <Input 
                  value={editingItem.title} 
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingItem.projectId} 
                  onChange={(e) => setEditingItem({...editingItem, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingItem.status} 
                  onChange={(e) => handleStatusChange(e.target.value, true)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="passed">Passed</option>
                  <option value="requires_action">Requires Action</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingItem.description} 
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.assignedTo} 
                    onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel required>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.dueDate} 
                    onChange={(e) => setEditingItem({...editingItem, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Criteria</FormLabel>
                <div className="flex space-x-2 mb-2">
                  <Input 
                    value={criteriaInput} 
                    onChange={(e) => setCriteriaInput(e.target.value)}
                    placeholder="Enter criteria description"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddCriteria(true)}
                    variant="outline"
                  >
                    Add Criteria
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingItem.criteria.map(criteria => (
                    <div key={criteria.id} className="flex flex-col space-y-2 bg-gray-50 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <span>{criteria.description}</span>
                        <button 
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveCriteria(criteria.id, true)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select 
                          className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={criteria.result}
                          onChange={(e) => handleUpdateCriteriaResult(criteria.id, e.target.value as any, criteria.notes)}
                        >
                          <option value="pending">Pending</option>
                          <option value="pass">Pass</option>
                          <option value="fail">Fail</option>
                          <option value="n/a">N/A</option>
                        </select>
                        <Input 
                          value={criteria.notes || ''} 
                          onChange={(e) => handleUpdateCriteriaResult(criteria.id, criteria.result, e.target.value)}
                          placeholder="Add notes (optional)"
                          className="flex-grow h-9 text-sm"
                        />
                      </div>
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
                  {editingItem.attachments.map(attachment => (
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
                    placeholder="Enter tag (e.g., structural, concrete)"
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
                  {editingItem.tags.map(tag => (
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
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* View Quality Item Modal/Dialog */}
      {viewingItem && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{viewingItem.title}</CardTitle>
                  <CardDescription>
                    Type: <span className={`${getTypeBadgeClass(viewingItem.type)} px-1.5 py-0.5 rounded text-xs`}>{viewingItem.type.toUpperCase()}</span> | 
                    Status: <span className={`${getStatusBadgeClass(viewingItem.status)} px-1.5 py-0.5 rounded text-xs`}>{viewingItem.status.replace('_', ' ').toUpperCase()}</span> | 
                    Project: {viewingItem.projectName}
                  </CardDescription>
                  <CardDescription>
                    Assigned to {viewingItem.assignedTo} | Due: {viewingItem.dueDate} 
                    {viewingItem.completedDate && ` | Completed: ${viewingItem.completedDate}`}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingItem(null)}>X</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p>{viewingItem.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Criteria</h4>
                  {viewingItem.criteria.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingItem.criteria.map(c => (
                          <TableRow key={c.id}>
                            <TableCell>{c.description}</TableCell>
                            <TableCell>
                              <span className={`${getResultBadgeClass(c.result)} px-2 py-1 rounded-full text-xs`}>
                                {c.result.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell>{c.notes || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No criteria defined.</p>
                  )}
                  <div className="mt-2 font-medium">
                    Score: {calculateScore(viewingItem.criteria) !== null ? `${calculateScore(viewingItem.criteria)}%` : 'N/A'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Attachments</h4>
                  {viewingItem.attachments.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {viewingItem.attachments.map(att => <li key={att}>📎 {att}</li>)}
                    </ul>
                  ) : (
                    <p>No attachments.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Tags</h4>
                  {viewingItem.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingItem.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>No tags.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setViewingItem(null)}>Close</Button>
            </CardFooter>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default QualityManagementModule;
