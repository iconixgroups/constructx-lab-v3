import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Edit, Trash2, RefreshCw, Maximize2, Settings } from "lucide-react";
// Import API function to get widget data (replace with actual API call)
// import { getWidgetData } from "../services/api";

// Dynamically import widget types to potentially reduce initial bundle size
const MetricWidget = lazy(() => import("./widgets/MetricWidget"));
const ChartWidget = lazy(() => import("./widgets/ChartWidget"));
const ListWidget = lazy(() => import("./widgets/ListWidget"));
// Add other widget types here
// const TableWidget = lazy(() => import("./widgets/TableWidget"));
// const CalendarWidget = lazy(() => import("./widgets/CalendarWidget"));

const WidgetComponent = ({ config, isEditing, onRemove, onUpdate }) => {
    const [widgetData, setWidgetData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMaximized, setIsMaximized] = useState(false); // State for maximizing widget
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for widget settings modal

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Replace with actual API call using config.id or config.dataSource/dataConfig
            // const data = await getWidgetData(config.id);
            // Mock data based on type for now
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            let mockData;
            switch (config.type) {
                case "Metric":
                    mockData = { value: Math.floor(Math.random() * 100) + 1, trend: Math.random() > 0.5 ? "up" : "down" };
                    break;
                case "Chart":
                    mockData = {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                        datasets: [
                            {
                                label: "Dataset 1",
                                data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100],
                                borderColor: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.5)",
                            },
                        ],
                    };
                    break;
                case "List":
                    mockData = [
                        { id: "doc1", title: "Project Plan v3", date: "2024-05-30" },
                        { id: "doc2", title: "Site Inspection Report", date: "2024-05-29" },
                        { id: "doc3", title: "Budget Proposal Q3", date: "2024-05-28" },
                    ];
                    break;
                default:
                    mockData = { message: `Data for ${config.type} widget` };
            }
            setWidgetData(mockData);
        } catch (err) {
            console.error("Error fetching widget data:", err);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up refresh interval if configured
        let intervalId;
        if (config.refreshInterval && config.refreshInterval > 0) {
            intervalId = setInterval(fetchData, config.refreshInterval * 1000);
        }
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [config.id, config.refreshInterval, config.dataSource, JSON.stringify(config.dataConfig)]); // Re-fetch if config changes

    const renderWidgetContent = () => {
        if (isLoading) return <div className="p-4 text-center">Loading...</div>;
        if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
        if (!widgetData) return <div className="p-4 text-center">No data available.</div>;

        // Lazy load the specific widget type component
        return (
            <Suspense fallback={<div className="p-4 text-center">Loading Widget...</div>}>
                {config.type === "Metric" && <MetricWidget data={widgetData} config={config.visualConfig} />}
                {config.type === "Chart" && <ChartWidget data={widgetData} config={config.visualConfig} />}
                {config.type === "List" && <ListWidget data={widgetData} config={config.visualConfig} />}
                {/* Add other widget types here */}
                {!["Metric", "Chart", "List"].includes(config.type) && (
                    <div className="p-4">Unsupported widget type: {config.type}</div>
                )}
            </Suspense>
        );
    };

    // TODO: Implement Maximized view and Settings Modal
    if (isMaximized) {
        // Render a maximized version, potentially in a modal
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 widget-drag-handle">
                        <CardTitle className="text-lg font-medium">{config.title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsMaximized(false)}>X</Button>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-auto">
                        {renderWidgetContent()}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 widget-drag-handle cursor-move">
                <CardTitle className="text-sm font-medium truncate" title={config.title}>{config.title}</CardTitle>
                <div className="flex items-center space-x-1">
                    {/* Show controls only when editing or hovered? */} 
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchData} title="Refresh">
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMaximized(true)} title="Maximize">
                        <Maximize2 className="h-3 w-3" />
                    </Button>
                    {isEditing && (
                        <>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSettingsOpen(true)} title="Settings">
                                <Settings className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onRemove} title="Remove">
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-2 overflow-auto">
                {renderWidgetContent()}
            </CardContent>
            {/* Add Widget Settings Modal here, controlled by isSettingsOpen */} 
            {/* <WidgetSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} config={config} onSave={onUpdate} /> */}
        </Card>
    );
};

export default WidgetComponent;

