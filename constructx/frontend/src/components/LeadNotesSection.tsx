import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getLeadNotes: async (leadId) => {
        console.log("Fetching notes for lead:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: "note1", leadId: leadId, content: "Client mentioned budget constraints. Need to adjust proposal.", createdBy: { id: "user1", name: "Alice Smith" }, createdAt: "2024-05-28T14:00:00Z", updatedAt: "2024-05-28T14:05:00Z" },
            { id: "note2", leadId: leadId, content: "Follow up scheduled for next Tuesday.", createdBy: { id: "user2", name: "Bob Johnson" }, createdAt: "2024-05-29T10:00:00Z", updatedAt: "2024-05-29T10:00:00Z" },
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending
    },
    addLeadNote: async (leadId, noteData) => {
        console.log("Adding note:", leadId, noteData);
        await new Promise(resolve => setTimeout(resolve, 300));
        const now = new Date().toISOString();
        return { ...noteData, id: `note${Math.random().toString(36).substring(7)}`, leadId: leadId, createdAt: now, updatedAt: now, createdBy: { id: "currentUser", name: "Current User" } };
    },
    updateLeadNote: async (noteId, noteData) => {
        console.log("Updating note:", noteId, noteData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...noteData, id: noteId, updatedAt: new Date().toISOString() };
    },
    deleteLeadNote: async (noteId) => {
        console.log("Deleting note:", noteId);
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

const LeadNotesSection = ({ leadId }) => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [editingNote, setEditingNote] = useState(null); // { id: string, content: string }

    useEffect(() => {
        const fetchNotes = async () => {
            if (!leadId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await mockApi.getLeadNotes(leadId);
                setNotes(data);
            } catch (err) {
                console.error("Error fetching notes:", err);
                setError("Failed to load notes.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotes();
    }, [leadId]);

    const handleAddNote = async () => {
        if (!newNoteContent.trim()) {
            alert("Note content cannot be empty.");
            return;
        }
        try {
            const addedNote = await mockApi.addLeadNote(leadId, { content: newNoteContent });
            setNotes([addedNote, ...notes]);
            setNewNoteContent("");
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding note:", err);
            alert("Failed to add note.");
        }
    };

    const handleUpdateNote = async () => {
        if (!editingNote || !editingNote.content.trim()) {
            alert("Note content cannot be empty.");
            return;
        }
        try {
            const updatedNoteData = await mockApi.updateLeadNote(editingNote.id, { content: editingNote.content });
            setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...updatedNoteData } : n));
            setEditingNote(null);
        } catch (err) {
            console.error("Error updating note:", err);
            alert("Failed to update note.");
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                await mockApi.deleteLeadNote(noteId);
                setNotes(prev => prev.filter(n => n.id !== noteId));
            } catch (err) {
                console.error("Error deleting note:", err);
                alert("Failed to delete note.");
            }
        }
    };

    const startEditing = (note) => {
        setEditingNote({ id: note.id, content: note.content });
        setShowAddForm(false); // Close add form if open
    };

    const cancelEditing = () => {
        setEditingNote(null);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notes</CardTitle>
                {!editingNote && (
                    <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? "Cancel" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Note</>}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <div className="mb-4 p-4 border rounded-lg space-y-2">
                        <Textarea
                            placeholder="Add a new note..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                        </div>
                    </div>
                )}

                {isLoading && <div className="text-center">Loading notes...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!isLoading && !error && notes.length === 0 && !showAddForm && (
                    <div className="text-center text-muted-foreground">No notes added yet.</div>
                )}
                {!isLoading && !error && notes.length > 0 && (
                    <div className="space-y-4">
                        {notes.map(note => (
                            <div key={note.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <Avatar className="h-8 w-8 border">
                                    {/* <AvatarImage src={note.createdBy?.avatarUrl} /> */}
                                    <AvatarFallback className="text-xs">{getInitials(note.createdBy?.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-muted-foreground">
                                            {note.createdBy?.name || "Unknown User"} - {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                            {note.createdAt !== note.updatedAt && " (edited)"}
                                        </span>
                                        {editingNote?.id !== note.id && (
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(note)} title="Edit">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteNote(note.id)} title="Delete">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {editingNote?.id === note.id ? (
                                        <div className="space-y-2 mt-1">
                                            <Textarea
                                                value={editingNote.content}
                                                onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                                                rows={3}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={cancelEditing}>Cancel</Button>
                                                <Button size="sm" onClick={handleUpdateNote}>Save Changes</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{note.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LeadNotesSection;

