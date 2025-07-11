import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Send, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface InvoicesListProps {
  invoices: any[];
  onEdit: (invoice: any) => void;
  onDelete: (invoice: any) => void;
  onSend: (invoice: any) => void;
  onRecordPayment: (invoice: any) => void;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, onEdit, onDelete, onSend, onRecordPayment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Sent":
      case "Viewed":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client/Vendor</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.title}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.client || invoice.vendor}</TableCell>
                <TableCell>${invoice.totalAmount.toFixed(2)} {invoice.currency}</TableCell>
                <TableCell>${invoice.amountDue.toFixed(2)} {invoice.currency}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(invoice)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      {invoice.status === "Draft" && (
                        <DropdownMenuItem onClick={() => onSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />Send Invoice
                        </DropdownMenuItem>
                      )}
                      {invoice.status !== "Paid" && invoice.amountDue > 0 && (
                        <DropdownMenuItem onClick={() => onRecordPayment(invoice)}>
                          <DollarSign className="mr-2 h-4 w-4" />Record Payment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />Delete/Void
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

export default InvoicesList;


