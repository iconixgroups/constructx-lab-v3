import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Check, X, Clock, Send, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "./ui/dialog";

// Mock API (replace with actual API calls)
const mockApi = {
    getDocumentApprovals: async (docId, versionId) => {
        console.log("Fetching approvals for doc:", docId, "version:", versionId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock approvals
        return [
            { id: "appr1", documentId: docId, versionId: versionId, approver: { id: "user2", name: "Bob Johnson", avatarUrl: "/avatars/bob.png" }, status: "Approved", comments: "Looks good.", requestedAt: "2024-01-22T10:00:00Z", respondedAt: "2024-01-22T13:50:00Z" },
            { id: "appr2", documentId: docId, versionId: versionId, approver: { id: "user3", name: "Charlie Davis", avatarUrl: null }, status: "Pending", comments: null, requestedAt: "2024-01-22T10:00:00Z", respondedAt: null },
            { id: "appr3", documentId: docId, versionId: "v2", approver: { id: "user2", name: "Bob Johnson", avatarUrl: "/avatars/bob.png" }, status: "Rejected", comments: "Needs clarification on page 5.", requestedAt: "2024-01-21T09:00:00Z", respondedAt: "2024-01-21T10:40:00Z" }, // Example for a previous version
        ].filter(appr => appr.versionId === versionId); // Filter for the specific version
    },
    requestDocumentApproval: async (docId, versionId, approverIds, message) => {
        console.log("Requesting approval:", { docId, versionId, approverIds, message });
        await new Promise(resolve => setTimeout(resolve, 500));
        // Return mock new pending approvals
        const currentUser = { id: "user1", name: "Alice Smith" };
        return approverIds.map(approverId => ({
            id: `appr_${Math.random().toString(36).substring(7)}`,
            documentId: docId,
            versionId: versionId,
            approver: { id: approverId, name: `User ${approverId}`, avatarUrl: null }, // Fetch real user details
            status: "Pending",
            comments: null,
            requestedAt: new Date().toISOString(),
            respondedAt: null,
        }));
    },
    respondToApproval: async (approvalId, status, comments) => {
        console.log("Responding to approval:", { approvalId, status, comments });
        await new Promise(resolve => setTimeout(resolve, 400));
        return { success: true, respondedAt: new Date().toISOString() };
    },
    getPotentialApprovers: async (projectId) => {
        console.log("Fetching potential approvers for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 200));
        return [
            { id: "user2", name: "Bob Johnson" },
            { id: "user3", name: "Charlie Davis" },
            { id: "user5", name: "Eve Williams" },
        ];
    },
};

// Helper function to determine badge variant based on status
const getApprovalStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "approved": return "success";
        case "pending": return "warning";
        case "rejected": return "destructive";
        case "revise": return "info"; // Assuming a revise status
        default: return "secondary";
    }
};

// Helper function to get status icon
const getApprovalStatusIcon = (status) => {
    const iconProps = { className: "h-4 w-4 mr-1" };
    switch (status?.toLowerCase()) {
        case "approved": return <Check {...iconProps} />; 
        case "pending": return <Clock {...iconProps} />;
        case "rejected": return <X {...iconProps} />;
        case "revise": return <Edit {...iconProps} />;
        default: return null;
    }
};

