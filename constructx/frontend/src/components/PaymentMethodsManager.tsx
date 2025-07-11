import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  XCircle,
  Star
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import paymentService from "../services/paymentService";

interface PaymentMethodsManagerProps {
  paymentMethods: any[];
  onUpdate: () => void; // Callback to refresh data in parent
}

const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({ paymentMethods, onUpdate }) => {
  const { toast } = useToast();
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMethod = () => {
    setEditingMethod(null);
    setShowMethodForm(true);
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    setShowMethodForm(true);
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;
    setIsLoading(true);
    try {
      await paymentService.deletePaymentMethod(methodId);
      toast({
        title: "Success",
        description: "Payment method deleted successfully."
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (methodId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      if (isActive) {
        await paymentService.activatePaymentMethod(methodId);
      } else {
        await paymentService.deactivatePaymentMethod(methodId);
      }
      toast({
        title: "Success",
        description: `Payment method ${isActive ? "activated" : "deactivated"} successfully.`
      });
      onUpdate();
    } catch (error) {
      console.error("Error toggling payment method status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment method status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string, isDefaultIncoming: boolean, isDefaultOutgoing: boolean) => {
    setIsLoading(true);
    try {
      await paymentService.setDefaultPaymentMethod(methodId, isDefaultIncoming, isDefaultOutgoing);
      toast({
        title: "Success",
        description: "Default payment method updated successfully."
      });
      onUpdate();
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast({
        title: "Error",
        description: "Failed to set default payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodFormSubmit = async (methodData: any) => {
    setIsLoading(true);
    try {
      if (editingMethod) {
        await paymentService.updatePaymentMethod(editingMethod.id, methodData);
        toast({
          title: "Success",
          description: "Payment method updated successfully."
        });
      } else {
        await paymentService.addPaymentMethod(methodData);
        toast({
          title: "Success",
          description: "Payment method added successfully."
        });
      }
      setShowMethodForm(false);
      setEditingMethod(null);
      onUpdate();
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Payment Methods</h2>
        <Button onClick={handleAddMethod}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Method
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Incoming Default</TableHead>
              <TableHead>Outgoing Default</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No payment methods found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              paymentMethods.map(method => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {method.type === "Credit Card" && <CreditCard className="h-4 w-4" />}
                    {method.type === "Bank Account" && <Banknote className="h-4 w-4" />}
                    {method.type}
                  </TableCell>
                  <TableCell>{method.details ? JSON.stringify(method.details) : "N/A"}</TableCell>
                  <TableCell>
                    {method.isDefaultIncoming ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    {method.isDefaultOutgoing ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={method.isActive}
                      onCheckedChange={(checked) => handleToggleActive(method.id, checked)}
                      disabled={isLoading}
                    />
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditMethod(method)}>
                          <Edit className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMethod(method.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSetDefault(method.id, true, method.isDefaultOutgoing)} disabled={method.isDefaultIncoming}>
                          <Star className="mr-2 h-4 w-4" />Set as Default Incoming
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(method.id, method.isDefaultIncoming, true)} disabled={method.isDefaultOutgoing}>
                          <Star className="mr-2 h-4 w-4" />Set as Default Outgoing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showMethodForm && (
        <Dialog open={true} onOpenChange={setShowMethodForm}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMethod ? "Edit Payment Method" : "Add New Payment Method"}</DialogTitle>
              <DialogDescription>
                {editingMethod ? "Edit the details of this payment method." : "Fill in the details to add a new payment method."}
              </DialogDescription>
            </DialogHeader>
            <PaymentMethodForm 
              method={editingMethod}
              onSubmit={handleMethodFormSubmit}
              onCancel={() => setShowMethodForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface PaymentMethodFormProps {
  method?: any;
  onSubmit: (methodData: any) => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ method, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: method?.name || "",
    type: method?.type || "Bank Account",
    details: method?.details || {},
    isDefaultIncoming: method?.isDefaultIncoming || false,
    isDefaultOutgoing: method?.isDefaultOutgoing || false,
    isActive: method?.isActive || true,
  });

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        type: method.type,
        details: method.details,
        isDefaultIncoming: method.isDefaultIncoming,
        isDefaultOutgoing: method.isDefaultOutgoing,
        isActive: method.isActive,
      });
    }
  }, [method]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value,
      },
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">Type</Label>
        <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bank Account">Bank Account</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Check">Check</SelectItem>
            <SelectItem value="Online Payment">Online Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "Bank Account" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bankName" className="text-right">Bank Name</Label>
          <Input id="bankName" name="bankName" value={formData.details.bankName || ""} onChange={handleDetailsChange} className="col-span-3" />
          <Label htmlFor="accountNumber" className="text-right">Account Number</Label>
          <Input id="accountNumber" name="accountNumber" value={formData.details.accountNumber || ""} onChange={handleDetailsChange} className="col-span-3" />
          <Label htmlFor="routingNumber" className="text-right">Routing Number</Label>
          <Input id="routingNumber" name="routingNumber" value={formData.details.routingNumber || ""} onChange={handleDetailsChange} className="col-span-3" />
        </div>
      )}

      {formData.type === "Credit Card" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cardNumber" className="text-right">Card Number</Label>
          <Input id="cardNumber" name="cardNumber" value={formData.details.cardNumber || ""} onChange={handleDetailsChange} className="col-span-3" placeholder="**** **** **** 1234" />
          <Label htmlFor="cardHolderName" className="text-right">Card Holder Name</Label>
          <Input id="cardHolderName" name="cardHolderName" value={formData.details.cardHolderName || ""} onChange={handleDetailsChange} className="col-span-3" />
          <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
          <Input id="expiryDate" name="expiryDate" value={formData.details.expiryDate || ""} onChange={handleDetailsChange} className="col-span-3" placeholder="MM/YY" />
        </div>
      )}

      {formData.type === "Check" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="checkNumber" className="text-right">Check Number</Label>
          <Input id="checkNumber" name="checkNumber" value={formData.details.checkNumber || ""} onChange={handleDetailsChange} className="col-span-3" />
        </div>
      )}

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isDefaultIncoming" className="text-right">Default Incoming</Label>
        <Switch
          id="isDefaultIncoming"
          checked={formData.isDefaultIncoming}
          onCheckedChange={(checked) => handleSwitchChange("isDefaultIncoming", checked)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isDefaultOutgoing" className="text-right">Default Outgoing</Label>
        <Switch
          id="isDefaultOutgoing"
          checked={formData.isDefaultOutgoing}
          onCheckedChange={(checked) => handleSwitchChange("isDefaultOutgoing", checked)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isActive" className="text-right">Active</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
          className="col-span-3"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">
          {method ? "Save Changes" : "Add Method"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PaymentMethodsManager;


