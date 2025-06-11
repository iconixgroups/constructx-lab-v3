import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { UploadCloud, X, File as FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

// Mock API (replace with actual API calls)
const mockApi = {
    uploadDocument: async (projectId, folderId, file, metadata, onProgress) => {
        console.log("Uploading document:", file.name, "to folder:", folderId, "metadata:", metadata);
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                onProgress(file.name, progress);
            }
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200); // Simulate progress update every 200ms

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 second upload time
        clearInterval(interval);
        onProgress(file.name, 100);

        // Assume currentUser is available
        const currentUser = { id: "user1", name: "Alice Smith" };
        return {
            id: `doc_${Math.random().toString(36).substring(7)}`,
            projectId: projectId,
            folderId: folderId,
            name: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePath: `/uploads/${file.name}`, // Mock path
            status: "Draft", // Initial status
            category: metadata.category,
            tags: metadata.tags,
            description: metadata.description,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLatestVersion: true,
        };
    },
    getDocumentCategories: async () => ["Drawing", "Specification", "Contract", "Permit", "Report", "Calculation", "Presentation", "Other"],
};

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DocumentUploadForm = ({ projectId, targetFolderId, onSuccess, onCancel }) => {
    const [files, setFiles] = useState([]);
    const [metadata, setMetadata] = useState({
        category: "",
        tags: "",
        description: "",
    });
    const [uploadProgress, setUploadProgress] = useState({}); // { [fileName]: progress }
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories
    React.useEffect(() => {
        mockApi.getDocumentCategories().then(setCategories);
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        // accept: { // Define acceptable file types if needed
        //     "image/*": [],
        //     "application/pdf": [],
        // }
    });

    const handleRemoveFile = (fileName) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileName];
            return newProgress;
        });
    };

    const handleMetadataChange = (e) => {
        const { name, value } = e.target;
        setMetadata(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value) => {
        setMetadata(prev => ({ ...prev, category: value }));
    };

    const handleUploadProgress = (fileName, progress) => {
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please select at least one file to upload.");
            return;
        }
        setIsUploading(true);
        setUploadProgress({}); // Reset progress

        const metadataToSave = {
            ...metadata,
            tags: metadata.tags.split(",").map(tag => tag.trim()).filter(tag => tag), // Split tags
        };

        try {
            const uploadPromises = files.map(file => 
                mockApi.uploadDocument(projectId, targetFolderId, file, metadataToSave, handleUploadProgress)
            );
            const results = await Promise.all(uploadPromises);
            console.log("Upload successful:", results);
            onSuccess(results); // Pass uploaded document details back
        } catch (error) {
            console.error("Upload failed:", error);
            alert("An error occurred during upload. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/50"}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                {isDragActive ? (
                    <p className="text-sm text-primary">Drop the files here ...</p>
                ) : (
                    <p className="text-sm text-muted-foreground">Drag & drop files here, or click to select files</p>
                )}
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Files to Upload:</h4>
                    {files.map(file => (
                        <div key={file.name} className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm truncate" title={file.name}>{file.name}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">({formatFileSize(file.size)})</span>
                            </div>
                            {uploadProgress[file.name] !== undefined && (
                                <Progress value={uploadProgress[file.name]} className="w-20 h-1.5 mx-2" />
                            )}
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive" 
                                onClick={() => handleRemoveFile(file.name)}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Metadata Fields */}
            <div className="space-y-4 pt-4 border-t">
                <div>
                    <label htmlFor="docCategory" className="text-sm font-medium">Category</label>
                    <Select value={metadata.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="docCategory"><SelectValue placeholder="Select category (optional)" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="docTags" className="text-sm font-medium">Tags</label>
                    <Input id="docTags" name="tags" value={metadata.tags} onChange={handleMetadataChange} placeholder="e.g., phase1, structural, approved" />
                    <p className="text-xs text-muted-foreground mt-1">Separate tags with commas.</p>
                </div>
                <div>
                    <label htmlFor="docDescription" className="text-sm font-medium">Description</label>
                    <Textarea id="docDescription" name="description" value={metadata.description} onChange={handleMetadataChange} placeholder="Add a brief description (optional)" rows={2} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>Cancel</Button>
                <Button type="submit" disabled={isUploading || files.length === 0}>
                    {isUploading ? `Uploading ${Object.keys(uploadProgress).length}/${files.length}...` : `Upload ${files.length} File(s)`}
                </Button>
            </div>
        </form>
    );
};

export default DocumentUploadForm;

