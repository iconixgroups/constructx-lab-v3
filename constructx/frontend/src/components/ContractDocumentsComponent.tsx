import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Clock, 
  FileUp, 
  Loader2,
  File,
  FilePlus,
  FolderPlus
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";

interface ContractDocumentsComponentProps {
  contractId: string;
}

const ContractDocumentsComponent: React.FC<ContractDocumentsComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Contract",
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Document category options
  const documentCategoryOptions = [
    { value: "Contract", label: "Contract" },
    { value: "Amendment", label: "Amendment" },
    { value: "Exhibit", label: "Exhibit" },
    { value: "Attachment", label: "Attachment" },
    { value: "Insurance", label: "Insurance" },
    { value: "Permit", label: "Permit" },
    { value: "Certificate", label: "Certificate" },
    { value: "Correspondence", label: "Correspondence" },
    { value: "Other", label: "Other" }
  ];
  
  // Mock data for initial development - will be replaced with API calls
  const mockDocuments = [
    {
      id: "doc-1",
      contractId: "contract-1",
      name: "Main Contract Agreement",
      description: "Fully executed contract agreement between all parties.",
      category: "Contract",
      fileUrl: "/contracts/contract-1/main-agreement.pdf",
      fileSize: 2458000,
      fileType: "application/pdf",
      uploadedBy: "John Doe",
      uploadedAt: "2025-01-10T14:30:00Z",
      updatedAt: "2025-01-10T14:30:00Z"
    },
    {
      id: "doc-2",
      contractId: "contract-1",
      name: "Insurance Certificate",
      description: "General liability insurance certificate for the project.",
      category: "Insurance",
      fileUrl: "/contracts/contract-1/insurance-cert.pdf",
      fileSize: 1245000,
      fileType: "application/pdf",
      uploadedBy: "Jane Smith",
      uploadedAt: "2025-01-12T10:15:00Z",
      updatedAt: "2025-01-12T10:15:00Z"
    },
    {
      id: "doc-3",
      contractId: "contract-1",
      name: "Building Permit",
      description: "City-issued building permit for the construction project.",
      category: "Permit",
      fileUrl: "/contracts/contract-1/building-permit.pdf",
      fileSize: 876000,
      fileType: "application/pdf",
      uploadedBy: "Robert Johnson",
      uploadedAt: "2025-01-15T09:45:00Z",
      updatedAt: "2025-01-15T09:45:00Z"
    }
  ];
  
  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await contractService.getContractDocuments(contractId);
        // setDocuments(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setDocuments(mockDocuments);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching contract documents:", err);
        setError("Failed to load contract documents. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [contractId]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <File className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <File className="h-5 w-5 text-blue-700" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <File className="h-5 w-5 text-green-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      category: "Contract",
      file: null
    });
    setShowAddDialog(true);
  };
  
  // Open edit dialog
  const handleEditClick = (document: any) => {
    setCurrentDocument(document);
    setFormData({
      name: document.name,
      description: document.description || "",
      category: document.category,
      file: null
    });
    setShowEditDialog(true);
  };
  
  // Handle add document
  const handleAddDocument = async (e: React.FormEvent) => {
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
      // This will be replaced with actual API call
      // const formDataToSend = new FormData();
      // formDataToSend.append('name', formData.name);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('category', formData.category);
      // formDataToSend.append('file', formData.file);
      // const response = await contractService.uploadContractDocument(contractId, formDataToSend);
      // setDocuments(prev => [...prev, response.data]);
      
      // Mock create for development
      const newDocument = {
        id: `doc-${Date.now()}`,
        contractId,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        fileUrl: `/contracts/${contractId}/${formData.file.name}`,
        fileSize: formData.file.size,
        fileType: formData.file.type,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, newDocument]);
      setShowAddDialog(false);
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
  
  // Handle edit document
  const handleEditDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Document name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This will be replaced with actual API call
      // const formDataToSend = new FormData();
      // formDataToSend.append('name', formData.name);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('category', formData.category);
      // if (formData.file) {
      //   formDataToSend.append('file', formData.file);
      // }
      // const response = await contractService.updateContractDocument(currentDocument.id, formDataToSend);
      // setDocuments(prev => prev.map(doc => doc.id === currentDocument.id ? response.data : doc));
      
      // Mock update for development
      const updatedDocument = {
        ...currentDocument,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        updatedAt: new Date().toISOString()
      };
      
      if (formData.file) {
        updatedDocument.fileUrl = `/contracts/${contractId}/${formData.file.name}`;
        updatedDocument.fileSize = formData.file.size;
        updatedDocument.fileType = formData.file.type;
      }
      
      setDocuments(prev => prev.map(doc => doc.id === currentDocument.id ? updatedDocument : doc));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Document updated successfully."
      });
    } catch (err) {
      console.error("Error updating document:", err);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete document
  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    
    try {
      // This will be replaced with actual API call
      // await contractService.deleteContractDocument(documentId);
      
      // Mock delete for development
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
  const handleDownloadDocument = async (document: any) => {
    try {
      // This will be replaced with actual API call
      // const response = await contractService.downloadContractDocument(document.id);
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', document.name);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      
      // Mock download for development
      toast({
        title: "Downloading",
        description: `Downloading ${document.name}...`
      });
      
      setTimeout(() => {
        toast({
          title: "Success",
          description: `${document.name} downloaded successfully.`
        });
      }, 1500);
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
  const handleViewDocument = async (document: any) => {
    try {
      // This will be replaced with actual API call or viewer implementation
      // window.open(document.fileUrl, '_blank');
      
      // Mock view for development
      toast({
        title: "Opening Document",
        description: `Opening ${document.name} in document viewer...`
      });
    } catch (err) {
      console.error("Error viewing document:", err);
      toast({
        title: "Error",
        description: "Failed to open document. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading && documents.length === 0) {
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
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Contract Documents</h2>
        <Button onClick={handleAddClick}>
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No documents uploaded to this contract yet.</p>
            <Button onClick={handleAddClick}>
              <Upload className="h-4 w-4 mr-2" /> Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(document => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {getFileIcon(document.fileType)}
                        <div>
                          <div className="font-medium">{document.name}</div>
                          {document.description && (
                            <div className="text-sm text-muted-foreground">{document.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.category}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(document.uploadedAt)}</div>
                        <div className="text-muted-foreground">by {document.uploadedBy}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDocument(document)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadDocument(document)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(document)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDocument(document.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
      
      {/* Add Document Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to this contract.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDocument}>
            <div className="space-y-4 py-4">
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
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    name="file"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formData.file ? formData.file.name : "No file selected"}
                  </span>
                </div>
                {formData.file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {formatFileSize(formData.file.size)}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
      
      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Document Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-file">Replace File (Optional)</Label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="edit-file-upload"
                    className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  <input
                    id="edit-file-upload"
                    name="file"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formData.file ? formData.file.name : "Keep existing file"}
                  </span>
                </div>
                {formData.file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {formatFileSize(formData.file.size)}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Document"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractDocumentsComponent;
