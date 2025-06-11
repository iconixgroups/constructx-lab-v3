import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { Edit, Trash2, MoreHorizontal, Eye, Copy, FileText, Calendar, DollarSign, Building, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

interface Contract {
  id: string;
  contractNumber: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  contractType: string;
  status: string;
  value: number;
  startDate: string;
  endDate: string;
  executionDate: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface ContractsListProps {
  contracts: Contract[];
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContractsList: React.FC<ContractsListProps> = ({
  contracts,
  onViewDetails,
  onDelete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContracts(contracts.map(contract => contract.id));
    } else {
      setSelectedContracts([]);
    }
  };
  
  // Handle select one
  const handleSelectOne = (checked: boolean, contractId: string) => {
    if (checked) {
      setSelectedContracts(prev => [...prev, contractId]);
    } else {
      setSelectedContracts(prev => prev.filter(id => id !== contractId));
    }
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setContractToDelete(id);
    setShowDeleteDialog(true);
  };
  
  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (contractToDelete) {
      onDelete(contractToDelete);
      setShowDeleteDialog(false);
      setContractToDelete(null);
    }
  };
  
  // Handle duplicate contract
  const handleDuplicate = (id: string) => {
    // In a real implementation, this would call the backend to duplicate
    toast({
      title: "Duplicating Contract",
      description: "Contract duplication in progress..."
    });
    
    // Navigate to the new contract after a brief delay (simulating API call)
    setTimeout(() => {
      toast({
        title: "Contract Duplicated",
        description: "Contract has been duplicated successfully."
      });
      // In a real implementation, we would navigate to the new contract ID returned from the API
      navigate(`/contracts/${id}-copy`);
    }, 1000);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Negotiation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Pending Signature":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Terminated":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedContracts.length === contracts.length && contracts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all contracts"
                />
              </TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map(contract => (
              <TableRow key={contract.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedContracts.includes(contract.id)}
                    onCheckedChange={(checked) => handleSelectOne(checked as boolean, contract.id)}
                    aria-label={`Select contract ${contract.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium hover:underline cursor-pointer" onClick={() => onViewDetails(contract.id)}>
                          {contract.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{contract.contractNumber}</div>
                      </div>
                    </div>
                    {contract.tags && contract.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contract.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contract.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{contract.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{contract.clientName}</span>
                  </div>
                </TableCell>
                <TableCell>{contract.contractType}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {formatCurrency(contract.value)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">Start: {formatDate(contract.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">End: {formatDate(contract.endDate)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(contract.id)}
                      title="View Contract"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                      title="Edit Contract"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/contracts/${contract.id}/documents`)}>
                          <FileText className="h-4 w-4 mr-2" /> View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(contract.id)}>
                          <Copy className="h-4 w-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(contract.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Confirm Deletion</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this contract? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractsList;
