import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';

interface AnalyticsWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'custom';
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  dataSource: string;
  refreshInterval: number; // in minutes
  size: 'small' | 'medium' | 'large';
  position: number;
  filters: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  widgets: AnalyticsWidget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data sources for analytics
const dataSources = [
  { id: 'projects', name: 'Projects Data' },
  { id: 'tasks', name: 'Tasks Data' },
  { id: 'financial', name: 'Financial Data' },
  { id: 'resources', name: 'Resources Data' },
  { id: 'schedule', name: 'Schedule Data' },
  { id: 'quality', name: 'Quality Control Data' },
  { id: 'safety', name: 'Safety Data' }
];

// Sample metrics for widgets
const sampleMetrics = {
  'projects': ['Project Count', 'Projects by Status', 'Projects by Type', 'Average Project Duration'],
  'tasks': ['Task Completion Rate', 'Overdue Tasks', 'Tasks by Priority', 'Task Distribution by Assignee'],
  'financial': ['Total Budget', 'Actual vs Planned Costs', 'Invoice Status', 'Payment Trends'],
  'resources': ['Resource Utilization', 'Equipment Allocation', 'Material Usage', 'Labor Hours'],
  'schedule': ['Schedule Variance', 'Milestone Status', 'Critical Path Analysis', 'Delay Frequency'],
  'quality': ['Quality Score Trends', 'Inspection Results', 'Defect Rate', 'Quality by Project'],
  'safety': ['Incident Count', 'Safety Compliance Rate', 'Hazard Identification', 'Safety Training Completion']
};

