import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface Document {
  id: string;
  name: string;
  description: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  status: 'draft' | 'final' | 'archived' | 'deleted';
  projectId: string;
  projectName: string;
  version: number;
  tags: string[];
}

const DocumentsModule: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Site Plan.pdf',
      description: 'Detailed site plan with dimensions',
      fileType: 'application/pdf',
      fileSize: 2500000,
      uploadedBy: 'John Smith',
      uploadedAt: '2025-05-10T14:30:00',
      status: 'final',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      version: 2,
      tags: ['plans', 'approved']
    },
    {
      id: '2',
      name: 'Electrical Specifications.docx',
      description: 'Electrical requirements and specifications',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 1200000,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2025-05-15T09:45:00',
      status: 'draft',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      version: 1,
      tags: ['specifications', 'electrical']
    },
    {
      id: '3',
      name: 'Foundation Design.dwg',
      description: 'CAD drawing of foundation design',
      fileType: 'application/acad',
      fileSize: 4800000,
      uploadedBy: 'Michael Brown',
      uploadedAt: '2025-05-05T11:20:00',
      status: 'final',
      projectId: '2',
      projectName: 'Riverside Apartments',
      version: 3,
      tags: ['design', 'foundation', 'approved']
    }
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    name: '',
    description: '',
    fileType: '',
    fileSize: 0,
    status: 'draft',
    projectId: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  const handleUploadDocument = () => {
    const documentId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newDocument.projectId);
    
    const uploadedDocument = {
      ...newDocument,
      id: documentId,
      uploadedBy: 'Current User', // In a real app, this would be the logged-in user
      uploadedAt: new Date().toISOString(),
      projectName: selectedProject?.name || '',
      version: 1,
      tags: newDocument.tags || []
    } as Document;
    
    setDocuments([...documents, uploadedDocument]);
    setNewDocument({
      name: '',
      description: '',
      fileType: '',
      fileSize: 0,
      status: 'draft',
      projectId: '',
      tags: []
    });
    setTagInput('');
    setShowUploadForm(false);
  };

  const handleUpdateDocument = () => {
    if (!editingDocument) return;
    
    const selectedProject = projects.find(p => p.id === editingDocument.projectId);
    const updatedDocument = {
      ...editingDocument,
      projectName: selectedProject?.name || editingDocument.projectName
    };
    
    const updatedDocuments = documents.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    );
    
    setDocuments(updatedDocuments);
    setEditingDocument(null);
    setTagInput('');
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
  };

  const handleArchiveDocument = (id: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? {...doc, status: 'archived' as const} : doc
    );
    
    setDocuments(updatedDocuments);
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingDocument) {
      const newTags = [...(editingDocument.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingDocument({...editingDocument, tags: newTags});
    } else {
      const newTags = [...(newDocument.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewDocument({...newDocument, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingDocument) {
      const newTags = editingDocument.tags.filter(t => t !== tag);
      setEditingDocument({...editingDocument, tags: newTags});
    } else {
      const newTags = (newDocument.tags || []).filter(t => t !== tag);
      setNewDocument({...newDocument, tags: newTags});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'final':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'archived':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'deleted':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('acad')) return '📐';
    return '📁';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents Management</h1>
        <Button onClick={() => setShowUploadForm(true)}>Upload Document</Button>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>Manage your project documents and files</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{getFileIcon(document.fileType)}</span>
                      {document.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{document.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {document.tags.map(tag => (
                        <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{document.projectName}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(document.status)}>
                      {document.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  <TableCell>v{document.version}</TableCell>
                  <TableCell>{document.uploadedBy}</TableCell>
                  <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingDocument(document)}
                      >
                        Edit
                      </Button>
                      {document.status !== 'archived' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleArchiveDocument(document.id)}
                        >
                          Archive
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
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

      {/* Upload Document Form */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>Enter the details for the new document</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Document Name</FormLabel>
                <Input 
                  value={newDocument.name} 
                  onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                  placeholder="Enter document name with extension (e.g., site_plan.pdf)"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newDocument.description} 
                  onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                  placeholder="Enter document description"
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newDocument.projectId} 
                  onChange={(e) => setNewDocument({...newDocument, projectId: e.target.value})}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>File Type</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newDocument.fileType} 
                    onChange={(e) => setNewDocument({...newDocument, fileType: e.target.value})}
                  >
                    <option value="">Select file type</option>
                    <option value="application/pdf">PDF</option>
                    <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document</option>
                    <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel Spreadsheet</option>
                    <option value="application/acad">CAD Drawing</option>
                    <option value="image/jpeg">JPEG Image</option>
                    <option value="image/png">PNG Image</option>
                  </select>
                </FormField>
                
                <FormField>
                  <FormLabel>File Size (bytes)</FormLabel>
                  <Input 
                    type="number"
                    value={newDocument.fileSize || ''} 
                    onChange={(e) => setNewDocument({...newDocument, fileSize: Number(e.target.value)})}
                    placeholder="Enter file size in bytes"
                  />
                  <FormDescription>
                    {newDocument.fileSize ? formatFileSize(newDocument.fileSize) : ''}
                  </FormDescription>
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newDocument.status} 
                  onChange={(e) => setNewDocument({...newDocument, status: e.target.value as any})}
                >
                  <option value="draft">Draft</option>
                  <option value="final">Final</option>
                </select>
              </FormField>
              
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
                  {(newDocument.tags || []).map(tag => (
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
              
              <FormField>
                <FormLabel required>File Upload</FormLabel>
                <Input 
                  type="file"
                  className="cursor-pointer"
                />
                <FormDescription>
                  In a real implementation, this would upload the actual file
                </FormDescription>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowUploadForm(false)}>Cancel</Button>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Document Form */}
      {editingDocument && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Document</CardTitle>
            <CardDescription>Update the document details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Document Name</FormLabel>
                <Input 
                  value={editingDocument.name} 
                  onChange={(e) => setEditingDocument({...editingDocument, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingDocument.description} 
                  onChange={(e) => setEditingDocument({...editingDocument, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel required>Project</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingDocument.projectId} 
                  onChange={(e) => setEditingDocument({...editingDocument, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingDocument.status} 
                  onChange={(e) => setEditingDocument({...editingDocument, status: e.target.value as any})}
                >
                  <option value="draft">Draft</option>
                  <option value="final">Final</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>
              
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
                  {editingDocument.tags.map(tag => (
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
              
              <FormField>
                <FormLabel>Version</FormLabel>
                <Input 
                  type="number"
                  min="1"
                  value={editingDocument.version} 
                  onChange={(e) => setEditingDocument({...editingDocument, version: Number(e.target.value)})}
                />
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingDocument(null)}>Cancel</Button>
            <Button onClick={handleUpdateDocument}>Update Document</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default DocumentsModule;
