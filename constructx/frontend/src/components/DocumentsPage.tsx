import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Download,
  LayoutGrid,
  List,
  Loader2,
  Folder,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import documentService from '../services/documentService';

// import FolderTree from './FolderTree';
// import DocumentsList from './DocumentsList';
// import DocumentsGrid from './DocumentsGrid';
// import DocumentUploadForm from './DocumentUploadForm';

interface DocumentsPageProps {
  projectId?: string; // Optional - if provided, shows documents for specific project
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    approvedDocuments: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [documentsResponse, foldersResponse, categoriesResponse, statusesResponse] = await Promise.all([
        documentService.getDocuments(projectId || ''),
        documentService.getFolders(projectId || ''),
        documentService.getDocumentCategories(),
        documentService.getDocumentStatuses(),
      ]);

      setDocuments(documentsResponse);
      setFolders(foldersResponse);
      setCategories(categoriesResponse.map((c: string) => ({ value: c, label: c })));
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));

      // Calculate metrics (mock for now, ideally from API)
      const approved = documentsResponse.filter((doc: any) => doc.status === 'Approved').length;
      const pending = documentsResponse.filter((doc: any) => doc.status === 'Under Review').length;

      setMetrics({
        totalDocuments: documentsResponse.length,
        totalFolders: foldersResponse.length,
        approvedDocuments: approved,
        pendingApprovals: pending,
      });

    } catch (error) {
      console.error('Error loading document data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'category':
        setFilterCategory(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
    }
  };

  const handleUploadDocument = () => {
    setShowUploadForm(true);
  };

  const handleCreateFolder = async () => {
    // Placeholder for creating new folder logic
    toast({
      title: 'Info',
      description: 'Create new folder functionality coming soon!',
    });
  };

  const handleDocumentUploadSubmit = async (documentData: any) => {
    setIsLoading(true);
    try {
      await documentService.uploadDocument(projectId || '', documentData);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully.',
      });
      setShowUploadForm(false);
      loadData();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    setIsLoading(true);
    try {
      await documentService.deleteDocument(documentId);
      toast({
        title: 'Success',
        description: 'Document deleted successfully.',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchTerm ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || doc.category === filterCategory;
    const matchesStatus = !filterStatus || doc.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading && documents.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage documents for project ${projectId}` : 'Centralized document repository'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateFolder}>
            <Folder className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
          <Button onClick={handleUploadDocument}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFolders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Documents</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvedDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingApprovals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Folder Tree */}
        {/* <div className="lg:w-1/4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <FolderTree folders={folders} onSelectFolder={(folderId) => console.log(folderId)} />
            </CardContent>
          </Card>
        </div> */}
        <div className="lg:w-full">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Documents List Component */}
              {/* <DocumentsList
                documents={filteredDocuments}
                onEdit={(doc) => console.log('Edit', doc.id)}
                onDelete={handleDeleteDocument}
                onDownload={(doc) => console.log('Download', doc.id)}
                onPreview={(doc) => console.log('Preview', doc.id)}
              /> */}
              <Card className="min-h-[300px] flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground">
                  <List className="mx-auto h-12 w-12 mb-4" />
                  <p>Documents List view coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              {/* Search and Filters (repeated for grid view for now, can be refactored) */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Documents Grid Component */}
              {/* <DocumentsGrid
                documents={filteredDocuments}
                onEdit={(doc) => console.log('Edit', doc.id)}
                onDelete={handleDeleteDocument}
                onDownload={(doc) => console.log('Download', doc.id)}
                onPreview={(doc) => console.log('Preview', doc.id)}
              /> */}
              <Card className="min-h-[300px] flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground">
                  <LayoutGrid className="mx-auto h-12 w-12 mb-4" />
                  <p>Documents Grid view coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Document Upload Form Modal */}
      {/* {showUploadForm && (
        <DocumentUploadForm
          projectId={projectId}
          onUpload={handleDocumentUploadSubmit}
          onCancel={() => setShowUploadForm(false)}
        />
      )} */}
    </div>
  );
};

export default DocumentsPage;