const AnalyticsModule: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: '1',
      name: 'Executive Overview',
      description: 'High-level metrics for executive decision making',
      isDefault: true,
      widgets: [
        {
          id: '1',
          title: 'Project Status Overview',
          type: 'chart',
          chartType: 'pie',
          dataSource: 'projects',
          refreshInterval: 60,
          size: 'medium',
          position: 1,
          filters: { timeRange: 'all' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Financial Performance',
          type: 'chart',
          chartType: 'bar',
          dataSource: 'financial',
          refreshInterval: 120,
          size: 'large',
          position: 2,
          filters: { timeRange: 'ytd' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '3',
          title: 'Resource Utilization',
          type: 'chart',
          chartType: 'line',
          dataSource: 'resources',
          refreshInterval: 240,
          size: 'medium',
          position: 3,
          filters: { timeRange: 'last30days' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '4',
          title: 'Key Performance Indicators',
          type: 'metric',
          dataSource: 'projects',
          refreshInterval: 60,
          size: 'small',
          position: 4,
          filters: { timeRange: 'current' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        }
      ],
      createdBy: 'System',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Project Performance',
      description: 'Detailed metrics for project management and tracking',
      isDefault: false,
      widgets: [
        {
          id: '5',
          title: 'Task Completion Trends',
          type: 'chart',
          chartType: 'line',
          dataSource: 'tasks',
          refreshInterval: 30,
          size: 'medium',
          position: 1,
          filters: { timeRange: 'last90days' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-20T14:15:00Z',
          updatedAt: '2025-01-20T14:15:00Z'
        },
        {
          id: '6',
          title: 'Schedule Variance Analysis',
          type: 'chart',
          chartType: 'bar',
          dataSource: 'schedule',
          refreshInterval: 60,
          size: 'large',
          position: 2,
          filters: { timeRange: 'last60days' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-20T14:15:00Z',
          updatedAt: '2025-01-20T14:15:00Z'
        },
        {
          id: '7',
          title: 'Quality Control Metrics',
          type: 'table',
          dataSource: 'quality',
          refreshInterval: 120,
          size: 'medium',
          position: 3,
          filters: { timeRange: 'last30days' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-01-20T14:15:00Z',
          updatedAt: '2025-01-20T14:15:00Z'
        }
      ],
      createdBy: 'System',
      createdAt: '2025-01-20T14:15:00Z',
      updatedAt: '2025-01-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Financial Analytics',
      description: 'Financial metrics and trends for budget management',
      isDefault: false,
      widgets: [
        {
          id: '8',
          title: 'Budget vs. Actual Costs',
          type: 'chart',
          chartType: 'bar',
          dataSource: 'financial',
          refreshInterval: 60,
          size: 'large',
          position: 1,
          filters: { timeRange: 'ytd' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-02-05T09:45:00Z',
          updatedAt: '2025-02-05T09:45:00Z'
        },
        {
          id: '9',
          title: 'Invoice Status',
          type: 'table',
          dataSource: 'financial',
          refreshInterval: 120,
          size: 'medium',
          position: 2,
          filters: { status: 'all' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-02-05T09:45:00Z',
          updatedAt: '2025-02-05T09:45:00Z'
        },
        {
          id: '10',
          title: 'Cost Trend Analysis',
          type: 'chart',
          chartType: 'line',
          dataSource: 'financial',
          refreshInterval: 240,
          size: 'medium',
          position: 3,
          filters: { timeRange: 'last12months' },
          isActive: true,
          createdBy: 'System',
          createdAt: '2025-02-05T09:45:00Z',
          updatedAt: '2025-02-05T09:45:00Z'
        }
      ],
      createdBy: 'System',
      createdAt: '2025-02-05T09:45:00Z',
      updatedAt: '2025-02-05T09:45:00Z'
    }
  ]);

  const [activeDashboard, setActiveDashboard] = useState<Dashboard>(dashboards[0]);
  const [showCreateDashboard, setShowCreateDashboard] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [editingWidget, setEditingWidget] = useState<AnalyticsWidget | null>(null);
  
  const [newDashboard, setNewDashboard] = useState<Partial<Dashboard>>({
    name: '',
    description: '',
    isDefault: false,
    widgets: []
  });
  
  const [newWidget, setNewWidget] = useState<Partial<AnalyticsWidget>>({
    title: '',
    type: 'chart',
    chartType: 'bar',
    dataSource: '',
    refreshInterval: 60,
    size: 'medium',
    filters: {},
    isActive: true
  });

  // Handle dashboard creation
  const handleCreateDashboard = () => {
    const dashboardId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    const createdDashboard: Dashboard = {
      id: dashboardId,
      name: newDashboard.name || 'New Dashboard',
      description: newDashboard.description || '',
      isDefault: newDashboard.isDefault || false,
      widgets: [],
      createdBy: 'Current User',
      createdAt: createdAt,
      updatedAt: createdAt
    };
    
    // If this is set as default, update other dashboards
    if (createdDashboard.isDefault) {
      const updatedDashboards = dashboards.map(dash => ({
        ...dash,
        isDefault: false
      }));
      setDashboards([...updatedDashboards, createdDashboard]);
    } else {
      setDashboards([...dashboards, createdDashboard]);
    }
    
    setActiveDashboard(createdDashboard);
    setNewDashboard({
      name: '',
      description: '',
      isDefault: false,
      widgets: []
    });
    setShowCreateDashboard(false);
  };

  // Handle dashboard update
  const handleUpdateDashboard = () => {
    if (!editingDashboard) return;
    
    const updatedDashboard = {
      ...editingDashboard,
      updatedAt: new Date().toISOString()
    };
    
    // If this is set as default, update other dashboards
    if (updatedDashboard.isDefault) {
      const updatedDashboards = dashboards.map(dash => ({
        ...dash,
        isDefault: dash.id === updatedDashboard.id ? true : false
      }));
      setDashboards(updatedDashboards);
    } else {
      const updatedDashboards = dashboards.map(dash => 
        dash.id === updatedDashboard.id ? updatedDashboard : dash
      );
      setDashboards(updatedDashboards);
    }
    
    setActiveDashboard(updatedDashboard);
    setEditingDashboard(null);
  };

  // Handle dashboard deletion
  const handleDeleteDashboard = (id: string) => {
    const updatedDashboards = dashboards.filter(dash => dash.id !== id);
    
    // If we're deleting the active dashboard, switch to another one
    if (activeDashboard.id === id && updatedDashboards.length > 0) {
      setActiveDashboard(updatedDashboards[0]);
    }
    
    setDashboards(updatedDashboards);
  };

  // Handle widget creation
  const handleAddWidget = () => {
    const widgetId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    const createdWidget: AnalyticsWidget = {
      id: widgetId,
      title: newWidget.title || 'New Widget',
      type: newWidget.type || 'chart',
      chartType: newWidget.type === 'chart' ? newWidget.chartType : undefined,
      dataSource: newWidget.dataSource || '',
      refreshInterval: newWidget.refreshInterval || 60,
      size: newWidget.size || 'medium',
      position: activeDashboard.widgets.length + 1,
      filters: newWidget.filters || {},
      isActive: true,
      createdBy: 'Current User',
      createdAt: createdAt,
      updatedAt: createdAt
    };
    
    const updatedDashboard = {
      ...activeDashboard,
      widgets: [...activeDashboard.widgets, createdWidget],
      updatedAt: createdAt
    };
    
    const updatedDashboards = dashboards.map(dash => 
      dash.id === activeDashboard.id ? updatedDashboard : dash
    );
    
    setDashboards(updatedDashboards);
    setActiveDashboard(updatedDashboard);
    setNewWidget({
      title: '',
      type: 'chart',
      chartType: 'bar',
      dataSource: '',
      refreshInterval: 60,
      size: 'medium',
      filters: {},
      isActive: true
    });
    setShowAddWidget(false);
  };

  // Handle widget update
  const handleUpdateWidget = () => {
    if (!editingWidget) return;
    
    const updatedWidget = {
      ...editingWidget,
      updatedAt: new Date().toISOString()
    };
    
    const updatedWidgets = activeDashboard.widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    );
    
    const updatedDashboard = {
      ...activeDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date().toISOString()
    };
    
    const updatedDashboards = dashboards.map(dash => 
      dash.id === activeDashboard.id ? updatedDashboard : dash
    );
    
    setDashboards(updatedDashboards);
    setActiveDashboard(updatedDashboard);
    setEditingWidget(null);
  };

  // Handle widget deletion
  const handleDeleteWidget = (id: string) => {
    const updatedWidgets = activeDashboard.widgets.filter(widget => widget.id !== id);
    
    const updatedDashboard = {
      ...activeDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date().toISOString()
    };
    
    const updatedDashboards = dashboards.map(dash => 
      dash.id === activeDashboard.id ? updatedDashboard : dash
    );
    
    setDashboards(updatedDashboards);
    setActiveDashboard(updatedDashboard);
  };

  // Get available metrics based on selected data source
  const getAvailableMetrics = (dataSource: string) => {
    return sampleMetrics[dataSource as keyof typeof sampleMetrics] || [];
  };

  // Render widget based on type
  const renderWidget = (widget: AnalyticsWidget) => {
    switch (widget.type) {
      case 'chart':
        return renderChartWidget(widget);
      case 'metric':
        return renderMetricWidget(widget);
      case 'table':
        return renderTableWidget(widget);
      case 'custom':
        return renderCustomWidget(widget);
      default:
        return <div>Unknown widget type</div>;
    }
  };

  // Render chart widget
  const renderChartWidget = (widget: AnalyticsWidget) => {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">{widget.title}</div>
          <div className="text-sm text-gray-500 mb-4">
            {widget.chartType?.toUpperCase()} Chart - {dataSources.find(ds => ds.id === widget.dataSource)?.name}
          </div>
          <div className="text-gray-400 italic">
            [Chart visualization would render here based on real data]
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Refreshes every {widget.refreshInterval} minutes
          </div>
        </div>
      </div>
    );
  };

  // Render metric widget
  const renderMetricWidget = (widget: AnalyticsWidget) => {
    // Sample metrics for demonstration
    const metrics = [
      { label: 'Active Projects', value: '24', trend: 'up', percentage: '8%' },
      { label: 'On-time Tasks', value: '87%', trend: 'up', percentage: '3%' },
      { label: 'Budget Variance', value: '-2.4%', trend: 'down', percentage: '1.2%' },
      { label: 'Resource Utilization', value: '78%', trend: 'up', percentage: '5%' }
    ];

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-lg font-medium mb-3">{widget.title}</div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
              <div className="text-2xl font-bold mt-1">{metric.value}</div>
              <div className={`text-xs mt-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.percentage} from last period
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500 text-right">
          Refreshes every {widget.refreshInterval} minutes
        </div>
      </div>
    );
  };

  // Render table widget
  const renderTableWidget = (widget: AnalyticsWidget) => {
    // Sample table data for demonstration
    const headers = ['Name', 'Status', 'Value', 'Date'];
    const rows = [
      ['Project Alpha', 'Active', '$245,000', '2025-05-15'],
      ['Task Completion', 'On Track', '87%', '2025-05-20'],
      ['Resource Allocation', 'Warning', '94%', '2025-05-18'],
      ['Budget Variance', 'Critical', '-5.2%', '2025-05-22']
    ];

    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="text-lg font-medium mb-3">{widget.title}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex}
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-right">
          Refreshes every {widget.refreshInterval} minutes
        </div>
      </div>
    );
  };

  // Render custom widget
  const renderCustomWidget = (widget: AnalyticsWidget) => {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">{widget.title}</div>
          <div className="text-sm text-gray-500 mb-4">
            Custom Widget - {dataSources.find(ds => ds.id === widget.dataSource)?.name}
          </div>
          <div className="text-gray-400 italic">
            [Custom visualization would render here]
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Refreshes every {widget.refreshInterval} minutes
          </div>
        </div>
      </div>
    );
  };

  // Get widget size class
  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      default:
        return 'col-span-2';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddWidget(true)}>Add Widget</Button>
          <Button onClick={() => setShowCreateDashboard(true)}>Create Dashboard</Button>
        </div>
      </div>

      {/* Dashboard Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboards</CardTitle>
          <CardDescription>Select a dashboard to view or manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dashboards.map(dashboard => (
              <Button 
                key={dashboard.id}
                variant={activeDashboard.id === dashboard.id ? 'default' : 'outline'}
                onClick={() => setActiveDashboard(dashboard)}
                className="flex items-center"
              >
                {dashboard.name}
                {dashboard.isDefault && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">Default</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{activeDashboard.name}</CardTitle>
              <CardDescription>{activeDashboard.description}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingDashboard(activeDashboard)}
              >
                Edit Dashboard
              </Button>
              {!activeDashboard.isDefault && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteDashboard(activeDashboard.id)}
                >
                  Delete Dashboard
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {activeDashboard.widgets.map(widget => (
              <div key={widget.id} className={getWidgetSizeClass(widget.size)}>
                <Card>
                  <CardContent className="p-0">
                    {renderWidget(widget)}
                  </CardContent>
                  <CardFooter className="flex justify-between py-2">
                    <div className="text-xs text-gray-500">
                      {dataSources.find(ds => ds.id === widget.dataSource)?.name}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingWidget(widget)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteWidget(widget.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
            {activeDashboard.widgets.length === 0 && (
              <div className="col-span-3 p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="text-gray-500 dark:text-gray-400">
                  No widgets added to this dashboard yet.
                </div>
                <Button 
                  className="mt-4"
                  onClick={() => setShowAddWidget(true)}
                >
                  Add Your First Widget
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Dashboard Form */}
      {showCreateDashboard && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Dashboard</CardTitle>
            <CardDescription>Configure your new analytics dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Dashboard Name</FormLabel>
                <Input 
                  value={newDashboard.name} 
                  onChange={(e) => setNewDashboard({...newDashboard, name: e.target.value})}
                  placeholder="Enter dashboard name"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newDashboard.description} 
                  onChange={(e) => setNewDashboard({...newDashboard, description: e.target.value})}
                  placeholder="Enter dashboard description"
                />
              </FormField>
              
              <FormField>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    checked={newDashboard.isDefault} 
                    onChange={(e) => setNewDashboard({...newDashboard, isDefault: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Set as default dashboard
                  </label>
                </div>
                <FormDescription>
                  The default dashboard will be shown first when accessing analytics
                </FormDescription>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateDashboard(false)}>Cancel</Button>
            <Button onClick={handleCreateDashboard}>Create Dashboard</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Dashboard Form */}
      {editingDashboard && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Dashboard</CardTitle>
            <CardDescription>Update dashboard configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Dashboard Name</FormLabel>
                <Input 
                  value={editingDashboard.name} 
                  onChange={(e) => setEditingDashboard({...editingDashboard, name: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingDashboard.description} 
                  onChange={(e) => setEditingDashboard({...editingDashboard, description: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="editIsDefault" 
                    checked={editingDashboard.isDefault} 
                    onChange={(e) => setEditingDashboard({...editingDashboard, isDefault: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="editIsDefault" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Set as default dashboard
                  </label>
                </div>
                <FormDescription>
                  The default dashboard will be shown first when accessing analytics
                </FormDescription>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingDashboard(null)}>Cancel</Button>
            <Button onClick={handleUpdateDashboard}>Update Dashboard</Button>
          </CardFooter>
        </Card>
      )}

      {/* Add Widget Form */}
      {showAddWidget && (
        <Card>
          <CardHeader>
            <CardTitle>Add Widget</CardTitle>
            <CardDescription>Configure a new analytics widget</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Widget Title</FormLabel>
                <Input 
                  value={newWidget.title} 
                  onChange={(e) => setNewWidget({...newWidget, title: e.target.value})}
                  placeholder="Enter widget title"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Widget Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newWidget.type} 
                  onChange={(e) => setNewWidget({...newWidget, type: e.target.value as any})}
                >
                  <option value="chart">Chart</option>
                  <option value="metric">Metric</option>
                  <option value="table">Table</option>
                  <option value="custom">Custom</option>
                </select>
              </FormField>
              
              {newWidget.type === 'chart' && (
                <FormField>
                  <FormLabel>Chart Type</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newWidget.chartType} 
                    onChange={(e) => setNewWidget({...newWidget, chartType: e.target.value as any})}
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Data Source</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newWidget.dataSource} 
                  onChange={(e) => setNewWidget({...newWidget, dataSource: e.target.value})}
                >
                  <option value="">Select data source</option>
                  {dataSources.map(source => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </FormField>
              
              {newWidget.dataSource && (
                <FormField>
                  <FormLabel>Metric</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select metric</option>
                    {getAvailableMetrics(newWidget.dataSource).map((metric, index) => (
                      <option key={index} value={metric}>{metric}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Widget Size</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newWidget.size} 
                  onChange={(e) => setNewWidget({...newWidget, size: e.target.value as any})}
                >
                  <option value="small">Small (1 column)</option>
                  <option value="medium">Medium (2 columns)</option>
                  <option value="large">Large (3 columns)</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Refresh Interval (minutes)</FormLabel>
                <Input 
                  type="number"
                  value={newWidget.refreshInterval} 
                  onChange={(e) => setNewWidget({...newWidget, refreshInterval: parseInt(e.target.value) || 60})}
                  min="5"
                  max="1440"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Time Range Filter</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => setNewWidget({
                    ...newWidget, 
                    filters: {...newWidget.filters, timeRange: e.target.value}
                  })}
                >
                  <option value="current">Current Period</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last60days">Last 60 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="last12months">Last 12 Months</option>
                  <option value="ytd">Year to Date</option>
                  <option value="all">All Time</option>
                </select>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddWidget(false)}>Cancel</Button>
            <Button onClick={handleAddWidget}>Add Widget</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Widget Form */}
      {editingWidget && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Widget</CardTitle>
            <CardDescription>Update widget configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel required>Widget Title</FormLabel>
                <Input 
                  value={editingWidget.title} 
                  onChange={(e) => setEditingWidget({...editingWidget, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Widget Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingWidget.type} 
                  onChange={(e) => setEditingWidget({...editingWidget, type: e.target.value as any})}
                >
                  <option value="chart">Chart</option>
                  <option value="metric">Metric</option>
                  <option value="table">Table</option>
                  <option value="custom">Custom</option>
                </select>
              </FormField>
              
              {editingWidget.type === 'chart' && (
                <FormField>
                  <FormLabel>Chart Type</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingWidget.chartType} 
                    onChange={(e) => setEditingWidget({...editingWidget, chartType: e.target.value as any})}
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Data Source</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingWidget.dataSource} 
                  onChange={(e) => setEditingWidget({...editingWidget, dataSource: e.target.value})}
                >
                  <option value="">Select data source</option>
                  {dataSources.map(source => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </FormField>
              
              {editingWidget.dataSource && (
                <FormField>
                  <FormLabel>Metric</FormLabel>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select metric</option>
                    {getAvailableMetrics(editingWidget.dataSource).map((metric, index) => (
                      <option key={index} value={metric}>{metric}</option>
                    ))}
                  </select>
                </FormField>
              )}
              
              <FormField>
                <FormLabel>Widget Size</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingWidget.size} 
                  onChange={(e) => setEditingWidget({...editingWidget, size: e.target.value as any})}
                >
                  <option value="small">Small (1 column)</option>
                  <option value="medium">Medium (2 columns)</option>
                  <option value="large">Large (3 columns)</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Refresh Interval (minutes)</FormLabel>
                <Input 
                  type="number"
                  value={editingWidget.refreshInterval} 
                  onChange={(e) => setEditingWidget({...editingWidget, refreshInterval: parseInt(e.target.value) || 60})}
                  min="5"
                  max="1440"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Time Range Filter</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={(editingWidget.filters as any).timeRange}
                  onChange={(e) => setEditingWidget({
                    ...editingWidget, 
                    filters: {...editingWidget.filters, timeRange: e.target.value}
                  })}
                >
                  <option value="current">Current Period</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last60days">Last 60 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="last12months">Last 12 Months</option>
                  <option value="ytd">Year to Date</option>
                  <option value="all">All Time</option>
                </select>
              </FormField>
              
              <FormField>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={editingWidget.isActive} 
                    onChange={(e) => setEditingWidget({...editingWidget, isActive: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Widget active
                  </label>
                </div>
                <FormDescription>
                  Inactive widgets will not be displayed on the dashboard
                </FormDescription>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingWidget(null)}>Cancel</Button>
            <Button onClick={handleUpdateWidget}>Update Widget</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsModule;
