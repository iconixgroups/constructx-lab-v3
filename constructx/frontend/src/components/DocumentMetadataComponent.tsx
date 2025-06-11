import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { format } from "date-fns";
import { Save, Edit, X } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    updateDocumentMetadata: async (docId, metadata) => {
        console.log(`Updating metadata for doc ${docId}:`, metadata);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Return the updated document or just success
        return { success: true, updatedAt: new Date().toISOString() };
    },
    getDocumentCategories: async () => ["Drawing", "Specification", "Contract", "Permit", "Report", "Calculation", "Presentation", "Other"],
    // Assume function to get custom metadata fields definition if needed
};

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const MetadataField = ({ label, value, isEditing, onChange, inputType = "text", options = [] }) => {
    if (!isEditing) {
        return (
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground col-span-1">{label}</span>
                <span className="text-sm col-span-2 break-words">{value || "-"}</span>
            </div>
        );
    }

    // Render editable field
    return (
        <div className="grid grid-cols-3 gap-2 py-2 border-b items-center">
            <label htmlFor={`metadata-${label}`} className="text-sm font-medium text-muted-foreground col-span-1">{label}</label>
            <div className="col-span-2">
                {inputType === "textarea" ? (
                    <Textarea id={`metadata-${label}`} value={value || ""} onChange={onChange} rows={2} className="text-sm" />
                ) : inputType === "select" ? (
                    <Select value={value || ""} onValueChange={(val) => onChange({ target: { value: val } })}> {/* Adapt onChange for Select */} 
                        <SelectTrigger id={`metadata-${label}`} className="text-sm h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input id={`metadata-${label}`} type={inputType} value={value || ""} onChange={onChange} className="text-sm h-8" />
                )}
            </div>
        </div>
    );
};

const DocumentMetadataComponent = ({ document, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableMetadata, setEditableMetadata] = useState({});
    const [categories, setCategories] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize editable state when document changes or editing starts
    useEffect(() => {
        if (document) {
            setEditableMetadata({
                name: document.name,
                description: document.description,
                category: document.category,
                tags: document.tags?.join(", ") || "",
                // Add custom metadata fields here if applicable
            });
        }
    }, [document]);

    // Fetch categories
    useEffect(() => {
        mockApi.getDocumentCategories().then(setCategories);
    }, []);

    const handleInputChange = (e, fieldName) => {
        const { value } = e.target;
        setEditableMetadata(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSelectChange = (value, fieldName) => {
        setEditableMetadata(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const metadataToSave = {
                ...editableMetadata,
                tags: editableMetadata.tags.split(",").map(tag => tag.trim()).filter(tag => tag), // Process tags
            };
            await mockApi.updateDocumentMetadata(document.id, metadataToSave);
            setIsEditing(false);
            onUpdate(); // Trigger parent component to refetch document details
        } catch (error) {
            console.error("Failed to update metadata:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset editable state to original document values
        setEditableMetadata({
            name: document.name,
            description: document.description,
            category: document.category,
            tags: document.tags?.join(", ") || "",
        });
        setIsEditing(false);
    };

    if (!document) {
        return <div>No document data available.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Document Details</h3>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Metadata
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="border rounded-md p-4">
                <MetadataField 
                    label="File Name" 
                    value={editableMetadata.name} 
                    isEditing={isEditing} 
                    onChange={(e) => handleInputChange(e, "name")} 
                />
                <MetadataField 
                    label="Description" 
                    value={editableMetadata.description} 
                    isEditing={isEditing} 
                    onChange={(e) => handleInputChange(e, "description")} 
                    inputType="textarea"
                />
                <MetadataField 
                    label="Category" 
                    value={editableMetadata.category} 
                    isEditing={isEditing} 
                    onChange={(val) => handleSelectChange(val, "category")} 
                    inputType="select"
                    options={categories}
                />
                <MetadataField 
                    label="Tags" 
                    value={editableMetadata.tags} 
                    isEditing={isEditing} 
                    onChange={(e) => handleInputChange(e, "tags")} 
                />
                {/* Static Fields (Not Editable Here) */} 
                <MetadataField label="File Size" value={formatFileSize(document.fileSize)} isEditing={false} />
                <MetadataField label="File Type" value={document.fileType} isEditing={false} />
                <MetadataField label="Created By" value={document.createdBy} isEditing={false} /> {/* Replace with user name */} 
                <MetadataField label="Created At" value={format(new Date(document.createdAt), "PP pp")} isEditing={false} />
                <MetadataField label="Last Updated" value={format(new Date(document.updatedAt), "PP pp")} isEditing={false} />
                {/* Add custom metadata fields here */} 
            </div>
        </div>
    );
};

export default DocumentMetadataComponent;

