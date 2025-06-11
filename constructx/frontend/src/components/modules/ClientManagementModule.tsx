import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface ClientContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface ClientCompany {
  id: string;
  name: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  status: 'active' | 'inactive' | 'prospect';
  contacts: ClientContact[];
  projects: { id: string; name: string }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const ClientManagementModule: React.FC = () => {
  const [clients, setClients] = useState<ClientCompany[]>([
    {
      id: '1',
      name: 'Skyline Properties',
      industry: 'Real Estate Development',
      address: '123 Main Street, Suite 500',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      website: 'www.skylineproperties.com',
      status: 'active',
      contacts: [
        {
          id: '1',
          name: 'Jennifer Wilson',
          title: 'Development Director',
          email: 'jennifer.wilson@skylineproperties.com',
          phone: '(312) 555-1234',
          isPrimary: true
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'Project Manager',
          email: 'michael.chen@skylineproperties.com',
          phone: '(312) 555-2345',
          isPrimary: false
        }
      ],
      projects: [
        { id: '1', name: 'Downtown Office Tower' }
      ],
      notes: 'Long-term client with multiple successful projects. Interested in expanding to mixed-use developments.',
      createdAt: '2023-06-15T10:30:00Z',
      updatedAt: '2025-05-10T14:45:00Z'
    },
    {
      id: '2',
      name: 'Riverfront Developments',
      industry: 'Residential Construction',
      address: '456 River Road',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
      website: 'www.riverfrontdev.com',
      status: 'active',
      contacts: [
        {
          id: '3',
          name: 'Sarah Johnson',
          title: 'CEO',
          email: 'sarah.johnson@riverfrontdev.com',
          phone: '(503) 555-6789',
          isPrimary: true
        }
      ],
      projects: [
        { id: '2', name: 'Riverside Apartments' }
      ],
      notes: 'Focused on sustainable residential developments. Looking for LEED certification on all projects.',
      createdAt: '2023-09-22T09:15:00Z',
      updatedAt: '2025-05-15T11:20:00Z'
    },
    {
      id: '3',
      name: 'City Healthcare Group',
      industry: 'Healthcare',
      address: '789 Medical Center Blvd',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      country: 'USA',
      website: 'www.cityhealthcare.org',
      status: 'active',
      contacts: [
        {
          id: '4',
          name: 'Robert Martinez',
          title: 'Facilities Director',
          email: 'r.martinez@cityhealthcare.org',
          phone: '(617) 555-8901',
          isPrimary: true
        },
        {
          id: '5',
          name: 'Lisa Wong',
          title: 'CFO',
          email: 'l.wong@cityhealthcare.org',
          phone: '(617) 555-9012',
          isPrimary: false
        }
      ],
      projects: [
        { id: '3', name: 'City Hospital Renovation' }
      ],
      notes: 'Ongoing relationship with multiple renovation projects. Strict compliance with healthcare regulations required.',
      createdAt: '2024-01-10T13:45:00Z',
      updatedAt: '2025-05-20T09:30:00Z'
    },
    {
      id: '4',
      name: 'Metro Transit Authority',
      industry: 'Public Infrastructure',
      address: '321 Transit Plaza',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303',
      country: 'USA',
      website: 'www.metrota.gov',
      status: 'prospect',
      contacts: [
        {
          id: '6',
          name: 'James Thompson',
          title: 'Infrastructure Planning Director',
          email: 'j.thompson@metrota.gov',
          phone: '(404) 555-3456',
          isPrimary: true
        }
      ],
      projects: [],
      notes: 'Potential client for upcoming transit station renovations. RFP expected in Q3 2025.',
      createdAt: '2025-03-05T10:00:00Z',
      updatedAt: '2025-05-18T15:10:00Z'
    },
    {
      id: '5',
      name: 'GreenTech Innovations',
      industry: 'Technology',
      address: '555 Tech Parkway',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      website: 'www.greentechinnovations.com',
      status: 'inactive',
      contacts: [
        {
          id: '7',
          name: 'David Garcia',
          title: 'Facilities Manager',
          email: 'd.garcia@greentechinnovations.com',
          phone: '(512) 555-7890',
          isPrimary: true
        }
      ],
      projects: [],
      notes: 'Previous client for headquarters construction. Currently no active projects but maintain relationship for future opportunities.',
      createdAt: '2022-11-12T11:30:00Z',
      updatedAt: '2025-04-30T16:45:00Z'
    }
  ]);

  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientCompany | null>(null);
  const [editingContact, setEditingContact] = useState<{ clientId: string; contact: ClientContact } | null>(null);
  const [viewingClient, setViewingClient] = useState<ClientCompany | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'prospect' | 'inactive'>('all');
  
  const [newClient, setNewClient] = useState<Partial<ClientCompany>>({
    name: '',
    industry: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    status: 'prospect',
    contacts: [],
    projects: [],
    notes: ''
  });
  
  const [newContact, setNewContact] = useState<Partial<ClientContact>>({
    name: '',
    title: '',
    email: '',
    phone: '',
    isPrimary: false
  });
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Filter clients based on active tab
  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    return client.status === activeTab;
  });

  // Industries for dropdown
  const industries = [
    'Real Estate Development',
    'Residential Construction',
    'Commercial Construction',
    'Healthcare',
    'Education',
    'Hospitality',
    'Retail',
    'Public Infrastructure',
    'Technology',
    'Manufacturing',
    'Energy',
    'Other'
  ];

  // Countries for dropdown
  const countries = [
    'USA',
    'Canada',
    'Mexico',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'China',
    'Brazil',
    'Other'
  ];

  // Handle client creation
  const handleCreateClient = () => {
    const clientId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    
    const createdClient: ClientCompany = {
      id: clientId,
      name: newClient.name || '',
      industry: newClient.industry || '',
      address: newClient.address || '',
      city: newClient.city || '',
      state: newClient.state || '',
      zipCode: newClient.zipCode || '',
      country: newClient.country || '',
      website: newClient.website || '',
      status: newClient.status || 'prospect',
      contacts: newClient.contacts || [],
      projects: newClient.projects || [],
      notes: newClient.notes || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setClients([...clients, createdClient]);
    
    setNewClient({
      name: '',
      industry: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      website: '',
      status: 'prospect',
      contacts: [],
      projects: [],
      notes: ''
    });
    
    setShowCreateClient(false);
  };

  // Handle client update
  const handleUpdateClient = () => {
    if (!editingClient) return;
    
    const updatedClient = {
      ...editingClient,
      updatedAt: new Date().toISOString()
    };
    
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    
    setClients(updatedClients);
    setEditingClient(null);
  };

  // Handle client deletion
  const handleDeleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
  };

  // Handle contact creation
  const handleCreateContact = () => {
    if (!selectedClientId) return;
    
    const contactId = Math.random().toString(36).substr(2, 9);
    
    const createdContact: ClientContact = {
      id: contactId,
      name: newContact.name || '',
      title: newContact.title || '',
      email: newContact.email || '',
      phone: newContact.phone || '',
      isPrimary: newContact.isPrimary || false
    };
    
    // If this is the first contact, make it primary
    const client = clients.find(c => c.id === selectedClientId);
    if (client && client.contacts.length === 0) {
      createdContact.isPrimary = true;
    }
    
    // If this contact is primary, make all others non-primary
    const updatedClients = clients.map(client => {
      if (client.id === selectedClientId) {
        let updatedContacts = [...client.contacts];
        
        if (createdContact.isPrimary) {
          updatedContacts = updatedContacts.map(contact => ({
            ...contact,
            isPrimary: false
          }));
        }
        
        return {
          ...client,
          contacts: [...updatedContacts, createdContact],
          updatedAt: new Date().toISOString()
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    
    setNewContact({
      name: '',
      title: '',
      email: '',
      phone: '',
      isPrimary: false
    });
    
    setShowCreateContact(false);
  };

  // Handle contact update
  const handleUpdateContact = () => {
    if (!editingContact) return;
    
    const { clientId, contact } = editingContact;
    
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        let updatedContacts = [...client.contacts];
        
        // If this contact is being set as primary, make all others non-primary
        if (contact.isPrimary) {
          updatedContacts = updatedContacts.map(c => ({
            ...c,
            isPrimary: c.id === contact.id ? true : false
          }));
        } else {
          // If this contact was primary and is being set as non-primary,
          // ensure there's still a primary contact
          const wasPrimary = client.contacts.find(c => c.id === contact.id)?.isPrimary;
          if (wasPrimary) {
            // If there are other contacts, make the first one primary
            if (updatedContacts.length > 1) {
              const firstOtherId = updatedContacts.find(c => c.id !== contact.id)?.id;
              updatedContacts = updatedContacts.map(c => ({
                ...c,
                isPrimary: c.id === firstOtherId
              }));
            } else {
              // If this is the only contact, keep it as primary
              contact.isPrimary = true;
            }
          }
          
          // Update the specific contact
          updatedContacts = updatedContacts.map(c => 
            c.id === contact.id ? contact : c
          );
        }
        
        return {
          ...client,
          contacts: updatedContacts,
          updatedAt: new Date().toISOString()
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setEditingContact(null);
  };

  // Handle contact deletion
  const handleDeleteContact = (clientId: string, contactId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const contactToDelete = client.contacts.find(c => c.id === contactId);
    if (!contactToDelete) return;
    
    let updatedContacts = client.contacts.filter(contact => contact.id !== contactId);
    
    // If the deleted contact was primary, make the first remaining contact primary
    if (contactToDelete.isPrimary && updatedContacts.length > 0) {
      updatedContacts = updatedContacts.map((contact, index) => ({
        ...contact,
        isPrimary: index === 0
      }));
    }
    
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          contacts: updatedContacts,
          updatedAt: new Date().toISOString()
        };
      }
      return client;
    });
    
    setClients(updatedClients);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateClient(true)}>Add Client</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowCreateContact(true);
              setSelectedClientId('');
            }}
            disabled={clients.length === 0}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Clients
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'prospect' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('prospect')}
        >
          Prospects
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'inactive' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive
        </button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Manage your client companies and contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Primary Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const primaryContact = client.contacts.find(contact => contact.isPrimary);
                
                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{client.name}</div>
                        <div className="text-xs text-gray-500">{client.website}</div>
                      </div>
                    </TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell>
                      {primaryContact ? (
                        <div>
                          <div>{primaryContact.name}</div>
                          <div className="text-xs text-gray-500">{primaryContact.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No primary contact</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{client.city}, {client.state}</div>
                        <div className="text-xs text-gray-500">{client.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`${getStatusBadgeClass(client.status)} px-2 py-1 rounded-full text-xs`}>
                        {client.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.projects.length > 0 ? (
                          <>
                            {client.projects.slice(0, 2).map(project => (
                              <span key={project.id} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                {project.name}
                              </span>
                            ))}
                            {client.projects.length > 2 && (
                              <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                                +{client.projects.length - 2} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">No projects</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingClient(client)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingClient(client)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No clients found. Add a new client to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Client Form */}
      {showCreateClient && (
        <Card>
          <CardHeader>
            <CardTitle>Add Client</CardTitle>
            <CardDescription>Enter details for the new client company</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="space-y-4">
                <FormField>
                  <FormLabel required>Company Name</FormLabel>
                  <Input 
                    value={newClient.name} 
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>Industry</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newClient.industry} 
                      onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry, index) => (
                        <option key={index} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Website</FormLabel>
                    <Input 
                      value={newClient.website} 
                      onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                      placeholder="www.example.com"
                    />
                  </FormField>
                </div>
                
                <FormField>
                  <FormLabel>Address</FormLabel>
                  <Input 
                    value={newClient.address} 
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    placeholder="Street address"
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>City</FormLabel>
                    <Input 
                      value={newClient.city} 
                      onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                      placeholder="City"
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>State/Province</FormLabel>
                    <Input 
                      value={newClient.state} 
                      onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                      placeholder="State/Province"
                    />
                  </FormField>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>Postal/Zip Code</FormLabel>
                    <Input 
                      value={newClient.zipCode} 
                      onChange={(e) => setNewClient({...newClient, zipCode: e.target.value})}
                      placeholder="Postal/Zip code"
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Country</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newClient.country} 
                      onChange={(e) => setNewClient({...newClient, country: e.target.value})}
                    >
                      <option value="">Select country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newClient.status} 
                    onChange={(e) => setNewClient({...newClient, status: e.target.value as any})}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Notes</FormLabel>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newClient.notes} 
                    onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                    placeholder="Enter any additional notes about this client"
                  />
                </FormField>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateClient(false)}>Cancel</Button>
            <Button onClick={handleCreateClient}>Add Client</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Client Form */}
      {editingClient && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Client</CardTitle>
            <CardDescription>Update client company details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="space-y-4">
                <FormField>
                  <FormLabel required>Company Name</FormLabel>
                  <Input 
                    value={editingClient.name} 
                    onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>Industry</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={editingClient.industry} 
                      onChange={(e) => setEditingClient({...editingClient, industry: e.target.value})}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry, index) => (
                        <option key={index} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Website</FormLabel>
                    <Input 
                      value={editingClient.website} 
                      onChange={(e) => setEditingClient({...editingClient, website: e.target.value})}
                    />
                  </FormField>
                </div>
                
                <FormField>
                  <FormLabel>Address</FormLabel>
                  <Input 
                    value={editingClient.address} 
                    onChange={(e) => setEditingClient({...editingClient, address: e.target.value})}
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>City</FormLabel>
                    <Input 
                      value={editingClient.city} 
                      onChange={(e) => setEditingClient({...editingClient, city: e.target.value})}
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>State/Province</FormLabel>
                    <Input 
                      value={editingClient.state} 
                      onChange={(e) => setEditingClient({...editingClient, state: e.target.value})}
                    />
                  </FormField>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel>Postal/Zip Code</FormLabel>
                    <Input 
                      value={editingClient.zipCode} 
                      onChange={(e) => setEditingClient({...editingClient, zipCode: e.target.value})}
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Country</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={editingClient.country} 
                      onChange={(e) => setEditingClient({...editingClient, country: e.target.value})}
                    >
                      <option value="">Select country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingClient.status} 
                    onChange={(e) => setEditingClient({...editingClient, status: e.target.value as any})}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Notes</FormLabel>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingClient.notes} 
                    onChange={(e) => setEditingClient({...editingClient, notes: e.target.value})}
                  />
                </FormField>
                
                {/* Contacts Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Contacts</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowCreateContact(true);
                        setSelectedClientId(editingClient.id);
                      }}
                    >
                      Add Contact
                    </Button>
                  </div>
                  
                  {editingClient.contacts.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Primary</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {editingClient.contacts.map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.title}</TableCell>
                              <TableCell>
                                <div>{contact.email}</div>
                                <div className="text-xs text-gray-500">{contact.phone}</div>
                              </TableCell>
                              <TableCell>
                                {contact.isPrimary ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Primary
                                  </span>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingContact({ clientId: editingClient.id, contact })}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteContact(editingClient.id, contact.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md text-gray-500">
                      No contacts added yet.
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingClient(null)}>Cancel</Button>
            <Button onClick={handleUpdateClient}>Update Client</Button>
          </CardFooter>
        </Card>
      )}

      {/* Create Contact Form */}
      {showCreateContact && (
        <Card>
          <CardHeader>
            <CardTitle>Add Contact</CardTitle>
            <CardDescription>Enter details for the new contact</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="space-y-4">
                {/* Client Selection (only if not coming from client edit) */}
                {!selectedClientId && (
                  <FormField>
                    <FormLabel required>Client Company</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={selectedClientId} 
                      onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                      <option value="">Select client company</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </FormField>
                )}
                
                <FormField>
                  <FormLabel required>Name</FormLabel>
                  <Input 
                    value={newContact.name} 
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Enter contact name"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Title/Position</FormLabel>
                  <Input 
                    value={newContact.title} 
                    onChange={(e) => setNewContact({...newContact, title: e.target.value})}
                    placeholder="Enter job title or position"
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel required>Email</FormLabel>
                    <Input 
                      type="email"
                      value={newContact.email} 
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Phone</FormLabel>
                    <Input 
                      value={newContact.phone} 
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </FormField>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="isPrimary"
                    checked={newContact.isPrimary}
                    onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700">
                    Set as primary contact
                  </label>
                </div>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateContact(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateContact}
              disabled={!selectedClientId || !newContact.name || !newContact.email}
            >
              Add Contact
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Contact Form */}
      {editingContact && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Contact</CardTitle>
            <CardDescription>Update contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="space-y-4">
                <FormField>
                  <FormLabel required>Name</FormLabel>
                  <Input 
                    value={editingContact.contact.name} 
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      contact: {...editingContact.contact, name: e.target.value}
                    })}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Title/Position</FormLabel>
                  <Input 
                    value={editingContact.contact.title} 
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      contact: {...editingContact.contact, title: e.target.value}
                    })}
                  />
                </FormField>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField>
                    <FormLabel required>Email</FormLabel>
                    <Input 
                      type="email"
                      value={editingContact.contact.email} 
                      onChange={(e) => setEditingContact({
                        ...editingContact,
                        contact: {...editingContact.contact, email: e.target.value}
                      })}
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>Phone</FormLabel>
                    <Input 
                      value={editingContact.contact.phone} 
                      onChange={(e) => setEditingContact({
                        ...editingContact,
                        contact: {...editingContact.contact, phone: e.target.value}
                      })}
                    />
                  </FormField>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="isPrimaryEdit"
                    checked={editingContact.contact.isPrimary}
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      contact: {...editingContact.contact, isPrimary: e.target.checked}
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPrimaryEdit" className="text-sm font-medium text-gray-700">
                    Set as primary contact
                  </label>
                </div>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingContact(null)}>Cancel</Button>
            <Button 
              onClick={handleUpdateContact}
              disabled={!editingContact.contact.name || !editingContact.contact.email}
            >
              Update Contact
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* View Client Modal/Dialog */}
      {viewingClient && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{viewingClient.name}</CardTitle>
                  <CardDescription>
                    {viewingClient.industry} | 
                    <span className={`${getStatusBadgeClass(viewingClient.status)} ml-1 px-1.5 py-0.5 rounded text-xs`}>
                      {viewingClient.status.toUpperCase()}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingClient(null)}>X</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Contact Information</h4>
                    <p className="text-sm">Website: {viewingClient.website || 'N/A'}</p>
                    <p className="text-sm">
                      Address: {[
                        viewingClient.address,
                        viewingClient.city,
                        viewingClient.state,
                        viewingClient.zipCode,
                        viewingClient.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Client Details</h4>
                    <p className="text-sm">Created: {formatDate(viewingClient.createdAt)}</p>
                    <p className="text-sm">Last Updated: {formatDate(viewingClient.updatedAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Projects</h4>
                  {viewingClient.projects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingClient.projects.map(project => (
                        <span key={project.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {project.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No projects associated with this client.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="text-sm whitespace-pre-wrap">{viewingClient.notes || 'No notes available.'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contacts</h4>
                  {viewingClient.contacts.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Primary</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewingClient.contacts.map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.title}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.phone}</TableCell>
                              <TableCell>
                                {contact.isPrimary ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Primary
                                  </span>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No contacts available for this client.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setViewingClient(null)}>Close</Button>
            </CardFooter>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default ClientManagementModule;
