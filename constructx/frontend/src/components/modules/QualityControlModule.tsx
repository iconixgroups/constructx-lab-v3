import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface QualityControl {
  id: string;
  title: string;
  description: string;
  type: 'inspection' | 'test' | 'checklist' | 'audit';
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'remediated';
  projectId: string;
  projectName: string;
  location: string;
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  score?: number;
  criteria: QualityCriteria[];
  attachments: string[];
}

interface QualityCriteria {
  id: string;
  description: string;
  status: 'pending' | 'passed' | 'failed' | 'n/a';
  notes?: string;
}

const QualityControlModule: React.FC = () => {
  const [qualityControls, setQualityControls] = useState<QualityControl[]>([
    {
      id: '1',
      title: 'Concrete Pour Quality Inspection',
      description: 'Inspection of concrete quality for foundation',
      type: 'inspection',
      status: 'passed',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Foundation Area',
      assignedTo: 'John Smith',
      dueDate: '2025-06-05',
      completedDate: '2025-06-04',
      score: 95,
      criteria: [
        { id: '1-1', description: 'Concrete mix meets specifications', status: 'passed', notes: 'Verified with lab test results' },
        { id: '1-2', description: 'Proper curing conditions maintained', status: 'passed', notes: 'Temperature and humidity monitored' },
        { id: '1-3', description: 'No visible cracks or defects', status: 'passed', notes: 'Visual inspection completed' }
      ],
      attachments: ['concrete_test_results.pdf', 'foundation_photos.jpg']
    },
    {
      id: '2',
      title: 'Structural Steel Installation Checklist',
      description: 'Quality control checklist for steel beam installation',
      type: 'checklist',
      status: 'in_progress',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Level 3 - Grid C/12',
      assignedTo: 'Sarah Johnson',
      dueDate: '2025-06-20',
      criteria: [
        { id: '2-1', description: 'All bolts properly torqued', status: 'pending' },
        { id: '2-2', description: 'Welds meet specification', status: 'passed', notes: 'Inspected by certified welder' },
        { id: '2-3', description: 'Proper alignment of beams', status: 'pending' },
        { id: '2-4', description: 'Fireproofing applied correctly', status: 'n/a', notes: 'To be completed in later phase' }
      ],
      attachments: ['steel_specs.pdf']
    },
    {
      id: '3',
      title: 'Electrical System Testing',
      description: 'Comprehensive testing of electrical installations',
      type: 'test',
      status: 'failed',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Electrical Room - Basement',
      assignedTo: 'Michael Brown',
      dueDate: '2025-06-10',
      completedDate: '2025-06-10',
      score: 65,
      criteria: [
        { id: '3-1', description: 'Proper voltage at all outlets', status: 'passed', notes: 'All outlets tested' },
        { id: '3-2', description: 'Circuit breakers functioning correctly', status: 'passed', notes: 'All breakers tested' },
        { id: '3-3', description: 'Emergency lighting operational', status: 'failed', notes: 'Three units not functioning properly' },
        { id: '3-4', description: 'Grounding meets code requirements', status: 'failed', notes: 'Improper grounding detected in east section' }
      ],
      attachments: ['electrical_test_report.pdf', 'deficiency_photos.zip']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQC, setEditingQC] = useState<QualityControl | null>(null);
  const [newQC, setNewQC] = useState<Partial<QualityControl>>({
    title: '',
    description: '',
    type: 'inspection',
    status: 'pending',
    projectId: '',
    location: '',
    assignedTo: '',
    dueDate: '',
    criteria: [],
    attachments: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [newCriteria, setNewCriteria] = useState<Partial<QualityCriteria>>({
    description: '',
    status: 'pending',
    notes: ''
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

  const handleCreateQC = () => {
    const qcId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newQC.projectId);
    
    // Add IDs to criteria
    const criteriaWithIds = (newQC.criteria || []).map(c => ({
      ...c,
      id: `${qcId}-${Math.random().toString(36).substr(2, 5)}`
    }));
    
    const createdQC = {
      ...newQC,
      id: qcId,
      projectName: selectedProject?.name || '',
      criteria: criteriaWithIds,
      attachments: newQC.attachments || []
    } as QualityControl;
    
    setQualityControls([...qualityControls, createdQC]);
    setNewQC({
      title: '',
      description: '',
      type: 'inspection',
      status: 'pending',
      projectId: '',
      location: '',
      assignedTo: '',
      dueDate: '',
      criteria: [],
      attachments: []
    });
    setAttachmentInput('');
    setNewCriteria({
      description: '',
      status: 'pending',
      notes: ''
    });
    setShowCreateForm(false);
  };

  const handleUpdateQC = () => {
    if (!editingQC) return;
    
    const selectedProject = projects.find(p => p.id === editingQC.projectId);
    const updatedQC = {
      ...editingQC,
      projectName: selectedProject?.name || editingQC.projectName
    };
    
    const updatedQCs = qualityControls.map(qc => 
      qc.id === updatedQC.id ? updatedQC : qc
    );
    
    setQualityControls(updatedQCs);
    setEditingQC(null);
    setAttachmentInput('');
    setNewCriteria({
      description: '',
      status: 'pending',
      notes: ''
    });
  };

  const handleDeleteQC = (id: string) => {
    const updatedQCs = qualityControls.filter(qc => qc.id !== id);
    setQualityControls(updatedQCs);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingQC) {
      const newAttachments = [...(editingQC.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingQC({...editingQC, attachments: newAttachments});
    } else {
      const newAttachments = [...(newQC.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewQC({...newQC, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingQC) {
      const newAttachments = editingQC.attachments.filter(a => a !== attachment);
      setEditingQC({...editingQC, attachments: newAttachments});
    } else {
      const newAttachments = (newQC.attachments || []).filter(a => a !== attachment);
      setNewQC({...newQC, attachments: newAttachments});
    }
  };

  const handleAddCriteria = (isEditing: boolean) => {
    if (!newCriteria.description?.trim()) return;
    
    if (isEditing && editingQC) {
      const criteriaId = `${editingQC.id}-${Math.random().toString(36).substr(2, 5)}`;
      const criteria = {
        ...newCriteria,
        id: criteriaId
      } as QualityCriteria;
      
      setEditingQC({
        ...editingQC,
        criteria: [...editingQC.criteria, criteria]
      });
    } else {
      const criteriaId = `temp-${Math.random().toString(36).substr(2, 5)}`;
      const criteria = {
        ...newCriteria,
        id: criteriaId
      } as QualityCriteria;
      
      setNewQC({
        ...newQC,
        criteria: [...(newQC.criteria || []), criteria]
      });
    }
    
    setNewCriteria({
      description: '',
      status: 'pending',
      notes: ''
    });
  };

  const handleRemoveCriteria = (criteriaId: string, isEditing: boolean) => {
    if (isEditing && editingQC) {
      const newCriteria = editingQC.criteria.filter(c => c.id !== criteriaId);
      setEditingQC({...editingQC, criteria: newCriteria});
    } else {
      const newCriteriaList = (newQC.criteria || []).filter(c => c.id !== criteriaId);
      setNewQC({...newQC, criteria: newCriteriaList});
    }
  };

  const handleUpdateCriteriaStatus = (criteriaId: string, status: string, isEditing: boolean) => {
    if (isEditing && editingQC) {
      const updatedCriteria = editingQC.criteria.map(c => 
        c.id === criteriaId ? {...c, status: status as any} : c
      );
      setEditingQC({...editingQC, criteria: updatedCriteria});
      
      // Update overall status based on criteria
      updateOverallStatus(updatedCriteria, true);
    } else {
      const updatedCriteria = (newQC.criteria || []).map(c => 
        c.id === criteriaId ? {...c, status: status as any} : c
      );
      setNewQC({...newQC, criteria: updatedCriteria});
      
      // Update overall status based on criteria
      updateOverallStatus(updatedCriteria, false);
    }
  };

  const updateOverallStatus = (criteria: QualityCriteria[], isEditing: boolean) => {
    // Skip empty criteria lists
    if (!criteria.length) return;
    
    // Filter out N/A criteria
    const relevantCriteria = criteria.filter(c => c.status !== 'n/a');
    if (!relevantCriteria.length) return;
    
    // Count statuses
    const pending = relevantCriteria.filter(c => c.status === 'pending').length;
    const failed = relevantCriteria.filter(c => c.status === 'failed').length;
    const passed = relevantCriteria.filter(c => c.status === 'passed').length;
    
    // Calculate score if all criteria are evaluated
    const score = pending === 0 ? Math.round((passed / relevantCriteria.length) * 100) : undefined;
    
    // Determine overall status
    let status: string;
    if (pending > 0) {
      status = relevantCriteria.some(c => c.status === 'failed') ? 'in_progress' : 'pending';
    } else if (failed > 0) {
      status = 'failed';
    } else {
      status = 'passed';
    }
    
    // Update the state
    if (isEditing && editingQC) {
      setEditingQC({...editingQC, status: status as any, score});
    } else {
      setNewQC({...newQC, status: status as any, score});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'passed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'failed':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'remediated':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'n/a':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'test':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'checklist':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'audit':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getScoreClass = (score?: number) => {
    if (score === undefined) return '';
    
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 70) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quality Control</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New</Button>
      </div>

      {/* Quality Control List */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Control Items</CardTitle>
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
                <TableHead>Score</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityControls.map((qc) => (
                <TableRow key={qc.id}>
                  <TableCell className="font-medium">
                    <div>{qc.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{qc.description}</div>
                    <div className="text-xs text-gray-500 mt-1">Location: {qc.location}</div>
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(qc.type)}>
                      {qc.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{qc.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(qc.status)}>
                      {qc.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getScoreClass(qc.score)}>
                      {qc.score !== undefined ? `${qc.score}%` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>{qc.dueDate}</TableCell>
                  <TableCell>{qc.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingQC(qc)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteQC(qc.id)}
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

      {/* Create Quality Control Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Quality Control Item</CardTitle>
            <CardDescription>Enter the details for the new quality control item</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newQC.type} 
                  onChange={(e) => setNewQC({...newQC, type: e.target.value as any})}
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
                  value={newQC.title} 
                  onChange={(e) => setNewQC({...newQC, title: e.target.value})}
                  placeholder="Enter title"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newQC.description} 
                  onChange={(e) => setNewQC({...newQC, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newQC.projectId} 
                  onChange={(e) => setNewQC({...newQC, projectId: e.target.value})}
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
                    value={newQC.status} 
                    onChange={(e) => setNewQC({...newQC, status: e.target.value as any})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="remediated">Remediated</option>
                  </select>
                  <FormDescription>
                    This will be automatically updated based on criteria results
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel required>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={newQC.dueDate} 
                    onChange={(e) => setNewQC({...newQC, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={newQC.location} 
                    onChange={(e) => setNewQC({...newQC, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newQC.assignedTo} 
                    onChange={(e) => setNewQC({...newQC, assignedTo: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              {newQC.status === 'passed' || newQC.status === 'failed' || newQC.status === 'remediated' ? (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={newQC.completedDate} 
                    onChange={(e) => setNewQC({...newQC, completedDate: e.target.value})}
                  />
                </FormField>
              ) : null}
              
              <FormField>
                <FormLabel>Quality Criteria</FormLabel>
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Criteria List */}
                      {(newQC.criteria || []).length > 0 ? (
                        <div className="space-y-2">
                          {(newQC.criteria || []).map((criteria, index) => (
                            <div key={criteria.id} className="flex items-start p-2 border rounded">
                              <div className="flex-grow">
                                <div className="font-medium">{index + 1}. {criteria.description}</div>
                                {criteria.notes && (
                                  <div className="text-xs text-gray-500 mt-1">Notes: {criteria.notes}</div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <select 
                                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                  value={criteria.status}
                                  onChange={(e) => handleUpdateCriteriaStatus(criteria.id, e.target.value, false)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="passed">Passed</option>
                                  <option value="failed">Failed</option>
                                  <option value="n/a">N/A</option>
                                </select>
                                <button 
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveCriteria(criteria.id, false)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No criteria added yet. Add criteria below.
                        </div>
                      )}
                      
                      {/* Add New Criteria */}
                      <div className="border-t pt-4">
                        <div className="font-medium mb-2">Add New Criteria</div>
                        <div className="space-y-2">
                          <Input 
                            value={newCriteria.description} 
                            onChange={(e) => setNewCriteria({...newCriteria, description: e.target.value})}
                            placeholder="Enter criteria description"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newCriteria.status}
                              onChange={(e) => setNewCriteria({...newCriteria, status: e.target.value as any})}
                            >
                              <option value="pending">Pending</option>
                              <option value="passed">Passed</option>
                              <option value="failed">Failed</option>
                              <option value="n/a">N/A</option>
                            </select>
                            <Input 
                              value={newCriteria.notes} 
                              onChange={(e) => setNewCriteria({...newCriteria, notes: e.target.value})}
                              placeholder="Notes (optional)"
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleAddCriteria(false)}
                            variant="outline"
                            className="w-full"
                          >
                            Add Criteria
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
                  {(newQC.attachments || []).map(attachment => (
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
            <Button onClick={handleCreateQC}>Create Quality Control Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Quality Control Form */}
      {editingQC && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Quality Control Item</CardTitle>
            <CardDescription>Update the quality control item details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingQC.type} 
                  onChange={(e) => setEditingQC({...editingQC, type: e.target.value as any})}
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
                  value={editingQC.title} 
                  onChange={(e) => setEditingQC({...editingQC, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingQC.description} 
                  onChange={(e) => setEditingQC({...editingQC, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingQC.projectId} 
                  onChange={(e) => setEditingQC({...editingQC, projectId: e.target.value})}
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
                    value={editingQC.status} 
                    onChange={(e) => setEditingQC({...editingQC, status: e.target.value as any})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="remediated">Remediated</option>
                  </select>
                  <FormDescription>
                    This will be automatically updated based on criteria results
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel required>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingQC.dueDate} 
                    onChange={(e) => setEditingQC({...editingQC, dueDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={editingQC.location} 
                    onChange={(e) => setEditingQC({...editingQC, location: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Assigned To</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingQC.assignedTo} 
                    onChange={(e) => setEditingQC({...editingQC, assignedTo: e.target.value})}
                  >
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              {editingQC.status === 'passed' || editingQC.status === 'failed' || editingQC.status === 'remediated' ? (
                <FormField>
                  <FormLabel>Completed Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingQC.completedDate} 
                    onChange={(e) => setEditingQC({...editingQC, completedDate: e.target.value})}
                  />
                </FormField>
              ) : null}
              
              <FormField>
                <FormLabel>Quality Criteria</FormLabel>
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Criteria List */}
                      {editingQC.criteria.length > 0 ? (
                        <div className="space-y-2">
                          {editingQC.criteria.map((criteria, index) => (
                            <div key={criteria.id} className="flex items-start p-2 border rounded">
                              <div className="flex-grow">
                                <div className="font-medium">{index + 1}. {criteria.description}</div>
                                {criteria.notes && (
                                  <div className="text-xs text-gray-500 mt-1">Notes: {criteria.notes}</div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <select 
                                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                  value={criteria.status}
                                  onChange={(e) => handleUpdateCriteriaStatus(criteria.id, e.target.value, true)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="passed">Passed</option>
                                  <option value="failed">Failed</option>
                                  <option value="n/a">N/A</option>
                                </select>
                                <button 
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveCriteria(criteria.id, true)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No criteria added yet. Add criteria below.
                        </div>
                      )}
                      
                      {/* Add New Criteria */}
                      <div className="border-t pt-4">
                        <div className="font-medium mb-2">Add New Criteria</div>
                        <div className="space-y-2">
                          <Input 
                            value={newCriteria.description} 
                            onChange={(e) => setNewCriteria({...newCriteria, description: e.target.value})}
                            placeholder="Enter criteria description"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newCriteria.status}
                              onChange={(e) => setNewCriteria({...newCriteria, status: e.target.value as any})}
                            >
                              <option value="pending">Pending</option>
                              <option value="passed">Passed</option>
                              <option value="failed">Failed</option>
                              <option value="n/a">N/A</option>
                            </select>
                            <Input 
                              value={newCriteria.notes} 
                              onChange={(e) => setNewCriteria({...newCriteria, notes: e.target.value})}
                              placeholder="Notes (optional)"
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleAddCriteria(true)}
                            variant="outline"
                            className="w-full"
                          >
                            Add Criteria
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
                  {editingQC.attachments.map(attachment => (
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
            <Button variant="outline" onClick={() => setEditingQC(null)}>Cancel</Button>
            <Button onClick={handleUpdateQC}>Update Quality Control Item</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QualityControlModule;
