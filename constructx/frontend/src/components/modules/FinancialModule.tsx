import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface FinancialItem {
  id: string;
  type: 'budget' | 'expense' | 'invoice' | 'payment';
  name: string;
  description: string;
  amount: number;
  date: string;
  status: 'draft' | 'approved' | 'pending' | 'paid' | 'overdue' | 'rejected';
  category: string;
  projectId: string;
  projectName: string;
  createdBy: string;
  attachments: string[];
}

const FinancialModule: React.FC = () => {
  const [financialItems, setFinancialItems] = useState<FinancialItem[]>([
    {
      id: '1',
      type: 'budget',
      name: 'Initial Construction Budget',
      description: 'Approved budget for Downtown Office Tower project',
      amount: 12500000,
      date: '2025-05-01',
      status: 'approved',
      category: 'Project Budget',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      createdBy: 'John Smith',
      attachments: ['budget_details.xlsx']
    },
    {
      id: '2',
      type: 'expense',
      name: 'Site Preparation',
      description: 'Expenses for initial site clearing and preparation',
      amount: 250000,
      date: '2025-05-15',
      status: 'paid',
      category: 'Site Work',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      createdBy: 'Sarah Johnson',
      attachments: ['invoice_site_prep.pdf', 'receipt.pdf']
    },
    {
      id: '3',
      type: 'invoice',
      name: 'Architectural Services - Phase 1',
      description: 'Invoice for initial architectural design services',
      amount: 175000,
      date: '2025-05-20',
      status: 'pending',
      category: 'Professional Services',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      createdBy: 'Michael Brown',
      attachments: ['arch_invoice_p1.pdf']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<FinancialItem>>({
    type: 'expense',
    name: '',
    description: '',
    amount: 0,
    date: '',
    status: 'draft',
    category: '',
    projectId: '',
    attachments: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock categories based on type
  const getCategories = (type: string) => {
    switch (type) {
      case 'budget':
        return ['Project Budget', 'Phase Budget', 'Contingency Budget'];
      case 'expense':
        return ['Site Work', 'Materials', 'Labor', 'Equipment', 'Permits', 'Professional Services', 'Overhead'];
      case 'invoice':
        return ['Professional Services', 'Contractor', 'Supplier', 'Utility', 'Rental'];
      case 'payment':
        return ['Contractor Payment', 'Supplier Payment', 'Refund', 'Deposit'];
      default:
        return [];
    }
  };

  const handleCreateItem = () => {
    const itemId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newItem.projectId);
    
    const createdItem = {
      ...newItem,
      id: itemId,
      projectName: selectedProject?.name || '',
      createdBy: 'Current User', // In a real app, this would be the logged-in user
      attachments: newItem.attachments || []
    } as FinancialItem;
    
    setFinancialItems([...financialItems, createdItem]);
    setNewItem({
      type: 'expense',
      name: '',
      description: '',
      amount: 0,
      date: '',
      status: 'draft',
      category: '',
      projectId: '',
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
    
    const updatedItems = financialItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setFinancialItems(updatedItems);
    setEditingItem(null);
    setAttachmentInput('');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = financialItems.filter(item => item.id !== id);
    setFinancialItems(updatedItems);
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'paid':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'overdue':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'rejected':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'budget':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'expense':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'invoice':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'payment':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Financial Item</Button>
      </div>

      {/* Financial Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Manage budgets, expenses, invoices, and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    {item.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.attachments.map(attachment => (
                          <span key={attachment} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded flex items-center">
                            <span className="mr-1">📎</span> {attachment}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(item.type)}>
                      {item.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status.toUpperCase()}
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

      {/* Create Financial Item Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Financial Item</CardTitle>
            <CardDescription>Enter the details for the new financial record</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newItem.type} 
                  onChange={(e) => setNewItem({...newItem, type: e.target.value as any, category: ''})}
                >
                  <option value="budget">Budget</option>
                  <option value="expense">Expense</option>
                  <option value="invoice">Invoice</option>
                  <option value="payment">Payment</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Name</FormLabel>
                <Input 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter name"
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
                  <FormLabel required>Amount</FormLabel>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newItem.amount || ''} 
                    onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                    placeholder="Enter amount"
                  />
                  <FormDescription>
                    {newItem.amount ? formatCurrency(newItem.amount) : ''}
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel required>Date</FormLabel>
                  <Input 
                    type="date"
                    value={newItem.date} 
                    onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Category</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.category} 
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    {getCategories(newItem.type || 'expense').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newItem.status} 
                    onChange={(e) => setNewItem({...newItem, status: e.target.value as any})}
                  >
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </FormField>
              </div>
              
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
            <Button onClick={handleCreateItem}>Create Financial Item</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Financial Item Form */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Financial Item</CardTitle>
            <CardDescription>Update the financial record details</CardDescription>
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
                  <option value="budget">Budget</option>
                  <option value="expense">Expense</option>
                  <option value="invoice">Invoice</option>
                  <option value="payment">Payment</option>
                </select>
              </FormField>
              
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
                  <FormLabel required>Amount</FormLabel>
                  <Input 
                    type="number"
                    step="0.01"
                    value={editingItem.amount} 
                    onChange={(e) => setEditingItem({...editingItem, amount: Number(e.target.value)})}
                  />
                  <FormDescription>
                    {formatCurrency(editingItem.amount)}
                  </FormDescription>
                </FormField>
                
                <FormField>
                  <FormLabel required>Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingItem.date} 
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Category</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.category} 
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    {getCategories(editingItem.type).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingItem.status} 
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                  >
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </FormField>
              </div>
              
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
            <Button onClick={handleUpdateItem}>Update Financial Item</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FinancialModule;
