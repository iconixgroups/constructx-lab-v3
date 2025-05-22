import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ScheduleManagementProps {
  projectId: string;
  projectName: string;
  schedule?: {
    startDate: Date;
    endDate: Date;
    currentPhase: string;
    progress: number;
    delay: number;
  };
  milestones?: {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    status: 'upcoming' | 'in_progress' | 'completed' | 'delayed';
    progress: number;
    dependencies?: string[];
    assignedTo?: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
  }[];
  phases?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'in_progress' | 'completed' | 'delayed';
    progress: number;
    milestones: string[];
  }[];
  isLoading?: boolean;
  onCreateMilestone?: () => void;
  onEditMilestone?: (milestoneId: string) => void;
  onCreatePhase?: () => void;
  onEditPhase?: (phaseId: string) => void;
  onExportSchedule?: () => void;
  onGenerateReport?: () => void;
}

export const ScheduleManagement: React.FC<ScheduleManagementProps> = ({
  projectId,
  projectName,
  schedule,
  milestones = [],
  phases = [],
  isLoading = false,
  onCreateMilestone,
  onEditMilestone,
  onCreatePhase,
  onEditPhase,
  onExportSchedule,
  onGenerateReport
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter milestones based on search query
  const filteredMilestones = milestones.filter(milestone => {
    if (!searchQuery) return true;
    
    return (
      milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      milestone.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter phases based on search query
  const filteredPhases = phases.filter(phase => {
    if (!searchQuery) return true;
    
    return phase.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort milestones by due date
  const sortedMilestones = [...filteredMilestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Sort phases by start date
  const sortedPhases = [...filteredPhases].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Get status color for milestones and phases
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = (date: Date): { text: string; isOverdue: boolean } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, 
        isOverdue: true 
      };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    } else {
      return { 
        text: `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`, 
        isOverdue: false 
      };
    }
  };

  // Render schedule overview
  const renderScheduleOverview = () => {
    if (!schedule) return null;
    
    const projectDuration = Math.ceil(
      (schedule.endDate.getTime() - schedule.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Start Date</div>
                  <div className="font-medium">{formatDate(schedule.startDate)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div className="font-medium">{formatDate(schedule.endDate)}</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Duration: {projectDuration} days</span>
                  <span>Progress: {schedule.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${schedule.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Phase</div>
                  <div className="font-medium">{schedule.currentPhase}</div>
                </div>
                {schedule.delay > 0 && (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Delayed by {schedule.delay} day{schedule.delay !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedMilestones
                .filter(m => m.status === 'upcoming' || m.status === 'in_progress')
                .slice(0, 3)
                .map(milestone => {
                  const { text, isOverdue } = getDaysRemaining(milestone.dueDate);
                  
                  return (
                    <div 
                      key={milestone.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => onEditMilestone && onEditMilestone(milestone.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-xs text-muted-foreground">Due: {formatDate(milestone.dueDate)}</div>
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress: {milestone.progress}%</span>
                          <span className={isOverdue ? 'text-red-600 dark:text-red-400' : ''}>
                            {text}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {sortedMilestones.filter(m => m.status === 'upcoming' || m.status === 'in_progress').length === 0 && (
                <div className="flex flex-col items-center justify-center h-[100px] space-y-2">
                  <p className="text-muted-foreground text-sm">No upcoming milestones</p>
                </div>
              )}
              
              {onCreateMilestone && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCreateMilestone}
                  className="w-full"
                >
                  Add Milestone
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render milestones list
  const renderMilestonesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">All Milestones</h3>
          {onCreateMilestone && (
            <Button onClick={onCreateMilestone}>
              New Milestone
            </Button>
          )}
        </div>
        
        {sortedMilestones.length > 0 ? (
          <div className="space-y-3">
            {sortedMilestones.map(milestone => {
              const { text, isOverdue } = getDaysRemaining(milestone.dueDate);
              
              return (
                <div 
                  key={milestone.id} 
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  onClick={() => onEditMilestone && onEditMilestone(milestone.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{milestone.title}</div>
                      {milestone.description && (
                        <div className="text-sm text-muted-foreground mt-1">{milestone.description}</div>
                      )}
                    </div>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Due Date</div>
                      <div className="font-medium">{formatDate(milestone.dueDate)}</div>
                      <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {text}
                      </div>
                    </div>
                    
                    {milestone.assignedTo && (
                      <div>
                        <div className="text-sm text-muted-foreground">Assigned To</div>
                        <div className="flex items-center mt-1">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={milestone.assignedTo.avatarUrl} alt={milestone.assignedTo.name} />
                            <AvatarFallback>{milestone.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{milestone.assignedTo.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          milestone.status === 'delayed' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {milestone.dependencies && milestone.dependencies.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-muted-foreground mb-1">Dependencies</div>
                      <div className="flex flex-wrap gap-2">
                        {milestone.dependencies.map(depId => {
                          const dep = milestones.find(m => m.id === depId);
                          return dep ? (
                            <Badge key={depId} variant="outline">
                              {dep.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-muted-foreground">No milestones found</p>
            {onCreateMilestone && (
              <Button onClick={onCreateMilestone}>
                Create Milestone
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render phases list
  const renderPhasesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Project Phases</h3>
          {onCreatePhase && (
            <Button onClick={onCreatePhase}>
              New Phase
            </Button>
          )}
        </div>
        
        {sortedPhases.length > 0 ? (
          <div className="space-y-4">
            {sortedPhases.map(phase => (
              <Card key={phase.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="font-medium">{formatDate(phase.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">End Date</div>
                      <div className="font-medium">{formatDate(phase.endDate)}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          phase.status === 'delayed' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Milestones</div>
                    <div className="space-y-2">
                      {phase.milestones.map(milestoneId => {
                        const milestone = milestones.find(m => m.id === milestoneId);
                        return milestone ? (
                          <div 
                            key={milestoneId}
                            className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded"
                          >
                            <span>{milestone.title}</span>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('_', ' ')}
                            </Badge>
                          </div>
                        ) : null;
                      })}
                      
                      {phase.milestones.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          No milestones in this phase
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditPhase && onEditPhase(phase.id)}
                    >
                      Edit Phase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <p className="text-muted-foreground">No phases found</p>
            {onCreatePhase && (
              <Button onClick={onCreatePhase}>
                Create Phase
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
          <CardTitle className="text-xl font-bold">{projectName} Schedule</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            <div className="flex space-x-2">
              {onExportSchedule && (
                <Button variant="outline" size="sm" onClick={onExportSchedule} className="h-8">
                  Export
                </Button>
              )}
              {onGenerateReport && (
                <Button variant="outline" size="sm" onClick={onGenerateReport} className="h-8">
                  Generate Report
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {renderScheduleOverview()}
              <div className="grid grid-cols-1 gap-4">
                {renderPhasesList()}
              </div>
            </TabsContent>
            
            <TabsContent value="milestones">
              {renderMilestonesList()}
            </TabsContent>
            
            <TabsContent value="phases">
              {renderPhasesList()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleManagement;
