import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'canceled';
  clientCompany: string;
  startDate: string;
  targetEndDate: string;
  projectManager: string;
}

const ProjectsModule: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Downtown Office Tower',
      description: 'Construction of a 20-story office building in downtown area',
      status: 'active',
      clientCompany: 'Acme Corporation',
      startDate: '2025-01-15',
      targetEndDate: '2026-06-30',
      projectManager: 'John Smith'
    },
    {
      id: '2',
      name: 'Riverside Apartments',
      description: 'Luxury apartment complex with 150 units',
      status: 'planning',
      clientCompany: 'River Development LLC',
      startDate: '2025-07-01',
      targetEndDate: '2027-03-31',
      projectManager: 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'City Hospital Renovation',
      description: 'Complete renovation of the west wing',
      status: 'on_hold',
      clientCompany: 'City Healthcare',
      startDate: '2024-11-01',
      targetEndDate: '2025-12-31',
      projectManager: 'Michael Brown'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'planning',
    clientCompany: '',
    startDate: '',
    targetEndDate: '',
    projectManager: ''
  });

  const handleCreateProject = () => {
    const projectId = Math.random().toString(36).substr(2, 9);
    const createdProject = {
      ...newProject,
      id: projectId
    } as Project;
    
    setProjects([...projects, createdProject]);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      clientCompany: '',
      startDate: '',
      targetEndDate: '',
      projectManager: ''
    });
    setShowCreateForm(false);
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    
    const updatedProjects = projects.map(project => 
      project.id === editingProject.id ? editingProject : project
    );
    
    setProjects(updatedProjects);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'active':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'completed':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'canceled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowCreateForm(true)}>Create Project</Button>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>Manage your construction projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Target End Date</TableHead>
                <TableHead>Project Manager</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(project.status)}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{project.clientCompany}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.targetEndDate}</TableCell>
                  <TableCell>{project.projectManager}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingProject(project)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
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

      {/* Create Project Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Enter the details for the new project</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Project Name</FormLabel>
                <Input 
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newProject.description} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Client Company</FormLabel>
                <Input 
                  value={newProject.clientCompany} 
                  onChange={(e) => setNewProject({...newProject, clientCompany: e.target.value})}
                  placeholder="Enter client company"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={newProject.startDate} 
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Target End Date</FormLabel>
                  <Input 
                    type="date"
                    value={newProject.targetEndDate} 
                    onChange={(e) => setNewProject({...newProject, targetEndDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Project Manager</FormLabel>
                <Input 
                  value={newProject.projectManager} 
                  onChange={(e) => setNewProject({...newProject, projectManager: e.target.value})}
                  placeholder="Enter project manager name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newProject.status} 
                  onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Project Form */}
      {editingProject && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>Update the project details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Project Name</FormLabel>
                <Input 
                  value={editingProject.name} 
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingProject.description} 
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Client Company</FormLabel>
                <Input 
                  value={editingProject.clientCompany} 
                  onChange={(e) => setEditingProject({...editingProject, clientCompany: e.target.value})}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Start Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingProject.startDate} 
                    onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel required>Target End Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingProject.targetEndDate} 
                    onChange={(e) => setEditingProject({...editingProject, targetEndDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel required>Project Manager</FormLabel>
                <Input 
                  value={editingProject.projectManager} 
                  onChange={(e) => setEditingProject({...editingProject, projectManager: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingProject.status} 
                  onChange={(e) => setEditingProject({...editingProject, status: e.target.value as any})}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
            <Button onClick={handleUpdateProject}>Update Project</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProjectsModule;
