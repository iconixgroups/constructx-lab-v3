import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Lead {
  id: string;
  name: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  value: number;
  probability: number;
  assignedTo: string;
  clientCompany: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

const LeadsModule: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'New Office Building',
      source: 'Website Inquiry',
      status: 'new',
      value: 1500000,
      probability: 30,
      assignedTo: 'Jane Doe',
      clientCompany: 'Tech Innovations Inc.',
      contactName: 'Robert Chen',
      contactEmail: 'robert.chen@techinnovations.com',
      contactPhone: '(555) 123-4567',
      createdAt: '2025-05-20'
    },
    {
      id: '2',
      name: 'Shopping Mall Renovation',
      source: 'Referral',
      status: 'contacted',
      value: 3200000,
      probability: 60,
      assignedTo: 'John Smith',
      clientCompany: 'Retail Properties Group',
      contactName: 'Maria Garcia',
      contactEmail: 'mgarcia@rpg.com',
      contactPhone: '(555) 987-6543',
      createdAt: '2025-05-15'
    },
    {
      id: '3',
      name: 'Industrial Warehouse',
      source: 'Trade Show',
      status: 'qualified',
      value: 2800000,
      probability: 75,
      assignedTo: 'Jane Doe',
      clientCompany: 'Global Logistics Co.',
      contactName: 'David Wilson',
      contactEmail: 'dwilson@globallogistics.com',
      contactPhone: '(555) 456-7890',
      createdAt: '2025-05-10'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    source: '',
    status: 'new',
    value: 0,
    probability: 0,
    assignedTo: '',
    clientCompany: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleCreateLead = () => {
    const leadId = Math.random().toString(36).substr(2, 9);
    const createdLead = {
      ...newLead,
      id: leadId,
      createdAt: new Date().toISOString().split('T')[0]
    } as Lead;
    
    setLeads([...leads, createdLead]);
    setNewLead({
      name: '',
      source: '',
      status: 'new',
      value: 0,
      probability: 0,
      assignedTo: '',
      clientCompany: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    });
    setShowCreateForm(false);
  };

  const handleUpdateLead = () => {
    if (!editingLead) return;
    
    const updatedLeads = leads.map(lead => 
      lead.id === editingLead.id ? editingLead : lead
    );
    
    setLeads(updatedLeads);
    setEditingLead(null);
  };

  const handleDeleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);
  };

  const handleConvertLead = (id: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? {...lead, status: 'converted' as const} : lead
    );
    
    setLeads(updatedLeads);
    // In a real implementation, this would also create a new project
    alert('Lead converted to project successfully!');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'contacted':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'qualified':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'unqualified':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'converted':
        return 'bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Lead</Button>
      </div>

      {/* Lead List */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>Manage your sales leads and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.clientCompany}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(lead.status)}>
                      {lead.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(lead.value)}</TableCell>
                  <TableCell>{lead.probability}%</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingLead(lead)}
                      >
                        Edit
                      </Button>
                      {lead.status !== 'converted' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleConvertLead(lead.id)}
                        >
                          Convert
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteLead(lead.id)}
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

      {/* Create Lead Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Lead</CardTitle>
            <CardDescription>Enter the details for the new lead</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Lead Name</FormLabel>
                  <Input 
                    value={newLead.name} 
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                    placeholder="Enter opportunity name"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Source</FormLabel>
                  <Input 
                    value={newLead.source} 
                    onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                    placeholder="How did you find this lead?"
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Estimated Value</FormLabel>
                  <Input 
                    type="number"
                    value={newLead.value || ''} 
                    onChange={(e) => setNewLead({...newLead, value: Number(e.target.value)})}
                    placeholder="Enter estimated value"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Probability (%)</FormLabel>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={newLead.probability || ''} 
                    onChange={(e) => setNewLead({...newLead, probability: Number(e.target.value)})}
                    placeholder="Enter win probability"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newLead.status} 
                    onChange={(e) => setNewLead({...newLead, status: e.target.value as any})}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="unqualified">Unqualified</option>
                  </select>
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Assigned To</FormLabel>
                <Input 
                  value={newLead.assignedTo} 
                  onChange={(e) => setNewLead({...newLead, assignedTo: e.target.value})}
                  placeholder="Enter sales representative name"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Client Company</FormLabel>
                <Input 
                  value={newLead.clientCompany} 
                  onChange={(e) => setNewLead({...newLead, clientCompany: e.target.value})}
                  placeholder="Enter client company name"
                />
              </FormField>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Contact Name</FormLabel>
                  <Input 
                    value={newLead.contactName} 
                    onChange={(e) => setNewLead({...newLead, contactName: e.target.value})}
                    placeholder="Enter contact name"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Contact Email</FormLabel>
                  <Input 
                    type="email"
                    value={newLead.contactEmail} 
                    onChange={(e) => setNewLead({...newLead, contactEmail: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Contact Phone</FormLabel>
                  <Input 
                    value={newLead.contactPhone} 
                    onChange={(e) => setNewLead({...newLead, contactPhone: e.target.value})}
                    placeholder="Enter contact phone"
                  />
                </FormField>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Lead Form */}
      {editingLead && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Lead</CardTitle>
            <CardDescription>Update the lead details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Lead Name</FormLabel>
                  <Input 
                    value={editingLead.name} 
                    onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Source</FormLabel>
                  <Input 
                    value={editingLead.source} 
                    onChange={(e) => setEditingLead({...editingLead, source: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Estimated Value</FormLabel>
                  <Input 
                    type="number"
                    value={editingLead.value} 
                    onChange={(e) => setEditingLead({...editingLead, value: Number(e.target.value)})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Probability (%)</FormLabel>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={editingLead.probability} 
                    onChange={(e) => setEditingLead({...editingLead, probability: Number(e.target.value)})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingLead.status} 
                    onChange={(e) => setEditingLead({...editingLead, status: e.target.value as any})}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="unqualified">Unqualified</option>
                    <option value="converted">Converted</option>
                  </select>
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Assigned To</FormLabel>
                <Input 
                  value={editingLead.assignedTo} 
                  onChange={(e) => setEditingLead({...editingLead, assignedTo: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Client Company</FormLabel>
                <Input 
                  value={editingLead.clientCompany} 
                  onChange={(e) => setEditingLead({...editingLead, clientCompany: e.target.value})}
                />
              </FormField>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Contact Name</FormLabel>
                  <Input 
                    value={editingLead.contactName} 
                    onChange={(e) => setEditingLead({...editingLead, contactName: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Contact Email</FormLabel>
                  <Input 
                    type="email"
                    value={editingLead.contactEmail} 
                    onChange={(e) => setEditingLead({...editingLead, contactEmail: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Contact Phone</FormLabel>
                  <Input 
                    value={editingLead.contactPhone} 
                    onChange={(e) => setEditingLead({...editingLead, contactPhone: e.target.value})}
                  />
                </FormField>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingLead(null)}>Cancel</Button>
            <Button onClick={handleUpdateLead}>Update Lead</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default LeadsModule;
