import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import DocumentCard from './DocumentCard';

interface DocumentLibraryProps {
  projectId: string;
  projectName: string;
  documents?: {
    id: string;
    title: string;
    description?: string;
    category: string;
    version: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    uploadedAt: Date;
    approvalStatus?: 'pending' | 'approved' | 'rejected' | 'not_required';
    tags?: string[];
    thumbnailUrl?: string;
  }[];
  categories?: {
    id: string;
    name: string;
    count: number;
  }[];
  isLoading?: boolean;
  onUploadDocument?: () => void;
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
  onEditDocument?: (documentId: string) => void;
  onDeleteDocument?: (documentId: string) => void;
  onViewVersionHistory?: (documentId: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  projectId,
  projectName,
  documents = [],
  categories = [],
  isLoading = false,
  onUploadDocument,
  onViewDocument,
  onDownloadDocument,
  onEditDocument,
  onDeleteDocument,
  onViewVersionHistory
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('date_desc');

  // Filter documents based on active tab (category) and search query
  const filteredDocuments = documents.filter(doc => {
    // Filter by category
    if (activeTab !== 'all' && doc.category !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      case 'date_asc':
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      case 'date_desc':
      default:
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
  });

  // Format category name
  const formatCategory = (category: string): string => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{projectName} Documents</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>
            {onUploadDocument && (
              <Button onClick={onUploadDocument}>
                Upload Document
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({documents.length})
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {formatCategory(category.name)} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedDocuments.length > 0 ? (
                  sortedDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      category={doc.category}
                      version={doc.version}
                      fileName={doc.fileName}
                      fileType={doc.fileType}
                      fileSize={doc.fileSize}
                      uploadedBy={doc.uploadedBy}
                      uploadedAt={doc.uploadedAt}
                      approvalStatus={doc.approvalStatus}
                      tags={doc.tags}
                      thumbnailUrl={doc.thumbnailUrl}
                      onView={() => onViewDocument && onViewDocument(doc.id)}
                      onDownload={() => onDownloadDocument && onDownloadDocument(doc.id)}
                      onEdit={() => onEditDocument && onEditDocument(doc.id)}
                      onDelete={() => onDeleteDocument && onDeleteDocument(doc.id)}
                      onVersionHistory={() => onViewVersionHistory && onViewVersionHistory(doc.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center h-[200px] space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <p className="text-muted-foreground">No documents found</p>
                    {onUploadDocument && (
                      <Button onClick={onUploadDocument}>
                        Upload Document
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Category-specific tabs */}
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedDocuments.length > 0 ? (
                    sortedDocuments.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        description={doc.description}
                        category={doc.category}
                        version={doc.version}
                        fileName={doc.fileName}
                        fileType={doc.fileType}
                        fileSize={doc.fileSize}
                        uploadedBy={doc.uploadedBy}
                        uploadedAt={doc.uploadedAt}
                        approvalStatus={doc.approvalStatus}
                        tags={doc.tags}
                        thumbnailUrl={doc.thumbnailUrl}
                        onView={() => onViewDocument && onViewDocument(doc.id)}
                        onDownload={() => onDownloadDocument && onDownloadDocument(doc.id)}
                        onEdit={() => onEditDocument && onEditDocument(doc.id)}
                        onDelete={() => onDeleteDocument && onDeleteDocument(doc.id)}
                        onVersionHistory={() => onViewVersionHistory && onViewVersionHistory(doc.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center h-[200px] space-y-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <p className="text-muted-foreground">No documents in {formatCategory(category.name)}</p>
                      {onUploadDocument && (
                        <Button onClick={onUploadDocument}>
                          Upload Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentLibrary;
