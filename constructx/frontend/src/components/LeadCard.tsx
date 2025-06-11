import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress"; // For probability
import { Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'; // For relative time

// Helper to get initials for avatar fallback
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
};

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const LeadCard = ({ lead }) => {
    if (!lead) return null;

    // Calculate time since last activity
    const timeSinceLastActivity = lead.lastActivityAt
        ? formatDistanceToNow(new Date(lead.lastActivityAt), { addSuffix: true })
        : "No activity";

    // Get assigned user initials (assuming assignedTo has a name property or is just a name string)
    // Replace with actual user data fetching/lookup if assignedTo is just an ID
    const assignedUserName = lead.assignedTo?.name || "Unassigned"; // Placeholder
    const assignedUserInitials = getInitials(assignedUserName);
    const assignedUserAvatarUrl = lead.assignedTo?.avatarUrl; // Placeholder

    return (
        <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm font-medium truncate" title={lead.name}>{lead.name}</CardTitle>
                <p className="text-xs text-muted-foreground truncate" title={lead.clientCompanyId?.name || "Unknown Client"}>
                    {lead.clientCompanyId?.name || "Unknown Client"} {/* Replace with actual client lookup */}
                </p>
            </CardHeader>
            <CardContent className="p-2 text-xs space-y-1">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">{formatCurrency(lead.estimatedValue)}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{lead.source || "Unknown"}</Badge>
                </div>
                <div>
                    <span className="text-muted-foreground">Probability:</span>
                    <div className="flex items-center gap-1">
                        <Progress value={lead.probability || 0} className="h-1 w-full" />
                        <span className="text-[10px] font-medium">{lead.probability || 0}%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 text-xs text-muted-foreground flex justify-between items-center">
                <div className="flex items-center gap-1" title={`Last activity: ${timeSinceLastActivity}`}>
                    <Clock className="h-3 w-3" />
                    <span className="truncate">{timeSinceLastActivity}</span>
                </div>
                <Avatar className="h-5 w-5" title={`Assigned to: ${assignedUserName}`}>
                    <AvatarImage src={assignedUserAvatarUrl} alt={assignedUserName} />
                    <AvatarFallback className="text-[10px]">{assignedUserInitials}</AvatarFallback>
                </Avatar>
            </CardFooter>
        </Card>
    );
};

export default LeadCard;

