import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  History, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Loader2,
  RotateCcw,
  GitCompare,
  Check,
  Save,
  Copy
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { contractService } from "../services/contractService";

interface ContractVersionsComponentProps {
  contractId: string;
}

const ContractVersionsComponent: React.FC<ContractVersionsComponentProps> = ({ contractId }) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isBaseline: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareVersions, setCompareVersions] = useState<{
    sourceId: string;
    targetId: string;
  }>({
    sourceId: "",
    targetId: ""
  });
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  
  // Mock data for initial development - will be replaced with API calls
  const mockVersions = [
    {
      id: "version-1",
      contractId: "contract-1",
      name: "Initial Draft",
      description: "First draft of the contract with basic terms and conditions.",
      createdBy: "John Doe",
      createdAt: "2025-01-10T14:30:00Z",
      isBaseline: true,
      changes: []
    },
    {
      id: "version-2",
      contractId: "contract-1",
      name: "Client Review Revisions",
      description: "Revisions based on client feedback on payment terms and schedule.",
      createdBy: "Jane Smith",
      createdAt: "2025-01-25T10:15:00Z",
      isBaseline: false,
      changes: [
        { type: "modified", section: "Payment Terms", description: "Updated payment schedule from 30/30/40 to 25/25/25/25" },
        { type: "added", section: "Late Payment", description: "Added clause for late payment penalties" }
      ]
    },
    {
      id: "version-3",
      contractId: "contract-1",
      name: "Legal Review Revisions",
      description: "Revisions based on legal department review.",
      createdBy: "Robert Johnson",
      createdAt: "2025-02-05T09:45:00Z",
      isBaseline: false,
      changes: [
        { type: "modified", section: "Liability", description: "Updated liability limitations" },
        { type: "modified", section: "Indemnification", description: "Clarified indemnification terms" },
        { type: "added", section: "Force Majeure", description: "Added comprehensive force majeure clause" }
      ]
    },
    {
      id: "version-4",
      contractId: "contract-1",
      name: "Final Contract",
      description: "Final version of the contract ready for signatures.",
      createdBy: "John Doe",
      createdAt: "2025-02-15T16:20:00Z",
      isBaseline: true,
      changes: [
        { type: "modified", section: "Scope of Work", description: "Updated project milestones" },
        { type: "added", section: "Change Orders", description: "Added detailed change order process" },
        { type: "removed", section: "Optional Services", description: "Removed optional services section as all services are now included in base contract" }
      ]
    }
  ];
  
  // Mock comparison data
  const mockComparisonData = {
    sections: [
      {
        name: "General Terms",
        changes: "unchanged"
      },
      {
        name: "Scope of Work",
        changes: "modified",
        details: {
          before: "Contractor will complete all work as described in Exhibit A within 12 months of the start date.",
          after: "Contractor will complete all work as described in Exhibit A within 14 months of the start date, with specific milestones as outlined in the updated project schedule."
        }
      },
      {
        name: "Payment Terms",
        changes: "modified",
        details: {
          before: "Payment will be made in three installments: 30% upon signing, 30% at midpoint, and 40% upon completion.",
          after: "Payment will be made in four equal installments of 25% each: upon signing, at 25% completion, at 75% completion, and upon final completion."
        }
      },
      {
        name: "Late Payment",
        changes: "added",
        details: {
          before: "",
          after: "Late payments will incur a 1.5% monthly interest charge on outstanding balances. Payments more than 30 days late may result in work stoppage until payment is received."
        }
      },
      {
        name: "Optional Services",
        changes: "removed",
        details: {
          before: "Client may request additional services not included in the base scope at the rates specified in Exhibit B.",
          after: ""
        }
      }
    ]
  };
  
  // Fetch versions
  useEffect(() => {
    const fetchVersions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await contractService.getContractVersions(contractId);
        setVersions(response.data || response);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching contract versions:", err);
        setError("Failed to load contract versions. Please try again.");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load contract versions. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchVersions();
  }, [contractId, toast]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Handle version selection for comparison
  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else {
        if (prev.length >= 2) {
          return [prev[1], versionId];
        } else {
          return [...prev, versionId];
        }
      }
    });
  };
  
  // Open create version dialog
  const handleCreateClick = () => {
    setFormData({
      name: "",
      description: "",
      isBaseline: false
    });
    setShowCreateDialog(true);
  };
  
  // Handle create version
  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Version name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await contractService.createContractVersion(contractId, formData);
      const newVersion = response.data || response;
      setVersions(prev => [...prev, newVersion]);
      setShowCreateDialog(false);
      setFormData({
        name: "",
        description: "",
        isBaseline: false
      });
      toast({
        title: "Success",
        description: "Contract version created successfully."
      });
    } catch (err) {
      console.error("Error creating contract version:", err);
      toast({
        title: "Error",
        description: "Failed to create contract version. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete version
  const handleDeleteVersion = async (versionId: string) => {
    if (!window.confirm("Are you sure you want to delete this version?")) {
      return;
    }
    
    try {
      await contractService.deleteContractVersion(contractId, versionId);
      setVersions(prev => prev.filter(v => v.id !== versionId));
      setSelectedVersions(prev => prev.filter(id => id !== versionId));
      toast({
        title: "Success",
        description: "Version deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting version:", err);
      toast({
        title: "Error",
        description: "Failed to delete version. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle restore version
  const handleRestoreVersion = async (versionId: string) => {
    if (!window.confirm("Are you sure you want to restore this version? This will update the current contract to match this version.")) {
      return;
    }
    
    try {
      await contractService.restoreContractVersion(contractId, versionId);
      toast({
        title: "Success",
        description: "Contract restored to selected version successfully."
      });
    } catch (err) {
      console.error("Error restoring version:", err);
      toast({
        title: "Error",
        description: "Failed to restore version. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Open compare dialog
  const handleCompareClick = () => {
    if (selectedVersions.length !== 2) {
      toast({
        title: "Selection Error",
        description: "Please select exactly two versions to compare.",
        variant: "destructive"
      });
      return;
    }
    
    setCompareVersions({
      sourceId: selectedVersions[0],
      targetId: selectedVersions[1]
    });
    setShowCompareDialog(true);
    
    // Fetch comparison data
    setComparisonLoading(true);
    setComparisonResult(null);
    
    // This will be replaced with actual API call
    // contractService.compareContractVersions(selectedVersions[0], selectedVersions[1])
    //   .then(response => {
    //     setComparisonResult(response.data);
    //   })
    //   .catch(err => {
    //     console.error("Error comparing versions:", err);
    //     toast({
    //       title: "Error",
    //       description: "Failed to compare versions. Please try again.",
    //       variant: "destructive"
    //     });
    //   })
    //   .finally(() => {
    //     setComparisonLoading(false);
    //   });
    
    // Mock comparison for development
    setTimeout(() => {
      setComparisonResult(mockComparisonData);
      setComparisonLoading(false);
    }, 1500);
  };
  
  // Get change type badge
  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case "added":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Added</Badge>;
      case "modified":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Modified</Badge>;
      case "removed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Removed</Badge>;
      case "unchanged":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Unchanged</Badge>;
      default:
        return null;
    }
  };
  
  if (isLoading && versions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Contract Versions</h2>
        <div className="flex space-x-2">
          {selectedVersions.length === 2 && (
            <Button variant="outline" onClick={handleCompareClick}>
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Selected
            </Button>
          )}
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Version
          </Button>
        </div>
      </div>
      
      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No versions created for this contract yet.</p>
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Initial Version
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map(version => (
                  <TableRow key={version.id} className={selectedVersions.includes(version.id) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedVersions.includes(version.id)}
                        onChange={() => handleVersionSelect(version.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="font-medium flex items-center">
                            {version.name}
                            {version.isBaseline && (
                              <Badge variant="outline" className="ml-2">Baseline</Badge>
                            )}
                          </div>
                          {version.description && (
                            <div className="text-sm text-muted-foreground">{version.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(version.createdAt)}</div>
                        <div className="text-muted-foreground">
                          by {version.createdBy} • {formatRelativeTime(version.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {version.changes.length > 0 ? (
                        <div className="text-sm">
                          <div>{version.changes.length} changes</div>
                          <div className="flex gap-1 mt-1">
                            {version.changes.some(c => c.type === "added") && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {version.changes.filter(c => c.type === "added").length} added
                              </Badge>
                            )}
                            {version.changes.some(c => c.type === "modified") && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                {version.changes.filter(c => c.type === "modified").length} modified
                              </Badge>
                            )}
                            {version.changes.some(c => c.type === "removed") && (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                {version.changes.filter(c => c.type === "removed").length} removed
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No changes</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreVersion(version.id)}
                          title="Restore this version"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVersion(version.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Create Version Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version of this contract to track changes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateVersion}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Version Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isBaseline"
                  checked={formData.isBaseline}
                  onChange={(e) => handleCheckboxChange("isBaseline", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isSubmitting}
                />
                <Label htmlFor="isBaseline">Mark as baseline version</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Baseline versions represent significant milestones in the contract's lifecycle.
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Version"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Compare Versions Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Comparing changes between versions.
            </DialogDescription>
          </DialogHeader>
          
          {comparisonLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comparisonResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {versions.find(v => v.id === compareVersions.sourceId)?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(versions.find(v => v.id === compareVersions.sourceId)?.createdAt)}
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {versions.find(v => v.id === compareVersions.targetId)?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(versions.find(v => v.id === compareVersions.targetId)?.createdAt)}
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Changes</TabsTrigger>
                  <TabsTrigger value="added">Added</TabsTrigger>
                  <TabsTrigger value="modified">Modified</TabsTrigger>
                  <TabsTrigger value="removed">Removed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  {comparisonResult.sections.map((section, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{section.name}</CardTitle>
                          {getChangeTypeBadge(section.changes)}
                        </div>
                      </CardHeader>
                      {section.changes !== "unchanged" && (
                        <CardContent className="py-3">
                          {section.changes === "added" && (
                            <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                              <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Added Content:</div>
                              <div className="whitespace-pre-wrap">{section.details.after}</div>
                            </div>
                          )}
                          
                          {section.changes === "removed" && (
                            <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                              <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Removed Content:</div>
                              <div className="whitespace-pre-wrap">{section.details.before}</div>
                            </div>
                          )}
                          
                          {section.changes === "modified" && (
                            <div className="space-y-3">
                              <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Before:</div>
                                <div className="whitespace-pre-wrap">{section.details.before}</div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                                <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">After:</div>
                                <div className="whitespace-pre-wrap">{section.details.after}</div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="added" className="space-y-4 mt-4">
                  {comparisonResult.sections.filter(s => s.changes === "added").length > 0 ? (
                    comparisonResult.sections.filter(s => s.changes === "added").map((section, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{section.name}</CardTitle>
                            {getChangeTypeBadge(section.changes)}
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                            <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Added Content:</div>
                            <div className="whitespace-pre-wrap">{section.details.after}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No added sections found.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="modified" className="space-y-4 mt-4">
                  {comparisonResult.sections.filter(s => s.changes === "modified").length > 0 ? (
                    comparisonResult.sections.filter(s => s.changes === "modified").map((section, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{section.name}</CardTitle>
                            {getChangeTypeBadge(section.changes)}
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-3">
                            <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                              <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Before:</div>
                              <div className="whitespace-pre-wrap">{section.details.before}</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                              <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">After:</div>
                              <div className="whitespace-pre-wrap">{section.details.after}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No modified sections found.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="removed" className="space-y-4 mt-4">
                  {comparisonResult.sections.filter(s => s.changes === "removed").length > 0 ? (
                    comparisonResult.sections.filter(s => s.changes === "removed").map((section, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{section.name}</CardTitle>
                            {getChangeTypeBadge(section.changes)}
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                            <div className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Removed Content:</div>
                            <div className="whitespace-pre-wrap">{section.details.before}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No removed sections found.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Failed to load comparison data. Please try again.
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompareDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractVersionsComponent;
