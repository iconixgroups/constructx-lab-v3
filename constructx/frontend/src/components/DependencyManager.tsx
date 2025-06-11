import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { AlertCircle, Link as LinkIcon, Plus, X, ArrowRight, AlertTriangle } from "lucide-react";

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
      },
      {
        id: "item1-1",
        name: "Requirements Gathering",
        type: "Task",
        startDate: "2024-01-15",
        endDate: "2024-01-25",
      },
      {
        id: "item1-2",
        name: "Initial Design",
        type: "Task",
        startDate: "2024-01-20",
        endDate: "2024-02-05",
      },
      {
        id: "item1-3",
        name: "Planning Complete",
        type: "Milestone",
        startDate: "2024-02-15",
        endDate: "2024-02-15",
      },
      {
        id: "item2",
        name: "Foundation Work",
        type: "Phase",
        startDate: "2024-02-20",
        endDate: "2024-04-10",
      },
      {
        id: "item2-1",
        name: "Site Preparation",
        type: "Task",
        startDate: "2024-02-20",
        endDate: "2024-03-05",
      },
      {
        id: "item2-2",
        name: "Excavation",
        type: "Task",
        startDate: "2024-03-01",
        endDate: "2024-03-20",
      },
      {
        id: "item2-3",
        name: "Foundation Pouring",
        type: "Task",
        startDate: "2024-03-15",
        endDate: "2024-04-05",
      },
      {
        id: "item2-4",
        name: "Foundation Inspection",
        type: "Milestone",
        startDate: "2024-04-10",
        endDate: "2024-04-10",
      }
    ];
  },
  getDependencies: async (scheduleId) => {
    console.log("Fetching dependencies for:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: "dep1",
        predecessorId: "item1-1",
        successorId: "item1-2",
        type: "Finish-to-Start",
        lag: 0
      },
      {
        id: "dep2",
        predecessorId: "item1-2",
        successorId: "item1-3",
        type: "Finish-to-Start",
        lag: 5
      },
      {
        id: "dep3",
        predecessorId: "item1-3",
        successorId: "item2-1",
        type: "Finish-to-Start",
        lag: 2
      },
      {
        id: "dep4",
        predecessorId: "item2-1",
        successorId: "item2-2",
        type: "Start-to-Start",
        lag: 5
      },
      {
        id: "dep5",
        predecessorId: "item2-2",
        successorId: "item2-3",
        type: "Finish-to-Start",
        lag: 0
      },
      {
        id: "dep6",
        predecessorId: "item2-3",
        successorId: "item2-4",
        type: "Finish-to-Start",
        lag: 3
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

const DependencyManager = ({ scheduleId }) => {
  const [items, setItems] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDependency, setSelectedDependency] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  
  // New dependency form state
  const [newDependency, setNewDependency] = useState({
    predecessorId: "",
    successorId: "",
    type: "Finish-to-Start",
    lag: 0
  });
  
  // Load data
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      mockApi.getScheduleItems(scheduleId),
      mockApi.getDependencies(scheduleId)
    ])
      .then(([itemsData, depsData]) => {
        setItems(itemsData);
        setDependencies(depsData);
      })
      .catch(err => {
        console.error("Failed to load dependency data:", err);
        setError("Failed to load dependencies. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId]);
  
  // Reset new dependency form
  const resetNewDependencyForm = () => {
    setNewDependency({
      predecessorId: "",
      successorId: "",
      type: "Finish-to-Start",
      lag: 0
    });
  };
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewDependency(prev => ({
      ...prev,
      [field]: field === "lag" ? parseInt(value) : value
    }));
  };
  
  // Check for circular dependencies
  const wouldCreateCircular = (predecessorId, successorId) => {
    // Simple check: direct circular
    if (predecessorId === successorId) return true;
    
    // Check if there's already a path from successor to predecessor
    const visited = new Set();
    const queue = [successorId];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (visited.has(current)) continue;
      visited.add(current);
      
      const outgoingDeps = dependencies.filter(dep => dep.predecessorId === current);
      for (const dep of outgoingDeps) {
        if (dep.successorId === predecessorId) return true;
        queue.push(dep.successorId);
      }
    }
    
    return false;
  };
  
  // Handle add dependency
  const handleAddDependency = () => {
    const { predecessorId, successorId, type, lag } = newDependency;
    
    // Validation
    if (!predecessorId || !successorId) {
      setError("Please select both predecessor and successor tasks.");
      return;
    }
    
    if (predecessorId === successorId) {
      setError("A task cannot depend on itself.");
      return;
    }
    
    if (wouldCreateCircular(predecessorId, successorId)) {
      setError("This would create a circular dependency.");
      return;
    }
    
    // In a real app, save to the server
    const newDep = {
      id: `dep${dependencies.length + 1}`,
      predecessorId,
      successorId,
      type,
      lag
    };
    
    setDependencies(prev => [...prev, newDep]);
    setShowAddDialog(false);
    resetNewDependencyForm();
    setError(null);
  };
  
  // Handle edit dependency
  const handleEditDependency = () => {
    if (!selectedDependency) return;
    
    const { id, predecessorId, successorId, type, lag } = selectedDependency;
    
    // Validation
    if (!predecessorId || !successorId) {
      setError("Please select both predecessor and successor tasks.");
      return;
    }
    
    if (predecessorId === successorId) {
      setError("A task cannot depend on itself.");
      return;
    }
    
    // In a real app, update on the server
    setDependencies(prev => 
      prev.map(dep => dep.id === id ? { ...dep, type, lag } : dep)
    );
    
    setShowEditDialog(false);
    setSelectedDependency(null);
    setError(null);
  };
  
  // Handle delete dependency
  const handleDeleteDependency = (depId) => {
    // In a real app, delete from the server
    setDependencies(prev => prev.filter(dep => dep.id !== depId));
  };
  
  // Get item by ID
  const getItemById = (itemId) => {
    return items.find(item => item.id === itemId) || { name: "Unknown Item" };
  };
  
  // Render dependency type badge
  const renderDependencyTypeBadge = (type) => {
    const badges = {
      "Finish-to-Start": "bg-blue-100 text-blue-800 border-blue-300",
      "Start-to-Start": "bg-green-100 text-green-800 border-green-300",
      "Finish-to-Finish": "bg-purple-100 text-purple-800 border-purple-300",
      "Start-to-Finish": "bg-amber-100 text-amber-800 border-amber-300"
    };
    
    return (
      <Badge className={badges[type] || "bg-gray-100 text-gray-800 border-gray-300"}>
        {type}
      </Badge>
    );
  };
  
  // Render dependency list view
  const renderListView = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Predecessor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Successor</TableHead>
              <TableHead>Lag (days)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dependencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No dependencies defined
                </TableCell>
              </TableRow>
            ) : (
              dependencies.map(dep => (
                <TableRow key={dep.id}>
                  <TableCell>{getItemById(dep.predecessorId).name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {renderDependencyTypeBadge(dep.type)}
                      {dep.lag > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          +{dep.lag} days
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getItemById(dep.successorId).name}</TableCell>
                  <TableCell>{dep.lag}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedDependency(dep);
                          setShowEditDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDependency(dep.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render dependency matrix view
  const renderMatrixView = () => {
    return (
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background z-10">Tasks</TableHead>
              {items.map(item => (
                <TableHead key={item.id} className="min-w-[120px] text-center">
                  <div className="truncate max-w-[120px]">{item.name}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(predecessor => (
              <TableRow key={predecessor.id}>
                <TableCell className="sticky left-0 bg-background font-medium">
                  <div className="truncate max-w-[200px]">{predecessor.name}</div>
                </TableCell>
                {items.map(successor => {
                  const dep = dependencies.find(
                    d => d.predecessorId === predecessor.id && d.successorId === successor.id
                  );
                  
                  return (
                    <TableCell 
                      key={successor.id} 
                      className={`text-center ${predecessor.id === successor.id ? 'bg-muted/30' : ''}`}
                    >
                      {predecessor.id !== successor.id ? (
                        dep ? (
                          <div className="flex flex-col items-center">
                            <Badge className="mb-1">{dep.type}</Badge>
                            {dep.lag > 0 && <span className="text-xs">+{dep.lag}d</span>}
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setNewDependency({
                                predecessorId: predecessor.id,
                                successorId: successor.id,
                                type: "Finish-to-Start",
                                lag: 0
                              });
                              setShowAddDialog(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render visual view
  const renderVisualView = () => {
    return (
      <div className="border rounded-md p-4 h-[400px] overflow-auto">
        <div className="flex flex-col space-y-4">
          {dependencies.map(dep => {
            const predecessor = getItemById(dep.predecessorId);
            const successor = getItemById(dep.successorId);
            
            return (
              <Card key={dep.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{predecessor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(predecessor.startDate)} - {formatDate(predecessor.endDate)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center mx-4">
                      <Badge className="mb-1">{dep.type}</Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      {dep.lag > 0 && (
                        <span className="text-xs text-muted-foreground">+{dep.lag} days</span>
                      )}
                    </div>
                    
                    <div className="flex-1 text-right">
                      <div className="font-medium">{successor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(successor.startDate)} - {formatDate(successor.endDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {dependencies.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No dependencies defined
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render add dependency dialog
  const renderAddDependencyDialog = () => {
    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="predecessorId">Predecessor Task</Label>
              <Select
                value={newDependency.predecessorId}
                onValueChange={(value) => handleInputChange("predecessorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select predecessor task" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Dependency Type</Label>
              <Select
                value={newDependency.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dependency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finish-to-Start">Finish-to-Start (FS)</SelectItem>
                  <SelectItem value="Start-to-Start">Start-to-Start (SS)</SelectItem>
                  <SelectItem value="Finish-to-Finish">Finish-to-Finish (FF)</SelectItem>
                  <SelectItem value="Start-to-Finish">Start-to-Finish (SF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="successorId">Successor Task</Label>
              <Select
                value={newDependency.successorId}
                onValueChange={(value) => handleInputChange("successorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select successor task" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="lag">Lag (days)</Label>
                <span>{newDependency.lag} days</span>
              </div>
              <Slider
                id="lag"
                min={0}
                max={30}
                step={1}
                value={[newDependency.lag]}
                onValueChange={(value) => handleInputChange("lag", value[0])}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false);
                resetNewDependencyForm();
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddDependency}>
              Add Dependency
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Render edit dependency dialog
  const renderEditDependencyDialog = () => {
    if (!selectedDependency) return null;
    
    return (
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Dependency</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Predecessor Task</Label>
              <div className="p-2 border rounded-md bg-muted/30">
                {getItemById(selectedDependency.predecessorId).name}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Dependency Type</Label>
              <Select
                value={selectedDependency.type}
                onValueChange={(value) => setSelectedDependency(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dependency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finish-to-Start">Finish-to-Start (FS)</SelectItem>
                  <SelectItem value="Start-to-Start">Start-to-Start (SS)</SelectItem>
                  <SelectItem value="Finish-to-Finish">Finish-to-Finish (FF)</SelectItem>
                  <SelectItem value="Start-to-Finish">Start-to-Finish (SF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Successor Task</Label>
              <div className="p-2 border rounded-md bg-muted/30">
                {getItemById(selectedDependency.successorId).name}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="lag">Lag (days)</Label>
                <span>{selectedDependency.lag} days</span>
              </div>
              <Slider
                id="lag"
                min={0}
                max={30}
                step={1}
                value={[selectedDependency.lag]}
                onValueChange={(value) => setSelectedDependency(prev => ({ ...prev, lag: value[0] }))}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedDependency(null);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditDependency}>
              Update Dependency
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dependencies...</div>;
  }
  
  return (
    <div className="dependency-manager space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="matrix">Matrix View</TabsTrigger>
            <TabsTrigger value="visual">Visual View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => {
          resetNewDependencyForm();
          setShowAddDialog(true);
        }}>
          Add Dependency
        </Button>
      </div>
      
      {error && !showAddDialog && !showEditDialog && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      <TabsContent value="list" className="mt-0">
        {renderListView()}
      </TabsContent>
      
      <TabsContent value="matrix" className="mt-0">
        {renderMatrixView()}
      </TabsContent>
      
      <TabsContent value="visual" className="mt-0">
        {renderVisualView()}
      </TabsContent>
      
      {/* Dialogs */}
      {renderAddDependencyDialog()}
      {renderEditDependencyDialog()}
    </div>
  );
};

export default DependencyManager;
