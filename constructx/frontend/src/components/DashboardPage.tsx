import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Settings, LayoutDashboard, Search, Filter, RefreshCw } from 'lucide-react';
import { useToast } from './ui/use-toast';
import dashboardService from '../services/dashboardService';

interface DashboardPageProps {
  projectId?: string; // Optional - if provided, shows project-specific dashboard
}

const DashboardPage: React.FC<DashboardPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<any[]>([]);

  useEffect(() => {
    loadDashboards();
  }, [projectId]);

  useEffect(() => {
    if (activeDashboardId) {
      loadWidgets(activeDashboardId);
    }
  }, [activeDashboardId]);

  const loadDashboards = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getDashboards(projectId);
      setDashboards(response);
      if (response.length > 0 && !activeDashboardId) {
        setActiveDashboardId(response[0].id); // Set first dashboard as active by default
      }
    } catch (error) {
      console.error('Error loading dashboards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboards. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWidgets = async (dashboardId: string) => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getWidgets(dashboardId);
      setWidgets(response);
    } catch (error) {
      console.error('Error loading widgets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widgets for this dashboard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDashboard = async () => {
    // Placeholder for adding new dashboard logic
    toast({
      title: 'Info',
      description: 'Add new dashboard functionality coming soon!',
    });
  };

  const handleDashboardSettings = async () => {
    // Placeholder for dashboard settings logic
    toast({
      title: 'Info',
      description: 'Dashboard settings functionality coming soon!',
    });
  };

  const handleAddWidget = async () => {
    // Placeholder for adding new widget logic
    toast({
      title: 'Info',
      description: 'Add new widget functionality coming soon!',
    });
  };

  const renderWidget = (widget: any) => {
    // This is a placeholder. In a real app, you'd have a component map
    // and render the appropriate widget component based on widget.type
    return (
      <Card key={widget.id} className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Widget Type: {widget.type}</p>
          <p className="text-muted-foreground text-sm">Data Source: {widget.dataSource}</p>
          {/* Render actual widget content here based on type and data */}
          <div className="mt-4 h-32 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-muted-foreground">
            {widget.title} Content
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {projectId ? `Project Dashboard for ${projectId}` : 'Your personalized insights at a glance'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAddDashboard}>
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
          <Button variant="outline" onClick={handleDashboardSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Dashboard Selector and Add Widget */}
      <div className="flex justify-between items-center">
        <Tabs value={activeDashboardId || ''} onValueChange={setActiveDashboardId}>
          <TabsList>
            {dashboards.map((dashboard) => (
              <TabsTrigger key={dashboard.id} value={dashboard.id}>
                {dashboard.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={handleAddWidget}>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      {/* Widget Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LayoutDashboard className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.length > 0 ? (
            widgets.map(renderWidget)
          ) : (
            <Card className="col-span-full p-8 text-center text-muted-foreground">
              <CardTitle>No widgets yet!</CardTitle>
              <CardDescription className="mt-2">
                Start by adding some widgets to your dashboard to see your data.
              </CardDescription>
              <Button onClick={handleAddWidget} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Widget
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;


