import React, { useState, useEffect } from "react";
import { Button } from "./ui/button"; // Assuming Shadcn UI Button
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; // Assuming Shadcn UI Select
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import WidgetComponent from "./WidgetComponent"; // Import the generic widget component
import WidgetLibrary from "./WidgetLibrary"; // Import the widget library modal
// Import API functions (replace with actual API calls)
// import { getUserDashboards, getDashboardConfig, updateDashboardLayout, addWidgetToDashboard } from "../services/api";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPage = () => {
    const [dashboards, setDashboards] = useState([]); // List of user dashboards
    const [currentDashboardId, setCurrentDashboardId] = useState(null);
    const [currentDashboard, setCurrentDashboard] = useState(null); // Full config of the current dashboard
    const [layout, setLayout] = useState([]); // Layout for react-grid-layout
    const [widgets, setWidgets] = useState([]); // Widget configurations for the current dashboard
    const [isEditMode, setIsEditMode] = useState(false);
    const [isWidgetLibraryOpen, setIsWidgetLibraryOpen] = useState(false);

    // Fetch dashboards on mount
    useEffect(() => {
        // Replace with actual API call
        // getUserDashboards().then(data => {
        //     setDashboards(data);
        //     // Select default or first dashboard
        //     const defaultDashboard = data.find(d => d.isDefault) || data[0];
        //     if (defaultDashboard) {
        //         setCurrentDashboardId(defaultDashboard.id);
        //     }
        // });
        // Mock data for now
        const mockDashboards = [
            { id: "dash1", name: "Default Dashboard", isDefault: true },
            { id: "dash2", name: "Project Overview", isDefault: false },
        ];
        setDashboards(mockDashboards);
        setCurrentDashboardId("dash1");
    }, []);

    // Fetch dashboard config when ID changes
    useEffect(() => {
        if (currentDashboardId) {
            // Replace with actual API call
            // getDashboardConfig(currentDashboardId).then(config => {
            //     setCurrentDashboard(config);
            //     // Transform config.layout into react-grid-layout format
            //     const rglLayout = config.widgets.map(w => ({
            //         i: w.id,
            //         x: w.position.x,
            //         y: w.position.y,
            //         w: w.position.w,
            //         h: w.position.h,
            //     }));
            //     setLayout(rglLayout);
            //     setWidgets(config.widgets);
            // });
            // Mock data for now
            const mockConfig = {
                id: "dash1",
                name: "Default Dashboard",
                layout: { /* ... */ },
                widgets: [
                    { id: "widget1", type: "Metric", title: "Active Projects", dataSource: "projects", dataConfig: { status: "Active" }, visualConfig: {}, position: { x: 0, y: 0, w: 2, h: 1 }, refreshInterval: 60 },
                    { id: "widget2", type: "Chart", title: "Task Status Distribution", dataSource: "tasks", dataConfig: { groupBy: "status" }, visualConfig: { chartType: "pie" }, position: { x: 2, y: 0, w: 4, h: 2 }, refreshInterval: 120 },
                    { id: "widget3", type: "List", title: "Recent Documents", dataSource: "documents", dataConfig: { limit: 5, sortBy: "createdAt", order: "desc" }, visualConfig: {}, position: { x: 0, y: 1, w: 2, h: 2 }, refreshInterval: 300 },
                ]
            };
            setCurrentDashboard(mockConfig);
            const rglLayout = mockConfig.widgets.map(w => ({
                i: w.id,
                x: w.position.x,
                y: w.position.y,
                w: w.position.w,
                h: w.position.h,
            }));
            setLayout(rglLayout);
            setWidgets(mockConfig.widgets);
        }
    }, [currentDashboardId]);

    const handleLayoutChange = (newLayout) => {
        // Only update state if in edit mode to prevent unwanted changes
        if (isEditMode) {
            setLayout(newLayout);
            // Prepare layout data for saving
            const updatedWidgetPositions = newLayout.map(item => ({
                widgetId: item.i,
                position: { x: item.x, y: item.y, w: item.w, h: item.h },
            }));
            // TODO: Debounce this call or save explicitly via button
            // updateDashboardLayout(currentDashboardId, { layout: updatedWidgetPositions });
            console.log("Layout changed (in edit mode):", updatedWidgetPositions);
        }
    };

    const handleAddWidget = (widgetConfig) => {
        // Replace with actual API call to add widget
        // addWidgetToDashboard(currentDashboardId, widgetConfig).then(newWidget => {
        //     setWidgets([...widgets, newWidget]);
        //     // Add to layout
        //     const newItem = { i: newWidget.id, x: 0, y: Infinity, w: newWidget.position.w || 2, h: newWidget.position.h || 1 }; // Place at bottom
        //     setLayout([...layout, newItem]);
        // });
        console.log("Adding widget:", widgetConfig);
        const newWidget = { ...widgetConfig, id: `widget${widgets.length + 1}` }; // Mock ID
        setWidgets([...widgets, newWidget]);
        const newItem = { i: newWidget.id, x: 0, y: Infinity, w: newWidget.position?.w || 2, h: newWidget.position?.h || 1 };
        setLayout([...layout, newItem]);
        setIsWidgetLibraryOpen(false);
    };

    const handleRemoveWidget = (widgetId) => {
        // Replace with actual API call
        // removeWidgetFromDashboard(widgetId).then(() => {
        //     setWidgets(widgets.filter(w => w.id !== widgetId));
        //     setLayout(layout.filter(l => l.i !== widgetId));
        // });
        console.log("Removing widget:", widgetId);
        setWidgets(widgets.filter(w => w.id !== widgetId));
        setLayout(layout.filter(l => l.i !== widgetId));
    };

    const handleUpdateWidget = (widgetId, updatedConfig) => {
        // Replace with actual API call
        // updateWidgetConfig(widgetId, updatedConfig).then(updatedWidget => {
        //     setWidgets(widgets.map(w => w.id === widgetId ? updatedWidget : w));
        // });
        console.log("Updating widget:", widgetId, updatedConfig);
        setWidgets(widgets.map(w => w.id === widgetId ? { ...w, ...updatedConfig } : w));
    };

    const toggleEditMode = () => {
        if (isEditMode) {
            // Save layout changes when exiting edit mode
            const updatedWidgetPositions = layout.map(item => ({
                widgetId: item.i,
                position: { x: item.x, y: item.y, w: item.w, h: item.h },
            }));
            // Replace with actual API call
            // updateDashboardLayout(currentDashboardId, { layout: updatedWidgetPositions });
            console.log("Saving layout:", updatedWidgetPositions);
        }
        setIsEditMode(!isEditMode);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-semibold">{currentDashboard?.name || "Dashboard"}</h1>
                <div className="flex gap-2">
                    <Select value={currentDashboardId || ""} onValueChange={setCurrentDashboardId}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Dashboard" />
                        </SelectTrigger>
                        <SelectContent>
                            {dashboards.map(dash => (
                                <SelectItem key={dash.id} value={dash.id}>{dash.name}</SelectItem>
                            ))}
                            {/* Add options for Create, Clone, Delete */} 
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsWidgetLibraryOpen(true)}>Add Widget</Button>
                    <Button variant={isEditMode ? "destructive" : "outline"} onClick={toggleEditMode}>
                        {isEditMode ? "Save Layout" : "Edit Layout"}
                    </Button>
                    {/* Add Dashboard Settings Button */} 
                </div>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }} // Adjust layouts per breakpoint if needed
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100} // Adjust as needed
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".widget-drag-handle" // Add this class to the draggable part of WidgetComponent
            >
                {widgets.map(widget => (
                    <div key={widget.id} className="bg-card rounded-lg shadow overflow-hidden">
                        <WidgetComponent
                            config={widget}
                            isEditing={isEditMode}
                            onRemove={() => handleRemoveWidget(widget.id)}
                            onUpdate={(updatedConfig) => handleUpdateWidget(widget.id, updatedConfig)}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>

            <WidgetLibrary
                isOpen={isWidgetLibraryOpen}
                onClose={() => setIsWidgetLibraryOpen(false)}
                onAddWidget={handleAddWidget}
            />
        </div>
    );
};

export default DashboardPage;

