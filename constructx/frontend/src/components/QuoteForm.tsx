import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface QuoteFormProps {
  quote?: any;
  onSubmit: (quoteData: any) => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quote, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: quote?.title || "",
    type: quote?.type || "Client Quote",
    recipientCompany: quote?.recipientCompany || "",
    vendor: quote?.vendor || "",
    totalAmount: quote?.totalAmount || "",
    currency: quote?.currency || "USD",
    issueDate: quote?.issueDate || new Date().toISOString().split("T")[0],
    expiryDate: quote?.expiryDate || "",
    description: quote?.description || "",
    terms: quote?.terms || "",
    notes: quote?.notes || "",
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        title: quote.title,
        type: quote.type,
        recipientCompany: quote.recipientCompany || "",
        vendor: quote.vendor || "",
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        issueDate: quote.issueDate,
        expiryDate: quote.expiryDate || "",
        description: quote.description || "",
        terms: quote.terms || "",
        notes: quote.notes || "",
      });
    }
  }, [quote]);

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
          <DialogTitle>{quote ? "Edit Quote" : "Create New Quote"}</DialogTitle>
          <DialogDescription>
            {quote ? "Edit the details of this quote." : "Fill in the details to create a new quote."}
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
                <SelectItem value="Client Quote">Client Quote</SelectItem>
                <SelectItem value="Vendor Quote Request">Vendor Quote Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.type === "Client Quote" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientCompany" className="text-right">Recipient Company</Label>
              <Input id="recipientCompany" name="recipientCompany" value={formData.recipientCompany} onChange={handleChange} className="col-span-3" />
            </div>
          )}
          {formData.type === "Vendor Quote Request" && (
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
            <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
            <Input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className="col-span-3" />
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
            {quote ? "Save Changes" : "Create Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteForm;


