import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, ChevronRight, MoreHorizontal, AlertTriangle, Calendar, Link } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getScheduleItems: async (scheduleId) => {
    console.log("Fetching schedule items for:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: "item1",
        name: "Project Planning Phase",
        type: "Phase",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        duration: 32,
        completionPercentage: 100,
        status: "Completed",
        assignedTo: {
          id: "user1",
          name: "John Smith",
          avatar: null
        },
        dependencies: [],
        level: 0,
        children: [
          {
            id: "item1-1",
            name: "Requirements Gathering",
            type: "Task",
            startDate: "2024-01-15",
            endDate: "2024-01-25",
            duration: 11,
            completionPercentage: 100,
            status: "Completed",
            assignedTo: {
              id: "user2",
              name: "Emily Johnson",
              avatar: null
            },
            dependencies: [],
            level: 1
          },
          {
            id: "item1-2",
            name: "Initial Design",
            type: "Task",
            startDate: "2024-01-20",
            endDate: "2024-02-05",
            duration: 17,
            completionPercentage: 100,
            status: "Completed",
            assignedTo: {
              id: "user3",
              name: "Michael Chen",
              avatar: null
            },
            dependencies: [
              { id: "dep1", predecessorId: "item1-1", type: "Finish-to-Start", lag: 0 }
            ],
            level: 1
          },
          {
            id: "item1-3",
            name: "Planning Complete",
            type: "Milestone",
            startDate: "2024-02-15",
            endDate: "2024-02-15",
            duration: 0,
            completionPercentage: 100,
            status: "Completed",
            assignedTo: null,
            dependencies: [
              { id: "dep2", predecessorId: "item1-2", type: "Finish-to-Start", lag: 5 }
            ],
            level: 1
          }
        ]
      },
      {
        id: "item2",
        name: "Foundation Work",
        type: "Phase",
        startDate: "2024-02-20",
        endDate: "2024-04-10",
        duration: 50,
        completionPercentage: 85,
        status: "In Progress",
        assignedTo: {
          id: "user4",
          name: "Sarah Wilson",
          avatar: null
        },
        dependencies: [
          { id: "dep3", predecessorId: "item1-3", type: "Finish-to-Start", lag: 2 }
        ],
        level: 0,
        children: [
          {
            id: "item2-1",
            name: "Site Preparation",
            type: "Task",
            startDate: "2024-02-20",
            endDate: "2024-03-05",
            duration: 14,
            completionPercentage: 100,
            status: "Completed",
            assignedTo: {
              id: "user5",
              name: "Robert Davis",
              avatar: null
            },
            dependencies: [],
            level: 1
          },
          {
            id: "item2-2",
            name: "Excavation",
            type: "Task",
            startDate: "2024-03-01",
            endDate: "2024-03-20",
            duration: 20,
            completionPercentage: 100,
            status: "Completed",
            assignedTo: {
              id: "user6",
              name: "Jessica Brown",
              avatar: null
            },
            dependencies: [
              { id: "dep4", predecessorId: "item2-1", type: "Start-to-Start", lag: 5 }
            ],
            level: 1
          },
          {
            id: "item2-3",
            name: "Foundation Pouring",
            type: "Task",
            startDate: "2024-03-15",
            endDate: "2024-04-05",
            duration: 22,
            completionPercentage: 70,
            status: "In Progress",
            assignedTo: {
              id: "user7",
              name: "David Miller",
              avatar: null
            },
            dependencies: [
              { id: "dep5", predecessorId: "item2-2", type: "Finish-to-Start", lag: 0 }
            ],
            level: 1
          },
          {
            id: "item2-4",
            name: "Foundation Inspection",
            type: "Milestone",
            startDate: "2024-04-10",
            endDate: "2024-04-10",
            duration: 0,
            completionPercentage: 0,
            status: "Not Started",
            assignedTo: {
              id: "user8",
              name: "Lisa Taylor",
              avatar: null
            },
            dependencies: [
              { id: "dep6", predecessorId: "item2-3", type: "Finish-to-Start", lag: 3 }
            ],
            level: 1
          }
        ]
      },
      {
        id: "item3",
        name: "Framing",
        type: "Phase",
        startDate: "2024-04-15",
        endDate: "2024-06-30",
        duration: 77,
        completionPercentage: 0,
        status: "Not Started",
        assignedTo: {
          id: "user9",
          name: "James Wilson",
          avatar: null
        },
        dependencies: [
          { id: "dep7", predecessorId: "item2-4", type: "Finish-to-Start", lag: 2 }
        ],
        level: 0,
        children: [
          {
            id: "item3-1",
            name: "First Floor Framing",
            type: "Task",
            startDate: "2024-04-15",
            endDate: "2024-05-15",
            duration: 31,
            completionPercentage: 0,
            status: "Not Started",
            assignedTo: {
              id: "user10",
              name: "Thomas Anderson",
              avatar: null
            },
            dependencies: [],
            level: 1
          },
          {
            id: "item3-2",
            name: "Second Floor Framing",
            type: "Task",
            startDate: "2024-05-10",
            endDate: "2024-06-10",
            duration: 32,
            completionPercentage: 0,
            status: "Not Started",
            assignedTo: {
              id: "user11",
              name: "Patricia Martinez",
              avatar: null
            },
            dependencies: [
              { id: "dep8", predecessorId: "item3-1", type: "Start-to-Start", lag: 20 }
            ],
            level: 1
          },
          {
            id: "item3-3",
            name: "Roof Framing",
            type: "Task",
            startDate: "2024-06-01",
            endDate: "2024-06-25",
            duration: 25,
            completionPercentage: 0,
            status: "Not Started",
            assignedTo: {
              id: "user12",
              name: "Christopher Lee",
              avatar: null
            },
            dependencies: [
              { id: "dep9", predecessorId: "item3-2", type: "Start-to-Start", lag: 15 }
            ],
            level: 1
          },
          {
            id: "item3-4",
            name: "Framing Inspection",
            type: "Milestone",
            startDate: "2024-06-30",
            endDate: "2024-06-30",
            duration: 0,
            completionPercentage: 0,
            status: "Not Started",
            assignedTo: {
              id: "user8",
              name: "Lisa Taylor",
              avatar: null
            },
            dependencies: [
              { id: "dep10", predecessorId: "item3-3", type: "Finish-to-Start", lag: 3 }
            ],
            level: 1
          }
        ]
      }
    ];
  }
};

