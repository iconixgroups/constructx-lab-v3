import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface InspectionFormProps {
  inspection?: any;
  templates: any[];
  onSubmit: (inspectionData: any) => void;
  onCancel: () => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ inspection, templates, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: inspection?.title || "",
    templateId: inspection?.templateId || (templates.length > 0 ? templates[0].id : ""),
    scheduledDate: inspection?.scheduledDate || new Date().toISOString().split("T")[0],
    location: inspection?.location || "",
    inspector: inspection?.inspector || "",
    description: inspection?.description || "",
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        title: inspection.title,
        templateId: inspection.templateId,
        scheduledDate: inspection.scheduledDate,
        location: inspection.location,
        inspector: inspection.inspector,
        description: inspection.description,
      });
    }
  }, [inspection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inspection ? "Edit Inspection" : "Schedule New Inspection"}</DialogTitle>
          <DialogDescription>
            {inspection ? "Edit the details of this inspection." : "Fill in the details to schedule a new inspection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">Template</Label>
            <Select name="templateId" value={formData.templateId} onValueChange={(value) => handleSelectChange("templateId", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduledDate" className="text-right">Scheduled Date</Label>
            <Input id="scheduledDate" name="scheduledDate" type="date" value={formData.scheduledDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inspector" className="text-right">Inspector</Label>
            <Input id="inspector" name="inspector" value={formData.inspector} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" rows={4} />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {inspection ? "Save Changes" : "Schedule Inspection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionForm;


