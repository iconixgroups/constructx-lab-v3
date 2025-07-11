import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface TeamMemberFormProps {
  member: any | null;
  teams: any[];
  roles: any[];
  onSubmit: (memberData: any) => void;
  onCancel: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, teams, roles, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    title: "",
    department: "",
    isActive: true,
    startDate: "",
    skills: [] as string[],
    certifications: [] as string[],
    teams: [] as string[],
    availability: "Full-time",
    hourlyRate: "",
    phone: "",
    avatar: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        role: member.role || "",
        title: member.title || "",
        department: member.department || "",
        isActive: member.isActive !== undefined ? member.isActive : true,
        startDate: member.startDate || "",
        skills: member.skills || [],
        certifications: member.certifications || [],
        teams: member.teams || [],
        availability: member.availability || "Full-time",
        hourlyRate: member.hourlyRate ? String(member.hourlyRate) : "",
        phone: member.phone || "",
        avatar: member.avatar || ""
      });
    }
  }, [member]);

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

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleTeamAssignmentChange = (selectedTeamId: string) => {
    setFormData(prev => {
      const isSelected = prev.teams.includes(selectedTeamId);
      if (isSelected) {
        return { ...prev, teams: prev.teams.filter(id => id !== selectedTeamId) };
      } else {
        return { ...prev, teams: [...prev.teams, selectedTeamId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.role || !formData.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Role, Title).",
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
          <DialogTitle>{member ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Edit the details of the team member." : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email <span className="text-red-500">*</span></Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role <span className="text-red-500">*</span></Label>
            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title <span className="text-red-500">*</span></Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hourlyRate" className="text-right">Hourly Rate</Label>
            <Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">Active</Label>
            <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="skills" className="text-right">Skills</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="certifications" className="text-right">Certifications</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
                    {cert}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveCertification(cert)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new certification"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCertification(); } }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddCertification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="teams" className="text-right">Assigned Teams</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {teams.map(team => (
                  <Button
                    key={team.id}
                    type="button"
                    variant={formData.teams.includes(team.id) ? "default" : "outline"}
                    onClick={() => handleTeamAssignmentChange(team.id)}
                    className="flex items-center gap-1"
                  >
                    {team.name}
                    {formData.teams.includes(team.id) && <Check className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability" className="text-right">Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => handleSelectChange("availability", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
                <SelectItem value="On-call">On-call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
            <Input id="avatar" name="avatar" value={formData.avatar} onChange={handleInputChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {member ? "Save Changes" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberForm;


