import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Search, Filter, Grid3X3, List, MoreHorizontal, Download, FileText, Calendar, DollarSign, Building, User, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import ContractsList from "./ContractsList";
import ContractsGrid from "./ContractsGrid";
import ContractForm from "./ContractForm";
import { contractService } from "../services/contractService";

const ContractsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    client: "all",
    dateRange: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    value: 0
  });
  const [clients, setClients] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Contract status options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Draft", label: "Draft" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Pending Signature", label: "Pending Signature" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Terminated", label: "Terminated" }
  ];

  // Contract type options
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "Fixed Price", label: "Fixed Price" },
    { value: "Time & Materials", label: "Time & Materials" },
    { value: "Cost Plus", label: "Cost Plus" },
    { value: "Unit Price", label: "Unit Price" },
    { value: "Guaranteed Maximum Price", label: "Guaranteed Maximum Price" }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "current", label: "Current Contracts" },
    { value: "upcoming", label: "Starting Soon" },
    { value: "ending", label: "Ending Soon" },
    { value: "past", label: "Past Contracts" }
  ];

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await contractService.getContracts();
        setContracts(response.data);
        setFilteredContracts(response.data);
        
        // Calculate metrics
        const total = response.data.length;
        const active = response.data.filter(c => c.status === "Active").length;
        const pending = response.data.filter(c => c.status === "Pending Signature" || c.status === "Negotiation").length;
        const completed = response.data.filter(c => c.status === "Completed").length;
        const value = response.data.reduce((sum, contract) => sum + (contract.value || 0), 0);
        
        setMetrics({
          total,
          active,
          pending,
          completed,
          value
        });
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError("Failed to load contracts. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load contracts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch clients for filtering
    const fetchClients = async () => {
      try {
        // In a real implementation, this would be a separate API call
        // For now, we'll extract client info from contracts
        const uniqueClients = {};
        contracts.forEach(contract => {
          if (contract.clientId && contract.clientName) {
            uniqueClients[contract.clientId] = contract.clientName;
          }
        });
        
        const clientsList = Object.entries(uniqueClients).map(([id, name]) => ({
          id,
          name
        }));
        
        setClients(clientsList);
      } catch (err) {
        console.error("Error processing clients:", err);
      }
    };
    
    fetchContracts();
    
    // Only fetch clients after contracts are loaded
    if (contracts.length > 0) {
      fetchClients();
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (!contracts.length) return;
    
    let result = [...contracts];
    
    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter(contract => contract.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== "all") {
      result = result.filter(contract => contract.contractType === filters.type);
    }
    
    // Apply client filter
    if (filters.client !== "all") {
      result = result.filter(contract => contract.clientId === filters.client);
    }
    
    // Apply date range filter
    if (filters.dateRange !== "all") {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      switch (filters.dateRange) {
        case "current":
          result = result.filter(contract => {
            const startDate = new Date(contract.startDate);
            const endDate = new Date(contract.endDate);
            return startDate <= today && endDate >= today;
          });
          break;
        case "upcoming":
          result = result.filter(contract => {
            const startDate = new Date(contract.startDate);
            return startDate > today && startDate <= thirtyDaysFromNow;
          });
          break;
        case "ending":
          result = result.filter(contract => {
            const endDate = new Date(contract.endDate);
            return endDate > today && endDate <= thirtyDaysFromNow;
          });
          break;
        case "past":
          result = result.filter(contract => {
            const endDate = new Date(contract.endDate);
            return endDate < today;
          });
          break;
        default:
          break;
      }
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(contract => 
        contract.name.toLowerCase().includes(query) ||
        contract.contractNumber.toLowerCase().includes(query) ||
        contract.clientName.toLowerCase().includes(query) ||
        contract.description.toLowerCase().includes(query) ||
        (contract.tags && contract.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredContracts(result);
  }, [contracts, filters, searchQuery]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      client: "all",
      dateRange: "all"
    });
    setSearchQuery("");
  };

  // Handle add contract
  const handleAddContract = async (contractData) => {
    try {
      const response = await contractService.createContract(contractData);
      setContracts(prev => [...prev, response.data]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Contract created successfully."
      });
    } catch (err) {
      console.error("Error creating contract:", err);
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle export contracts
  const handleExportContracts = async () => {
    setIsExporting(true);
    
    try {
      // This would typically call an export API endpoint
      // For now, we'll simulate the export process
      toast({
        title: "Exporting Contracts",
        description: "Your contracts export is being prepared."
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Export Complete",
        description: "Contracts have been exported successfully."
      });
    } catch (err) {
      console.error("Error exporting contracts:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export contracts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle delete contract
  const handleDeleteContract = async (contractId) => {
    try {
      await contractService.deleteContract(contractId);
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      toast({
        title: "Success",
        description: "Contract deleted successfully."
      });
    } catch (err) {
      console.error(`Error deleting contract ${contractId}:`, err);
      toast({
        title: "Error",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage and track all contract agreements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Contract
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <MoreHorizontal className="h-4 w-4 mr-2" /> Actions
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportContracts} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" /> Export Contracts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/contract-templates")}>
                <FileText className="h-4 w-4 mr-2" /> Manage Templates
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Contracts</p>
              <h3 className="text-xl font-bold">{metrics.total}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
              <h3 className="text-xl font-bold">{metrics.active}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Contracts</p>
              <h3 className="text-xl font-bold">{metrics.pending}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <h3 className="text-xl font-bold">{metrics.completed}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <h3 className="text-xl font-bold">{formatCurrency(metrics.value)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contract Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Client</label>
                <Select
                  value={filters.client}
                  onValueChange={(value) => handleFilterChange("client", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => handleFilterChange("dateRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Contracts List/Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No contracts found matching your criteria.</p>
            <Button onClick={handleResetFilters}>Reset Filters</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            Showing {filteredContracts.length} of {contracts.length} contracts
          </div>
          {viewMode === "list" ? (
            <ContractsList 
              contracts={filteredContracts} 
              onDelete={handleDeleteContract}
              onViewDetails={(id) => navigate(`/contracts/${id}`)}
            />
          ) : (
            <ContractsGrid 
              contracts={filteredContracts} 
              onDelete={handleDeleteContract}
              onViewDetails={(id) => navigate(`/contracts/${id}`)}
            />
          )}
        </>
      )}
      
      {/* Add Contract Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Contract</DialogTitle>
            <DialogDescription>
              Create a new contract. Fill out the basic details below.
            </DialogDescription>
          </DialogHeader>
          <ContractForm onSubmit={handleAddContract} onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsPage;
