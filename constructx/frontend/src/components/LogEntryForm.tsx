import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface LogEntryFormProps {
  logEntry?: any;
  logTypes: any[];
  onSubmit: (logEntryData: any) => void;
  onCancel: () => void;
}

const LogEntryForm: React.FC<LogEntryFormProps> = ({ logEntry, logTypes, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: logEntry?.title || "",
    logTypeId: logEntry?.logTypeId || (logTypes.length > 0 ? logTypes[0].id : ""),
    entryDate: logEntry?.entryDate || new Date().toISOString().split("T")[0],
    data: JSON.stringify(logEntry?.data || {}, null, 2),
  });

  useEffect(() => {
    if (logEntry) {
      setFormData({
        title: logEntry.title,
        logTypeId: logEntry.logTypeId,
        entryDate: logEntry.entryDate,
        data: JSON.stringify(logEntry.data || {}, null, 2),
      });
    }
  }, [logEntry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(formData.data);
      onSubmit({ ...formData, data: parsedData });
    } catch (error) {
      alert("Invalid JSON in Data field.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{logEntry ? "Edit Log Entry" : "Create New Log Entry"}</DialogTitle>
          <DialogDescription>
            {logEntry ? "Edit the details of this log entry." : "Fill in the details to create a new log entry."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logType" className="text-right">Log Type</Label>
            <Select name="logTypeId" value={formData.logTypeId} onValueChange={(value) => handleSelectChange("logTypeId", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select log type" />
              </SelectTrigger>
              <SelectContent>
                {logTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entryDate" className="text-right">Entry Date</Label>
            <Input id="entryDate" name="entryDate" type="date" value={formData.entryDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="data" className="text-right">Data (JSON)</Label>
            <Textarea id="data" name="data" value={formData.data} onChange={handleChange} className="col-span-3 font-mono text-sm" rows={8} placeholder="Enter JSON data for the log entry" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {logEntry ? "Save Changes" : "Create Log Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogEntryForm;