const ApprovalRequestDialog = ({ documentId, documentVersionId, onApprovalRequested }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [potentialApprovers, setPotentialApprovers] = useState([]);
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch potential approvers when dialog opens
            // Assuming projectId is available or derivable
            mockApi.getPotentialApprovers("proj1").then(setPotentialApprovers);
        }
    }, [isOpen]);

    const handleSelectApprover = (approverId) => {
        setSelectedApprovers(prev => 
            prev.includes(approverId) 
                ? prev.filter(id => id !== approverId) 
                : [...prev, approverId]
        );
    };

    const handleSubmit = async () => {
        if (selectedApprovers.length === 0 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const newApprovals = await mockApi.requestDocumentApproval(documentId, documentVersionId, selectedApprovers, message);
            onApprovalRequested(newApprovals); // Callback to update parent state
            setIsOpen(false); // Close dialog on success
            setSelectedApprovers([]);
            setMessage("");
        } catch (error) {
            console.error("Failed to request approval:", error);
            alert("Failed to request approval.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Send className="mr-2 h-4 w-4" /> Request Approval
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Request Document Approval</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Select Approvers</label>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                            {potentialApprovers.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <span>{user.name}</span>
                                    <Button 
                                        variant={selectedApprovers.includes(user.id) ? "secondary" : "outline"} 
                                        size="xs"
                                        onClick={() => handleSelectApprover(user.id)}
                                    >
                                        {selectedApprovers.includes(user.id) ? "Selected" : "Select"}
                                    </Button>
                                </div>
                            ))}
                            {potentialApprovers.length === 0 && <p className="text-sm text-muted-foreground">No potential approvers found.</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="approvalMessage" className="text-sm font-medium">Message (Optional)</label>
                        <Textarea 
                            id="approvalMessage"
                            placeholder="Add a message for the approvers..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={selectedApprovers.length === 0 || isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ApprovalWorkflowComponent = ({ documentId, documentVersionId }) => {
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = { id: "user3" }; // Mock current user ID for response check

    const fetchApprovals = useCallback(async () => {
        if (!documentId || !documentVersionId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getDocumentApprovals(documentId, documentVersionId);
            setApprovals(data);
        } catch (err) {
            console.error("Error fetching approvals:", err);
            setError("Failed to load approval status.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId, documentVersionId]);

    useEffect(() => {
        fetchApprovals();
    }, [fetchApprovals]);

    const handleApprovalRequested = (newApprovals) => {
        setApprovals(prev => [...prev, ...newApprovals]);
    };

    const handleRespond = async (approvalId, status, comments) => {
        try {
            await mockApi.respondToApproval(approvalId, status, comments);
            // Refetch or update local state
            fetchApprovals(); 
        } catch (error) {
            console.error("Failed to respond to approval:", error);
            alert("Failed to submit response.");
        }
    };

    // Component to handle response input (could be a modal or inline form)
    const RespondForm = ({ approvalId }) => {
        const [responseStatus, setResponseStatus] = useState("Approved");
        const [responseComments, setResponseComments] = useState("");
        const [isResponding, setIsResponding] = useState(false);

        const submitResponse = async () => {
            setIsResponding(true);
            await handleRespond(approvalId, responseStatus, responseComments);
            setIsResponding(false);
            // Optionally close a modal here
        };

        return (
            <div className="mt-2 p-3 border rounded-md bg-muted/30 space-y-2">
                <Select value={responseStatus} onValueChange={setResponseStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Approved">Approve</SelectItem>
                        <SelectItem value="Rejected">Reject</SelectItem>
                        <SelectItem value="Revise">Request Revision</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea 
                    placeholder="Add comments (optional)" 
                    value={responseComments}
                    onChange={(e) => setResponseComments(e.target.value)}
                    rows={2}
                />
                <Button size="sm" onClick={submitResponse} disabled={isResponding}>
                    {isResponding ? "Submitting..." : "Submit Response"}
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Approval Status</h3>
                <ApprovalRequestDialog 
                    documentId={documentId} 
                    documentVersionId={documentVersionId} 
                    onApprovalRequested={handleApprovalRequested} 
                />
            </div>

            {isLoading ? (
                <div className="text-center p-4">Loading approval status...</div>
            ) : error ? (
                <div className="text-center p-4 text-red-500">Error: {error}</div>
            ) : approvals.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">No approval requests found for this version.</div>
            ) : (
                <div className="space-y-3">
                    {approvals.map(approval => (
                        <div key={approval.id} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={approval.approver.avatarUrl} alt={approval.approver.name} />
                                <AvatarFallback>{approval.approver.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{approval.approver.name}</span>
                                    <Badge variant={getApprovalStatusBadgeVariant(approval.status)}>
                                        {getApprovalStatusIcon(approval.status)}
                                        {approval.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Requested on {format(new Date(approval.requestedAt), "PP pp")}
                                    {approval.respondedAt && `, Responded on ${format(new Date(approval.respondedAt), "PP pp")}`}
                                </p>
                                {approval.comments && (
                                    <p className="mt-1 text-sm italic bg-muted/40 p-2 rounded-md">"{approval.comments}"</p>
                                )}
                                {/* Show response form if pending and current user is the approver */} 
                                {approval.status === "Pending" && approval.approver.id === currentUser.id && (
                                    <RespondForm approvalId={approval.id} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalWorkflowComponent;

