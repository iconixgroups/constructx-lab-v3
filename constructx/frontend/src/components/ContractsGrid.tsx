import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Eye, Edit, MoreHorizontal, Trash2, Copy, FileText, Calendar, DollarSign, Building } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
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

interface ContractsGridProps {
  contracts: Contract[];
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContractsGrid: React.FC<ContractsGridProps> = ({
  contracts,
  onViewDetails,
  onDelete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
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
  
  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contracts.map(contract => (
          <Card key={contract.id} className="overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div 
                    className="font-medium text-lg hover:underline cursor-pointer"
                    onClick={() => onViewDetails(contract.id)}
                  >
                    {contract.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{contract.contractNumber}</div>
                </div>
                <Badge className={`${getStatusColor(contract.status)}`}>
                  {contract.status}
                </Badge>
              </div>
              
              <div className="mt-2 text-sm line-clamp-2 text-muted-foreground">
                {contract.description}
              </div>
              
              {contract.tags && contract.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {contract.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <CardContent className="p-4 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Client</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{contract.clientName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Value</div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatCurrency(contract.value)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Start Date</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(contract.startDate)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">End Date</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(contract.endDate)}
                  </div>
                </div>
              </div>
              
              {contract.status === "Active" && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Contract Timeline</div>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {(() => {
                      const startDate = new Date(contract.startDate);
                      const endDate = new Date(contract.endDate);
                      const today = new Date();
                      
                      const totalDuration = endDate.getTime() - startDate.getTime();
                      const elapsed = today.getTime() - startDate.getTime();
                      
                      const progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
                      
                      return (
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{getDaysRemaining(contract.endDate) > 0 ? `${getDaysRemaining(contract.endDate)} days remaining` : "Overdue"}</span>
                    <span>{Math.round(((new Date().getTime() - new Date(contract.startDate).getTime()) / 
                      (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime())) * 100)}% complete</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  {contract.contractType}
                </div>
                <div className="flex items-center space-x-1">
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
              </div>
            </CardContent>
          </Card>
        ))}
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

export default ContractsGrid;
