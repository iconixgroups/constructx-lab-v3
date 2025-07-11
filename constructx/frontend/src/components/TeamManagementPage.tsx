import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Grid3X3, 
  List, 
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Download,
  Upload,
  GitBranch
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import teamService from "../services/teamService";
import TeamMembersList from "./TeamMembersList";
import TeamMembersGrid from "./TeamMembersGrid";
import TeamsListComponent from "./TeamsListComponent";
import OrganizationChartComponent from "./OrganizationChartComponent";
import TeamMemberForm from "./TeamMemberForm";
import TeamForm from "./TeamForm";
import RolesManagementComponent from "./RolesManagementComponent";

interface TeamManagementPageProps {
  projectId?: string; // Optional - if provided, shows team for specific project
}

const TeamManagementPage: React.FC<TeamManagementPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("members");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalTeams: 0,
    pendingInvites: 0
  });

  // Mock data for development
  const mockTeamMembers = [
    {
      id: "member-1",
      userId: "user-1",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "Project Manager",
      title: "Senior Project Manager",
      department: "Construction",
      avatar: null,
      isActive: true,
      startDate: "2024-01-15",
      skills: ["Project Management", "Risk Assessment", "Budget Planning"],
      certifications: ["PMP", "OSHA 30"],
      teams: ["Team Alpha", "Management Team"],
      availability: "Full-time",
      hourlyRate: 85.00,
      phone: "+1 (555) 123-4567"
    },
    {
      id: "member-2",
      userId: "user-2",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Site Superintendent",
      title: "Senior Superintendent",
      department: "Field Operations",
      avatar: null,
      isActive: true,
      startDate: "2024-02-01",
      skills: ["Site Management", "Safety Compliance", "Quality Control"],
      certifications: ["OSHA 30", "First Aid/CPR"],
      teams: ["Team Alpha", "Safety Committee"],
      availability: "Full-time",
      hourlyRate: 75.00,
      phone: "+1 (555) 234-5678"
    },
    {
      id: "member-3",
      userId: "user-3",
      name: "Mike Chen",
      email: "mike.chen@company.com",
      role: "Engineer",
      title: "Structural Engineer",
      department: "Engineering",
      avatar: null,
      isActive: true,
      startDate: "2024-01-20",
      skills: ["Structural Analysis", "AutoCAD", "Building Codes"],
      certifications: ["PE License", "LEED AP"],
      teams: ["Team Beta", "Engineering Team"],
      availability: "Full-time",
      hourlyRate: 80.00,
      phone: "+1 (555) 345-6789"
    },
    {
      id: "member-4",
      userId: "user-4",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@company.com",
      role: "Safety Officer",
      title: "Safety Coordinator",
      department: "Safety",
      avatar: null,
      isActive: true,
      startDate: "2024-03-01",
      skills: ["Safety Inspections", "Incident Investigation", "Training"],
      certifications: ["CSP", "OSHA 30", "First Aid/CPR"],
      teams: ["Safety Committee", "Team Alpha"],
      availability: "Full-time",
      hourlyRate: 65.00,
      phone: "+1 (555) 456-7890"
    }
  ];

  const mockTeams = [
    {
      id: "team-1",
      name: "Team Alpha",
      description: "Primary construction team for main building",
      type: "Project Team",
      leadId: "member-1",
      leadName: "John Smith",
      memberCount: 8,
      projectId: "project-1",
      projectName: "Downtown Office Complex",
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "team-2",
      name: "Team Beta",
      description: "Engineering and design team",
      type: "Department",
      leadId: "member-3",
      leadName: "Mike Chen",
      memberCount: 5,
      projectId: null,
      projectName: null,
      isActive: true,
      createdAt: "2024-01-20T14:30:00Z"
    },
    {
      id: "team-3",
      name: "Safety Committee",
      description: "Cross-functional safety oversight team",
      type: "Committee",
      leadId: "member-4",
      leadName: "Lisa Rodriguez",
      memberCount: 6,
      projectId: null,
      projectName: null,
      isActive: true,
      createdAt: "2024-02-01T09:15:00Z"
    }
  ];

  const mockRoles = [
    { value: "Project Manager", label: "Project Manager" },
    { value: "Site Superintendent", label: "Site Superintendent" },
    { value: "Engineer", label: "Engineer" },
    { value: "Safety Officer", label: "Safety Officer" },
    { value: "Foreman", label: "Foreman" },
    { value: "Architect", label: "Architect" },
    { value: "Quality Inspector", label: "Quality Inspector" }
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [membersResponse, teamsResponse, rolesResponse] = await Promise.all([
        teamService.getTeamMembers({ projectId }),
        teamService.getTeams({ projectId }),
        teamService.getRoles()
      ]);
      
      setTeamMembers(membersResponse);
      setTeams(teamsResponse);
      setRoles(rolesResponse.map((role: any) => ({ value: role.name, label: role.name }))); // Assuming roles come as {id, name, description}
      setStats({
        totalMembers: membersResponse.length,
        activeMembers: membersResponse.filter((m: any) => m.isActive).length,
        totalTeams: teamsResponse.length,
        pendingInvites: 0 // This needs to be fetched from backend if available
      });
    } catch (error) {
      console.error("Error loading team data:", error);
      toast({
        title: "Error",
        description: "Failed to load team data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "role":
        setFilterRole(value);
        break;
      case "team":
        setFilterTeam(value);
        break;
      case "status":
        setFilterStatus(value);
        break;
    }
  };

  // Handle add member
  const handleAddMember = () => {
    setEditingMember(null);
    setShowMemberForm(true);
  };

  // Handle edit member
  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  // Handle add team
  const handleAddTeam = () => {
    setEditingTeam(null);
    setShowTeamForm(true);
  };

  // Handle edit team
  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  // Handle member form submit
  const handleMemberFormSubmit = async (memberData: any) => {
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await teamService.updateTeamMember(editingMember.id, memberData);
        toast({
          title: "Success",
          description: "Team member updated successfully."
        });
      } else {
        await teamService.createTeamMember(memberData);
        toast({
          title: "Success",
          description: "Team member added successfully."
        });
      }
      setShowMemberForm(false);
      setEditingMember(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({
        title: "Error",
        description: "Failed to save team member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle team form submit
  const handleTeamFormSubmit = async (teamData: any) => {
    setIsSubmitting(true);
    try {
      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, teamData);
        toast({
          title: "Success",
          description: "Team updated successfully."
        });
      } else {
        await teamService.createTeam(teamData);
        toast({
          title: "Success",
          description: "Team created successfully."
        });
      }
      setShowTeamForm(false);
      setEditingTeam(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving team:", error);
      toast({
        title: "Error",
        description: "Failed to save team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter team members based on search and filters
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || member.role === filterRole;
    const matchesTeam = !filterTeam || member.teams.includes(filterTeam);
    const matchesStatus = !filterStatus || 
      (filterStatus === "active" && member.isActive) ||
      (filterStatus === "inactive" && !member.isActive);
    
    return matchesSearch && matchesRole && matchesTeam && matchesStatus;
  });

  if (isLoading && teamMembers.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage project team members and assignments" : "Manage company team members and teams"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvites}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="organization">Organization Chart</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={(value) => handleFilterChange("role", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTeam} onValueChange={(value) => handleFilterChange("team", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Team Members List/Grid */}
          {viewMode === "list" ? (
            <TeamMembersList 
              teamMembers={filteredTeamMembers}
              onEdit={handleEditMember}
              onDelete={async (member) => {
                try {
                  await teamService.deleteTeamMember(member.id);
                  toast({
                    title: "Success",
                    description: "Team member removed successfully."
                  });
                  loadData();
                } catch (error) {
                  console.error("Error deleting team member:", error);
                  toast({
                    title: "Error",
                    description: "Failed to remove team member. Please try again.",
                    variant: "destructive"
                  });
                }
              }}
            />
          ) : (
            <TeamMembersGrid 
              teamMembers={filteredTeamMembers}
              onEdit={handleEditMember}
              onDelete={async (member) => {
                try {
                  await teamService.deleteTeamMember(member.id);
                  toast({
                    title: "Success",
                    description: "Team member removed successfully."
                  });
                  loadData();
                } catch (error) {
                  console.error("Error deleting team member:", error);
                  toast({
                    title: "Error",
                    description: "Failed to remove team member. Please try again.",
                    variant: "destructive"
                  });
                }
              }}
            />
          )}}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Teams</h2>
            <Button onClick={handleAddTeam}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
          <TeamsListComponent 
            teams={teams}
            onEdit={handleEditTeam}
            onDelete={async (team) => {
              try {
                await teamService.deleteTeam(team.id);
                toast({
                  title: "Success",
                  description: "Team deleted successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting team:", error);
                toast({
                  title: "Error",
                  description: "Failed to delete team. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <OrganizationChartComponent 
            teamMembers={teamMembers}
            teams={teams}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesManagementComponent />
        </TabsContent>
      </Tabs>

      {/* Member Form Dialog */}
      {showMemberForm && (
        <TeamMemberForm
          member={editingMember}
          teams={teams}
          roles={roles}
          onSubmit={handleMemberFormSubmit}
          onCancel={() => {
            setShowMemberForm(false);
            setEditingMember(null);
          }}
        />
      )}

      {/* Team Form Dialog */}
      {showTeamForm && (
        <TeamForm
          team={editingTeam}
          teamMembers={teamMembers}
          onSubmit={handleTeamFormSubmit}
          onCancel={() => {
            setShowTeamForm(false);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamManagementPage;

