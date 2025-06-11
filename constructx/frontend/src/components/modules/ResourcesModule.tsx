import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Resource {
  id: string;
  type: 'labor' | 'equipment' | 'material';
  name: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  status: 'available' | 'allocated' | 'depleted' | 'on_order';
  projectId: string;
  projectName: string;
  location: string;
  supplier: string;
  deliveryDate?: string;
  tags: string[];
}

const ResourcesModule: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'labor',
      name: 'Construction Workers',
      description: 'General construction laborers',
      quantity: 25,
      unit: 'workers',
      cost: 35,
      status: 'allocated',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Main Site',
      supplier: 'ABC Staffing',
      tags: ['skilled', 'full-time']
    },
    {
      id: '2',
      type: 'equipment',
      name: 'Excavator',
      description: 'Heavy duty excavator for foundation work',
      quantity: 2,
      unit: 'units',
      cost: 1200,
      status: 'available',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Equipment Yard',
      supplier: 'Heavy Machinery Rentals',
      tags: ['heavy', 'rental']
    },
    {
      id: '3',
      type: 'material',
      name: 'Concrete Mix',
      description: 'High-strength concrete for foundation',
      quantity: 500,
      unit: 'cubic yards',
      cost: 125,
      status: 'on_order',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      location: 'Supplier Warehouse',
      supplier: 'Quality Concrete Supply',
      deliveryDate: '2025-06-15',
      tags: ['foundation', 'bulk']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'labor',
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    cost: 0,
    status: 'available',
    projectId: '',
    location: '',
    supplier: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock units based on type
  const getUnits = (type: string) => {
    switch (type) {
      case 'labor':
        return ['workers', 'hours', 'days', 'weeks'];
      case 'equipment':
        return ['units', 'hours', 'days', 'weeks'];
      case 'material':
        return ['cubic yards', 'tons', 'pallets', 'pieces', 'square feet', 'gallons'];
      default:
        return [];
    }
  };

  const handleCreateResource = () => {
    const resourceId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newResource.projectId);
    
    const createdResource = {
      ...newResource,
      id: resourceId,
      projectName: selectedProject?.name || '',
      tags: newResource.tags || []
    } as Resource;
    
    setResources([...resources, createdResource]);
    setNewResource({
      type: 'labor',
      name: '',
      description: '',
      quantity: 0,
      unit: '',
      cost: 0,
      status: 'available',
      projectId: '',
      location: '',
      supplier: '',
      tags: []
    });
    setTagInput('');
    setShowCreateForm(false);
  };

  const handleUpdateResource = () => {
    if (!editingResource) return;
    
    const selectedProject = projects.find(p => p.id === editingResource.projectId);
    const updatedResource = {
      ...editingResource,
      projectName: selectedProject?.name || editingResource.projectName
    };
    
    const updatedResources = resources.map(resource => 
      resource.id === updatedResource.id ? updatedResource : resource
    );
    
    setResources(updatedResources);
    setEditingResource(null);
    setTagInput('');
  };

  const handleDeleteResource = (id: string) => {
    const updatedResources = resources.filter(resource => resource.id !== id);
    setResources(updatedResources);
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingResource) {
      const newTags = [...(editingResource.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingResource({...editingResource, tags: newTags});
    } else {
      const newTags = [...(newResource.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewResource({...newResource, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingResource) {
      const newTags = editingResource.tags.filter(t => t !== tag);
      setEditingResource({...editingResource, tags: newTags});
    } else {
      const newTags = (newResource.tags || []).filter(t => t !== tag);
      setNewResource({...newResource, tags: newTags});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'allocated':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'depleted':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'on_order':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'labor':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'equipment':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'material':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
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
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add Resource</Button>
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>Manage labor, equipment, and materials for your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div>{resource.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{resource.description}</div>
                    {resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resource.tags.map(tag => (
                          <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(resource.type)}>
                      {resource.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{resource.projectName}</TableCell>
                  <TableCell>
                    {resource.quantity} {resource.unit}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(resource.cost)}/{resource.unit}
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(resource.status)}>
                      {resource.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{resource.location}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingResource(resource)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
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

      {/* Create Resource Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
            <CardDescription>Enter the details for the new resource</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Resource Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newResource.type} 
                  onChange={(e) => setNewResource({...newResource, type: e.target.value as any, unit: ''})}
                >
                  <option value="labor">Labor</option>
                  <option value="equipment">Equipment</option>
                  <option value="material">Material</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Name</FormLabel>
                <Input 
                  value={newResource.name} 
                  onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                  placeholder="Enter resource name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newResource.description} 
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newResource.projectId} 
                  onChange={(e) => setNewResource({...newResource, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Quantity</FormLabel>
                  <Input 
                    type="number"
                    value={newResource.quantity || ''} 
                    onChange={(e) => setNewResource({...newResource, quantity: Number(e.target.value)})}
                    placeholder="Enter quantity"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Unit</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newResource.unit} 
                    onChange={(e) => setNewResource({...newResource, unit: e.target.value})}
                  >
                    <option value="">Select unit</option>
                    {getUnits(newResource.type || 'labor').map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel required>Cost per Unit</FormLabel>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newResource.cost || ''} 
                    onChange={(e) => setNewResource({...newResource, cost: Number(e.target.value)})}
                    placeholder="Enter cost"
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newResource.status} 
                    onChange={(e) => setNewResource({...newResource, status: e.target.value as any})}
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="depleted">Depleted</option>
                    <option value="on_order">On Order</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={newResource.location} 
                    onChange={(e) => setNewResource({...newResource, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Supplier</FormLabel>
                <Input 
                  value={newResource.supplier} 
                  onChange={(e) => setNewResource({...newResource, supplier: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </FormField>
              
              {newResource.type === 'material' && newResource.status === 'on_order' && (
                <FormField>
                  <FormLabel>Expected Delivery Date</FormLabel>
                  <Input 
                    type="date"
                    value={newResource.deliveryDate} 
                    onChange={(e) => setNewResource({...newResource, deliveryDate: e.target.value})}
                  />
                </FormField>
              )}
              
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
                  {(newResource.tags || []).map(tag => (
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
            <Button onClick={handleCreateResource}>Add Resource</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Resource Form */}
      {editingResource && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Resource</CardTitle>
            <CardDescription>Update the resource details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Resource Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingResource.type} 
                  onChange={(e) => setEditingResource({...editingResource, type: e.target.value as any})}
                >
                  <option value="labor">Labor</option>
                  <option value="equipment">Equipment</option>
                  <option value="material">Material</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Name</FormLabel>
                <Input 
                  value={editingResource.name} 
                  onChange={(e) => setEditingResource({...editingResource, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingResource.description} 
                  onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingResource.projectId} 
                  onChange={(e) => setEditingResource({...editingResource, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <FormLabel required>Quantity</FormLabel>
                  <Input 
                    type="number"
                    value={editingResource.quantity} 
                    onChange={(e) => setEditingResource({...editingResource, quantity: Number(e.target.value)})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Unit</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingResource.unit} 
                    onChange={(e) => setEditingResource({...editingResource, unit: e.target.value})}
                  >
                    {getUnits(editingResource.type).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel required>Cost per Unit</FormLabel>
                  <Input 
                    type="number"
                    step="0.01"
                    value={editingResource.cost} 
                    onChange={(e) => setEditingResource({...editingResource, cost: Number(e.target.value)})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingResource.status} 
                    onChange={(e) => setEditingResource({...editingResource, status: e.target.value as any})}
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="depleted">Depleted</option>
                    <option value="on_order">On Order</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    value={editingResource.location} 
                    onChange={(e) => setEditingResource({...editingResource, location: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Supplier</FormLabel>
                <Input 
                  value={editingResource.supplier} 
                  onChange={(e) => setEditingResource({...editingResource, supplier: e.target.value})}
                />
              </FormField>
              
              {editingResource.type === 'material' && editingResource.status === 'on_order' && (
                <FormField>
                  <FormLabel>Expected Delivery Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingResource.deliveryDate} 
                    onChange={(e) => setEditingResource({...editingResource, deliveryDate: e.target.value})}
                  />
                </FormField>
              )}
              
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
                  {editingResource.tags.map(tag => (
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
            <Button variant="outline" onClick={() => setEditingResource(null)}>Cancel</Button>
            <Button onClick={handleUpdateResource}>Update Resource</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ResourcesModule;
