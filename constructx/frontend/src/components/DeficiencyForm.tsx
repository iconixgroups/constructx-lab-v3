import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface DeficiencyFormProps {
  deficiency?: any;
  onSubmit: (deficiencyData: any) => void;
  onCancel: () => void;
}

const DeficiencyForm: React.FC<DeficiencyFormProps> = ({ deficiency, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: deficiency?.description || "",
    status: deficiency?.status || "Open",
    priority: deficiency?.priority || "Medium",
    assignedTo: deficiency?.assignedTo || "",
    dueDate: deficiency?.dueDate || new Date().toISOString().split("T")[0],
    location: deficiency?.location || "",
  });

  useEffect(() => {
    if (deficiency) {
      setFormData({
        description: deficiency.description,
        status: deficiency.status,
        priority: deficiency.priority,
        assignedTo: deficiency.assignedTo,
        dueDate: deficiency.dueDate,
        location: deficiency.location,
      });
    }
  }, [deficiency]);

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
          <DialogTitle>{deficiency ? "Edit Deficiency" : "Create New Deficiency"}</DialogTitle>
          <DialogDescription>
            {deficiency ? "Edit the details of this deficiency." : "Fill in the details to create a new deficiency."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Void">Void</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
            <Input id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {deficiency ? "Save Changes" : "Create Deficiency"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeficiencyForm;


