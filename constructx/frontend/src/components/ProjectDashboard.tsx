import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import DashboardWidget from './DashboardWidget';

interface ProjectDashboardProps {
  projectId: string;
  projectName: string;
  dashboards?: {
    id: string;
    name: string;
    isDefault: boolean;
    layout: {
      columns: number;
      widgets: {
        id: string;
        type: string;
        title: string;
        size: {
          width: number;
          height: number;
        };
        position: {
          x: number;
          y: number;
        };
        config?: any;
      }[];
    };
  }[];
  isLoading?: boolean;
  onCreateDashboard?: () => void;
  onEditDashboard?: (dashboardId: string) => void;
  onDeleteDashboard?: (dashboardId: string) => void;
  onAddWidget?: (dashboardId: string) => void;
  onEditWidget?: (dashboardId: string, widgetId: string) => void;
  onRemoveWidget?: (dashboardId: string, widgetId: string) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectId,
  projectName,
  dashboards = [],
  isLoading = false,
  onCreateDashboard,
  onEditDashboard,
  onDeleteDashboard,
  onAddWidget,
  onEditWidget,
  onRemoveWidget
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    dashboards.find(d => d.isDefault)?.id || dashboards[0]?.id || 'default'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Get active dashboard
  const activeDashboard = dashboards.find(d => d.id === activeTab);

  // Render widgets in grid layout
  const renderWidgets = (dashboard: typeof dashboards[0]) => {
    if (!dashboard) return null;

    // Mock widget data (in a real app, this would come from API)
    const widgetData: Record<string, any> = {
      project_summary: (
        <div className="flex flex-col h-full">
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-sm font-medium">Status</div>
              <div className="text-lg font-bold">Active</div>
            </div>
            <div>
              <div className="text-sm font-medium">Progress</div>
              <div className="text-lg font-bold">68%</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">Start Date</div>
              <div className="text-sm font-medium">Mar 15, 2025</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">End Date</div>
              <div className="text-sm font-medium">Aug 30, 2025</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">Budget</div>
              <div className="text-sm font-medium">$1,250,000</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">Team</div>
              <div className="text-sm font-medium">12 members</div>
            </div>
          </div>
        </div>
      ),
      task_status: (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
              <div className="text-xs text-blue-800 dark:text-blue-200">To Do</div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">8</div>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded text-center">
              <div className="text-xs text-amber-800 dark:text-amber-200">In Progress</div>
              <div className="text-lg font-bold text-amber-800 dark:text-amber-200">12</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded text-center">
              <div className="text-xs text-purple-800 dark:text-purple-200">Review</div>
              <div className="text-lg font-bold text-purple-800 dark:text-purple-200">5</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
              <div className="text-xs text-green-800 dark:text-green-200">Completed</div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">24</div>
            </div>
          </div>
        </div>
      ),
      upcoming_milestones: (
        <div className="flex flex-col h-full space-y-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
            <div className="text-xs text-muted-foreground">May 25, 2025</div>
            <div className="text-sm font-medium">Design Approval</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
            <div className="text-xs text-muted-foreground">Jun 10, 2025</div>
            <div className="text-sm font-medium">Foundation Complete</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
            <div className="text-xs text-muted-foreground">Jul 05, 2025</div>
            <div className="text-sm font-medium">Framing Inspection</div>
          </div>
        </div>
      ),
      recent_activity: (
        <div className="flex flex-col h-full space-y-2 overflow-auto">
          <div className="border-b pb-2">
            <div className="text-sm font-medium">John Smith added a document</div>
            <div className="text-xs text-muted-foreground">Today at 9:32 AM</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm font-medium">Sarah Johnson completed a task</div>
            <div className="text-xs text-muted-foreground">Yesterday at 4:15 PM</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm font-medium">Mike Davis updated the schedule</div>
            <div className="text-xs text-muted-foreground">Yesterday at 2:45 PM</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm font-medium">Lisa Wang added a comment</div>
            <div className="text-xs text-muted-foreground">May 20, 2025 at 11:20 AM</div>
          </div>
        </div>
      ),
      budget_overview: (
        <div className="flex flex-col h-full">
          <div className="flex justify-between mb-2">
            <div>
              <div className="text-sm font-medium">Budget</div>
              <div className="text-lg font-bold">$1,250,000</div>
            </div>
            <div>
              <div className="text-sm font-medium">Spent</div>
              <div className="text-lg font-bold">$780,500</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">Remaining</div>
              <div className="text-sm font-medium">$469,500</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
              <div className="text-xs text-muted-foreground">Forecast</div>
              <div className="text-sm font-medium">$1,180,000</div>
            </div>
          </div>
        </div>
      )
    };

    return (
      <div 
        className={`grid grid-cols-${dashboard.layout.columns} gap-4 p-4`}
        style={{ 
          gridTemplateColumns: `repeat(${dashboard.layout.columns}, minmax(0, 1fr))` 
        }}
      >
        {dashboard.layout.widgets.map(widget => (
          <DashboardWidget
            key={widget.id}
            title={widget.title}
            type={widget.type}
            size={widget.size}
            onEdit={() => onEditWidget && onEditWidget(dashboard.id, widget.id)}
            onRemove={() => onRemoveWidget && onRemoveWidget(dashboard.id, widget.id)}
            refreshInterval={300}
            lastUpdated={new Date()}
          >
            {widgetData[widget.type] || (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </DashboardWidget>
        ))}
        
        {onAddWidget && (
          <Card className="col-span-1 h-[200px] flex items-center justify-center border-dashed cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Button 
              variant="ghost" 
              onClick={() => onAddWidget(dashboard.id)}
              className="flex flex-col items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span>Add Widget</span>
            </Button>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{projectName} Dashboard</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            {onCreateDashboard && (
              <Button variant="outline" size="sm" onClick={onCreateDashboard}>
                New Dashboard
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
        ) : dashboards.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {dashboards.map(dashboard => (
                <TabsTrigger key={dashboard.id} value={dashboard.id} className="relative">
                  {dashboard.name}
                  {dashboard.isDefault && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dashboards.map(dashboard => (
              <TabsContent key={dashboard.id} value={dashboard.id}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium">{dashboard.name}</h3>
                    {dashboard.isDefault && (
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {onEditDashboard && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditDashboard(dashboard.id)}
                        className="h-8"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>
                        Edit
                      </Button>
                    )}
                    {onDeleteDashboard && !dashboard.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteDashboard(dashboard.id)}
                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                {renderWidgets(dashboard)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-muted-foreground">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <line x1="3" x2="21" y1="9" y2="9"></line>
              <line x1="9" x2="9" y1="21" y2="9"></line>
            </svg>
            <p className="text-muted-foreground">No dashboards available</p>
            {onCreateDashboard && (
              <Button onClick={onCreateDashboard}>Create Dashboard</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDashboard;
