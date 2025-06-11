import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, FileText, Download, Eye, MoreHorizontal, Upload, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import bidService from "../services/bidService";

const BidDocumentsComponent = ({ bidId }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input

  // Document categories
  const categories = [
    { value: "general", label: "General" },
    { value: "proposal", label: "Proposal" },
    { value: "contract", label: "Contract" },
    { value: "specification", label: "Specification" },
    { value: "drawing", label: "Drawing" },
    { value: "financial", label: "Financial" },
    { value: "correspondence", label: "Correspondence" }
  ];

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [bidId]);

  // Fetch documents from API
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bidService.getBidDocuments(bidId);
      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching bid documents:", err);
      setError("Failed to load bid documents. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bid documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        name: prev.name || file.name.split('.')[0] // Use filename as default name if empty
      }));
    }
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Open upload dialog
  const handleUploadClick = () => {
    setFormData({
      name: "",
      description: "",
      category: "general",
      file: null
    });
    setFileInputKey(Date.now()); // Reset file input
    setShowUploadDialog(true);
  };

  // Handle upload document
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Document name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.file) {
      toast({
        title: "Validation Error",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('file', formData.file);
      
      const response = await bidService.uploadBidDocument(bidId, uploadData);
      setDocuments(prev => [...prev, response.data]);
      setShowUploadDialog(false);
      toast({
        title: "Success",
        description: "Document uploaded successfully."
      });
    } catch (err) {
      console.error("Error uploading document:", err);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete document
  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    
    try {
      await bidService.deleteBidDocument(bidId, documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: "Success",
        description: "Document deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle download document
  const handleDownloadDocument = async (document) => {
    try {
      toast({
        title: "Downloading",
        description: `Downloading ${document.name}...`
      });
      
      const response = await bidService.downloadBidDocument(bidId, document.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Success",
        description: "Document downloaded successfully."
      });
    } catch (err) {
      console.error("Error downloading document:", err);
      toast({
        title: "Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle view document
  const handleViewDocument = async (document) => {
    try {
      toast({
        title: "Opening",
        description: `Opening ${document.name}...`
      });
      
      const response = await bidService.getBidDocumentUrl(bidId, document.id);
      window.open(response.data.url, '_blank');
    } catch (err) {
      console.error("Error viewing document:", err);
      toast({
        title: "Error",
        description: "Failed to open document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: "file-text",
      doc: "file-text",
      docx: "file-text",
      xls: "file-spreadsheet",
      xlsx: "file-spreadsheet",
      ppt: "file-presentation",
      pptx: "file-presentation",
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      zip: "file-archive",
      rar: "file-archive"
    };
    
    return iconMap[extension] || "file";
  };

  // Filter documents based on active tab
  const filteredDocuments = activeTab === "all" 
    ? documents 
    : documents.filter(doc => doc.category === activeTab);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchDocuments}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Bid Documents</h2>
        <Button onClick={handleUploadClick}>
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No documents found. Upload your first document to get started.</p>
                <Button onClick={handleUploadClick}>
                  <Upload className="h-4 w-4 mr-2" /> Upload Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(document => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{document.name}</p>
                            {document.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{document.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categories.find(c => c.value === document.category)?.label || document.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(document.size)}</TableCell>
                      <TableCell>{formatDate(document.createdAt)}</TableCell>
                      <TableCell>{document.uploadedByName}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                              <Download className="h-4 w-4 mr-2" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDocument(document.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to this bid.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
                <Input
                  id="file"
                  type="file"
                  key={fileInputKey}
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Document Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isSubmitting}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.file}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidDocumentsComponent;
