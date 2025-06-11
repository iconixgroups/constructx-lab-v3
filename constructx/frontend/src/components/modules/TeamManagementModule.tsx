import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  projects: { id: string; name: string }[];
  skills: string[];
  certifications: string[];
  avatar?: string;
  joinDate: string;
  lastActive: string;
}

interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
}

const TeamManagementModule: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Project Manager',
      email: 'john.smith@constructx.com',
      phone: '(555) 123-4567',
      department: 'Project Management',
      status: 'active',
      projects: [
        { id: '1', name: 'Downtown Office Tower' },
        { id: '3', name: 'City Hospital Renovation' }
      ],
      skills: ['Project Planning', 'Team Leadership', 'Risk Management', 'Stakeholder Communication'],
      certifications: ['PMP', 'LEED AP'],
      avatar: 'john_smith.jpg',
      joinDate: '2023-03-15',
      lastActive: '2025-05-26'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Quality Control Manager',
      email: 'sarah.johnson@constructx.com',
      phone: '(555) 234-5678',
      department: 'Quality Control',
      status: 'active',
      projects: [
        { id: '1', name: 'Downtown Office Tower' },
        { id: '2', name: 'Riverside Apartments' }
      ],
      skills: ['Quality Assurance', 'Inspection Protocols', 'Regulatory Compliance', 'Documentation'],
      certifications: ['CQE', 'Six Sigma Black Belt'],
      avatar: 'sarah_johnson.jpg',
      joinDate: '2023-05-22',
      lastActive: '2025-05-27'
    },
    {
      id: '3',
      name: 'Michael Brown',
      role: 'Site Supervisor',
      email: 'michael.brown@constructx.com',
      phone: '(555) 345-6789',
      department: 'Field Operations',
      status: 'active',
      projects: [
        { id: '2', name: 'Riverside Apartments' }
      ],
      skills: ['Construction Management', 'Safety Protocols', 'Team Coordination', 'Schedule Management'],
      certifications: ['OSHA 30', 'First Aid'],
      avatar: 'michael_brown.jpg',
      joinDate: '2023-08-10',
      lastActive: '2025-05-25'
    },
    {
      id: '4',
      name: 'Emily Davis',
      role: 'Financial Analyst',
      email: 'emily.davis@constructx.com',
      phone: '(555) 456-7890',
      department: 'Finance',
      status: 'on_leave',
      projects: [
        { id: '1', name: 'Downtown Office Tower' },
        { id: '2', name: 'Riverside Apartments' },
        { id: '3', name: 'City Hospital Renovation' }
      ],
      skills: ['Budget Analysis', 'Cost Forecasting', 'Financial Reporting', 'Contract Review'],
      certifications: ['CPA', 'MBA'],
      avatar: 'emily_davis.jpg',
      joinDate: '2023-11-05',
      lastActive: '2025-05-20'
    },
    {
      id: '5',
      name: 'Robert Wilson',
      role: 'Safety Officer',
      email: 'robert.wilson@constructx.com',
      phone: '(555) 567-8901',
      department: 'Safety',
      status: 'active',
      projects: [
        { id: '1', name: 'Downtown Office Tower' },
        { id: '2', name: 'Riverside Apartments' },
        { id: '3', name: 'City Hospital Renovation' }
      ],
      skills: ['Safety Inspections', 'Hazard Identification', 'Safety Training', 'Incident Investigation'],
      certifications: ['CSP', 'OSHA 500'],
      avatar: 'robert_wilson.jpg',
      joinDate: '2024-01-20',
      lastActive: '2025-05-27'
    }
  ]);

  const [teamRoles, setTeamRoles] = useState<TeamRole[]>([
    {
      id: '1',
      name: 'Project Manager',
      description: 'Responsible for overall project planning, execution, and delivery.',
      permissions: ['project_create', 'project_edit', 'project_delete', 'team_assign', 'budget_manage', 'report_all'],
      memberCount: 1
    },
    {
      id: '2',
      name: 'Quality Control Manager',
      description: 'Ensures all work meets quality standards and specifications.',
      permissions: ['quality_create', 'quality_edit', 'quality_delete', 'inspection_manage', 'report_quality'],
      memberCount: 1
    },
    {
      id: '3',
      name: 'Site Supervisor',
      description: 'Oversees daily field operations and coordinates work crews.',
      permissions: ['field_create', 'field_edit', 'task_manage', 'resource_assign', 'report_field'],
      memberCount: 1
    },
    {
      id: '4',
      name: 'Financial Analyst',
      description: 'Manages project finances, budgets, and cost reporting.',
      permissions: ['finance_view', 'finance_edit', 'invoice_manage', 'budget_view', 'report_financial'],
      memberCount: 1
    },
    {
      id: '5',
      name: 'Safety Officer',
      description: 'Ensures compliance with safety regulations and manages safety programs.',
      permissions: ['safety_create', 'safety_edit', 'safety_delete', 'training_manage', 'report_safety'],
      memberCount: 1
    }
  ]);

  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingRole, setEditingRole] = useState<TeamRole | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');
  
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    department: '',
    status: 'active',
    projects: [],
    skills: [],
    certifications: [],
    joinDate: new Date().toISOString().split('T')[0]
  });
  
  const [newRole, setNewRole] = useState<Partial<TeamRole>>({
    name: '',
    description: '',
    permissions: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [permissionInput, setPermissionInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock departments for dropdown
  const departments = [
    'Project Management',
    'Quality Control',
    'Field Operations',
    'Finance',
    'Safety',
    'Engineering',
    'Procurement',
    'Administration',
    'IT'
  ];

  // Mock permissions for dropdown
  const availablePermissions = [
    { id: 'project_create', name: 'Create Projects' },
    { id: 'project_edit', name: 'Edit Projects' },
    { id: 'project_delete', name: 'Delete Projects' },
    { id: 'team_assign', name: 'Assign Team Members' },
    { id: 'budget_manage', name: 'Manage Budgets' },
    { id: 'budget_view', name: 'View Budgets' },
    { id: 'quality_create', name: 'Create Quality Items' },
    { id: 'quality_edit', name: 'Edit Quality Items' },
    { id: 'quality_delete', name: 'Delete Quality Items' },
    { id: 'inspection_manage', name: 'Manage Inspections' },
    { id: 'field_create', name: 'Create Field Reports' },
    { id: 'field_edit', name: 'Edit Field Reports' },
    { id: 'task_manage', name: 'Manage Tasks' },
    { id: 'resource_assign', name: 'Assign Resources' },
    { id: 'finance_view', name: 'View Financial Data' },
    { id: 'finance_edit', name: 'Edit Financial Data' },
    { id: 'invoice_manage', name: 'Manage Invoices' },
    { id: 'safety_create', name: 'Create Safety Items' },
    { id: 'safety_edit', name: 'Edit Safety Items' },
    { id: 'safety_delete', name: 'Delete Safety Items' },
    { id: 'training_manage', name: 'Manage Training' },
    { id: 'report_all', name: 'Access All Reports' },
    { id: 'report_quality', name: 'Access Quality Reports' },
    { id: 'report_field', name: 'Access Field Reports' },
    { id: 'report_financial', name: 'Access Financial Reports' },
    { id: 'report_safety', name: 'Access Safety Reports' }
  ];

  // Handle team member creation
  const handleCreateMember = () => {
    const memberId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    const createdMember: TeamMember = {
      id: memberId,
      name: newMember.name || '',
      role: newMember.role || '',
      email: newMember.email || '',
      phone: newMember.phone || '',
      department: newMember.department || '',
      status: newMember.status || 'active',
      projects: newMember.projects || [],
      skills: newMember.skills || [],
      certifications: newMember.certifications || [],
      joinDate: newMember.joinDate || createdAt.split('T')[0],
      lastActive: createdAt.split('T')[0]
    };
    
    setTeamMembers([...teamMembers, createdMember]);
    
    // Update role member count
    const updatedRoles = teamRoles.map(role => 
      role.name === createdMember.role ? { ...role, memberCount: role.memberCount + 1 } : role
    );
    setTeamRoles(updatedRoles);
    
    setNewMember({
      name: '',
      role: '',
      email: '',
      phone: '',
      department: '',
      status: 'active',
      projects: [],
      skills: [],
      certifications: [],
      joinDate: new Date().toISOString().split('T')[0]
    });
    setSkillInput('');
    setCertificationInput('');
    setShowCreateMember(false);
  };

  // Handle team member update
  const handleUpdateMember = () => {
    if (!editingMember) return;
    
    const previousRole = teamMembers.find(m => m.id === editingMember.id)?.role;
    const updatedMember = {
      ...editingMember,
      lastActive: new Date().toISOString().split('T')[0]
    };
    
    const updatedMembers = teamMembers.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    );
    
    setTeamMembers(updatedMembers);
    
    // Update role member counts if role changed
    if (previousRole !== updatedMember.role) {
      const updatedRoles = teamRoles.map(role => {
        if (role.name === previousRole) {
          return { ...role, memberCount: Math.max(0, role.memberCount - 1) };
        } else if (role.name === updatedMember.role) {
          return { ...role, memberCount: role.memberCount + 1 };
        }
        return role;
      });
      setTeamRoles(updatedRoles);
    }
    
    setEditingMember(null);
    setSkillInput('');
    setCertificationInput('');
  };

  // Handle team member deletion
  const handleDeleteMember = (id: string) => {
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;
    
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedMembers);
    
    // Update role member count
    const updatedRoles = teamRoles.map(role => 
      role.name === memberToDelete.role ? { ...role, memberCount: Math.max(0, role.memberCount - 1) } : role
    );
    setTeamRoles(updatedRoles);
  };

  // Handle team role creation
  const handleCreateRole = () => {
    const roleId = Math.random().toString(36).substr(2, 9);
    
    const createdRole: TeamRole = {
      id: roleId,
      name: newRole.name || '',
      description: newRole.description || '',
      permissions: newRole.permissions || [],
      memberCount: 0
    };
    
    setTeamRoles([...teamRoles, createdRole]);
    setNewRole({
      name: '',
      description: '',
      permissions: []
    });
    setPermissionInput('');
    setShowCreateRole(false);
  };

  // Handle team role update
  const handleUpdateRole = () => {
    if (!editingRole) return;
    
    const previousName = teamRoles.find(r => r.id === editingRole.id)?.name;
    const updatedRole = {
      ...editingRole
    };
    
    const updatedRoles = teamRoles.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    );
    
    setTeamRoles(updatedRoles);
    
    // Update member roles if role name changed
    if (previousName !== updatedRole.name) {
      const updatedMembers = teamMembers.map(member => 
        member.role === previousName ? { ...member, role: updatedRole.name } : member
      );
      setTeamMembers(updatedMembers);
    }
    
    setEditingRole(null);
    setPermissionInput('');
  };

  // Handle team role deletion
  const handleDeleteRole = (id: string) => {
    const roleToDelete = teamRoles.find(r => r.id === id);
    if (!roleToDelete) return;
    
    // Check if role has members
    const hasMembers = teamMembers.some(member => member.role === roleToDelete.name);
    if (hasMembers) {
      alert(`Cannot delete role "${roleToDelete.name}" because it has assigned members.`);
      return;
    }
    
    const updatedRoles = teamRoles.filter(role => role.id !== id);
    setTeamRoles(updatedRoles);
  };

  // Handle adding project to member
  const handleAddProject = (projectId: string, isEditing: boolean) => {
    if (!projectId) return;
    
    const selectedProject = projects.find(p => p.id === projectId);
    if (!selectedProject) return;
    
    if (isEditing && editingMember) {
      // Check if project already exists
      if (editingMember.projects.some(p => p.id === projectId)) return;
      
      const updatedProjects = [...editingMember.projects, selectedProject];
      setEditingMember({...editingMember, projects: updatedProjects});
    } else {
      // Check if project already exists
      if ((newMember.projects || []).some(p => p.id === projectId)) return;
      
      const updatedProjects = [...(newMember.projects || []), selectedProject];
      setNewMember({...newMember, projects: updatedProjects});
    }
  };

  // Handle removing project from member
  const handleRemoveProject = (projectId: string, isEditing: boolean) => {
    if (isEditing && editingMember) {
      const updatedProjects = editingMember.projects.filter(p => p.id !== projectId);
      setEditingMember({...editingMember, projects: updatedProjects});
    } else {
      const updatedProjects = (newMember.projects || []).filter(p => p.id !== projectId);
      setNewMember({...newMember, projects: updatedProjects});
    }
  };

  // Handle adding skill to member
  const handleAddSkill = (isEditing: boolean) => {
    if (!skillInput.trim()) return;
    
    if (isEditing && editingMember) {
      // Check if skill already exists
      if (editingMember.skills.includes(skillInput.trim())) return;
      
      const updatedSkills = [...editingMember.skills, skillInput.trim()];
      setEditingMember({...editingMember, skills: updatedSkills});
    } else {
      // Check if skill already exists
      if ((newMember.skills || []).includes(skillInput.trim())) return;
      
      const updatedSkills = [...(newMember.skills || []), skillInput.trim()];
      setNewMember({...newMember, skills: updatedSkills});
    }
    
    setSkillInput('');
  };

  // Handle removing skill from member
  const handleRemoveSkill = (skill: string, isEditing: boolean) => {
    if (isEditing && editingMember) {
      const updatedSkills = editingMember.skills.filter(s => s !== skill);
      setEditingMember({...editingMember, skills: updatedSkills});
    } else {
      const updatedSkills = (newMember.skills || []).filter(s => s !== skill);
      setNewMember({...newMember, skills: updatedSkills});
    }
  };

  // Handle adding certification to member
  const handleAddCertification = (isEditing: boolean) => {
    if (!certificationInput.trim()) return;
    
    if (isEditing && editingMember) {
      // Check if certification already exists
      if (editingMember.certifications.includes(certificationInput.trim())) return;
      
      const updatedCertifications = [...editingMember.certifications, certificationInput.trim()];
      setEditingMember({...editingMember, certifications: updatedCertifications});
    } else {
      // Check if certification already exists
      if ((newMember.certifications || []).includes(certificationInput.trim())) return;
      
      const updatedCertifications = [...(newMember.certifications || []), certificationInput.trim()];
      setNewMember({...newMember, certifications: updatedCertifications});
    }
    
    setCertificationInput('');
  };

  // Handle removing certification from member
  const handleRemoveCertification = (certification: string, isEditing: boolean) => {
    if (isEditing && editingMember) {
      const updatedCertifications = editingMember.certifications.filter(c => c !== certification);
      setEditingMember({...editingMember, certifications: updatedCertifications});
    } else {
      const updatedCertifications = (newMember.certifications || []).filter(c => c !== certification);
      setNewMember({...newMember, certifications: updatedCertifications});
    }
  };

  // Handle adding permission to role
  const handleAddPermission = (isEditing: boolean) => {
    if (!permissionInput) return;
    
    if (isEditing && editingRole) {
      // Check if permission already exists
      if (editingRole.permissions.includes(permissionInput)) return;
      
      const updatedPermissions = [...editingRole.permissions, permissionInput];
      setEditingRole({...editingRole, permissions: updatedPermissions});
    } else {
      // Check if permission already exists
      if ((newRole.permissions || []).includes(permissionInput)) return;
      
      const updatedPermissions = [...(newRole.permissions || []), permissionInput];
      setNewRole({...newRole, permissions: updatedPermissions});
    }
    
    setPermissionInput('');
  };

  // Handle removing permission from role
  const handleRemovePermission = (permission: string, isEditing: boolean) => {
    if (isEditing && editingRole) {
      const updatedPermissions = editingRole.permissions.filter(p => p !== permission);
      setEditingRole({...editingRole, permissions: updatedPermissions});
    } else {
      const updatedPermissions = (newRole.permissions || []).filter(p => p !== permission);
      setNewRole({...newRole, permissions: updatedPermissions});
    }
  };

  // Get permission name from ID
  const getPermissionName = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex space-x-2">
          {activeTab === 'members' && (
            <Button onClick={() => setShowCreateMember(true)}>Add Team Member</Button>
          )}
          {activeTab === 'roles' && (
            <Button onClick={() => setShowCreateRole(true)}>Create Role</Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('members')}
        >
          Team Members
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'roles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles & Permissions
        </button>
      </div>

      {/* Team Members Tab */}
      {activeTab === 'members' && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage team members, roles, and project assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div>{member.name}</div>
                          <div className="text-xs text-gray-500">Since {member.joinDate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <span className={`${getStatusBadgeClass(member.status)} px-2 py-1 rounded-full text-xs`}>
                        {member.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.projects.slice(0, 2).map(project => (
                          <span key={project.id} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                            {project.name}
                          </span>
                        ))}
                        {member.projects.length > 2 && (
                          <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                            +{member.projects.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{member.email}</div>
                      <div className="text-xs text-gray-500">{member.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingMember(member)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingMember(member)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
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
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Manage team roles and associated permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map(permission => (
                          <span key={permission} className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-xs">
                            {getPermissionName(permission)}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{role.memberCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingRole(role)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={role.memberCount > 0}
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
      )}

      {/* Create Team Member Form */}
      {showCreateMember && (
        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
            <CardDescription>Enter details for the new team member</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Name</FormLabel>
                  <Input 
                    value={newMember.name} 
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Role</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newMember.role} 
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  >
                    <option value="">Select a role</option>
                    {teamRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField>
                  <FormLabel required>Email</FormLabel>
                  <Input 
                    type="email"
                    value={newMember.email} 
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    value={newMember.phone} 
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField>
                  <FormLabel>Department</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newMember.department} 
                    onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newMember.status} 
                    onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </FormField>
              </div>
              
              <FormField className="mt-4">
                <FormLabel>Projects</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onChange={(e) => handleAddProject(e.target.value, false)}
                    value=""
                  >
                    <option value="">Select project to add</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newMember.projects || []).map(project => (
                    <div key={project.id} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {project.name}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveProject(project.id, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Skills</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter skill"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddSkill(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newMember.skills || []).map(skill => (
                    <div key={skill} className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                      {skill}
                      <button 
                        type="button"
                        className="ml-1 text-green-700 hover:text-green-900"
                        onClick={() => handleRemoveSkill(skill, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Certifications</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={certificationInput} 
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Enter certification"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddCertification(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newMember.certifications || []).map(cert => (
                    <div key={cert} className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      {cert}
                      <button 
                        type="button"
                        className="ml-1 text-amber-700 hover:text-amber-900"
                        onClick={() => handleRemoveCertification(cert, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Join Date</FormLabel>
                <Input 
                  type="date"
                  value={newMember.joinDate} 
                  onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                />
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateMember(false)}>Cancel</Button>
            <Button onClick={handleCreateMember}>Add Team Member</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Team Member Form */}
      {editingMember && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Team Member</CardTitle>
            <CardDescription>Update team member details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Name</FormLabel>
                  <Input 
                    value={editingMember.name} 
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Role</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingMember.role} 
                    onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                  >
                    <option value="">Select a role</option>
                    {teamRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField>
                  <FormLabel required>Email</FormLabel>
                  <Input 
                    type="email"
                    value={editingMember.email} 
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    value={editingMember.phone} 
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField>
                  <FormLabel>Department</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingMember.department} 
                    onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingMember.status} 
                    onChange={(e) => setEditingMember({...editingMember, status: e.target.value as any})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </FormField>
              </div>
              
              <FormField className="mt-4">
                <FormLabel>Projects</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onChange={(e) => handleAddProject(e.target.value, true)}
                    value=""
                  >
                    <option value="">Select project to add</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingMember.projects.map(project => (
                    <div key={project.id} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {project.name}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveProject(project.id, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Skills</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter skill"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddSkill(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingMember.skills.map(skill => (
                    <div key={skill} className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                      {skill}
                      <button 
                        type="button"
                        className="ml-1 text-green-700 hover:text-green-900"
                        onClick={() => handleRemoveSkill(skill, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Certifications</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={certificationInput} 
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Enter certification"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddCertification(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingMember.certifications.map(cert => (
                    <div key={cert} className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      {cert}
                      <button 
                        type="button"
                        className="ml-1 text-amber-700 hover:text-amber-900"
                        onClick={() => handleRemoveCertification(cert, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Join Date</FormLabel>
                <Input 
                  type="date"
                  value={editingMember.joinDate} 
                  onChange={(e) => setEditingMember({...editingMember, joinDate: e.target.value})}
                />
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
            <Button onClick={handleUpdateMember}>Update Team Member</Button>
          </CardFooter>
        </Card>
      )}

      {/* Create Role Form */}
      {showCreateRole && (
        <Card>
          <CardHeader>
            <CardTitle>Create Role</CardTitle>
            <CardDescription>Define a new team role and its permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Role Name</FormLabel>
                <Input 
                  value={newRole.name} 
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  placeholder="Enter role name"
                />
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newRole.description} 
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  placeholder="Enter role description"
                />
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Permissions</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={permissionInput}
                    onChange={(e) => setPermissionInput(e.target.value)}
                  >
                    <option value="">Select permission to add</option>
                    {availablePermissions.map(permission => (
                      <option key={permission.id} value={permission.id}>{permission.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddPermission(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newRole.permissions || []).map(permission => (
                    <div key={permission} className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      {getPermissionName(permission)}
                      <button 
                        type="button"
                        className="ml-1 text-purple-700 hover:text-purple-900"
                        onClick={() => handleRemovePermission(permission, false)}
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
            <Button variant="outline" onClick={() => setShowCreateRole(false)}>Cancel</Button>
            <Button onClick={handleCreateRole}>Create Role</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Role Form */}
      {editingRole && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Role</CardTitle>
            <CardDescription>Update role details and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Role Name</FormLabel>
                <Input 
                  value={editingRole.name} 
                  onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                />
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingRole.description} 
                  onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                />
              </FormField>
              
              <FormField className="mt-4">
                <FormLabel>Permissions</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={permissionInput}
                    onChange={(e) => setPermissionInput(e.target.value)}
                  >
                    <option value="">Select permission to add</option>
                    {availablePermissions.map(permission => (
                      <option key={permission.id} value={permission.id}>{permission.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddPermission(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingRole.permissions.map(permission => (
                    <div key={permission} className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      {getPermissionName(permission)}
                      <button 
                        type="button"
                        className="ml-1 text-purple-700 hover:text-purple-900"
                        onClick={() => handleRemovePermission(permission, true)}
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
            <Button variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </CardFooter>
        </Card>
      )}

      {/* View Team Member Modal/Dialog */}
      {viewingMember && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl">
                    {viewingMember.avatar ? (
                      <img src={viewingMember.avatar} alt={viewingMember.name} className="w-16 h-16 rounded-full" />
                    ) : (
                      viewingMember.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <CardTitle>{viewingMember.name}</CardTitle>
                    <CardDescription>
                      {viewingMember.role} | {viewingMember.department} | 
                      <span className={`${getStatusBadgeClass(viewingMember.status)} ml-1 px-1.5 py-0.5 rounded text-xs`}>
                        {viewingMember.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingMember(null)}>X</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Contact Information</h4>
                    <p className="text-sm">Email: {viewingMember.email}</p>
                    <p className="text-sm">Phone: {viewingMember.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Employment Details</h4>
                    <p className="text-sm">Join Date: {viewingMember.joinDate}</p>
                    <p className="text-sm">Last Active: {viewingMember.lastActive}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Projects</h4>
                  {viewingMember.projects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingMember.projects.map(project => (
                        <span key={project.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {project.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No projects assigned.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Skills</h4>
                  {viewingMember.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingMember.skills.map(skill => (
                        <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Certifications</h4>
                  {viewingMember.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingMember.certifications.map(cert => (
                        <span key={cert} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No certifications listed.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Role Permissions</h4>
                  {teamRoles.find(r => r.name === viewingMember.role)?.permissions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2 mb-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-sm">{getPermissionName(permission)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setViewingMember(null)}>Close</Button>
            </CardFooter>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default TeamManagementModule;
