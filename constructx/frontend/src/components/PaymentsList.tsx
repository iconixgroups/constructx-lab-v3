import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PaymentsListProps {
  payments: any[];
  onEdit: (payment: any) => void;
  onDelete: (payment: any) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Failed":
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "Incoming") return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
    if (type === "Outgoing") return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Related Entity</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {getTypeIcon(payment.type)}
                  {payment.type}
                </TableCell>
                <TableCell>${payment.amount.toFixed(2)} {payment.currency}</TableCell>
                <TableCell>{payment.paymentDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell>{payment.relatedEntityType} ({payment.relatedEntityId})</TableCell>
                <TableCell>{payment.paymentMethodId}</TableCell>{/* This should be replaced with method name */}
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
                      <DropdownMenuItem onClick={() => onEdit(payment)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(payment)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />View Details
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
  );
};

export default PaymentsList;


