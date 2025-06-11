import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DollarSign, Calendar, BarChart, MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, Copy } from "lucide-react";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Helper function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Helper function to get status badge color
const getStatusBadgeClass = (status, statuses) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.color : "bg-gray-200 text-gray-800";
};

const BidsList = ({ bids, statuses, onBidClick, onStatusChange }) => {
  const [selectedBids, setSelectedBids] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort bids
  const sortedBids = [...bids].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle checkbox change
  const handleCheckboxChange = (bidId) => {
    setSelectedBids(prev => {
      if (prev.includes(bidId)) {
        return prev.filter(id => id !== bidId);
      } else {
        return [...prev, bidId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedBids.length === bids.length) {
      setSelectedBids([]);
    } else {
      setSelectedBids(bids.map(bid => bid.id));
    }
  };

  // Handle status change
  const handleStatusChange = (bidId, newStatus) => {
    onStatusChange(bidId, newStatus);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on bids:`, selectedBids);
    // Will be replaced with actual API calls
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedBids.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex justify-between items-center">
          <span className="text-sm font-medium">{selectedBids.length} bids selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
              Export Selected
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statuses.map(status => (
                  <DropdownMenuItem 
                    key={status.value}
                    onClick={() => {
                      selectedBids.forEach(bidId => handleStatusChange(bidId, status.value));
                      setSelectedBids([]);
                    }}
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedBids.length === bids.length && bids.length > 0} 
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Bid Name
                  {sortConfig.key === 'name' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('bidNumber')}>
                <div className="flex items-center">
                  Bid Number
                  {sortConfig.key === 'bidNumber' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('clientName')}>
                <div className="flex items-center">
                  Client
                  {sortConfig.key === 'clientName' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center">
                  Status
                  {sortConfig.key === 'status' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center">
                  Due Date
                  {sortConfig.key === 'dueDate' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('estimatedValue')}>
                <div className="flex items-center justify-end">
                  Value
                  {sortConfig.key === 'estimatedValue' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('probability')}>
                <div className="flex items-center justify-end">
                  Probability
                  {sortConfig.key === 'probability' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('assignedToName')}>
                <div className="flex items-center">
                  Assigned To
                  {sortConfig.key === 'assignedToName' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No bids found. Create your first bid to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedBids.map((bid) => (
                <TableRow key={bid.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedBids.includes(bid.id)} 
                      onCheckedChange={() => handleCheckboxChange(bid.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium" onClick={() => onBidClick(bid.id)}>
                    {bid.name}
                  </TableCell>
                  <TableCell onClick={() => onBidClick(bid.id)}>
                    {bid.bidNumber}
                  </TableCell>
                  <TableCell onClick={() => onBidClick(bid.id)}>
                    {bid.clientName}
                  </TableCell>
                  <TableCell onClick={() => onBidClick(bid.id)}>
                    <Badge className={getStatusBadgeClass(bid.status, statuses)}>
                      {statuses.find(s => s.value === bid.status)?.label || bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => onBidClick(bid.id)}>
                    {formatDate(bid.dueDate)}
                  </TableCell>
                  <TableCell className="text-right" onClick={() => onBidClick(bid.id)}>
                    {formatCurrency(bid.estimatedValue)}
                  </TableCell>
                  <TableCell className="text-right" onClick={() => onBidClick(bid.id)}>
                    {bid.probability}%
                  </TableCell>
                  <TableCell onClick={() => onBidClick(bid.id)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/avatars/${bid.assignedTo}.png`} alt={bid.assignedToName} />
                        <AvatarFallback className="text-xs">
                          {getInitials(bid.assignedToName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{bid.assignedToName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onBidClick(bid.id)}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log(`Edit bid ${bid.id}`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log(`Duplicate bid ${bid.id}`)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => console.log(`Delete bid ${bid.id}`)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BidsList;
