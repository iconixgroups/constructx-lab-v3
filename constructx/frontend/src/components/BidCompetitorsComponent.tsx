import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Edit, Trash2, BarChart, Loader2, Building, DollarSign, Percent } from "lucide-react";
import { useToast } from "./ui/use-toast";
import bidService from "../services/bidService";

const BidCompetitorsComponent = ({ bidId }) => {
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentCompetitor, setCurrentCompetitor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    estimatedBidAmount: "",
    strengthsWeaknesses: "",
    winProbability: "50",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch competitors
  useEffect(() => {
    fetchCompetitors();
  }, [bidId]);

  // Fetch competitors from API
  const fetchCompetitors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bidService.getBidCompetitors(bidId);
      setCompetitors(response.data);
    } catch (err) {
      console.error("Error fetching bid competitors:", err);
      setError("Failed to load bid competitors. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bid competitors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open add dialog
  const handleAddClick = () => {
    setFormData({
      name: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      estimatedBidAmount: "",
      strengthsWeaknesses: "",
      winProbability: "50",
      notes: ""
    });
    setShowAddDialog(true);
  };

  // Open edit dialog
  const handleEditClick = (competitor) => {
    setCurrentCompetitor(competitor);
    setFormData({
      name: competitor.name,
      contactPerson: competitor.contactPerson || "",
      contactEmail: competitor.contactEmail || "",
      contactPhone: competitor.contactPhone || "",
      estimatedBidAmount: competitor.estimatedBidAmount ? competitor.estimatedBidAmount.toString() : "",
      strengthsWeaknesses: competitor.strengthsWeaknesses || "",
      winProbability: competitor.winProbability ? competitor.winProbability.toString() : "50",
      notes: competitor.notes || ""
    });
    setShowEditDialog(true);
  };

  // Handle add competitor
  const handleAddCompetitor = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Competitor name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const competitorData = {
        ...formData,
        estimatedBidAmount: formData.estimatedBidAmount ? parseFloat(formData.estimatedBidAmount) : null,
        winProbability: parseInt(formData.winProbability, 10)
      };
      
      const response = await bidService.createBidCompetitor(bidId, competitorData);
      setCompetitors(prev => [...prev, response.data]);
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Competitor added successfully."
      });
    } catch (err) {
      console.error("Error adding competitor:", err);
      toast({
        title: "Error",
        description: "Failed to add competitor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit competitor
  const handleEditCompetitor = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Competitor name is required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const competitorData = {
        ...formData,
        estimatedBidAmount: formData.estimatedBidAmount ? parseFloat(formData.estimatedBidAmount) : null,
        winProbability: parseInt(formData.winProbability, 10)
      };
      
      const response = await bidService.updateBidCompetitor(bidId, currentCompetitor.id, competitorData);
      setCompetitors(prev => prev.map(competitor => 
        competitor.id === currentCompetitor.id ? response.data : competitor
      ));
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Competitor updated successfully."
      });
    } catch (err) {
      console.error("Error updating competitor:", err);
      toast({
        title: "Error",
        description: "Failed to update competitor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete competitor
  const handleDeleteCompetitor = async (competitorId) => {
    if (!window.confirm("Are you sure you want to delete this competitor?")) {
      return;
    }
    
    try {
      await bidService.deleteBidCompetitor(bidId, competitorId);
      setCompetitors(prev => prev.filter(competitor => competitor.id !== competitorId));
      toast({
        title: "Success",
        description: "Competitor deleted successfully."
      });
    } catch (err) {
      console.error("Error deleting competitor:", err);
      toast({
        title: "Error",
        description: "Failed to delete competitor. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "Unknown";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get probability color
  const getProbabilityColor = (probability) => {
    if (probability >= 70) return "text-green-600";
    if (probability >= 40) return "text-amber-600";
    return "text-red-600";
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
        <Button onClick={fetchCompetitors}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Competitors Analysis</h2>
        <Button onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Add Competitor
        </Button>
      </div>
      
      {competitors.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No competitors found. Add your first competitor to start tracking the competition.</p>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Competitor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Competitors Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bid Amount Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 relative">
                {competitors.map((competitor, index) => {
                  const maxAmount = Math.max(
                    ...competitors.map(c => c.estimatedBidAmount || 0),
                    1 // Prevent division by zero
                  );
                  const height = competitor.estimatedBidAmount 
                    ? `${(competitor.estimatedBidAmount / maxAmount) * 100}%` 
                    : "10%";
                  
                  return (
                    <div 
                      key={competitor.id}
                      className="absolute bottom-0 flex flex-col items-center"
                      style={{ 
                        left: `${(index / Math.max(competitors.length - 1, 1)) * 100}%`, 
                        transform: 'translateX(-50%)',
                        width: '60px'
                      }}
                    >
                      <div className="text-xs mb-1 font-medium">
                        {formatCurrency(competitor.estimatedBidAmount)}
                      </div>
                      <div 
                        className="w-12 bg-primary rounded-t-md"
                        style={{ height }}
                      ></div>
                      <div className="mt-2 text-xs text-center w-16 truncate" title={competitor.name}>
                        {competitor.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Competitors Table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Estimated Bid</TableHead>
                  <TableHead className="text-right">Win Probability</TableHead>
                  <TableHead>Strengths/Weaknesses</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map(competitor => (
                  <TableRow key={competitor.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{competitor.name}</p>
                          {competitor.notes && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{competitor.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {competitor.contactPerson && (
                        <div>
                          <p>{competitor.contactPerson}</p>
                          {competitor.contactEmail && (
                            <p className="text-xs text-muted-foreground">{competitor.contactEmail}</p>
                          )}
                          {competitor.contactPhone && (
                            <p className="text-xs text-muted-foreground">{competitor.contactPhone}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(competitor.estimatedBidAmount)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className={getProbabilityColor(competitor.winProbability)}>
                          {competitor.winProbability}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2">
                        {competitor.strengthsWeaknesses || "Not specified"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(competitor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCompetitor(competitor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {/* Add Competitor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Competitor</DialogTitle>
            <DialogDescription>
              Add a new competitor to track for this bid.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCompetitor}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Competitor Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedBidAmount">Estimated Bid Amount</Label>
                  <Input
                    id="estimatedBidAmount"
                    name="estimatedBidAmount"
                    type="number"
                    min="0"
                    value={formData.estimatedBidAmount}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="winProbability">Win Probability (%)</Label>
                <Input
                  id="winProbability"
                  name="winProbability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.winProbability}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strengthsWeaknesses">Strengths & Weaknesses</Label>
                <Textarea
                  id="strengthsWeaknesses"
                  name="strengthsWeaknesses"
                  value={formData.strengthsWeaknesses}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="E.g., Strong: Local presence, relationships. Weak: Higher pricing, limited resources."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Competitor"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Competitor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Competitor</DialogTitle>
            <DialogDescription>
              Make changes to the competitor details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCompetitor}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Competitor Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                  <Input
                    id="edit-contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-estimatedBidAmount">Estimated Bid Amount</Label>
                  <Input
                    id="edit-estimatedBidAmount"
                    name="estimatedBidAmount"
                    type="number"
                    min="0"
                    value={formData.estimatedBidAmount}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-winProbability">Win Probability (%)</Label>
                <Input
                  id="edit-winProbability"
                  name="winProbability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.winProbability}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-strengthsWeaknesses">Strengths & Weaknesses</Label>
                <Textarea
                  id="edit-strengthsWeaknesses"
                  name="strengthsWeaknesses"
                  value={formData.strengthsWeaknesses}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Competitor"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidCompetitorsComponent;
