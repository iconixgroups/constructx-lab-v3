import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Contract {
  id: string;
  title: string;
  type: 'client' | 'subcontractor' | 'vendor' | 'consultant' | 'labor' | 'other';
  status: 'draft' | 'pending_review' | 'pending_approval' | 'approved' | 'executed' | 'active' | 'completed' | 'terminated' | 'expired';
  projectId: string;
  projectName: string;
  contractorId?: string;
  contractorName?: string;
  clientId?: string;
  clientName?: string;
  value: number;
  startDate: string;
  endDate: string;
  executionDate?: string;
  description: string;
  scope: string;
  paymentTerms: string;
  attachments: string[];
  tags: string[];
  amendments: ContractAmendment[];
}

interface ContractAmendment {
  id: string;
  title: string;
  description: string;
  changeType: 'scope' | 'value' | 'timeline' | 'terms' | 'other';
  valueChange?: number;
  dateChange?: number; // in days
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  createdDate: string;
  approvedDate?: string;
  attachments: string[];
}

const ContractManagementModule: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Downtown Office Tower Construction',
      type: 'client',
      status: 'active',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      clientId: '101',
      clientName: 'Metropolis Development Corp',
      value: 12500000,
      startDate: '2025-01-15',
      endDate: '2026-07-30',
      executionDate: '2025-01-10',
      description: 'Main construction contract for the Downtown Office Tower project',
      scope: 'Complete construction of a 15-story office building including foundation, structure, MEP systems, and interior finishes.',
      paymentTerms: 'Monthly progress payments with 10% retainage, net 30 days',
      attachments: ['main_contract.pdf', 'technical_specifications.pdf', 'drawings_set.pdf'],
      tags: ['commercial', 'high-rise', 'office'],
      amendments: [
        {
          id: '1-1',
          title: 'Additional Floor',
          description: 'Addition of one floor to the original design',
          changeType: 'scope',
          valueChange: 1200000,
          dateChange: 45,
          status: 'approved',
          createdDate: '2025-03-15',
          approvedDate: '2025-03-28',
          attachments: ['amendment_1_drawings.pdf', 'amendment_1_cost_breakdown.pdf']
        }
      ]
    },
    {
      id: '2',
      title: 'Electrical Systems Installation',
      type: 'subcontractor',
      status: 'active',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      contractorId: '201',
      contractorName: 'Precision Electrical Services',
      value: 1850000,
      startDate: '2025-04-10',
      endDate: '2026-02-28',
      executionDate: '2025-04-05',
      description: 'Subcontract for all electrical systems installation',
      scope: 'Complete electrical systems including power distribution, lighting, emergency systems, and low voltage systems.',
      paymentTerms: 'Monthly progress payments with 5% retainage, net 45 days',
      attachments: ['electrical_subcontract.pdf', 'electrical_specs.pdf'],
      tags: ['electrical', 'subcontractor'],
      amendments: []
    },
    {
      id: '3',
      title: 'Structural Steel Supply',
      type: 'vendor',
      status: 'pending_approval',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      contractorId: '301',
      contractorName: 'Structural Steel Co.',
      value: 3200000,
      startDate: '2025-02-15',
      endDate: '2025-08-30',
      description: 'Supply of all structural steel components',
      scope: 'Fabrication and delivery of all structural steel components according to approved shop drawings.',
      paymentTerms: '30% deposit, 60% upon delivery, 10% upon acceptance',
      attachments: ['steel_supply_contract.pdf', 'steel_specifications.pdf'],
      tags: ['materials', 'steel', 'supply'],
      amendments: []
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    type: 'client',
    title: '',
    status: 'draft',
    projectId: '',
    value: 0,
    startDate: '',
    endDate: '',
    description: '',
    scope: '',
    paymentTerms: '',
    attachments: [],
    tags: [],
    amendments: []
  });
  const [newAmendment, setNewAmendment] = useState<Partial<ContractAmendment>>({
    title: '',
    description: '',
    changeType: 'scope',
    status: 'draft',
    createdDate: new Date().toISOString().split('T')[0],
    attachments: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [amendmentAttachmentInput, setAmendmentAttachmentInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock clients for dropdown
  const clients = [
    { id: '101', name: 'Metropolis Development Corp' },
    { id: '102', name: 'Riverside Properties LLC' },
    { id: '103', name: 'City Healthcare System' }
  ];

  // Mock contractors for dropdown
  const contractors = [
    { id: '201', name: 'Precision Electrical Services' },
    { id: '202', name: 'Metro Plumbing & HVAC' },
    { id: '301', name: 'Structural Steel Co.' },
    { id: '302', name: 'Glass & Glazing Specialists' },
    { id: '303', name: 'Foundation Experts Inc.' }
  ];

  const handleCreateContract = () => {
    const contractId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newContract.projectId);
    
    const createdContract = {
      ...newContract,
      id: contractId,
      projectName: selectedProject?.name || '',
      attachments: newContract.attachments || [],
      tags: newContract.tags || [],
      amendments: []
    } as Contract;
    
    setContracts([...contracts, createdContract]);
    setNewContract({
      type: 'client',
      title: '',
      status: 'draft',
      projectId: '',
      value: 0,
      startDate: '',
      endDate: '',
      description: '',
      scope: '',
      paymentTerms: '',
      attachments: [],
      tags: [],
      amendments: []
    });
    setAttachmentInput('');
    setTagInput('');
    setShowCreateForm(false);
  };

  const handleUpdateContract = () => {
    if (!editingContract) return;
    
    const selectedProject = projects.find(p => p.id === editingContract.projectId);
    const updatedContract = {
      ...editingContract,
      projectName: selectedProject?.name || editingContract.projectName
    };
    
    const updatedContracts = contracts.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    );
    
    setContracts(updatedContracts);
    setEditingContract(null);
    setAttachmentInput('');
    setTagInput('');
    setShowAmendmentForm(false);
  };

  const handleDeleteContract = (id: string) => {
    const updatedContracts = contracts.filter(contract => contract.id !== id);
    setContracts(updatedContracts);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingContract) {
      const newAttachments = [...(editingContract.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingContract({...editingContract, attachments: newAttachments});
    } else {
      const newAttachments = [...(newContract.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewContract({...newContract, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingContract) {
      const newAttachments = editingContract.attachments.filter(a => a !== attachment);
      setEditingContract({...editingContract, attachments: newAttachments});
    } else {
      const newAttachments = (newContract.attachments || []).filter(a => a !== attachment);
      setNewContract({...newContract, attachments: newAttachments});
    }
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingContract) {
      const newTags = [...(editingContract.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingContract({...editingContract, tags: newTags});
    } else {
      const newTags = [...(newContract.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewContract({...newContract, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingContract) {
      const newTags = editingContract.tags.filter(t => t !== tag);
      setEditingContract({...editingContract, tags: newTags});
    } else {
      const newTags = (newContract.tags || []).filter(t => t !== tag);
      setNewContract({...newContract, tags: newTags});
    }
  };

  const handleAddAmendmentAttachment = () => {
    if (!amendmentAttachmentInput.trim()) return;
    
    const newAttachments = [...(newAmendment.attachments || [])];
    if (!newAttachments.includes(amendmentAttachmentInput.trim())) {
      newAttachments.push(amendmentAttachmentInput.trim());
    }
    setNewAmendment({...newAmendment, attachments: newAttachments});
    
    setAmendmentAttachmentInput('');
  };

  const handleRemoveAmendmentAttachment = (attachment: string) => {
    const newAttachments = (newAmendment.attachments || []).filter(a => a !== attachment);
    setNewAmendment({...newAmendment, attachments: newAttachments});
  };

  const handleCreateAmendment = () => {
    if (!editingContract) return;
    
    const amendmentId = `${editingContract.id}-${Math.random().toString(36).substr(2, 5)}`;
    const createdAmendment = {
      ...newAmendment,
      id: amendmentId,
      attachments: newAmendment.attachments || []
    } as ContractAmendment;
    
    const updatedAmendments = [...(editingContract.amendments || []), createdAmendment];
    setEditingContract({...editingContract, amendments: updatedAmendments});
    
    setNewAmendment({
      title: '',
      description: '',
      changeType: 'scope',
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      attachments: []
    });
    setAmendmentAttachmentInput('');
    setShowAmendmentForm(false);
  };

  const handleDeleteAmendment = (amendmentId: string) => {
    if (!editingContract) return;
    
    const updatedAmendments = editingContract.amendments.filter(amendment => amendment.id !== amendmentId);
    setEditingContract({...editingContract, amendments: updatedAmendments});
  };

  const handleStatusChange = (status: string, isEditing: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (isEditing && editingContract) {
      let updatedContract = {...editingContract, status: status as any};
      
      // Set execution date if status is executed or active
      if ((status === 'executed' || status === 'active') && !updatedContract.executionDate) {
        updatedContract.executionDate = today;
      }
      
      setEditingContract(updatedContract);
    } else {
      let updatedContract = {...newContract, status: status as any};
      
      // Set execution date if status is executed or active
      if ((status === 'executed' || status === 'active') && !updatedContract.executionDate) {
        updatedContract.executionDate = today;
      }
      
      setNewContract(updatedContract);
    }
  };

  const handleAmendmentStatusChange = (status: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    let updatedAmendment = {...newAmendment, status: status as any};
    
    // Set approval date if status is approved
    if (status === 'approved' && !updatedAmendment.approvedDate) {
      updatedAmendment.approvedDate = today;
    }
    
    setNewAmendment(updatedAmendment);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'pending_review':
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'approved':
      case 'executed':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'active':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'terminated':
      case 'expired':
      case 'rejected':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'subcontractor':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'vendor':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'consultant':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'labor':
        return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs';
      case 'other':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getChangeTypeBadgeClass = (changeType: string) => {
    switch (changeType) {
      case 'scope':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'value':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'timeline':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'terms':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'other':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
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

  const calculateTotalValue = (contract: Contract) => {
    let totalValue = contract.value;
    
    // Add value changes from approved amendments
    if (contract.amendments && contract.amendments.length > 0) {
      contract.amendments.forEach(amendment => {
        if (amendment.status === 'approved' && amendment.valueChange) {
          totalValue += amendment.valueChange;
        }
      });
    }
    
    return totalValue;
  };

  const calculateEndDate = (contract: Contract) => {
    if (!contract.endDate) return '';
    
    let endDate = new Date(contract.endDate);
    
    // Add date changes from approved amendments
    if (contract.amendments && contract.amendments.length > 0) {
      contract.amendments.forEach(amendment => {
        if (amendment.status === 'approved' && amendment.dateChange) {
          endDate.setDate(endDate.getDate() + amendment.dateChange);
        }
      });
    }
    
    return endDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create New Contract</Button>
      </div>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>Manage client, subcontractor, vendor, and other contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    <div>{contract.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {contract.type === 'client' ? `Client: ${contract.clientName}` : 
                       contract.type === 'subcontractor' || contract.type === 'vendor' ? `Contractor: ${contract.contractorName}` : ''}
                    </div>
                    {contract.amendments.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {contract.amendments.length} amendment{contract.amendments.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {contract.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contract.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(contract.type)}>
                      {contract.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{contract.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(contract.status)}>
                      {contract.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>{formatCurrency(calculateTotalValue(contract))}</div>
                    {contract.amendments.some(a => a.status === 'approved' && a.valueChange) && (
                      <div className="text-xs text-gray-500 mt-1">
                        Original: {formatCurrency(contract.value)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{contract.startDate} to {calculateEndDate(contract)}</div>
                    {contract.amendments.some(a => a.status === 'approved' && a.dateChange) && (
                      <div className="text-xs text-gray-500 mt-1">
                        Original end: {contract.endDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingContract(contract)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteContract(contract.id)}
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

      {/* Create Contract Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Contract</CardTitle>
            <CardDescription>Enter the details for the new contract</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Contract Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newContract.type} 
                  onChange={(e) => setNewContract({...newContract, type: e.target.value as any})}
                >
                  <option value="client">Client Contract</option>
                  <option value="subcontractor">Subcontractor Contract</option>
                  <option value="vendor">Vendor Contract</option>
                  <option value="consultant">Consultant Contract</option>
                  <option value="labor">Labor Contract</option>
                  <option value="other">Other Contract</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Contract Title</FormLabel>
                <Input 
                  value={newContract.title} 
                  onChange={(e) => setNewContract({...newContract, title: e.target.value})}
                  placeholder="Enter contract title"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newContract.projectId} 
                  onChange={(e) => setNewContract({...newContract, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              {newContract.type === 'client' && (
                <FormField>
                  <FormLabel>Client</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newContract.clientId} 
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id === e.target.value);
                      setNewContract({
                        ...newContract, 
                        clientId: e.target.value,
                        clientName: selectedClient?.name
                      });
                    }}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              {(newContract.type === 'subcontractor' || newContract.type === 'vendor' || 
                newContract.type === 'consultant' || newContract.type === 'labor') && (
                <FormField>
                  <FormLabel>Contractor</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newContract.contractorId} 
                    onChange={(e) => {
                      const selectedContractor = contractors.find(c => c.id === e.target.value);
                      setNewContract({
                        ...newContract, 
                        contractorId: e.target.value,
                        contractorName: selectedContractor?.name
                      });
                    }}
                  >
                    <option value="">Select a contractor</option>
                    {contractors.map(contractor => (
                      <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newContract.status} 
                  onChange={(e) => handleStatusChange(e.target.value, false)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="executed">Executed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="terminated">Terminated</option>
                  <option value="expired">Expired</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Contract Value</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={newContract.value} 
                  onChange={(e) => setNewContract({...newContract, value: parseFloat(e.target.value) || 0})}
                  placeholder="Enter contract value"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={newContract.startDate} 
                    onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={newContract.endDate} 
                    onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              {(newContract.status === 'executed' || newContract.status === 'active' || 
                newContract.status === 'completed') && (
                <FormField>
                  <FormLabel>Execution Date</FormLabel>
                  <Input 
                    type="date"
                    value={newContract.executionDate} 
                    onChange={(e) => setNewContract({...newContract, executionDate: e.target.value})}
                  />
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newContract.description} 
                  onChange={(e) => setNewContract({...newContract, description: e.target.value})}
                  placeholder="Enter contract description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Scope of Work</FormLabel>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newContract.scope} 
                  onChange={(e) => setNewContract({...newContract, scope: e.target.value})}
                  placeholder="Enter scope of work"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Payment Terms</FormLabel>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newContract.paymentTerms} 
                  onChange={(e) => setNewContract({...newContract, paymentTerms: e.target.value})}
                  placeholder="Enter payment terms"
                />
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
                  {(newContract.attachments || []).map(attachment => (
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
                    placeholder="Enter tag (e.g., commercial, residential)"
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
                  {(newContract.tags || []).map(tag => (
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
            <Button onClick={handleCreateContract}>Create Contract</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Contract Form */}
      {editingContract && !showAmendmentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Contract</CardTitle>
            <CardDescription>Update the contract details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Contract Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingContract.type} 
                  onChange={(e) => setEditingContract({...editingContract, type: e.target.value as any})}
                >
                  <option value="client">Client Contract</option>
                  <option value="subcontractor">Subcontractor Contract</option>
                  <option value="vendor">Vendor Contract</option>
                  <option value="consultant">Consultant Contract</option>
                  <option value="labor">Labor Contract</option>
                  <option value="other">Other Contract</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Contract Title</FormLabel>
                <Input 
                  value={editingContract.title} 
                  onChange={(e) => setEditingContract({...editingContract, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingContract.projectId} 
                  onChange={(e) => setEditingContract({...editingContract, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              {editingContract.type === 'client' && (
                <FormField>
                  <FormLabel>Client</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingContract.clientId} 
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id === e.target.value);
                      setEditingContract({
                        ...editingContract, 
                        clientId: e.target.value,
                        clientName: selectedClient?.name
                      });
                    }}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              {(editingContract.type === 'subcontractor' || editingContract.type === 'vendor' || 
                editingContract.type === 'consultant' || editingContract.type === 'labor') && (
                <FormField>
                  <FormLabel>Contractor</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingContract.contractorId} 
                    onChange={(e) => {
                      const selectedContractor = contractors.find(c => c.id === e.target.value);
                      setEditingContract({
                        ...editingContract, 
                        contractorId: e.target.value,
                        contractorName: selectedContractor?.name
                      });
                    }}
                  >
                    <option value="">Select a contractor</option>
                    {contractors.map(contractor => (
                      <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingContract.status} 
                  onChange={(e) => handleStatusChange(e.target.value, true)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="executed">Executed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="terminated">Terminated</option>
                  <option value="expired">Expired</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Contract Value</FormLabel>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingContract.value} 
                  onChange={(e) => setEditingContract({...editingContract, value: parseFloat(e.target.value) || 0})}
                />
                {calculateTotalValue(editingContract) !== editingContract.value && (
                  <FormDescription>
                    Total value with amendments: {formatCurrency(calculateTotalValue(editingContract))}
                  </FormDescription>
                )}
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingContract.startDate} 
                    onChange={(e) => setEditingContract({...editingContract, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>End Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingContract.endDate} 
                    onChange={(e) => setEditingContract({...editingContract, endDate: e.target.value})}
                  />
                  {calculateEndDate(editingContract) !== editingContract.endDate && (
                    <FormDescription>
                      Adjusted end date with amendments: {calculateEndDate(editingContract)}
                    </FormDescription>
                  )}
                </FormField>
              </div>
              
              {(editingContract.status === 'executed' || editingContract.status === 'active' || 
                editingContract.status === 'completed') && (
                <FormField>
                  <FormLabel>Execution Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingContract.executionDate} 
                    onChange={(e) => setEditingContract({...editingContract, executionDate: e.target.value})}
                  />
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingContract.description} 
                  onChange={(e) => setEditingContract({...editingContract, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Scope of Work</FormLabel>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingContract.scope} 
                  onChange={(e) => setEditingContract({...editingContract, scope: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Payment Terms</FormLabel>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingContract.paymentTerms} 
                  onChange={(e) => setEditingContract({...editingContract, paymentTerms: e.target.value})}
                />
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
                  {editingContract.attachments.map(attachment => (
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
                    placeholder="Enter tag (e.g., commercial, residential)"
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
                  {editingContract.tags.map(tag => (
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
              
              {/* Amendments Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Amendments</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAmendmentForm(true)}
                  >
                    Add Amendment
                  </Button>
                </div>
                
                {editingContract.amendments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Change Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Value Change</TableHead>
                        <TableHead>Timeline Change</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editingContract.amendments.map((amendment) => (
                        <TableRow key={amendment.id}>
                          <TableCell className="font-medium">
                            <div>{amendment.title}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{amendment.description}</div>
                          </TableCell>
                          <TableCell>
                            <span className={getChangeTypeBadgeClass(amendment.changeType)}>
                              {amendment.changeType.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={getStatusBadgeClass(amendment.status)}>
                              {amendment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {amendment.valueChange ? formatCurrency(amendment.valueChange) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {amendment.dateChange ? `${amendment.dateChange > 0 ? '+' : ''}${amendment.dateChange} days` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {amendment.status === 'approved' ? amendment.approvedDate : amendment.createdDate}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteAmendment(amendment.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 border rounded text-gray-500">
                    No amendments yet.
                  </div>
                )}
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingContract(null)}>Cancel</Button>
            <Button onClick={handleUpdateContract}>Update Contract</Button>
          </CardFooter>
        </Card>
      )}

      {/* Create Amendment Form */}
      {editingContract && showAmendmentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Contract Amendment</CardTitle>
            <CardDescription>Enter the details for the new amendment to contract: {editingContract.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Amendment Title</FormLabel>
                <Input 
                  value={newAmendment.title} 
                  onChange={(e) => setNewAmendment({...newAmendment, title: e.target.value})}
                  placeholder="Enter amendment title"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Description</FormLabel>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newAmendment.description} 
                  onChange={(e) => setNewAmendment({...newAmendment, description: e.target.value})}
                  placeholder="Enter amendment description"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Change Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newAmendment.changeType} 
                  onChange={(e) => setNewAmendment({...newAmendment, changeType: e.target.value as any})}
                >
                  <option value="scope">Scope Change</option>
                  <option value="value">Value Change</option>
                  <option value="timeline">Timeline Change</option>
                  <option value="terms">Terms Change</option>
                  <option value="other">Other Change</option>
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                {(newAmendment.changeType === 'value' || newAmendment.changeType === 'scope') && (
                  <FormField>
                    <FormLabel>Value Change</FormLabel>
                    <Input 
                      type="number"
                      step="0.01"
                      value={newAmendment.valueChange} 
                      onChange={(e) => setNewAmendment({...newAmendment, valueChange: parseFloat(e.target.value) || 0})}
                      placeholder="Enter value change (can be negative)"
                    />
                    <FormDescription>
                      Enter negative value for reduction
                    </FormDescription>
                  </FormField>
                )}
                
                {(newAmendment.changeType === 'timeline' || newAmendment.changeType === 'scope') && (
                  <FormField>
                    <FormLabel>Timeline Change (days)</FormLabel>
                    <Input 
                      type="number"
                      value={newAmendment.dateChange} 
                      onChange={(e) => setNewAmendment({...newAmendment, dateChange: parseInt(e.target.value) || 0})}
                      placeholder="Enter days change (can be negative)"
                    />
                    <FormDescription>
                      Enter negative value for reduction
                    </FormDescription>
                  </FormField>
                )}
              </div>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newAmendment.status} 
                  onChange={(e) => handleAmendmentStatusChange(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Created Date</FormLabel>
                  <Input 
                    type="date"
                    value={newAmendment.createdDate} 
                    onChange={(e) => setNewAmendment({...newAmendment, createdDate: e.target.value})}
                  />
                </FormField>
                
                {newAmendment.status === 'approved' && (
                  <FormField>
                    <FormLabel>Approved Date</FormLabel>
                    <Input 
                      type="date"
                      value={newAmendment.approvedDate} 
                      onChange={(e) => setNewAmendment({...newAmendment, approvedDate: e.target.value})}
                    />
                  </FormField>
                )}
              </div>
              
              <FormField>
                <FormLabel>Attachments</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={amendmentAttachmentInput} 
                    onChange={(e) => setAmendmentAttachmentInput(e.target.value)}
                    placeholder="Enter attachment filename"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddAmendmentAttachment}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  In a real implementation, this would allow file uploads
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newAmendment.attachments || []).map(attachment => (
                    <div key={attachment} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="mr-1">📎</span> {attachment}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveAmendmentAttachment(attachment)}
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
            <Button variant="outline" onClick={() => setShowAmendmentForm(false)}>Cancel</Button>
            <Button onClick={handleCreateAmendment}>Add Amendment</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ContractManagementModule;
