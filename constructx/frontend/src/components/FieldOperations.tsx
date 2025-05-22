import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface FieldOperationsProps {
  projectId: string;
  projectName: string;
  fieldReports?: {
    id: string;
    title: string;
    date: Date;
    location: string;
    status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
    type: string;
    submittedBy: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    hasIssues: boolean;
    hasPhotos: boolean;
    weather?: {
      condition: string;
      temperature: number;
      precipitation: number;
    };
  }[];
  inspections?: {
    id: string;
    title: string;
    date: Date;
    type: string;
    status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'rescheduled';
    inspector: {
      id: string;
      name: string;
      email: string;
      organization: string;
      avatarUrl?: string;
    };
    location: string;
    notes?: string;
  }[];
  issues?: {
    id: string;
    title: string;
    description: string;
    date: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    assignedTo?: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    reportedBy: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    hasPhotos: boolean;
  }[];
  isLoading?: boolean;
  onCreateFieldReport?: () => void;
  onViewFieldReport?: (reportId: string) => void;
  onCreateInspection?: () => void;
  onViewInspection?: (inspectionId: string) => void;
  onCreateIssue?: () => void;
  onViewIssue?: (issueId: string) => void;
  onExportData?: () => void;
}

export const FieldOperations: React.FC<FieldOperationsProps> = ({
  projectId,
  projectName,
  fieldReports = [],
  inspections = [],
  issues = [],
  isLoading = false,
  onCreateFieldReport,
  onViewFieldReport,
  onCreateInspection,
  onViewInspection,
  onCreateIssue,
  onViewIssue,
  onExportData
}) => {
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter field reports based on search query
  const filteredReports = fieldReports.filter(report => {
    if (!searchQuery) return true;
    
    return (
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter inspections based on search query
  const filteredInspections = inspections.filter(inspection => {
    if (!searchQuery) return true;
    
    return (
      inspection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspector.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter issues based on search query
  const filteredIssues = issues.filter(issue => {
    if (!searchQuery) return true;
    
    return (
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.assignedTo && issue.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Sort reports by date (newest first)
  const sortedReports = [...filteredReports].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Sort inspections by date (newest first)
  const sortedInspections = [...filteredInspections].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Sort issues by priority and date
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get status color for field reports
  const getReportStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'reviewed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Get status color for inspections
  const getInspectionStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Get status color for issues
  const getIssueStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Get priority color for issues
  const getIssuePriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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

  // Format temperature
  const formatTemperature = (temp: number): string => {
    return `${temp}°F`;
  };

  // Render field reports list
  const renderFieldReportsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Field Reports</h3>
          {onCreateFieldReport && (
            <Button onClick={onCreateFieldReport}>
              New Report
            </Button>
          )}
        </div>
        
        {sortedReports.length > 0 ? (
          <div className="space-y-3">
            {sortedReports.map(report => (
              <div 
                key={report.id} 
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onViewFieldReport && onViewFieldReport(report.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{report.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.type} • {report.location}
                    </div>
                  </div>
                  <Badge className={getReportStatusColor(report.status)}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{formatDate(report.date)}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Submitted By</div>
                    <div className="flex items-center mt-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={report.submittedBy.avatarUrl} alt={report.submittedBy.name} />
                        <AvatarFallback>{report.submittedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{report.submittedBy.name}</span>
                    </div>
                  </div>
                  
                  {report.weather && (
                    <div>
                      <div className="text-sm text-muted-foreground">Weather</div>
                      <div className="font-medium">
                        {report.weather.condition}, {formatTemperature(report.weather.temperature)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex space-x-2">
                  {report.hasIssues && (
                    <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                      Has Issues
                    </Badge>
                  )}
                  {report.hasPhotos && (
                    <Badge variant="outline">
                      Has Photos
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
              <path d="M10 9H8"></path>
            </svg>
            <p className="text-muted-foreground">No field reports found</p>
            {onCreateFieldReport && (
              <Button onClick={onCreateFieldReport}>
                Create Field Report
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render inspections list
  const renderInspectionsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Inspections</h3>
          {onCreateInspection && (
            <Button onClick={onCreateInspection}>
              Schedule Inspection
            </Button>
          )}
        </div>
        
        {sortedInspections.length > 0 ? (
          <div className="space-y-3">
            {sortedInspections.map(inspection => (
              <div 
                key={inspection.id} 
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onViewInspection && onViewInspection(inspection.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{inspection.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {inspection.type} • {inspection.location}
                    </div>
                  </div>
                  <Badge className={getInspectionStatusColor(inspection.status)}>
                    {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{formatDate(inspection.date)}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Inspector</div>
                    <div className="flex items-center mt-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={inspection.inspector.avatarUrl} alt={inspection.inspector.name} />
                        <AvatarFallback>{inspection.inspector.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{inspection.inspector.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {inspection.inspector.organization}
                    </div>
                  </div>
                </div>
                
                {inspection.notes && (
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground">Notes</div>
                    <div className="text-sm mt-1">{inspection.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M2 12h20"></path>
              <path d="M16 6 22 12 16 18"></path>
              <path d="M8 18 2 12 8 6"></path>
            </svg>
            <p className="text-muted-foreground">No inspections found</p>
            {onCreateInspection && (
              <Button onClick={onCreateInspection}>
                Schedule Inspection
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render issues list
  const renderIssuesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Issues</h3>
          {onCreateIssue && (
            <Button onClick={onCreateIssue}>
              Report Issue
            </Button>
          )}
        </div>
        
        {sortedIssues.length > 0 ? (
          <div className="space-y-3">
            {sortedIssues.map(issue => (
              <div 
                key={issue.id} 
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onViewIssue && onViewIssue(issue.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{issue.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {issue.location} • Reported on {formatDate(issue.date)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getIssuePriorityColor(issue.priority)}>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </Badge>
                    <Badge className={getIssueStatusColor(issue.status)}>
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm">{issue.description}</div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Reported By</div>
                    <div className="flex items-center mt-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={issue.reportedBy.avatarUrl} alt={issue.reportedBy.name} />
                        <AvatarFallback>{issue.reportedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{issue.reportedBy.name}</span>
                    </div>
                  </div>
                  
                  {issue.assignedTo && (
                    <div>
                      <div className="text-sm text-muted-foreground">Assigned To</div>
                      <div className="flex items-center mt-1">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarImage src={issue.assignedTo.avatarUrl} alt={issue.assignedTo.name} />
                          <AvatarFallback>{issue.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{issue.assignedTo.name}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {issue.hasPhotos && (
                  <div className="mt-3">
                    <Badge variant="outline">
                      Has Photos
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-muted-foreground">No issues found</p>
            {onCreateIssue && (
              <Button onClick={onCreateIssue}>
                Report Issue
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
          <CardTitle className="text-xl font-bold">{projectName} Field Operations</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            {onExportData && (
              <Button variant="outline" size="sm" onClick={onExportData} className="h-8">
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
              <TabsTrigger value="reports">Field Reports</TabsTrigger>
              <TabsTrigger value="inspections">Inspections</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              {renderFieldReportsList()}
            </TabsContent>
            
            <TabsContent value="inspections">
              {renderInspectionsList()}
            </TabsContent>
            
            <TabsContent value="issues">
              {renderIssuesList()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldOperations;
