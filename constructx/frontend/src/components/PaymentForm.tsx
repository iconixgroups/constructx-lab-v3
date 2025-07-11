import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface PaymentFormProps {
  payment?: any;
  paymentMethods: any[];
  onSubmit: (paymentData: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, paymentMethods, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: payment?.type || "Outgoing",
    amount: payment?.amount || "",
    currency: payment?.currency || "USD",
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    paymentMethodId: payment?.paymentMethodId || (paymentMethods.length > 0 ? paymentMethods[0].id : ""),
    relatedEntityType: payment?.relatedEntityType || "Invoice",
    relatedEntityId: payment?.relatedEntityId || "",
    notes: payment?.notes || "",
    // Add more fields as needed
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        type: payment.type,
        amount: payment.amount,
        currency: payment.currency,
        paymentDate: payment.paymentDate,
        paymentMethodId: payment.paymentMethodId,
        relatedEntityType: payment.relatedEntityType,
        relatedEntityId: payment.relatedEntityId,
        notes: payment.notes,
      });
    }
  }, [payment]);

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
          <DialogTitle>{payment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
          <DialogDescription>
            {payment ? "Edit the details of this payment." : "Fill in the details to record a new payment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Incoming">Incoming</SelectItem>
                <SelectItem value="Outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">Currency</Label>
            <Input id="currency" name="currency" value={formData.currency} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentDate" className="text-right">Payment Date</Label>
            <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethodId" className="text-right">Payment Method</Label>
            <Select name="paymentMethodId" value={formData.paymentMethodId} onValueChange={(value) => handleSelectChange("paymentMethodId", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(pm => (
                  <SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relatedEntityType" className="text-right">Related Entity Type</Label>
            <Select name="relatedEntityType" value={formData.relatedEntityType} onValueChange={(value) => handleSelectChange("relatedEntityType", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Invoice">Invoice</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="ContractMilestone">Contract Milestone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relatedEntityId" className="text-right">Related Entity ID</Label>
            <Input id="relatedEntityId" name="relatedEntityId" value={formData.relatedEntityId} onChange={handleChange} className="col-span-3" placeholder="e.g., inv-001, exp-010" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>
            {payment ? "Save Changes" : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;


