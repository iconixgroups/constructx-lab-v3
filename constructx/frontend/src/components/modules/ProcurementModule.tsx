import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface ProcurementItem {
  id: string;
  type: 'material' | 'equipment' | 'service' | 'contract';
  title: string;
  description: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'received' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  projectName: string;
  requestedBy: string;
  approvedBy?: string;
  vendor?: string;
  cost: number;
  quantity: number;
  unit: string;
  requestDate: string;
  requiredDate: string;
  approvalDate?: string;
  orderDate?: string;
  deliveryDate?: string;
  attachments: string[];
}

const ProcurementModule: React.FC = () => {
  const [procurementItems, setProcurementItems] = useState<ProcurementItem[]>([
    {
      id: '1',
      type: 'material',
      title: 'Concrete Mix Type II',
      description: 'High-strength concrete mix for foundation',
      status: 'ordered',
      priority: 'high',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      requestedBy: 'John Smith',
      approvedBy: 'Robert Wilson',
      vendor: 'ABC Building Supplies',
      cost: 5200,
      quantity: 40,
      unit: 'cubic yards',
      requestDate: '2025-05-15',
      requiredDate: '2025-06-10',
      approvalDate: '2025-05-18',
      orderDate: '2025-05-20',
      attachments: ['concrete_specs.pdf', 'vendor_quote.pdf']
    },
    {
      id: '2',
      type: 'equipment',
      title: 'Excavator Rental',
      description: 'Medium-sized excavator for foundation work',
      status: 'approved',
      priority: 'medium',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      requestedBy: 'Sarah Johnson',
      approvedBy: 'Robert Wilson',
      vendor: 'Heavy Equipment Rentals Inc.',
      cost: 3500,
      quantity: 1,
      unit: 'week',
      requestDate: '2025-05-20',
      requiredDate: '2025-06-05',
      approvalDate: '2025-05-25',
      attachments: ['equipment_specs.pdf', 'rental_agreement.pdf']
    },
    {
      id: '3',
      type: 'service',
      title: 'Electrical Subcontractor',
      description: 'Specialized electrical work for server room',
      status: 'pending_approval',
      priority: 'high',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      requestedBy: 'Michael Brown',
      vendor: 'Precision Electrical Services',
      cost: 28500,
      quantity: 1,
      unit: 'service',
      requestDate: '2025-05-22',
      requiredDate: '2025-06-15',
      attachments: ['service_scope.pdf', 'subcontractor_proposal.pdf']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcurementItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<ProcurementItem>>({
    type: 'material',
    title: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    projectId: '',
    requestedBy: '',
    cost: 0,
    quantity: 1,
    unit: '',
    requestDate: new Date().toISOString().split('T')[0],
    requiredDate: '',
    attachments: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');

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

  // Mock vendors for dropdown
  const vendors = [
    { id: '1', name: 'ABC Building Supplies' },
    { id: '2', name: 'Heavy Equipment Rentals Inc.' },
    { id: '3', name: 'Precision Electrical Services' },
    { id: '4', name: 'Metro Plumbing & HVAC' },
    { id: '5', name: 'Structural Steel Co.' }
  ];

  const handleCreateItem = () => {
    const itemId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newItem.projectId);
    
    const createdItem = {
      ...newItem,
      id: itemId,
      projectName: selectedProject?.name || '',
      attachments: newItem.attachments || []
    } as ProcurementItem;
    
    setProcurementItems([...procurementItems, createdItem]);
    setNewItem({
      type: 'material',
      title: '',
      description: '',
      status: 'draft',
      priority: 'medium',
      projectId: '',
      requestedBy: '',
      cost: 0,
      quantity: 1,
      unit: '',
      requestDate: new Date().toISOString().split('T')[0],
      requiredDate: '',
      attachments: []
    });
    setAttachmentInput('');
    setShowCreateForm(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const selectedProject = projects.find(p => p.id === editingItem.projectId);
    const updatedItem = {
      ...editingItem,
      projectName: selectedProject?.name || editingItem.projectName
    };
    
    const updatedItems = procurementItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setProcurementItems(updatedItems);
    setEditingItem(null);
    setAttachmentInput('');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = procurementItems.filter(item => item.id !== id);
    setProcurementItems(updatedItems);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingItem) {
      const newAttachments = [...(editingItem.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingItem({...editingItem, attachments: newAttachments});
    } else {
      const newAttachments = [...(newItem.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
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

  const handleStatusChange = (status: string, isEditing: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (isEditing && editingItem) {
      let updatedItem = {...editingItem, status: status as any};
      
      // Set appropriate dates based on status
      if (status === 'approved' && !updatedItem.approvalDate) {
        updatedItem.approvalDate = today;
      } else if (status === 'ordered' && !updatedItem.orderDate) {
        updatedItem.orderDate = today;
      } else if ((status === 'received' || status === 'completed') && !updatedItem.deliveryDate) {
        updatedItem.deliveryDate = today;
      }
      
      setEditingItem(updatedItem);
    } else {
      let updatedItem = {...newItem, status: status as any};
      
      // Set appropriate dates based on status
      if (status === 'approved' && !updatedItem.approvalDate) {
        updatedItem.approvalDate = today;
      } else if (status === 'ordered' && !updatedItem.orderDate) {
        updatedItem.orderDate = today;
      } else if ((status === 'received' || status === 'completed') && !updatedItem.deliveryDate) {
        updatedItem.deliveryDate = today;
      }
      
      setNewItem(updatedItem);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'approved':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'ordered':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'received':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'cancelled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'material':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'equipment':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'service':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'contract':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Procurement Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New</Button>
      </div>

      {/* Procurement Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Items</CardTitle>
          <CardDescription>Manage materials, equipment, services, and contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Required By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procurementItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.quantity} {item.unit}
                      {item.vendor && ` | Vendor: ${item.vendor}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(item.type)}>
                      {item.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityBadgeClass(item.priority)}>
                      {item.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell>{item.requiredDate}</TableCell>
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

      {/* Create Procurement Item Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Procurement Item</CardTitle>
            <CardDescription>Enter the details for the new procurement item</CardDescription>
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
                  <option value="material">Material</option>
                  <option value="equipment">Equipment</option>
                  <option value="service">Service</option>
                  <option value="contract">Contract</option>
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
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.status} 
                    onChange={(e) => handleStatusChange(e.target.value, false)}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="ordered">Ordered</option>
                    <option value="received">Received</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.priority} 
                    onChange={(e) => setNewItem({...newItem, priority: e.target.value as any})}
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
                  <FormLabel required>Request Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.requestDate} 
                    onChange={(e) => setNewItem({...newItem, requestDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Required Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.requiredDate} 
                    onChange={(e) => setNewItem({...newItem, requiredDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Requested By</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.requestedBy} 
                    onChange={(e) => setNewItem({...newItem, requestedBy: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
                
                {(newItem.status === 'approved' || newItem.status === 'ordered' || 
                  newItem.status === 'received' || newItem.status === 'completed') && (
                  <FormField>
                    <FormLabel>Approved By</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newItem.approvedBy} 
                      onChange={(e) => setNewItem({...newItem, approvedBy: e.target.value})}
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </FormField>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Cost</FormLabel>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.cost} 
                    onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value) || 0})}
                    placeholder="Enter cost"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Quantity</FormLabel>
                  <Input 
                    type="number"
                    min="1"
                    value={newItem.quantity} 
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                    placeholder="Enter quantity"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Unit</FormLabel>
                  <Input 
                    value={newItem.unit} 
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="e.g., pieces, yards, hours"
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Vendor</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newItem.vendor} 
                  onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
                >
                  <option value="">Select vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                </select>
              </FormField>
              
              {newItem.status === 'approved' && (
                <FormField>
                  <FormLabel>Approval Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.approvalDate} 
                    onChange={(e) => setNewItem({...newItem, approvalDate: e.target.value})}
                  />
                </FormField>
              )}
              
              {newItem.status === 'ordered' && (
                <FormField>
                  <FormLabel>Order Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.orderDate} 
                    onChange={(e) => setNewItem({...newItem, orderDate: e.target.value})}
                  />
                </FormField>
              )}
              
              {(newItem.status === 'received' || newItem.status === 'completed') && (
                <FormField>
                  <FormLabel>Delivery Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.deliveryDate} 
                    onChange={(e) => setNewItem({...newItem, deliveryDate: e.target.value})}
                  />
                </FormField>
              )}
              
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
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateItem}>Create Procurement Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Procurement Item Form */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Procurement Item</CardTitle>
            <CardDescription>Update the procurement item details</CardDescription>
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
                  <option value="material">Material</option>
                  <option value="equipment">Equipment</option>
                  <option value="service">Service</option>
                  <option value="contract">Contract</option>
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
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.status} 
                    onChange={(e) => handleStatusChange(e.target.value, true)}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="ordered">Ordered</option>
                    <option value="received">Received</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Priority</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.priority} 
                    onChange={(e) => setEditingItem({...editingItem, priority: e.target.value as any})}
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
                  <FormLabel required>Request Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.requestDate} 
                    onChange={(e) => setEditingItem({...editingItem, requestDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Required Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.requiredDate} 
                    onChange={(e) => setEditingItem({...editingItem, requiredDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Requested By</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.requestedBy} 
                    onChange={(e) => setEditingItem({...editingItem, requestedBy: e.target.value})}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </FormField>
                
                {(editingItem.status === 'approved' || editingItem.status === 'ordered' || 
                  editingItem.status === 'received' || editingItem.status === 'completed') && (
                  <FormField>
                    <FormLabel>Approved By</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={editingItem.approvedBy} 
                      onChange={(e) => setEditingItem({...editingItem, approvedBy: e.target.value})}
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </FormField>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Cost</FormLabel>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.cost} 
                    onChange={(e) => setEditingItem({...editingItem, cost: parseFloat(e.target.value) || 0})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Quantity</FormLabel>
                  <Input 
                    type="number"
                    min="1"
                    value={editingItem.quantity} 
                    onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 1})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Unit</FormLabel>
                  <Input 
                    value={editingItem.unit} 
                    onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Vendor</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingItem.vendor} 
                  onChange={(e) => setEditingItem({...editingItem, vendor: e.target.value})}
                >
                  <option value="">Select vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                </select>
              </FormField>
              
              {editingItem.status === 'approved' && (
                <FormField>
                  <FormLabel>Approval Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.approvalDate} 
                    onChange={(e) => setEditingItem({...editingItem, approvalDate: e.target.value})}
                  />
                </FormField>
              )}
              
              {editingItem.status === 'ordered' && (
                <FormField>
                  <FormLabel>Order Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.orderDate} 
                    onChange={(e) => setEditingItem({...editingItem, orderDate: e.target.value})}
                  />
                </FormField>
              )}
              
              {(editingItem.status === 'received' || editingItem.status === 'completed') && (
                <FormField>
                  <FormLabel>Delivery Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.deliveryDate} 
                    onChange={(e) => setEditingItem({...editingItem, deliveryDate: e.target.value})}
                  />
                </FormField>
              )}
              
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
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleUpdateItem}>Update Procurement Item</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProcurementModule;
