import axios from "axios";

const API_URL = "/api/team"; // Base URL for team management APIs

interface TeamMemberData {
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  isActive: boolean;
  startDate: string;
  skills: string[];
  certifications: string[];
  teams: string[];
  availability: string;
  hourlyRate: number;
  phone: string;
  avatar: string;
}

interface TeamData {
  name: string;
  description: string;
  type: string;
  leadId: string;
  memberIds: string[];
  projectId: string;
  isActive: boolean;
}

interface RoleData {
  name: string;
  description: string;
  isSystem: boolean;
  permissions: { [key: string]: boolean };
}

const teamService = {
  // Team Members
  getTeamMembers: async (filters?: { projectId?: string; search?: string; role?: string; team?: string; status?: string }) => {
    const response = await axios.get(`${API_URL}/members`, { params: filters });
    return response.data;
  },

  getTeamMemberById: async (id: string) => {
    const response = await axios.get(`${API_URL}/members/${id}`);
    return response.data;
  },

  createTeamMember: async (data: TeamMemberData) => {
    const response = await axios.post(`${API_URL}/members`, data);
    return response.data;
  },

  updateTeamMember: async (id: string, data: Partial<TeamMemberData>) => {
    const response = await axios.put(`${API_URL}/members/${id}`, data);
    return response.data;
  },

  deleteTeamMember: async (id: string) => {
    const response = await axios.delete(`${API_URL}/members/${id}`);
    return response.data;
  },

  // Teams
  getTeams: async (filters?: { projectId?: string; search?: string; type?: string; leadId?: string; status?: string }) => {
    const response = await axios.get(`${API_URL}/teams`, { params: filters });
    return response.data;
  },

  getTeamById: async (id: string) => {
    const response = await axios.get(`${API_URL}/teams/${id}`);
    return response.data;
  },

  createTeam: async (data: TeamData) => {
    const response = await axios.post(`${API_URL}/teams`, data);
    return response.data;
  },

  updateTeam: async (id: string, data: Partial<TeamData>) => {
    const response = await axios.put(`${API_URL}/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: string) => {
    const response = await axios.delete(`${API_URL}/teams/${id}`);
    return response.data;
  },

  addMemberToTeam: async (teamId: string, memberId: string, role?: string) => {
    const response = await axios.post(`${API_URL}/teams/${teamId}/members`, { memberId, role });
    return response.data;
  },

  removeMemberFromTeam: async (teamId: string, memberId: string) => {
    const response = await axios.delete(`${API_URL}/teams/${teamId}/members/${memberId}`);
    return response.data;
  },

  // Roles
  getRoles: async () => {
    const response = await axios.get(`${API_URL}/roles`);
    return response.data;
  },

  getRoleById: async (id: string) => {
    const response = await axios.get(`${API_URL}/roles/${id}`);
    return response.data;
  },

  createRole: async (data: RoleData) => {
    const response = await axios.post(`${API_URL}/roles`, data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<RoleData>) => {
    const response = await axios.put(`${API_URL}/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await axios.delete(`${API_URL}/roles/${id}`);
    return response.data;
  },

  // Skills and Certifications (simplified for now, can be expanded)
  getSkills: async () => {
    const response = await axios.get(`${API_URL}/skills`);
    return response.data;
  },

  getCertifications: async () => {
    const response = await axios.get(`${API_URL}/certifications`);
    return response.data;
  },

  // Team Communication (placeholder for future implementation)
  getTeamCommunications: async (teamId: string) => {
    const response = await axios.get(`${API_URL}/teams/${teamId}/communications`);
    return response.data;
  },

  createTeamCommunication: async (teamId: string, data: any) => {
    const response = await axios.post(`${API_URL}/teams/${teamId}/communications`, data);
    return response.data;
  },
};

export default teamService;


