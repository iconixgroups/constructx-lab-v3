import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock, Mail, Phone, StickyNote, CheckSquare, Calendar, FileText, User } from "lucide-react";
import { format } from "date-fns";

// Mock API (replace with actual API calls)
const mockApi = {
    getLeadActivities: async (leadId) => {
        console.log("Fetching activities for lead:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: "act1", type: "Email", title: "Sent initial proposal", description: "Emailed the v1 proposal document.", performedBy: { id: "user1", name: "Alice Smith" }, performedAt: "2024-05-30T16:45:00Z", documentId: "doc10" },
            { id: "act2", type: "Meeting", title: "Discovery Call", description: "Discussed project requirements and scope.", performedBy: { id: "user2", name: "Bob Johnson" }, performedAt: "2024-05-29T09:15:00Z" },
            { id: "act3", type: "Note", title: "Internal Follow-up", description: "Need to check resource availability.", performedBy: { id: "user1", name: "Alice Smith" }, performedAt: "2024-05-28T14:00:00Z" },
            { id: "act4", type: "Call", title: "Initial Contact", description: "Brief introductory call.", performedBy: { id: "user2", name: "Bob Johnson" }, performedAt: "2024-05-26T10:30:00Z", outcome: "Scheduled discovery call" },
            { id: "act5", type: "Task", title: "Prepare Proposal", description: "Draft proposal based on discovery call.", performedBy: { id: "user1", name: "Alice Smith" }, scheduledAt: "2024-05-31T09:00:00Z", status: "Pending" }, // Example scheduled task
        ].sort((a, b) => new Date(b.performedAt || b.scheduledAt) - new Date(a.performedAt || a.scheduledAt)); // Sort descending
    },
    addLeadActivity: async (leadId, activityData) => {
        console.log("Adding activity for lead:", leadId, activityData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...activityData, id: `act${Math.random().toString(36).substring(7)}`, performedAt: new Date().toISOString(), performedBy: { id: "currentUser", name: "Current User" } }; // Mock response
    },
    getActivityTypes: async () => ["Call", "Email", "Meeting", "Note", "Task", "Document"],
};

// Helper to get initials
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
};

// Map activity types to icons
const activityIcons = {
    Call: <Phone className="h-4 w-4" />,
    Email: <Mail className="h-4 w-4" />,
    Meeting: <Users className="h-4 w-4" />,
    Note: <StickyNote className="h-4 w-4" />,
    Task: <CheckSquare className="h-4 w-4" />,
    Document: <FileText className="h-4 w-4" />,
    Default: <Activity className="h-4 w-4" />,
};

const LeadActivityTimeline = ({ leadId }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newActivityType, setNewActivityType] = useState("Note");
    const [newActivityDescription, setNewActivityDescription] = useState("");
    const [activityTypes, setActivityTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!leadId) return;
            setIsLoading(true);
            setError(null);
            try {
                const [fetchedActivities, fetchedTypes] = await Promise.all([
                    mockApi.getLeadActivities(leadId),
                    mockApi.getActivityTypes(),
                ]);
                setActivities(fetchedActivities);
                setActivityTypes(fetchedTypes);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError("Failed to load activities.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [leadId]);

    const handleAddActivity = async () => {
        if (!newActivityDescription.trim()) {
            alert("Please enter a description for the activity.");
            return;
        }
        try {
            const activityData = {
                type: newActivityType,
                description: newActivityDescription,
                // Add title or other fields based on type if needed
            };
            const addedActivity = await mockApi.addLeadActivity(leadId, activityData);
            setActivities([addedActivity, ...activities]); // Add to the top
            setNewActivityDescription("");
            setNewActivityType("Note");
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding activity:", err);
            alert("Failed to add activity.");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activity Timeline</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Cancel" : "Log Activity"}
                </Button>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <div className="mb-4 p-4 border rounded-lg space-y-2">
                        <Select value={newActivityType} onValueChange={setNewActivityType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select activity type" />
                            </SelectTrigger>
                            <SelectContent>
                                {activityTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            placeholder={`Add a ${newActivityType.toLowerCase()}...`}
                            value={newActivityDescription}
                            onChange={(e) => setNewActivityDescription(e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <Button size="sm" onClick={handleAddActivity}>Save Activity</Button>
                        </div>
                    </div>
                )}

                {isLoading && <div className="text-center">Loading activities...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!isLoading && !error && activities.length === 0 && (
                    <div className="text-center text-muted-foreground">No activities logged yet.</div>
                )}
                {!isLoading && !error && activities.length > 0 && (
                    <div className="space-y-6">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                                        {activityIcons[activity.type] || activityIcons.Default}
                                    </span>
                                    {/* Optional: Add a line connecting dots */}
                                    {/* <div className="flex-grow w-px bg-border my-1"></div> */}
                                </div>
                                <div className="flex-grow pb-6 border-b last:border-b-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-medium text-sm">{activity.title || activity.type}</span>
                                            <span className="text-xs text-muted-foreground ml-2">by {activity.performedBy?.name || "Unknown User"}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {format(new Date(activity.performedAt || activity.scheduledAt), "PPp")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                    {activity.outcome && <p className="text-xs mt-1">Outcome: {activity.outcome}</p>}
                                    {activity.status && activity.type === "Task" && <p className="text-xs mt-1">Status: <Badge variant="secondary">{activity.status}</Badge></p>}
                                    {/* Add link to document if documentId exists */} 
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LeadActivityTimeline;

