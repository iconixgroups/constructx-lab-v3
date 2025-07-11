import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, X, Loader2, Check } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface TeamFormProps {
  team: any | null;
  teamMembers: any[]; // For selecting team lead and assigning members
  onSubmit: (teamData: any) => void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, teamMembers, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Project Team",
    leadId: "",
    memberIds: [] as string[],
    projectId: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
        type: team.type || "Project Team",
        leadId: team.leadId || "",
        memberIds: team.memberIds || [],
        projectId: team.projectId || "",
        isActive: team.isActive !== undefined ? team.isActive : true,
      });
    }
  }, [team]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberAssignmentChange = (selectedMemberId: string) => {
    setFormData(prev => {
      const isSelected = prev.memberIds.includes(selectedMemberId);
      if (isSelected) {
        return { ...prev, memberIds: prev.memberIds.filter(id => id !== selectedMemberId) };
      } else {
        return { ...prev, memberIds: [...prev.memberIds, selectedMemberId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.type || !formData.leadId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Type, Lead).",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
          <DialogDescription>
            {team ? "Edit the details of the team." : "Fill in the details to create a new team."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Team Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Team Type <span className="text-red-500">*</span></Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a team type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Team">Project Team</SelectItem>
                <SelectItem value="Department">Department</SelectItem>
                <SelectItem value="Committee">Committee</SelectItem>
                <SelectItem value="Task Force">Task Force</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leadId" className="text-right">Team Lead <span className="text-red-500">*</span></Label>
            <Select value={formData.leadId} onValueChange={(value) => handleSelectChange("leadId", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="memberIds" className="text-right">Team Members</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {teamMembers.map(member => (
                  <Button
                    key={member.id}
                    type="button"
                    variant={formData.memberIds.includes(member.id) ? "default" : "outline"}
                    onClick={() => handleMemberAssignmentChange(member.id)}
                    className="flex items-center gap-1"
                  >
                    {member.name}
                    {formData.memberIds.includes(member.id) && <Check className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectId" className="text-right">Project (Optional)</Label>
            <Input id="projectId" name="projectId" value={formData.projectId} onChange={handleInputChange} className="col-span-3" placeholder="Enter Project ID if applicable" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {team ? "Save Changes" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;


