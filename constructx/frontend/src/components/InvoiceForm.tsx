import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface InvoiceFormProps {
  invoice?: any;
  onSubmit: (invoiceData: any) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: invoice?.title || "",
    type: invoice?.type || "Outgoing Client Invoice",
    client: invoice?.client || "",
    vendor: invoice?.vendor || "",
    totalAmount: invoice?.totalAmount || "",
    currency: invoice?.currency || "USD",
    issueDate: invoice?.issueDate || new Date().toISOString().split("T")[0],
    dueDate: invoice?.dueDate || "",
    description: invoice?.description || "",
    terms: invoice?.terms || "",
    notes: invoice?.notes || "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        title: invoice.title,
        type: invoice.type,
        client: invoice.client || "",
        vendor: invoice.vendor || "",
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate || "",
        description: invoice.description || "",
        terms: invoice.terms || "",
        notes: invoice.notes || "",
      });
    }
  }, [invoice]);

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
          <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Edit the details of this invoice." : "Fill in the details to create a new invoice."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Outgoing Client Invoice">Outgoing Client Invoice</SelectItem>
                <SelectItem value="Incoming Vendor Invoice">Incoming Vendor Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.type === "Outgoing Client Invoice" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">Client</Label>
              <Input id="client" name="client" value={formData.client} onChange={handleChange} className="col-span-3" />
            </div>
          )}
          {formData.type === "Incoming Vendor Invoice" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vendor" className="text-right">Vendor</Label>
              <Input id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} className="col-span-3" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalAmount" className="text-right">Total Amount</Label>
            <Input id="totalAmount" name="totalAmount" type="number" step="0.01" value={formData.totalAmount} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">Currency</Label>
            <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issueDate" className="text-right">Issue Date</Label>
            <Input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="terms" className="text-right">Terms</Label>
            <Textarea id="terms" name="terms" value={formData.terms} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">
            {invoice ? "Save Changes" : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;


