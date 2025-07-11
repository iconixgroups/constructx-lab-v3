import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, GitBranch, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  teams: string[];
}

interface Team {
  id: string;
  name: string;
  leadId: string;
  memberCount: number;
}

interface OrganizationChartComponentProps {
  teamMembers: TeamMember[];
  teams: Team[];
}

const OrganizationChartComponent: React.FC<OrganizationChartComponentProps> = ({ teamMembers, teams }) => {
  // For a simple visualization, we can group members by team and show team leads.
  // A more complex implementation would involve a proper D3.js or similar library for interactive charts.

  const getTeamLead = (team: Team) => {
    const lead = teamMembers.find(member => member.id === team.leadId);
    return lead ? lead.name : "N/A";
  };

  const getTeamMembers = (teamId: string) => {
    return teamMembers.filter(member => member.teams.includes(teams.find(t => t.id === teamId)?.name || ""));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Organization Chart</h2>
      <p className="text-muted-foreground">A visual representation of teams and their members. For more complex visualizations, consider dedicated charting libraries.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                {team.name}
              </CardTitle>
              <CardDescription>
                Lead: {getTeamLead(team)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-md font-semibold mb-2">Members ({getTeamMembers(team.id).length})</h3>
              <div className="space-y-1">
                {getTeamMembers(team.id).length > 0 ? (
                  getTeamMembers(team.id).map(member => (
                    <div key={member.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {member.name} ({member.role})
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No members assigned to this team yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No teams available to display in the organization chart.
        </div>
      )}
    </div>
  );
};

export default OrganizationChartComponent;


