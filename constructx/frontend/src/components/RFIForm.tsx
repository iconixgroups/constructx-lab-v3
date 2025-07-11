import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface RFIFormProps {
  rfi?: any; // Existing RFI data for editing
  statuses: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  onSubmit: (rfiData: any) => void;
  onCancel: () => void;
}

const RFIForm: React.FC<RFIFormProps> = ({ rfi, statuses, priorities, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: rfi?.title || "",
    description: rfi?.description || "",
    status: rfi?.status || "Submitted",
    priority: rfi?.priority || "Medium",
    category: rfi?.category || "Architectural",
    dueDate: rfi?.dueDate ? new Date(rfi.dueDate) : undefined,
    submittedBy: rfi?.submittedBy || "", // This should ideally come from auth context
    assignedTo: rfi?.assignedTo || "", // This should ideally be a user picker
    impactDescription: rfi?.impactDescription || "",
    costImpact: rfi?.costImpact || false,
    scheduleImpact: rfi?.scheduleImpact || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rfi) {
      setFormData({
        title: rfi.title || "",
        description: rfi.description || "",
        status: rfi.status || "Submitted",
        priority: rfi.priority || "Medium",
        category: rfi.category || "Architectural",
        dueDate: rfi.dueDate ? new Date(rfi.dueDate) : undefined,
        submittedBy: rfi.submittedBy || "",
        assignedTo: rfi.assignedTo || "",
        impactDescription: rfi.impactDescription || "",
        costImpact: rfi.costImpact || false,
        scheduleImpact: rfi.scheduleImpact || false,
      });
    }
  }, [rfi]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.submittedBy || !formData.assignedTo) {
      alert("Please fill in all required fields: Title, Description, Submitted By, and Assigned To.");
      setIsSubmitting(false);
      return;
    }

    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? format(formData.dueDate, "yyyy-MM-dd") : undefined,
    });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rfi ? "Edit RFI" : "Create New RFI"}</DialogTitle>
          <DialogDescription>
            {rfi ? "Edit the details of this Request for Information." : "Fill in the details to create a new Request for Information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="submittedBy" className="text-right">Submitted By</Label>
            <Input id="submittedBy" name="submittedBy" value={formData.submittedBy} onChange={handleInputChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
            <Input id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="impactDescription" className="text-right">Impact Description</Label>
            <Textarea id="impactDescription" name="impactDescription" value={formData.impactDescription} onChange={handleInputChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costImpact" className="text-right">Cost Impact</Label>
            <input type="checkbox" id="costImpact" name="costImpact" checked={formData.costImpact} onChange={handleCheckboxChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduleImpact" className="text-right">Schedule Impact</Label>
            <input type="checkbox" id="scheduleImpact" name="scheduleImpact" checked={formData.scheduleImpact} onChange={handleCheckboxChange} className="col-span-3" />
          </div>

        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {rfi ? "Save Changes" : "Create RFI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RFIForm;


