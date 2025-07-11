import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Send, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface QuotesListProps {
  quotes: any[];
  onEdit: (quote: any) => void;
  onDelete: (quote: any) => void;
  onSend: (quote: any) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({ quotes, onEdit, onDelete, onSend }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
      case "Converted":
        return "bg-green-100 text-green-800";
      case "Sent":
      case "Viewed":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Rejected":
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quote #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Recipient/Vendor</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No quotes found.
              </TableCell>
            </TableRow>
          ) : (
            quotes.map(quote => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                <TableCell>{quote.title}</TableCell>
                <TableCell>{quote.type}</TableCell>
                <TableCell>{quote.recipientCompany || quote.vendor}</TableCell>
                <TableCell>${quote.totalAmount.toFixed(2)} {quote.currency}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                </TableCell>
                <TableCell>{quote.issueDate}</TableCell>
                <TableCell>{quote.expiryDate}</TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(quote)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </DropdownMenuItem>
                      {quote.status === "Draft" && (
                        <DropdownMenuItem onClick={() => onSend(quote)}>
                          <Send className="mr-2 h-4 w-4" />Send Quote
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(quote)} className="text-red-600">
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

export default QuotesList;


