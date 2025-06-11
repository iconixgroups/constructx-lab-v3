import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Trash2, UserPlus, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "./ui/dialog";

// Mock API (replace with actual API calls)
const mockApi = {
    getDocumentAccess: async (docId) => {
        console.log("Fetching access controls for doc:", docId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock access list
        return [
            { id: "acc1", documentId: docId, user: { id: "user1", name: "Alice Smith", avatarUrl: "/avatars/alice.png" }, role: null, accessLevel: "Admin", grantedBy: "system", grantedAt: "2024-01-20T09:00:00Z", expiresAt: null },
            { id: "acc2", documentId: docId, user: { id: "user2", name: "Bob Johnson", avatarUrl: "/avatars/bob.png" }, role: null, accessLevel: "Edit", grantedBy: "user1", grantedAt: "2024-01-22T14:05:00Z", expiresAt: null },
            { id: "acc3", documentId: docId, user: null, role: { id: "role1", name: "Reviewers" }, accessLevel: "Comment", grantedBy: "user1", grantedAt: "2024-01-22T14:10:00Z", expiresAt: "2024-02-29T23:59:59Z" },
            { id: "acc4", documentId: docId, user: { id: "user3", name: "Charlie Davis", avatarUrl: null }, role: null, accessLevel: "View", grantedBy: "user2", grantedAt: "2024-01-23T10:00:00Z", expiresAt: null },
        ];
    },
    grantDocumentAccess: async (docId, targetType, targetId, accessLevel, expiresAt) => {
        console.log("Granting access:", { docId, targetType, targetId, accessLevel, expiresAt });
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentUser = { id: "user1", name: "Alice Smith" }; // Mock granter
        const targetUser = targetType === "user" ? { id: targetId, name: `User ${targetId}`, avatarUrl: null } : null;
        const targetRole = targetType === "role" ? { id: targetId, name: `Role ${targetId}` } : null;
        return {
            id: `acc_${Math.random().toString(36).substring(7)}`,
            documentId: docId,
            user: targetUser,
            role: targetRole,
            accessLevel: accessLevel,
            grantedBy: currentUser.id,
            grantedAt: new Date().toISOString(),
            expiresAt: expiresAt,
        };
    },
    updateDocumentAccess: async (accessId, accessLevel, expiresAt) => {
        console.log(`Updating access ${accessId}:`, { accessLevel, expiresAt });
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    revokeDocumentAccess: async (accessId) => {
        console.log(`Revoking access ${accessId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    getPotentialUsersAndRoles: async (projectId) => {
        console.log("Fetching potential users/roles for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            users: [
                { id: "user2", name: "Bob Johnson" },
                { id: "user3", name: "Charlie Davis" },
                { id: "user4", name: "David Lee" },
                { id: "user5", name: "Eve Williams" },
            ],
            roles: [
                { id: "role1", name: "Reviewers" },
                { id: "role2", name: "Engineers" },
                { id: "role3", name: "Contractors" },
            ],
        };
    },
};

const ACCESS_LEVELS = ["View", "Comment", "Edit", "Approve", "Admin"];

const GrantAccessDialog = ({ documentId, onAccessGranted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [potentialTargets, setPotentialTargets] = useState({ users: [], roles: [] });
    const [selectedTargetType, setSelectedTargetType] = useState("user"); // "user" or "role"
    const [selectedTargetId, setSelectedTargetId] = useState("");
    const [selectedAccessLevel, setSelectedAccessLevel] = useState("View");
    const [expiresAt, setExpiresAt] = useState(""); // Date string
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch potential users/roles when dialog opens
            mockApi.getPotentialUsersAndRoles("proj1").then(setPotentialTargets);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedTargetId || !selectedAccessLevel || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const expiryDate = expiresAt ? new Date(expiresAt).toISOString() : null;
            const newAccess = await mockApi.grantDocumentAccess(documentId, selectedTargetType, selectedTargetId, selectedAccessLevel, expiryDate);
            onAccessGranted(newAccess); // Callback to update parent state
            setIsOpen(false); // Close dialog on success
            // Reset form
            setSelectedTargetId("");
            setSelectedAccessLevel("View");
            setExpiresAt("");
        } catch (error) {
            console.error("Failed to grant access:", error);
            alert("Failed to grant access.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentTargetList = selectedTargetType === "user" ? potentialTargets.users : potentialTargets.roles;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Grant Access
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Grant Document Access</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Target Type Selection */}
                    <Select value={selectedTargetType} onValueChange={setSelectedTargetType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="role">Role</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* Target Selection */}
                    <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                        <SelectTrigger><SelectValue placeholder={`Select ${selectedTargetType}...`} /></SelectTrigger>
                        <SelectContent>
                            {currentTargetList.map(target => (
                                <SelectItem key={target.id} value={target.id}>{target.name}</SelectItem>
                            ))}
                            {currentTargetList.length === 0 && <p className="p-2 text-sm text-muted-foreground">No {selectedTargetType}s found.</p>}
                        </SelectContent>
                    </Select>

                    {/* Access Level */}
                    <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {ACCESS_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Expiration Date (Optional) */}
                    <div>
                        <label htmlFor="expiresAt" className="text-sm font-medium">Expires At (Optional)</label>
                        <Input 
                            id="expiresAt"
                            type="date" 
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={!selectedTargetId || !selectedAccessLevel || isSubmitting}>
                        {isSubmitting ? "Granting..." : "Grant Access"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AccessControlComponent = ({ documentId }) => {
    const [accessList, setAccessList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccess = useCallback(async () => {
        if (!documentId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getDocumentAccess(documentId);
            setAccessList(data);
        } catch (err) {
            console.error("Error fetching access controls:", err);
            setError("Failed to load access controls.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchAccess();
    }, [fetchAccess]);

    const handleAccessGranted = (newAccess) => {
        setAccessList(prev => [...prev, newAccess]);
    };

    const handleRevokeAccess = async (accessId) => {
        if (window.confirm("Are you sure you want to revoke this access?")) {
            try {
                await mockApi.revokeDocumentAccess(accessId);
                setAccessList(prev => prev.filter(acc => acc.id !== accessId));
            } catch (error) {
                console.error("Failed to revoke access:", error);
                alert("Failed to revoke access.");
            }
        }
    };

    const handleUpdateAccess = async (accessId, newLevel, newExpiry) => {
        try {
            await mockApi.updateDocumentAccess(accessId, newLevel, newExpiry);
            // Refetch or update local state
            fetchAccess(); 
        } catch (error) {
            console.error("Failed to update access:", error);
            alert("Failed to update access.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Access Control</h3>
                <GrantAccessDialog documentId={documentId} onAccessGranted={handleAccessGranted} />
            </div>

            {isLoading ? (
                <div className="text-center p-4">Loading access list...</div>
            ) : error ? (
                <div className="text-center p-4 text-red-500">Error: {error}</div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User / Role</TableHead>
                                <TableHead>Access Level</TableHead>
                                <TableHead>Expires At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accessList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No specific access rules defined.</TableCell>
                                </TableRow>
                            )}
                            {accessList.map(acc => (
                                <TableRow key={acc.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {acc.user ? (
                                                <>
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={acc.user.avatarUrl} alt={acc.user.name} />
                                                        <AvatarFallback>{acc.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{acc.user.name}</span>
                                                </>
                                            ) : acc.role ? (
                                                <>
                                                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{acc.role.name} (Role)</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Unknown</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {/* Inline edit or use a dropdown for updating */}
                                        <Select 
                                            value={acc.accessLevel} 
                                            onValueChange={(newLevel) => handleUpdateAccess(acc.id, newLevel, acc.expiresAt)}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {ACCESS_LEVELS.map(level => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {/* Inline edit for expiry or use a date picker */} 
                                        {acc.expiresAt ? format(new Date(acc.expiresAt), "PP") : "Never"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* Prevent revoking own admin access? Add logic */} 
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 text-destructive" 
                                            title="Revoke Access"
                                            onClick={() => handleRevokeAccess(acc.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default AccessControlComponent;

