import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { User, Calendar, DollarSign, Activity, Clock, AlertTriangle } from "lucide-react";

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "active": return "success";
        case "completed": return "default";
        case "planning": return "info";
        case "on hold": return "warning";
        case "cancelled": return "destructive";
        default: return "secondary";
    }
};

// Mock data for recent activity and upcoming deadlines (replace with API calls)
const mockRecentActivity = [
    { id: 1, user: "Alice Smith", action: "Updated phase: Structure", timestamp: "2024-06-02T10:30:00Z" },
    { id: 2, user: "Bob Johnson", action: "Added document: Floor Plan Rev C", timestamp: "2024-06-01T15:00:00Z" },
    { id: 3, user: "System", action: "Budget threshold nearing (85% used)", timestamp: "2024-06-01T09:00:00Z" },
];

const mockUpcomingDeadlines = [
    { id: 1, item: "Phase: Structure Completion", date: "2024-08-15" },
    { id: 2, item: "Task: Submit Permit Application", date: "2024-06-10" },
    { id: 3, item: "Milestone: Client Review Meeting", date: "2024-06-20" },
];

const mockRiskIndicators = [
    { id: 1, indicator: "Schedule Slippage Risk: High", level: "high" },
    { id: 2, indicator: "Budget Overrun Risk: Medium", level: "medium" },
    { id: 3, indicator: "Resource Availability Risk: Low", level: "low" },
];

const ProjectOverviewTab = ({ project }) => {
    if (!project) {
        return <div>Loading project overview...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Key Info & Status */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p>{project.description || "No description provided."}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Client:</strong> {project.clientId || "N/A"}</span> {/* Replace with client name */} 
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Manager:</strong> {project.projectManager?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Start Date:</strong> {project.startDate ? format(new Date(project.startDate), "PP") : "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Target Date:</strong> {project.targetCompletionDate ? format(new Date(project.targetCompletionDate), "PP") : "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Budget:</strong> {formatCurrency(project.budget)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Risk Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {mockRiskIndicators.map(risk => (
                                <li key={risk.id} className="flex items-center gap-2">
                                    <AlertTriangle className={`h-4 w-4 ${risk.level === "high" ? "text-red-500" : risk.level === "medium" ? "text-yellow-500" : "text-green-500"}`} />
                                    <span>{risk.indicator}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Activity & Deadlines */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm">
                            {mockRecentActivity.map(activity => (
                                <li key={activity.id} className="flex items-start gap-2">
                                    <Activity className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p>{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">By {activity.user} - {format(new Date(activity.timestamp), "PPp")}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Add link to full activity log */} 
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {mockUpcomingDeadlines.map(deadline => (
                                <li key={deadline.id} className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span>{deadline.item} - <strong>{format(new Date(deadline.date), "PP")}</strong></span>
                                </li>
                            ))}
                        </ul>
                        {/* Add link to full schedule */} 
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectOverviewTab;

