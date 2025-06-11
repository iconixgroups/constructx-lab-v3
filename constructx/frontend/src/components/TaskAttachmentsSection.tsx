import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { UploadCloud, Paperclip, FileText, FileImage, FileArchive, FileAudio, FileVideo, Trash2, Download } from "lucide-react";
import { format } from "date-fns";
import { useDropzone } from "react-dropzone"; // Assuming react-dropzone is installed

// Mock API (replace with actual API calls)
const mockApi = {
    getTaskAttachments: async (taskId) => {
        console.log("Fetching attachments for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock attachments
        return [
            { id: "att1", taskId: taskId, fileName: "Foundation_Plan_RevB.pdf", fileSize: 2560000, fileType: "application/pdf", filePath: "/uploads/Foundation_Plan_RevB.pdf", uploadedBy: { id: "user3", name: "Charlie Brown" }, uploadedAt: "2024-02-05T11:00:00Z" },
            { id: "att2", taskId: taskId, fileName: "Site_Photo_Feb6.jpg", fileSize: 1200000, fileType: "image/jpeg", filePath: "/uploads/Site_Photo_Feb6.jpg", uploadedBy: { id: "user4", name: "Diana Prince" }, uploadedAt: "2024-02-06T15:30:00Z" },
            { id: "att3", taskId: taskId, fileName: "Meeting_Notes.docx", fileSize: 45000, fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", filePath: "/uploads/Meeting_Notes.docx", uploadedBy: { id: "user1", name: "Alice Smith" }, uploadedAt: "2024-02-09T09:15:00Z" },
        ];
    },
    uploadAttachment: async (taskId, file) => {
        console.log("Uploading attachment:", taskId, file.name);
        // Simulate upload progress
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        // Assume currentUser is available
        const currentUser = { id: "user1", name: "Alice Smith" };
        return {
            id: `att${Math.random().toString(36).substring(7)}`,
            taskId: taskId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePath: `/uploads/${file.name}`, // Mock path
            uploadedBy: currentUser,
            uploadedAt: new Date().toISOString(),
        };
    },
    deleteAttachment: async (attachmentId) => {
        console.log("Deleting attachment:", attachmentId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    downloadAttachment: async (attachmentId, filePath) => {
        // In a real app, this would trigger a download
        console.log("Downloading attachment:", attachmentId, filePath);
        alert(`Simulating download of ${filePath}`);
        // Example: window.location.href = `/api/tasks/attachments/${attachmentId}`;
    },
};

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper to get file icon
const getFileIcon = (fileType) => {
    if (!fileType) return <Paperclip className="h-4 w-4" />;
    if (fileType.startsWith("image/")) return <FileImage className="h-4 w-4 text-blue-500" />;
    if (fileType.startsWith("audio/")) return <FileAudio className="h-4 w-4 text-purple-500" />;
    if (fileType.startsWith("video/")) return <FileVideo className="h-4 w-4 text-orange-500" />;
    if (fileType === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return <FileText className="h-4 w-4 text-green-500" />;
    if (fileType.includes("document") || fileType.includes("word")) return <FileText className="h-4 w-4 text-blue-600" />;
    if (fileType.includes("zip") || fileType.includes("archive")) return <FileArchive className="h-4 w-4 text-yellow-500" />;
    return <Paperclip className="h-4 w-4 text-gray-500" />;
};

const TaskAttachmentsSection = ({ taskId, initialAttachments }) => {
    const [attachments, setAttachments] = useState(initialAttachments || []);
    const [isLoading, setIsLoading] = useState(!initialAttachments);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchAttachments = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getTaskAttachments(taskId);
            setAttachments(data);
        } catch (err) {
            console.error("Error fetching attachments:", err);
            setError("Failed to load attachments.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        if (!initialAttachments) {
            fetchAttachments();
        }
    }, [taskId, initialAttachments, fetchAttachments]);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        setIsUploading(true);
        try {
            // Upload files one by one (or handle multiple uploads)
            for (const file of acceptedFiles) {
                const uploadedAttachment = await mockApi.uploadAttachment(taskId, file);
                setAttachments(prev => [...prev, uploadedAttachment]);
            }
        } catch (err) {
            console.error("Error uploading attachment:", err);
            alert("Failed to upload attachment(s).");
        } finally {
            setIsUploading(false);
        }
    }, [taskId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        noClick: true, // Disable default click behavior if using a separate button
        noKeyboard: true 
    });

    const handleDeleteAttachment = async (attachmentId) => {
        if (window.confirm("Are you sure you want to delete this attachment?")) {
            try {
                await mockApi.deleteAttachment(attachmentId);
                setAttachments(prev => prev.filter(att => att.id !== attachmentId));
            } catch (err) {
                console.error("Error deleting attachment:", err);
                alert("Failed to delete attachment.");
            }
        }
    };

    const handleDownload = (attachmentId, filePath) => {
        mockApi.downloadAttachment(attachmentId, filePath);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Dropzone Area */} 
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-4 transition-colors duration-200 ease-in-out ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/50"}`}
                    onClick={triggerFileInput} // Trigger file input on click
                >
                    <input {...getInputProps()} ref={fileInputRef} style={{ display: "none" }} />
                    <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    {isUploading ? (
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    ) : isDragActive ? (
                        <p className="text-sm text-primary">Drop the files here ...</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">Drag & drop files here, or <span className="text-primary font-medium">click to browse</span></p>
                    )}
                </div>

                {/* Attachments List */} 
                {isLoading && <div className="text-center p-4">Loading attachments...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && attachments.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">No attachments uploaded yet.</div>
                )}
                {!isLoading && !error && attachments.length > 0 && (
                    <div className="mt-4 border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead> {/* Icon */} 
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Uploaded By</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attachments.map((att) => (
                                    <TableRow key={att.id}>
                                        <TableCell>{getFileIcon(att.fileType)}</TableCell>
                                        <TableCell className="font-medium break-all">{att.fileName}</TableCell>
                                        <TableCell>{formatFileSize(att.fileSize)}</TableCell>
                                        <TableCell>{att.uploadedBy?.name || "Unknown"}</TableCell>
                                        <TableCell>{att.uploadedAt ? format(new Date(att.uploadedAt), "PP pp") : "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownload(att.id, att.filePath)} title="Download">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteAttachment(att.id)} title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TaskAttachmentsSection;

