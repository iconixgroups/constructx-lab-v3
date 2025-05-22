import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import LeadCard from './LeadCard';

interface LeadsManagementProps {
  companyId: string;
  leads?: {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    source: string;
    score?: number;
    assignedTo?: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    createdAt: Date;
    lastContactDate?: Date;
    estimatedValue?: number;
    tags?: string[];
  }[];
  isLoading?: boolean;
  onCreateLead?: () => void;
  onViewLead?: (leadId: string) => void;
  onEditLead?: (leadId: string) => void;
  onDeleteLead?: (leadId: string) => void;
  onLeadStatusChange?: (leadId: string, newStatus: string) => void;
  onAssigneeChange?: (leadId: string) => void;
  onImportLeads?: () => void;
  onExportLeads?: () => void;
}

export const LeadsManagement: React.FC<LeadsManagementProps> = ({
  companyId,
  leads = [],
  isLoading = false,
  onCreateLead,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onLeadStatusChange,
  onAssigneeChange,
  onImportLeads,
  onExportLeads
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('date_desc');

  // Filter leads based on active tab (status) and search query
  const filteredLeads = leads.filter(lead => {
    // Filter by status
    if (activeTab !== 'all' && lead.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'value_desc':
        return (b.estimatedValue || 0) - (a.estimatedValue || 0);
      case 'value_asc':
        return (a.estimatedValue || 0) - (b.estimatedValue || 0);
      case 'score_desc':
        return (b.score || 0) - (a.score || 0);
      case 'score_asc':
        return (a.score || 0) - (b.score || 0);
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Count leads by status
  const leadCounts = {
    all: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    proposal: leads.filter(lead => lead.status === 'proposal').length,
    negotiation: leads.filter(lead => lead.status === 'negotiation').length,
    won: leads.filter(lead => lead.status === 'won').length,
    lost: leads.filter(lead => lead.status === 'lost').length
  };

  // Format status label
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Leads Management</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="value_desc">Highest Value</option>
              <option value="value_asc">Lowest Value</option>
              <option value="score_desc">Highest Score</option>
              <option value="score_asc">Lowest Score</option>
            </select>
            <div className="flex space-x-2">
              {onImportLeads && (
                <Button variant="outline" size="sm" onClick={onImportLeads} className="h-8">
                  Import
                </Button>
              )}
              {onExportLeads && (
                <Button variant="outline" size="sm" onClick={onExportLeads} className="h-8">
                  Export
                </Button>
              )}
              {onCreateLead && (
                <Button onClick={onCreateLead}>
                  New Lead
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({leadCounts.all})
              </TabsTrigger>
              <TabsTrigger value="new">
                New ({leadCounts.new})
              </TabsTrigger>
              <TabsTrigger value="contacted">
                Contacted ({leadCounts.contacted})
              </TabsTrigger>
              <TabsTrigger value="qualified">
                Qualified ({leadCounts.qualified})
              </TabsTrigger>
              <TabsTrigger value="proposal">
                Proposal ({leadCounts.proposal})
              </TabsTrigger>
              <TabsTrigger value="negotiation">
                Negotiation ({leadCounts.negotiation})
              </TabsTrigger>
              <TabsTrigger value="won">
                Won ({leadCounts.won})
              </TabsTrigger>
              <TabsTrigger value="lost">
                Lost ({leadCounts.lost})
              </TabsTrigger>
            </TabsList>
            
            {/* All tabs use the same rendering logic with different filtered data */}
            {['all', 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(status => (
              <TabsContent key={status} value={status}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <LeadCard
                        key={lead.id}
                        id={lead.id}
                        name={lead.name}
                        company={lead.company}
                        email={lead.email}
                        phone={lead.phone}
                        status={lead.status}
                        source={lead.source}
                        score={lead.score}
                        assignedTo={lead.assignedTo}
                        createdAt={lead.createdAt}
                        lastContactDate={lead.lastContactDate}
                        estimatedValue={lead.estimatedValue}
                        tags={lead.tags}
                        onView={() => onViewLead && onViewLead(lead.id)}
                        onEdit={() => onEditLead && onEditLead(lead.id)}
                        onDelete={() => onDeleteLead && onDeleteLead(lead.id)}
                        onStatusChange={(newStatus) => onLeadStatusChange && onLeadStatusChange(lead.id, newStatus)}
                        onAssigneeChange={() => onAssigneeChange && onAssigneeChange(lead.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center h-[200px] space-y-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <p className="text-muted-foreground">No {status === 'all' ? '' : status} leads found</p>
                      {onCreateLead && (
                        <Button onClick={onCreateLead}>
                          Create Lead
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsManagement;
