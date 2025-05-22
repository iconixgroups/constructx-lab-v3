import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ResourceManagementProps {
  projectId: string;
  projectName: string;
  resources?: {
    id: string;
    name: string;
    type: 'labor' | 'equipment' | 'material';
    category: string;
    status: 'available' | 'allocated' | 'in_use' | 'maintenance' | 'depleted';
    quantity: number;
    unit: string;
    cost: number;
    location?: string;
    assignedTo?: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    supplier?: {
      id: string;
      name: string;
      contact: string;
    };
    deliveryDate?: Date;
    notes?: string;
  }[];
  teams?: {
    id: string;
    name: string;
    role: string;
    members: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatarUrl?: string;
    }[];
    assignedTasks: number;
    completedTasks: number;
  }[];
  isLoading?: boolean;
  onAddResource?: () => void;
  onEditResource?: (resourceId: string) => void;
  onManageTeam?: (teamId: string) => void;
  onCreateTeam?: () => void;
  onExportResourceData?: () => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  projectId,
  projectName,
  resources = [],
  teams = [],
  isLoading = false,
  onAddResource,
  onEditResource,
  onManageTeam,
  onCreateTeam,
  onExportResourceData
}) => {
  const [activeTab, setActiveTab] = useState<string>('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string | null>(null);

  // Filter resources based on search query and type filter
  const filteredResources = resources.filter(resource => {
    // Filter by type
    if (resourceTypeFilter && resource.type !== resourceTypeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => {
    if (!searchQuery) return true;
    
    return (
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.members.some(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Group resources by type
  const resourcesByType = {
    labor: filteredResources.filter(r => r.type === 'labor'),
    equipment: filteredResources.filter(r => r.type === 'equipment'),
    material: filteredResources.filter(r => r.type === 'material')
  };

  // Get status color for resources
  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'allocated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_use': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'maintenance': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'depleted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render resources list
  const renderResourcesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <div className="flex space-x-2">
              <Button 
                variant={resourceTypeFilter === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setResourceTypeFilter(null)}
              >
                All
              </Button>
              <Button 
                variant={resourceTypeFilter === 'labor' ? "default" : "outline"} 
                size="sm"
                onClick={() => setResourceTypeFilter('labor')}
              >
                Labor
              </Button>
              <Button 
                variant={resourceTypeFilter === 'equipment' ? "default" : "outline"} 
                size="sm"
                onClick={() => setResourceTypeFilter('equipment')}
              >
                Equipment
              </Button>
              <Button 
                variant={resourceTypeFilter === 'material' ? "default" : "outline"} 
                size="sm"
                onClick={() => setResourceTypeFilter('material')}
              >
                Material
              </Button>
            </div>
          </div>
          {onAddResource && (
            <Button onClick={onAddResource}>
              Add Resource
            </Button>
          )}
        </div>
        
        {filteredResources.length > 0 ? (
          <div className="space-y-6">
            {/* Show grouped resources if no filter is applied, otherwise show filtered list */}
            {resourceTypeFilter === null ? (
              <>
                {resourcesByType.labor.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Labor</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resourcesByType.labor.map(resource => renderResourceCard(resource))}
                    </div>
                  </div>
                )}
                
                {resourcesByType.equipment.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Equipment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resourcesByType.equipment.map(resource => renderResourceCard(resource))}
                    </div>
                  </div>
                )}
                
                {resourcesByType.material.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Material</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resourcesByType.material.map(resource => renderResourceCard(resource))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => renderResourceCard(resource))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
              <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
              <line x1="12" y1="22" x2="12" y2="13"></line>
              <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
            </svg>
            <p className="text-muted-foreground">No resources found</p>
            {onAddResource && (
              <Button onClick={onAddResource}>
                Add Resource
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render individual resource card
  const renderResourceCard = (resource: typeof resources[0]) => {
    return (
      <Card 
        key={resource.id}
        className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        onClick={() => onEditResource && onEditResource(resource.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{resource.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{resource.category}</div>
            </div>
            <Badge className={getResourceStatusColor(resource.status)}>
              {resource.status.charAt(0).toUpperCase() + resource.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Quantity</div>
                <div className="font-medium">
                  {resource.quantity} {resource.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Cost</div>
                <div className="font-medium">{formatCurrency(resource.cost)}</div>
              </div>
            </div>
            
            {resource.location && (
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{resource.location}</div>
              </div>
            )}
            
            {resource.supplier && (
              <div>
                <div className="text-sm text-muted-foreground">Supplier</div>
                <div className="font-medium">{resource.supplier.name}</div>
                <div className="text-xs text-muted-foreground">{resource.supplier.contact}</div>
              </div>
            )}
            
            {resource.deliveryDate && (
              <div>
                <div className="text-sm text-muted-foreground">Delivery Date</div>
                <div className="font-medium">{formatDate(resource.deliveryDate)}</div>
              </div>
            )}
            
            {resource.assignedTo && (
              <div>
                <div className="text-sm text-muted-foreground">Assigned To</div>
                <div className="flex items-center mt-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={resource.assignedTo.avatarUrl} alt={resource.assignedTo.name} />
                    <AvatarFallback>{resource.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{resource.assignedTo.name}</span>
                </div>
              </div>
            )}
            
            {resource.notes && (
              <div>
                <div className="text-sm text-muted-foreground">Notes</div>
                <div className="text-sm">{resource.notes}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render teams list
  const renderTeamsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Teams</h3>
          {onCreateTeam && (
            <Button onClick={onCreateTeam}>
              Create Team
            </Button>
          )}
        </div>
        
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeams.map(team => (
              <Card 
                key={team.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => onManageTeam && onManageTeam(team.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">{team.role}</div>
                    </div>
                    <Badge variant="outline">
                      {team.members.length} Members
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Team Members</div>
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map(member => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-slate-100 dark:bg-slate-800">
                            <span className="text-xs font-medium">+{team.members.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Task Progress</div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Completed: {team.completedTasks}/{team.assignedTasks} tasks</span>
                        <span>
                          {team.assignedTasks > 0 
                            ? Math.round((team.completedTasks / team.assignedTasks) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${team.assignedTasks > 0 
                              ? Math.round((team.completedTasks / team.assignedTasks) * 100) 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageTeam && onManageTeam(team.id);
                        }}
                      >
                        Manage Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p className="text-muted-foreground">No teams found</p>
            {onCreateTeam && (
              <Button onClick={onCreateTeam}>
                Create Team
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{projectName} Resources</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            {onExportResourceData && (
              <Button variant="outline" size="sm" onClick={onExportResourceData} className="h-8">
                Export Data
              </Button>
            )}
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
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources">
              {renderResourcesList()}
            </TabsContent>
            
            <TabsContent value="teams">
              {renderTeamsList()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceManagement;
