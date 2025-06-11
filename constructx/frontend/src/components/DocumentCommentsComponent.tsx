import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Send, Edit, Trash2 } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getDocumentComments: async (docId) => {
        console.log("Fetching comments for document:", docId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock comments
        return [
            { id: "cmt1", documentId: docId, versionId: "v3", content: "Looks good, approved.", position: null, createdBy: { id: "user2", name: "Bob Johnson", avatarUrl: "/avatars/bob.png" }, createdAt: "2024-01-22T13:50:00Z", updatedAt: "2024-01-22T13:50:00Z" },
            { id: "cmt2", documentId: docId, versionId: "v2", content: "Please check the beam specification on page 5.", position: { x: 100, y: 250 }, createdBy: { id: "user3", name: "Charlie Davis", avatarUrl: null }, createdAt: "2024-01-21T10:45:00Z", updatedAt: "2024-01-21T10:45:00Z" },
            { id: "cmt3", documentId: docId, versionId: "v2", content: "Agreed, needs clarification.", position: null, createdBy: { id: "user1", name: "Alice Smith", avatarUrl: "/avatars/alice.png" }, createdAt: "2024-01-21T10:55:00Z", updatedAt: "2024-01-21T10:55:00Z" },
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort newest first
    },
    addDocumentComment: async (docId, versionId, content, position) => {
        console.log("Adding comment:", { docId, versionId, content, position });
        await new Promise(resolve => setTimeout(resolve, 400));
        const currentUser = { id: "user4", name: "David Lee", avatarUrl: "/avatars/david.png" }; // Mock current user
        return {
            id: `cmt_${Math.random().toString(36).substring(7)}`,
            documentId: docId,
            versionId: versionId, // Link to specific version if applicable
            content: content,
            position: position,
            createdBy: currentUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },
    updateDocumentComment: async (commentId, content) => {
        console.log(`Updating comment ${commentId} with content: ${content}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true, updatedAt: new Date().toISOString() };
    },
    deleteDocumentComment: async (commentId) => {
        console.log(`Deleting comment ${commentId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
};

const CommentCard = ({ comment, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const currentUser = { id: "user4" }; // Mock current user ID for edit/delete check

    const handleUpdate = async () => {
        if (!editedContent.trim()) return;
        try {
            await mockApi.updateDocumentComment(comment.id, editedContent);
            onUpdate({ ...comment, content: editedContent, updatedAt: new Date().toISOString() });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
            alert("Failed to update comment.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await mockApi.deleteDocumentComment(comment.id);
                onDelete(comment.id);
            } catch (error) {
                console.error("Failed to delete comment:", error);
                alert("Failed to delete comment.");
            }
        }
    };

    return (
        <div className="flex gap-3 py-3 border-b last:border-b-0">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.createdBy.avatarUrl} alt={comment.createdBy.name} />
                <AvatarFallback>{comment.createdBy.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{comment.createdBy.name || "Unknown User"}</span>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        {comment.updatedAt > comment.createdAt && " (edited)"}
                    </span>
                </div>
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea 
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={2}
                            className="text-sm"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleUpdate}>Save</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                )}
                {/* Show edit/delete only for the comment author */} 
                {comment.createdBy.id === currentUser.id && !isEditing && (
                    <div className="flex justify-end gap-1 mt-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={handleDelete}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
                {/* TODO: Add positioned comment indicator if comment.position exists */} 
            </div>
        </div>
    );
};

const DocumentCommentsComponent = ({ documentId, documentVersionId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);

    const fetchComments = useCallback(async () => {
        if (!documentId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getDocumentComments(documentId);
            setComments(data);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to load comments.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handlePostComment = async () => {
        if (!newComment.trim() || isPosting) return;
        setIsPosting(true);
        try {
            // Pass versionId if available, otherwise null
            const addedComment = await mockApi.addDocumentComment(documentId, documentVersionId, newComment, null);
            setComments(prev => [addedComment, ...prev]); // Add to top
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            alert("Failed to post comment.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleUpdateComment = (updatedComment) => {
        setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
    };

    const handleDeleteComment = (commentId) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    return (
        <div className="space-y-4">
            {/* New Comment Form */} 
            <div className="flex gap-3 items-start">
                <Avatar className="h-8 w-8 mt-1">
                    {/* Replace with actual current user avatar */} 
                    <AvatarImage src="/avatars/david.png" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="pr-12"
                    />
                    <Button 
                        size="icon" 
                        className="absolute right-2 bottom-2 h-8 w-8" 
                        onClick={handlePostComment}
                        disabled={!newComment.trim() || isPosting}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Comments List */} 
            <div className="border-t pt-2">
                {isLoading ? (
                    <div className="text-center p-4">Loading comments...</div>
                ) : error ? (
                    <div className="text-center p-4 text-red-500">Error: {error}</div>
                ) : comments.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">No comments yet.</div>
                ) : (
                    <div>
                        {comments.map(comment => (
                            <CommentCard 
                                key={comment.id} 
                                comment={comment} 
                                onUpdate={handleUpdateComment}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentCommentsComponent;

