import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Send, Edit, Trash2 } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getTaskComments: async (taskId) => {
        console.log("Fetching comments for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock comments
        return [
            { id: "cmt1", taskId: taskId, content: "Initial thoughts on the plan look good. Let me know if you need input on the structural calculations.", createdBy: { id: "user3", name: "Charlie Brown", avatarUrl: null }, createdAt: "2024-02-01T14:00:00Z", updatedAt: "2024-02-01T14:00:00Z" },
            { id: "cmt2", taskId: taskId, content: "@Charlie Brown Thanks! Will reach out next week once the draft is ready.", createdBy: { id: "user1", name: "Alice Smith", avatarUrl: null }, createdAt: "2024-02-01T16:30:00Z", updatedAt: "2024-02-01T16:30:00Z" },
            { id: "cmt3", taskId: taskId, content: "Just checking in on the status of this task.", createdBy: { id: "user2", name: "Bob Johnson", avatarUrl: null }, createdAt: "2024-02-08T10:00:00Z", updatedAt: "2024-02-08T10:00:00Z" },
        ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    addComment: async (taskId, commentData) => {
        console.log("Adding comment:", taskId, commentData);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Assume currentUser is available (e.g., from context)
        const currentUser = { id: "user1", name: "Alice Smith", avatarUrl: null }; 
        return { 
            ...commentData, 
            id: `cmt${Math.random().toString(36).substring(7)}`, 
            taskId: taskId, 
            createdBy: currentUser, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },
    updateComment: async (commentId, commentData) => {
        console.log("Updating comment:", commentId, commentData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...commentData, id: commentId, updatedAt: new Date().toISOString() };
    },
    deleteComment: async (commentId) => {
        console.log("Deleting comment:", commentId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
};

// Helper to get initials
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
};

const TaskCommentsSection = ({ taskId, initialComments }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [isLoading, setIsLoading] = useState(!initialComments);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null); // { id: string, content: string }
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Assume currentUser is available (replace with actual context/auth logic)
    const currentUser = { id: "user1", name: "Alice Smith" };

    const fetchComments = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getTaskComments(taskId);
            setComments(data);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to load comments.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        if (!initialComments) {
            fetchComments();
        }
    }, [taskId, initialComments, fetchComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const addedComment = await mockApi.addComment(taskId, { content: newComment });
            setComments([...comments, addedComment]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            alert("Failed to add comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingComment || !editingComment.content.trim()) return;
        setIsSubmitting(true);
        try {
            const updatedData = { content: editingComment.content };
            await mockApi.updateComment(editingComment.id, updatedData);
            setComments(comments.map(c => c.id === editingComment.id ? { ...c, ...updatedData, updatedAt: new Date().toISOString() } : c));
            setEditingComment(null);
        } catch (err) {
            console.error("Error updating comment:", err);
            alert("Failed to update comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await mockApi.deleteComment(commentId);
                setComments(comments.filter(c => c.id !== commentId));
            } catch (err) {
                console.error("Error deleting comment:", err);
                alert("Failed to delete comment.");
            }
        }
    };

    const startEditing = (comment) => {
        setEditingComment({ id: comment.id, content: comment.content });
    };

    const cancelEditing = () => {
        setEditingComment(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Comment Input Area */}
                <div className="flex gap-2 items-start">
                    <Avatar className="h-8 w-8 border mt-1">
                        {/* Replace with actual current user avatar */}
                        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow space-y-2">
                        <Textarea
                            placeholder="Add a comment... (mention users with @)"
                            value={editingComment ? editingComment.content : newComment}
                            onChange={(e) => editingComment ? setEditingComment({ ...editingComment, content: e.target.value }) : setNewComment(e.target.value)}
                            rows={editingComment ? 4 : 2}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end gap-2">
                            {editingComment && (
                                <Button variant="outline" size="sm" onClick={cancelEditing} disabled={isSubmitting}>Cancel</Button>
                            )}
                            <Button 
                                size="sm" 
                                onClick={editingComment ? handleUpdateComment : handleAddComment} 
                                disabled={isSubmitting || (editingComment ? !editingComment.content.trim() : !newComment.trim())}
                            >
                                {isSubmitting ? "Submitting..." : (editingComment ? "Save Changes" : <><Send className="mr-1 h-4 w-4" /> Comment</>)}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pt-4 border-t">
                    {isLoading && <div className="text-center p-4">Loading comments...</div>}
                    {error && <div className="text-center p-4 text-red-500">{error}</div>}
                    {!isLoading && !error && comments.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">No comments yet.</div>
                    )}
                    {!isLoading && !error && comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 items-start">
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={comment.createdBy?.avatarUrl} />
                                <AvatarFallback>{getInitials(comment.createdBy?.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow bg-muted/30 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{comment.createdBy?.name || "Unknown User"}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            {comment.createdAt !== comment.updatedAt && " (edited)"}
                                        </span>
                                        {/* Show edit/delete only for the comment author */}
                                        {comment.createdBy?.id === currentUser.id && !editingComment && (
                                            <>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(comment)} title="Edit">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteComment(comment.id)} title="Delete">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCommentsSection;

