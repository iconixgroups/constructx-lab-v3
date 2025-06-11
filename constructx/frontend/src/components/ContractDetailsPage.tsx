import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { 
  Edit, 
  MoreHorizontal, 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  Building, 
  User, 
  Copy, 
  Trash2, 
  Clock, 
  Users, 
  FileUp, 
  History, 
  Milestone, 
  GitBranch, 
  Loader2 
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";
import ContractPartiesComponent from "./ContractPartiesComponent";
import ContractSectionsComponent from "./ContractSectionsComponent";
import ContractDocumentsComponent from "./ContractDocumentsComponent";
import ContractMilestonesComponent from "./ContractMilestonesComponent";
import ChangeOrdersComponent from "./ChangeOrdersComponent";
import ContractVersionsComponent from "./ContractVersionsComponent";
import { contractService } from "../services/contractService";

const ContractDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch contract details
  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await contractService.getContract(id);
        setContract(response.data);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Failed to load contract details. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load contract details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContractDetails();
  }, [id, toast]);
  
  // Handle delete contract
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      await contractService.deleteContract(id);
      toast({
        title: "Success",
        description: "Contract deleted successfully."
      });
      navigate("/contracts");
    } catch (err) {
      console.error("Error deleting contract:", err);
      toast({
        title: "Error",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  // Handle duplicate contract
  const handleDuplicateContract = async () => {
    if (!id) return;
    
    setIsDuplicating(true);
    
    try {
      const response = await contractService.duplicateContract(id);
      toast({
        title: "Success",
        description: "Contract duplicated successfully."
      });
      navigate(`/contracts/${response.data.id}`);
    } catch (err) {
      console.error("Error duplicating contract:", err);
      toast({
        title: "Error",
        description: "Failed to duplicate contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDuplicating(false);
    }
  };
  
  // Handle export contract
  const handleExportContract = async () => {
    if (!id) return;
    
    setIsExporting(true);
    
    try {
      await contractService.exportContract(id);
      toast({
        title: "Export Complete",
        description: "Contract has been exported successfully."
      });
    } catch (err) {
      console.error("Error exporting contract:", err);
      toast({
        title: "Error",
        description: "Failed to export contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
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
  
  if (isLoading && !contract) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading contract details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Contract not found.</p>
            <Button onClick={() => navigate("/contracts")}>Back to Contracts</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{contract.name}</h1>
              <Badge className={`${getStatusColor(contract.status)}`}>
                {contract.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{contract.contractNumber}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate(`/contracts/${id}/edit`)}
              disabled={isLoading || isExporting || isDuplicating || isDeleting}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Contract
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={isLoading || isExporting || isDuplicating || isDeleting}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...
                    </>
                  ) : isDuplicating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Duplicating...
                    </>
                  ) : (
                    <>
                      <MoreHorizontal className="h-4 w-4 mr-2" /> Actions
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleExportContract}
                  disabled={isExporting || isDuplicating || isDeleting}
                >
                  <Download className="h-4 w-4 mr-2" /> Export Contract
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDuplicateContract}
                  disabled={isExporting || isDuplicating || isDeleting}
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicate Contract
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteClick}
                  className="text-red-600"
                  disabled={isExporting || isDuplicating || isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Contract
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Contract Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <h3 className="text-lg font-medium">{contract.clientName}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contract Value</p>
                <h3 className="text-lg font-medium">{formatCurrency(contract.value)}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <h3 className="text-lg font-medium">
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contract Timeline (for Active contracts) */}
        {contract.status === "Active" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contract Timeline</CardTitle>
            </CardHeader>
            <CardContent>
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
              <div className="flex justify-between text-sm mt-2">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(contract.startDate)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Progress</p>
                  <p className="font-medium">
                    {Math.round(((new Date().getTime() - new Date(contract.startDate).getTime()) / 
                      (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime())) * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(contract.endDate)}</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <Badge variant="outline" className="font-medium">
                  {getDaysRemaining(contract.endDate) > 0 
                    ? `${getDaysRemaining(contract.endDate)} days remaining` 
                    : "Contract Overdue"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="changes">Change Orders</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1">{contract.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contract Type</h3>
                    <p className="mt-1">{contract.contractType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Execution Date</h3>
                    <p className="mt-1">{formatDate(contract.executionDate)}</p>
                  </div>
                </div>
                
                {contract.tags && contract.tags.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {contract.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contract History</h3>
                  <div className="text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Created by</span>
                      <span>{contract.createdByName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Created on</span>
                      <span>{formatDate(contract.createdAt)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Last updated</span>
                      <span>{formatDate(contract.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Parties Tab */}
          <TabsContent value="parties" className="pt-4">
            <ContractPartiesComponent contractId={id || ''} />
          </TabsContent>
          
          {/* Sections Tab */}
          <TabsContent value="sections" className="pt-4">
            <ContractSectionsComponent contractId={id || ''} />
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="pt-4">
            <ContractDocumentsComponent contractId={id || ''} />
          </TabsContent>
          
          {/* Milestones Tab */}
          <TabsContent value="milestones" className="pt-4">
            <ContractMilestonesComponent contractId={id || ''} />
          </TabsContent>
          
          {/* Change Orders Tab */}
          <TabsContent value="changes" className="pt-4">
            <ChangeOrdersComponent contractId={id || ''} />
          </TabsContent>
          
          {/* Versions Tab */}
          <TabsContent value="versions" className="pt-4">
            <ContractVersionsComponent contractId={id || ''} />
          </TabsContent>
        </Tabs>
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
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractDetailsPage;
