import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlusCircle, Trash2, Edit } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getProjectMembers: async (projectId) => {
        console.log("Fetching members for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock members if initialMembers aren't provided or need refresh
        return [
            { id: "pm1", projectId: projectId, userId: "user1", user: { id: "user1", name: "Alice Smith", email: "alice@example.com", avatarUrl: null }, role: "Project Manager", joinedAt: "2024-01-10T09:00:00Z" },
            { id: "pm2", projectId: projectId, userId: "user3", user: { id: "user3", name: "Charlie Brown", email: "charlie@example.com", avatarUrl: null }, role: "Engineer", joinedAt: "2024-01-15T10:00:00Z" },
            { id: "pm3", projectId: projectId, userId: "user4", user: { id: "user4", name: "Diana Prince", email: "diana@example.com", avatarUrl: null }, role: "Superintendent", joinedAt: "2024-02-01T11:00:00Z" },
        ];
    },
    getAvailableUsers: async (projectId) => {
        // Fetch users not already on the project
        console.log("Fetching available users for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 200));
        return [
            { id: "user2", name: "Bob Johnson" },
            { id: "user5", name: "Eve Adams" },
        ];
    },
    getProjectRoles: async () => {
        return ["Project Manager", "Superintendent", "Engineer", "Foreman", "Estimator", "Admin", "Viewer"];
    },
    addProjectMember: async (projectId, memberData) => {
        console.log("Adding member:", projectId, memberData);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Find user details for the added member
        const users = [
            { id: "user1", name: "Alice Smith", email: "alice@example.com", avatarUrl: null },
            { id: "user2", name: "Bob Johnson", email: "bob@example.com", avatarUrl: null },
            { id: "user3", name: "Charlie Brown", email: "charlie@example.com", avatarUrl: null },
            { id: "user4", name: "Diana Prince", email: "diana@example.com", avatarUrl: null },
            { id: "user5", name: "Eve Adams", email: "eve@example.com", avatarUrl: null },
        ];
        const user = users.find(u => u.id === memberData.userId);
        return { ...memberData, id: `pm${Math.random().toString(36).substring(7)}`, projectId: projectId, user: user, joinedAt: new Date().toISOString() };
    },
    updateProjectMember: async (memberId, memberData) => {
        console.log("Updating member:", memberId, memberData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...memberData, id: memberId }; // Return updated data (role)
    },
    removeProjectMember: async (memberId) => {
        console.log("Removing member:", memberId);
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

const MemberForm = ({ member, onSave, onCancel, availableUsers, roles, projectId }) => {
    const [formData, setFormData] = useState({
        userId: member?.userId || "",
        role: member?.role || "",
    });

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.userId || !formData.role) {
            alert("Please select a user and assign a role.");
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/40 mb-4">
            <h3 className="text-lg font-semibold">{member?.id ? "Edit Member Role" : "Add New Member"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="memberUserId" className="text-sm font-medium">User*</label>
                    <Select 
                        value={formData.userId} 
                        onValueChange={(value) => handleSelectChange("userId", value)} 
                        required
                        disabled={!!member?.id} // Disable user selection when editing
                    >
                        <SelectTrigger id="memberUserId"><SelectValue placeholder="Select user" /></SelectTrigger>
                        <SelectContent>
                            {member?.id && member.user && (
                                <SelectItem key={member.userId} value={member.userId}>{member.user.name}</SelectItem>
                            )}
                            {!member?.id && availableUsers.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="memberRole" className="text-sm font-medium">Role*</label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)} required>
                        <SelectTrigger id="memberRole"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                            {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* Add permissions configuration here if needed */}
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{member?.id ? "Save Changes" : "Add Member"}</Button>
            </div>
        </form>
    );
};

const ProjectTeamTab = ({ projectId, initialMembers }) => {
    const [members, setMembers] = useState(initialMembers || []);
    const [isLoading, setIsLoading] = useState(!initialMembers);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null); // Member object to edit
    const [availableUsers, setAvailableUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const fetchTeamData = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        setError(null);
        try {
            const fetchPromises = [
                mockApi.getProjectRoles(),
                mockApi.getAvailableUsers(projectId),
            ];
            // Only fetch members if not provided initially
            if (!initialMembers) {
                fetchPromises.unshift(mockApi.getProjectMembers(projectId));
            }
            
            const results = await Promise.all(fetchPromises);

            let fetchedMembers = initialMembers;
            let fetchedRoles;
            let fetchedAvailableUsers;

            if (!initialMembers) {
                fetchedMembers = results[0];
                fetchedRoles = results[1];
                fetchedAvailableUsers = results[2];
            } else {
                fetchedRoles = results[0];
                fetchedAvailableUsers = results[1];
            }

            setMembers(fetchedMembers || []);
            setRoles(fetchedRoles || []);
            setAvailableUsers(fetchedAvailableUsers || []);

        } catch (err) {
            console.error("Error fetching team data:", err);
            setError("Failed to load team data.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId, initialMembers]);

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    const handleAddMember = async (memberData) => {
        try {
            const addedMember = await mockApi.addProjectMember(projectId, memberData);
            setMembers([...members, addedMember]);
            // Refresh available users
            setAvailableUsers(prev => prev.filter(u => u.id !== addedMember.userId));
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding member:", err);
            alert("Failed to add member.");
        }
    };

    const handleUpdateMember = async (memberData) => {
        if (!editingMember) return;
        try {
            const updatedMember = await mockApi.updateProjectMember(editingMember.id, memberData);
            setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...updatedMember } : m));
            setEditingMember(null);
        } catch (err) {
            console.error("Error updating member:", err);
            alert("Failed to update member role.");
        }
    };

    const handleRemoveMember = async (memberId, userId) => {
        if (window.confirm("Are you sure you want to remove this member from the project?")) {
            try {
                await mockApi.removeProjectMember(memberId);
                const removedMember = members.find(m => m.id === memberId);
                setMembers(members.filter(m => m.id !== memberId));
                // Add user back to available users if they exist
                if (removedMember?.user) {
                    setAvailableUsers(prev => [...prev, { id: removedMember.user.id, name: removedMember.user.name }])
                }
            } catch (err) {
                console.error("Error removing member:", err);
                alert("Failed to remove member.");
            }
        }
    };

    const startEditing = (member) => {
        setEditingMember(member);
        setShowAddForm(false); // Close add form if open
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Team</CardTitle>
                <Button size="sm" variant="outline" onClick={() => { setShowAddForm(!showAddForm); setEditingMember(null); }}>
                    {showAddForm ? "Cancel" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Member</>}
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && <MemberForm onSave={handleAddMember} onCancel={() => setShowAddForm(false)} availableUsers={availableUsers} roles={roles} projectId={projectId} />}
                {editingMember && <MemberForm member={editingMember} onSave={handleUpdateMember} onCancel={() => setEditingMember(null)} availableUsers={availableUsers} roles={roles} projectId={projectId} />}

                {isLoading && <div className="text-center p-4">Loading team members...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && members.length === 0 && !showAddForm && !editingMember && (
                    <div className="text-center p-8 text-muted-foreground">No team members assigned yet.</div>
                )}

                {!isLoading && !error && members.length > 0 && (
                    <div className="mt-4 border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8 border">
                                                    <AvatarImage src={member.user?.avatarUrl} />
                                                    <AvatarFallback>{getInitials(member.user?.name)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.user?.name || "Unknown User"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.user?.email || "N/A"}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(member)} title="Edit Role">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveMember(member.id, member.userId)} title="Remove Member">
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
                {/* Placeholder for Team Org Chart */} 
                 <div className="mt-6 p-4 border rounded-lg text-center text-muted-foreground">
                    Team Organization Chart placeholder.
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectTeamTab;

