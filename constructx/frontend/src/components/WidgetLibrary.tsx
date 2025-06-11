import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

// Mock data for available widget types and data sources
const availableWidgetTypes = [
    { value: "Metric", label: "Metric (Single Number)" },
    { value: "Chart", label: "Chart (Line, Bar, Pie)" },
    { value: "List", label: "List (Tasks, Documents, etc.)" },
    { value: "Table", label: "Table" },
    { value: "Calendar", label: "Calendar" },
];

const availableDataSources = [
    { value: "projects", label: "Projects" },
    { value: "tasks", label: "Tasks" },
    { value: "documents", label: "Documents" },
    { value: "leads", label: "Leads" },
    { value: "schedule", label: "Schedule Items" },
    { value: "expenses", label: "Expenses" },
];

const WidgetLibrary = ({ isOpen, onClose, onAddWidget }) => {
    const [selectedType, setSelectedType] = useState("");
    const [widgetTitle, setWidgetTitle] = useState("");
    const [selectedDataSource, setSelectedDataSource] = useState("");
    // Add more state for specific configurations based on type
    const [chartType, setChartType] = useState("bar");
    const [metricField, setMetricField] = useState("");
    const [listLimit, setListLimit] = useState(5);

    const handleAddClick = () => {
        if (!selectedType || !widgetTitle || !selectedDataSource) {
            // Add proper validation feedback
            alert("Please fill in all required fields.");
            return;
        }

        // Construct the widget configuration object
        const newWidgetConfig = {
            type: selectedType,
            title: widgetTitle,
            dataSource: selectedDataSource,
            dataConfig: {},
            visualConfig: {},
            // Default position/size - DashboardPage will handle placement
            position: { w: 2, h: 1 }, // Default size
            refreshInterval: 60, // Default refresh
        };

        // Add type-specific configurations
        switch (selectedType) {
            case "Metric":
                newWidgetConfig.dataConfig = { field: metricField }; // Example config
                newWidgetConfig.position = { w: 2, h: 1 };
                break;
            case "Chart":
                newWidgetConfig.visualConfig = { chartType: chartType };
                newWidgetConfig.position = { w: 4, h: 2 };
                break;
            case "List":
                newWidgetConfig.dataConfig = { limit: listLimit, sortBy: "createdAt", order: "desc" };
                newWidgetConfig.position = { w: 2, h: 2 };
                break;
            // Add cases for other types
        }

        onAddWidget(newWidgetConfig);
        resetForm();
    };

    const resetForm = () => {
        setSelectedType("");
        setWidgetTitle("");
        setSelectedDataSource("");
        setChartType("bar");
        setMetricField("");
        setListLimit(5);
    };

    const renderConfigOptions = () => {
        switch (selectedType) {
            case "Metric":
                return (
                    <div className="grid gap-2">
                        <Label htmlFor="metricField">Metric Field</Label>
                        <Input id="metricField" value={metricField} onChange={(e) => setMetricField(e.target.value)} placeholder="e.g., count, sum(amount)" />
                    </div>
                );
            case "Chart":
                return (
                    <div className="grid gap-2">
                        <Label htmlFor="chartType">Chart Type</Label>
                        <Select value={chartType} onValueChange={setChartType}>
                            <SelectTrigger id="chartType">
                                <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Add more chart config options: groupBy, aggregate, etc. */}
                    </div>
                );
            case "List":
                return (
                    <div className="grid gap-2">
                        <Label htmlFor="listLimit">Number of Items</Label>
                        <Input id="listLimit" type="number" value={listLimit} onChange={(e) => setListLimit(parseInt(e.target.value, 10))} min="1" max="20" />
                        {/* Add more list config options: sortBy, filter, etc. */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Widget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="widgetType">Widget Type</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger id="widgetType">
                                <SelectValue placeholder="Select widget type" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableWidgetTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="widgetTitle">Widget Title</Label>
                        <Input id="widgetTitle" value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} placeholder="Enter widget title" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dataSource">Data Source</Label>
                        <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                            <SelectTrigger id="dataSource">
                                <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDataSources.map(source => (
                                    <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Render additional config options based on selected type */} 
                    {renderConfigOptions()}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleAddClick}>Add Widget</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WidgetLibrary;

