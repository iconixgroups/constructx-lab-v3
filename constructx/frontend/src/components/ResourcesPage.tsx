import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { List, LayoutGrid, Search, Filter, SortAsc, Plus, Download, Users, Wrench, Package, AlertTriangle } from "lucide-react";
import ResourcesList from "./ResourcesList";
import ResourcesGrid from "./ResourcesGrid";
import ResourceForm from "./ResourceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import resourceService from "../services/resourceService"; // Import the service

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [metrics, setMetrics] = useState(null); // Assuming metrics endpoint exists or calculated client-side
  const [viewMode, setViewMode] = useState("list"); // list, grid
  const [activeTab, setActiveTab] = useState("All"); // All, Labor, Equipment, Material
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");
  const [filters, setFilters] = useState({}); // Add more specific filters as needed
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [error, setError] = useState(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // State to trigger refetch

  // Function to load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = {
        search: searchQuery || undefined,
        sort: sortOption || undefined,
        ...filters,
      };
      // Map "All" tab to no type filter
      if (activeTab !== "All") {
        queryParams.type = activeTab;
      }
      
      // Fetch resources using the service
      const resourcesData = await resourceService.getResources(queryParams);
      setResources(resourcesData.data || resourcesData); // Adjust based on API response structure
      
      // Fetch metrics (assuming endpoint exists)
      // If not, calculate metrics from resourcesData
      // const metricsData = await resourceService.getResourceMetrics(); 
      // setMetrics(metricsData);
      
      // Example: Calculate metrics client-side if no dedicated endpoint
      const calculatedMetrics = {
          totalResources: resourcesData.length,
          laborCount: resourcesData.filter(r => r.type === 'Labor').length,
          equipmentCount: resourcesData.filter(r => r.type === 'Equipment').length,
          materialCount: resourcesData.filter(r => r.type === 'Material').length,
          // Add other counts as needed (available, allocated etc.) based on resource properties
      };
      setMetrics(calculatedMetrics);

    } catch (err) {
      console.error("Failed to load resources data:", err);
      setError("Failed to load resources. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, sortOption, filters, triggerRefetch]); // Add triggerRefetch dependency

  // Fetch resources and metrics on mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]); // Use the memoized loadData function
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle search input change (debounced search might be better)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Consider adding debounce here to avoid API calls on every keystroke
  };
  
  // Handle sort change
  const handleSortChange = (value) => {
    setSortOption(value);
  };
  
  // Handle filter change (example)
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Handle save new resource
  const handleSaveResource = async (newResourceData) => {
    try {
      await resourceService.createResource(newResourceData);
      setShowAddDialog(false);
      setTriggerRefetch(prev => prev + 1); // Trigger refetch
    } catch (saveError) {
      console.error("Failed to save resource:", saveError);
      // Display error to user within the form or as a toast
      setError("Failed to save the new resource."); 
    }
  };
  
  // Function to trigger refetch from child components (List/Grid)
  const requestRefetch = () => {
      setTriggerRefetch(prev => prev + 1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Resources Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled> {/* Add export functionality later */}
            <Download className="h-4 w-4 mr-2" />
            Export Resources
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              {/* Pass service methods to form if needed for validation (e.g., check name uniqueness) */}
              <ResourceForm 
                onSave={handleSaveResource} 
                onCancel={() => setShowAddDialog(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Metrics Summary - Calculated client-side for now */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalResources}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Labor</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.laborCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.equipmentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materials</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.materialCount}</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Tabs and Controls */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Labor">Labor</TabsTrigger>
            <TabsTrigger value="Equipment">Equipment</TabsTrigger>
            <TabsTrigger value="Material">Material</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8 w-full sm:w-48"
                value={searchQuery}
                onChange={handleSearchChange} // Use updated handler
              />
            </div>
            
            <DropdownMenu> {/* Add actual filter functionality */}
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterChange("status", "Available")}>Status: Available</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("status", "Allocated")}>Status: Allocated</DropdownMenuItem>
                {/* Add more filters based on available API params */}
                 <DropdownMenuItem onClick={() => setFilters({})}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="cost_asc">Cost (Low to High)</SelectItem>
                <SelectItem value="cost_desc">Cost (High to Low)</SelectItem>
                <SelectItem value="status_asc">Status</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-1 border rounded-md p-1">
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center p-8">Loading resources...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500 flex items-center justify-center">
               <AlertTriangle className="h-5 w-5 mr-2" /> {error}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No resources found matching your criteria.
            </div>
          ) : (
            // Use a key based on the activeTab to force re-render of content on tab change if needed
            <TabsContent key={activeTab} value={activeTab} className="mt-0">
              {viewMode === "list" ? (
                <ResourcesList resources={resources} requestRefetch={requestRefetch} />
              ) : (
                <ResourcesGrid resources={resources} requestRefetch={requestRefetch} />
              )}
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;
