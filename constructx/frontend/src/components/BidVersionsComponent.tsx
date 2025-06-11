import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Eye, Download, MoreHorizontal, History, ArrowLeft, ArrowRight, Loader2, Clock, User, FileText } from "lucide-react";
import { useToast } from "./ui/use-toast";
import bidService from "../services/bidService";

const BidVersionsComponent = ({ bidId }) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState({
    from: null,
    to: null
  });
  const [comparisonData, setComparisonData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  // Fetch versions
  useEffect(() => {
    fetchVersions();
  }, [bidId]);

  // Fetch versions from API
  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bidService.getBidVersions(bidId);
      setVersions(response.data);
    } catch (err) {
      console.error("Error fetching bid versions:", err);
      setError("Failed to load bid versions. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bid versions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create version
  const handleCreateVersion = async () => {
    if (!window.confirm("Are you sure you want to create a new version of this bid?")) {
      return;
    }
    
    try {
      toast({
        title: "Creating Version",
        description: "Creating a new version of this bid..."
      });
      
      const response = await bidService.createBidVersion(bidId);
      setVersions(prev => [response.data, ...prev]);
      
      toast({
        title: "Success",
        description: "New version created successfully."
      });
    } catch (err) {
      console.error("Error creating version:", err);
      toast({
        title: "Error",
        description: "Failed to create version. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle restore version
  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm("Are you sure you want to restore this version? This will overwrite the current bid data.")) {
      return;
    }
    
    try {
      toast({
        title: "Restoring Version",
        description: "Restoring bid to selected version..."
      });
      
      await bidService.restoreBidVersion(bidId, versionId);
      
      toast({
        title: "Success",
        description: "Version restored successfully. Please refresh the page to see the changes."
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

  // Handle download version
  const handleDownloadVersion = async (version) => {
    try {
      toast({
        title: "Downloading",
        description: `Downloading version ${version.versionNumber}...`
      });
      
      const response = await bidService.downloadBidVersion(bidId, version.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bid_${bidId}_Version_${version.versionNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Success",
        description: "Version downloaded successfully."
      });
    } catch (err) {
      console.error("Error downloading version:", err);
      toast({
        title: "Error",
        description: "Failed to download version. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle view version
  const handleViewVersion = async (version) => {
    try {
      toast({
        title: "Opening",
        description: `Opening version ${version.versionNumber}...`
      });
      
      const response = await bidService.getBidVersionUrl(bidId, version.id);
      window.open(response.data.url, '_blank');
    } catch (err) {
      console.error("Error viewing version:", err);
      toast({
        title: "Error",
        description: "Failed to open version. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Open compare dialog
  const handleCompareClick = () => {
    if (versions.length < 2) {
      toast({
        title: "Cannot Compare",
        description: "You need at least two versions to compare.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedVersions({
      from: versions[1].id, // Second most recent
      to: versions[0].id    // Most recent
    });
    setComparisonData(null);
    setShowCompareDialog(true);
  };

  // Handle compare versions
  const handleCompareVersions = async () => {
    if (!selectedVersions.from || !selectedVersions.to) {
      toast({
        title: "Validation Error",
        description: "Please select two versions to compare.",
        variant: "destructive"
      });
      return;
    }
    
    setIsComparing(true);
    
    try {
      const response = await bidService.compareBidVersions(bidId, selectedVersions.from, selectedVersions.to);
      setComparisonData(response.data);
    } catch (err) {
      console.error("Error comparing versions:", err);
      toast({
        title: "Error",
        description: "Failed to compare versions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (isLoading) {
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
        <Button onClick={fetchVersions}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Version History</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCompareClick} disabled={versions.length < 2}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Compare Versions
          </Button>
          <Button onClick={handleCreateVersion}>
            <Plus className="h-4 w-4 mr-2" /> Create Version
          </Button>
        </div>
      </div>
      
      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No versions found. Create your first version to track changes.</p>
            <Button onClick={handleCreateVersion}>
              <Plus className="h-4 w-4 mr-2" /> Create Version
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version, index) => (
                <TableRow key={version.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        v{version.versionNumber}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(version.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {version.createdByName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {version.description || "No description provided"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewVersion(version)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadVersion(version)}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        {index !== 0 && (
                          <DropdownMenuItem onClick={() => handleRestoreVersion(version.id)}>
                            <History className="h-4 w-4 mr-2" /> Restore
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Compare Versions Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Select two versions to compare changes between them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Version</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedVersions.from || ""}
                  onChange={(e) => setSelectedVersions(prev => ({ ...prev, from: e.target.value }))}
                  disabled={isComparing}
                >
                  <option value="">Select a version</option>
                  {versions.map(version => (
                    <option key={version.id} value={version.id}>
                      v{version.versionNumber} - {formatDate(version.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Version</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedVersions.to || ""}
                  onChange={(e) => setSelectedVersions(prev => ({ ...prev, to: e.target.value }))}
                  disabled={isComparing}
                >
                  <option value="">Select a version</option>
                  {versions.map(version => (
                    <option key={version.id} value={version.id}>
                      v{version.versionNumber} - {formatDate(version.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleCompareVersions} 
                disabled={isComparing || !selectedVersions.from || !selectedVersions.to}
              >
                {isComparing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" /> Compare
                  </>
                )}
              </Button>
            </div>
            
            {comparisonData && (
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Comparison Results</h3>
                
                {comparisonData.changes.length === 0 ? (
                  <p className="text-center text-muted-foreground">No differences found between these versions.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Comparing v{comparisonData.fromVersion} to v{comparisonData.toVersion}
                    </p>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comparisonData.changes.map((change, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{change.field}</TableCell>
                            <TableCell className="bg-red-50">{change.oldValue || "(empty)"}</TableCell>
                            <TableCell className="bg-green-50">{change.newValue || "(empty)"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidVersionsComponent;