// Helper functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Status color mapping
const statusColors = {
  "Completed": "bg-green-500 text-white",
  "In Progress": "bg-blue-500 text-white",
  "Not Started": "bg-gray-300 text-gray-700",
  "On Hold": "bg-amber-500 text-white",
  "Delayed": "bg-red-500 text-white"
};

// Type badge mapping
const typeBadges = {
  "Phase": "bg-purple-100 text-purple-800 border-purple-300",
  "Task": "bg-blue-100 text-blue-800 border-blue-300",
  "Milestone": "bg-amber-100 text-amber-800 border-amber-300",
  "Summary": "bg-green-100 text-green-800 border-green-300"
};

const ScheduleListView = ({ scheduleId, dateRange }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Fetch schedule items
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    mockApi.getScheduleItems(scheduleId)
      .then(data => {
        setScheduleItems(data);
        
        // Initialize expanded state for all parent items
        const expanded = {};
        data.forEach(item => {
          expanded[item.id] = true; // Default to expanded
        });
        setExpandedItems(expanded);
      })
      .catch(err => {
        console.error("Failed to load schedule items:", err);
        setError("Failed to load schedule data. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId]);
  
  // Toggle expanded state for an item
  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Handle item selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === flattenedItems.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(flattenedItems.map(item => item.id));
    }
  };
  
  // Handle item click for details
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemDialog(true);
  };
  
  // Flatten and filter items based on search and expansion
  const flattenItems = (items, result = []) => {
    items.forEach(item => {
      result.push(item);
      
      if (item.children && item.children.length > 0 && expandedItems[item.id]) {
        flattenItems(item.children, result);
      }
    });
    
    return result;
  };
  
  // Apply search filter
  const filterItems = (items) => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.status.toLowerCase().includes(query) ||
      (item.assignedTo && item.assignedTo.name.toLowerCase().includes(query))
    );
  };
  
  // Apply sorting
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "startDate":
          valueA = new Date(a.startDate);
          valueB = new Date(b.startDate);
          break;
        case "endDate":
          valueA = new Date(a.endDate);
          valueB = new Date(b.endDate);
          break;
        case "duration":
          valueA = a.duration;
          valueB = b.duration;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "completionPercentage":
          valueA = a.completionPercentage;
          valueB = b.completionPercentage;
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }
      
      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };
  
  // Process items for display
  const processedItems = flattenItems(scheduleItems);
  const filteredItems = filterItems(processedItems);
  const flattenedItems = sortItems(filteredItems);
  
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };
  
  // Render item details dialog
  const renderItemDetailsDialog = () => {
    if (!selectedItem) return null;
    
    return (
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Badge className={`mr-2 ${typeBadges[selectedItem.type]}`}>
                {selectedItem.type}
              </Badge>
              {selectedItem.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Start Date</h4>
              <p className="text-sm">{formatDate(selectedItem.startDate)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">End Date</h4>
              <p className="text-sm">{formatDate(selectedItem.endDate)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Duration</h4>
              <p className="text-sm">{selectedItem.duration} days</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge className={statusColors[selectedItem.status]}>
                {selectedItem.status}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Completion</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${selectedItem.completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1">{selectedItem.completionPercentage}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Assigned To</h4>
              <p className="text-sm">
                {selectedItem.assignedTo ? selectedItem.assignedTo.name : "Unassigned"}
              </p>
            </div>
            
            {selectedItem.dependencies && selectedItem.dependencies.length > 0 && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-1">Dependencies</h4>
                <div className="space-y-1">
                  {selectedItem.dependencies.map(dep => (
                    <div key={dep.id} className="flex items-center text-sm">
                      <Link className="h-3 w-3 mr-1" />
                      <span>{dep.type} with {dep.lag} day{dep.lag !== 1 ? 's' : ''} lag</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>Close</Button>
            <Button variant="outline">Edit</Button>
            <Button>View in Gantt</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading schedule items...</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertTriangle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }
  
  return (
    <div className="schedule-list-container flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Add Item</Button>
          <Button variant="outline" size="sm">Add Milestone</Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={selectedItems.length === 0}>
                Edit Selected
              </DropdownMenuItem>
              <DropdownMenuItem disabled={selectedItems.length === 0}>
                Delete Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                Expand All
              </DropdownMenuItem>
              <DropdownMenuItem>
                Collapse All
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-md overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedItems.length === flattenedItems.length && flattenedItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {renderSortIndicator("name")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Start Date {renderSortIndicator("startDate")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  End Date {renderSortIndicator("endDate")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("duration")}
                >
                  Duration {renderSortIndicator("duration")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIndicator("status")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("completionPercentage")}
                >
                  Progress {renderSortIndicator("completionPercentage")}
                </TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No items match your search" : "No schedule items found"}
                  </TableCell>
                </TableRow>
              ) : (
                flattenedItems.map(item => (
                  <TableRow 
                    key={item.id}
                    className={`${item.level > 0 ? 'bg-muted/30' : ''}`}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center"
                        style={{ paddingLeft: `${item.level * 20}px` }}
                      >
                        {item.children && item.children.length > 0 && (
                          <button 
                            onClick={() => toggleExpand(item.id)}
                            className="mr-1 p-1 rounded-sm hover:bg-muted"
                          >
                            <ChevronRight 
                              className={`h-4 w-4 transition-transform ${expandedItems[item.id] ? 'rotate-90' : ''}`} 
                            />
                          </button>
                        )}
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <Badge className={`mr-2 ${typeBadges[item.type]}`}>
                            {item.type.charAt(0)}
                          </Badge>
                          <span className={item.type === "Milestone" ? "font-medium" : ""}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.startDate)}</TableCell>
                    <TableCell>{formatDate(item.endDate)}</TableCell>
                    <TableCell>
                      {item.type === "Milestone" ? "0" : `${item.duration} days`}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${item.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs whitespace-nowrap">{item.completionPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.assignedTo ? item.assignedTo.name : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleItemClick(item)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                          <DropdownMenuItem>Add Dependency</DropdownMenuItem>
                          <DropdownMenuItem>Update Progress</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Summary */}
      <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
        <div>
          {selectedItems.length > 0 ? (
            <span>{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
          ) : (
            <span>Showing {flattenedItems.length} item{flattenedItems.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-1"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 mr-1"></div>
            <span>Not Started</span>
          </div>
        </div>
      </div>
      
      {/* Item Details Dialog */}
      {renderItemDetailsDialog()}
    </div>
  );
};

export default ScheduleListView;
