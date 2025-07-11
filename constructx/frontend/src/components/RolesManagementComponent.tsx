import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Plus, Settings, Check, X, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";
import teamService from "../services/teamService";

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: { [key: string]: boolean };
  assignmentCount: number;
}

interface RolesManagementComponentProps {
  // No props needed for now, as it manages roles internally
}

const RolesManagementComponent: React.FC<RolesManagementComponentProps> = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSystem: false,
    permissions: {} as { [key: string]: boolean }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for development
  const mockRoles = [
    {
      id: "role-1",
      name: "Admin",
      description: "Full access to all modules and settings.",
      isSystem: true,
      permissions: {
        dashboard_view: true, dashboard_edit: true,
        leads_view: true, leads_edit: true,
        projects_view: true, projects_edit: true,
        tasks_view: true, tasks_edit: true,
        documents_view: true, documents_edit: true,
        schedule_view: true, schedule_edit: true,
        resources_view: true, resources_edit: true,
        financial_view: true, financial_edit: true,
        bids_view: true, bids_edit: true,
        contracts_view: true, contracts_edit: true,
        team_view: true, team_edit: true,
        roles_manage: true,
        settings_manage: true
      },
      assignmentCount: 5
    },
    {
      id: "role-2",
      name: "Project Manager",
      description: "Manages projects, schedules, resources, and team members.",
      isSystem: true,
      permissions: {
        dashboard_view: true,
        leads_view: true,
        projects_view: true, projects_edit: true,
        tasks_view: true, tasks_edit: true,
        documents_view: true, documents_edit: true,
        schedule_view: true, schedule_edit: true,
        resources_view: true, resources_edit: true,
        financial_view: true,
        bids_view: true,
        contracts_view: true,
        team_view: true, team_edit: true,
        roles_manage: false,
        settings_manage: false
      },
      assignmentCount: 12
    },
    {
      id: "role-3",
      name: "Team Member",
      description: "Can view assigned tasks and project details.",
      isSystem: true,
      permissions: {
        dashboard_view: true,
        leads_view: false,
        projects_view: true,
        tasks_view: true, tasks_edit: true,
        documents_view: true,
        schedule_view: true,
        resources_view: true,
        financial_view: false,
        bids_view: false,
        contracts_view: false,
        team_view: true,
        roles_manage: false,
        settings_manage: false
      },
      assignmentCount: 50
    },
    {
      id: "role-4",
      name: "Custom Role A",
      description: "A custom role with specific viewing permissions.",
      isSystem: false,
      permissions: {
        dashboard_view: true,
        leads_view: true,
        projects_view: true,
        tasks_view: true,
        documents_view: true,
        schedule_view: false,
        resources_view: false,
        financial_view: false,
        bids_view: false,
        contracts_view: false,
        team_view: false,
        roles_manage: false,
        settings_manage: false
      },
      assignmentCount: 3
    }
  ];

  // Define all possible permissions for the matrix
  const allPermissions = {
    dashboard_view: "View Dashboard",
    dashboard_edit: "Edit Dashboard",
    leads_view: "View Leads",
    leads_edit: "Edit Leads",
    projects_view: "View Projects",
    projects_edit: "Edit Projects",
    tasks_view: "View Tasks",
    tasks_edit: "Edit Tasks",
    documents_view: "View Documents",
    documents_edit: "Edit Documents",
    schedule_view: "View Schedule",
    schedule_edit: "Edit Schedule",
    resources_view: "View Resources",
    resources_edit: "Edit Resources",
    financial_view: "View Financials",
    financial_edit: "Edit Financials",
    bids_view: "View Bids",
    bids_edit: "Edit Bids",
    contracts_view: "View Contracts",
    contracts_edit: "Edit Contracts",
    team_view: "View Team",
    team_edit: "Edit Team",
    roles_manage: "Manage Roles",
    settings_manage: "Manage Settings"
  };

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await teamService.getRoles();
        setRoles(response);
      } catch (err: any) {
        console.error("Error fetching roles:", err);
        setError(err.message || "Failed to load roles. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load roles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: checked
      }
    }));
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      isSystem: false,
      permissions: {} // Start with no permissions selected
    });
    setShowRoleForm(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: { ...role.permissions }
    });
    setShowRoleForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Role name is required.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingRole) {
        await teamService.updateRole(editingRole.id, formData);
        toast({
          title: "Success",
          description: "Role updated successfully."
        });
      } else {
        const newRole = await teamService.createRole(formData);
        setRoles(prev => [...prev, { ...newRole, assignmentCount: 0 }]);
        toast({
          title: "Success",
          description: "Role created successfully."
        });
      }
      setShowRoleForm(false);
      setEditingRole(null);
    } catch (err) {
      console.error("Error saving role:", err);
      toast({
        title: "Error",
        description: "Failed to save role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      return;
    }

    try {
      await teamService.deleteRole(roleId);
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast({
        title: "Success",
        description: "Role deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting role:", err);
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading && roles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Roles & Permissions</h2>
        <Button onClick={handleAddRole}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No roles defined yet. Click "Add New Role" to create one.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "outline" : "default"}>
                      {role.isSystem ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.assignmentCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="mr-2 h-4 w-4" />Edit Role
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />Delete Role
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Role Form Dialog */}
      {showRoleForm && (
        <Dialog open={true} onOpenChange={setShowRoleForm}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
              <DialogDescription>
                {editingRole ? "Edit the details and permissions for this role." : "Define a new role and its associated permissions."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Role Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSystem" className="text-right">System Role</Label>
                <Switch
                  id="isSystem"
                  checked={formData.isSystem}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSystem: checked }))}
                  className="col-span-3"
                  disabled={!!editingRole && editingRole.isSystem} // Disable if editing a system role
                />
              </div>

              <h3 className="col-span-4 text-lg font-semibold mt-4">Permissions</h3>
              <p className="col-span-4 text-sm text-muted-foreground -mt-2 mb-2">Select which actions members with this role can perform.</p>

              <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(allPermissions).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={!!formData.permissions[key]}
                      onCheckedChange={(checked) => handlePermissionChange(key, checked)}
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRoleForm(false)}>Cancel</Button>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingRole ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RolesManagementComponent;


