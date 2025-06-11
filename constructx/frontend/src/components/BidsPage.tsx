import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Loader2, Plus, Filter, Download, MoreHorizontal, Search, ArrowUpDown, Calendar, DollarSign, Users, BarChart } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import BidPipeline from "./BidPipeline";
import BidsList from "./BidsList";

// Bid status options with colors
const bidStatuses = [
  { value: "draft", label: "Draft", color: "bg-gray-200 text-gray-800" },
  { value: "submitted", label: "Submitted", color: "bg-blue-200 text-blue-800" },
  { value: "under-review", label: "Under Review", color: "bg-amber-200 text-amber-800" },
  { value: "won", label: "Won", color: "bg-green-200 text-green-800" },
  { value: "lost", label: "Lost", color: "bg-red-200 text-red-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-purple-200 text-purple-800" }
];

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Mock data for initial development - will be replaced with API calls
const mockBidMetrics = {
  totalBids: 24,
  activeBids: 18,
  totalValue: 4750000,
  avgWinRate: 42,
  byStatus: [
    { status: "Draft", count: 5, value: 850000 },
    { status: "Submitted", count: 8, value: 1750000 },
    { status: "Under Review", count: 5, value: 1250000 },
    { status: "Won", count: 3, value: 650000 },
    { status: "Lost", count: 2, value: 200000 },
    { status: "Cancelled", count: 1, value: 50000 }
  ]
};

const BidsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [viewMode, setViewMode] = useState("pipeline");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bids, setBids] = useState([]);
  const [metrics, setMetrics] = useState(mockBidMetrics);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "all",
    minValue: "",
    maxValue: "",
    assignedTo: "all"
  });
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAddBidDialog, setShowAddBidDialog] = useState(false);

  // Fetch bids data
  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This will be replaced with actual API call
        // const response = await bidService.getBids(filters);
        // setBids(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setBids(generateMockBids());
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError("Failed to load bids. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchBids();
  }, [filters]);

  // Generate mock bids for development
  const generateMockBids = () => {
    const statuses = ["draft", "submitted", "under-review", "won", "lost", "cancelled"];
    const clients = ["Acme Construction", "BuildWell Inc.", "City Development", "Downtown Properties", "Eastside Builders"];
    const users = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Wilson"];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: `bid-${i + 1}`,
      name: `Bid ${i + 1} - ${["Office Building", "Residential Complex", "Shopping Center", "Hospital Wing", "School Renovation"][i % 5]}`,
      bidNumber: `BID-2025-${1000 + i}`,
      clientId: `client-${(i % 5) + 1}`,
      clientName: clients[i % clients.length],
      description: `Proposal for construction project in ${["Downtown", "Westside", "Northpark", "Eastville", "Southbay"][i % 5]}`,
      status: statuses[i % statuses.length],
      submissionDate: new Date(2025, 5, i + 1).toISOString(),
      dueDate: new Date(2025, 5, i + 15).toISOString(),
      estimatedValue: Math.floor((Math.random() * 500000) + 50000),
      finalValue: i % 3 === 0 ? Math.floor((Math.random() * 500000) + 50000) : null,
      estimatedStartDate: new Date(2025, 8, i + 1).toISOString(),
      estimatedDuration: Math.floor((Math.random() * 12) + 1),
      probability: Math.floor((Math.random() * 100) + 1),
      assignedTo: `user-${(i % 5) + 1}`,
      assignedToName: users[i % users.length],
      createdAt: new Date(2025, 4, i + 1).toISOString(),
      updatedAt: new Date(2025, 4, i + 10).toISOString(),
      tags: [
        ["commercial", "new-construction", "high-priority"][i % 3],
        ["urban", "suburban", "rural"][i % 3]
      ]
    }));
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle search input
  const handleSearchChange = (e) => {
    handleFilterChange("search", e.target.value);
  };

  // Handle add new bid
  const handleAddBid = () => {
    setShowAddBidDialog(true);
  };

  // Handle bid click
  const handleBidClick = (bidId) => {
    navigate(`/bids/${bidId}`);
  };

  // Handle export bids
  const handleExportBids = (format) => {
    toast({
      title: "Export Started",
      description: `Exporting bids as ${format.toUpperCase()}...`
    });
    
    // This will be replaced with actual export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Bids exported as ${format.toUpperCase()} successfully.`
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bids Management</h1>
          <p className="text-muted-foreground">Create, track, and manage bid proposals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddBid}>
            <Plus className="h-4 w-4 mr-2" /> Add Bid
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExportBids("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportBids("pdf")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportBids("csv")}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
              <h3 className="text-2xl font-bold">{metrics.totalBids}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Bids</p>
              <h3 className="text-2xl font-bold">{metrics.activeBids}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Win Rate</p>
              <h3 className="text-2xl font-bold">{metrics.avgWinRate}%</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bids..."
              className="pl-8"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {bidStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </Button>
        </div>
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setIsLoading(true);
                setError(null);
                setTimeout(() => {
                  setBids(generateMockBids());
                  setIsLoading(false);
                }, 1000);
              }}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-4">
          {viewMode === "pipeline" ? (
            <BidPipeline 
              bids={bids} 
              statuses={bidStatuses} 
              onBidClick={handleBidClick} 
              onStatusChange={(bidId, newStatus) => {
                console.log(`Bid ${bidId} status changed to ${newStatus}`);
                // Will be replaced with actual API call
              }}
            />
          ) : (
            <BidsList 
              bids={bids} 
              statuses={bidStatuses} 
              onBidClick={handleBidClick} 
              onStatusChange={(bidId, newStatus) => {
                console.log(`Bid ${bidId} status changed to ${newStatus}`);
                // Will be replaced with actual API call
              }}
            />
          )}
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Bids</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down your bid list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minValue">Min Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minValue"
                    placeholder="Min value"
                    className="pl-8"
                    value={filters.minValue}
                    onChange={(e) => handleFilterChange("minValue", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxValue">Max Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxValue"
                    placeholder="Max value"
                    className="pl-8"
                    value={filters.maxValue}
                    onChange={(e) => handleFilterChange("maxValue", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange("assignedTo", value)}>
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="user-1">John Doe</SelectItem>
                  <SelectItem value="user-2">Jane Smith</SelectItem>
                  <SelectItem value="user-3">Robert Johnson</SelectItem>
                  <SelectItem value="user-4">Emily Davis</SelectItem>
                  <SelectItem value="user-5">Michael Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setFilters({
                status: "all",
                search: "",
                dateRange: "all",
                minValue: "",
                maxValue: "",
                assignedTo: "all"
              });
              setShowFilterDialog(false);
            }}>
              Reset
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Bid Dialog - Will be replaced with BidForm component */}
      <Dialog open={showAddBidDialog} onOpenChange={setShowAddBidDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Bid</DialogTitle>
            <DialogDescription>
              Create a new bid proposal for a potential project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              This dialog will be replaced with the BidForm component.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddBidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Bid Created",
                description: "New bid has been created successfully."
              });
              setShowAddBidDialog(false);
            }}>
              Create Bid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidsPage;
