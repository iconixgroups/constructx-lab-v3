import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePickerWithRange } from "./ui/date-range-picker"; // Assuming this component exists
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GanttChartSquare, CalendarDays, List } from "lucide-react";
import GanttChartView from "./GanttChartView"; // Placeholder
import CalendarView from "./CalendarView"; // Placeholder
import ScheduleListView from "./ScheduleListView"; // Placeholder

// Mock API (replace with actual API calls)
const mockApi = {
    getSchedulesForProject: async (projectId) => {
        console.log("Fetching schedules for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: "sched1", name: "Main Construction Schedule", status: "Active" },
            { id: "sched2", name: "MEP Coordination Schedule", status: "Draft" },
            { id: "sched3", name: "Lookahead Schedule - June", status: "Active" },
        ];
    },
    getScheduleDetails: async (scheduleId) => {
        console.log("Fetching details for schedule:", scheduleId);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Return mock details including date range
        return {
            id: scheduleId,
            name: `Schedule ${scheduleId}`,
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            // ... other details
        };
    }
};

const SchedulePage = ({ projectId }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [currentView, setCurrentView] = useState("gantt"); // gantt, calendar, list
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Fetch schedules on mount
    useEffect(() => {
        setIsLoadingSchedules(true);
        mockApi.getSchedulesForProject(projectId)
            .then(data => {
                setSchedules(data);
                if (data.length > 0) {
                    // Select the first active schedule by default, or just the first one
                    const firstActive = data.find(s => s.status === "Active");
                    const defaultScheduleId = firstActive ? firstActive.id : data[0].id;
                    setSelectedScheduleId(defaultScheduleId);
                }
            })
            .catch(err => console.error("Failed to load schedules:", err))
            .finally(() => setIsLoadingSchedules(false));
    }, [projectId]);

    // Fetch schedule details when selectedScheduleId changes
    useEffect(() => {
        if (!selectedScheduleId) {
            setScheduleDetails(null);
            setDateRange({ from: undefined, to: undefined });
            return;
        }
        setIsLoadingDetails(true);
        mockApi.getScheduleDetails(selectedScheduleId)
            .then(data => {
                setScheduleDetails(data);
                // Set initial date range based on schedule dates
                setDateRange({ 
                    from: data.startDate ? new Date(data.startDate) : undefined, 
                    to: data.endDate ? new Date(data.endDate) : undefined 
                });
            })
            .catch(err => console.error("Failed to load schedule details:", err))
            .finally(() => setIsLoadingDetails(false));
    }, [selectedScheduleId]);

    const handleScheduleChange = (scheduleId) => {
        setSelectedScheduleId(scheduleId);
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
        // Potentially refetch data for the new range or pass range to child views
    };

    return (
        <div className="p-4 md:p-6 space-y-4">
            {/* Header and Controls */} 
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-semibold">Schedule Management</h1>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {isLoadingSchedules ? (
                        <p>Loading schedules...</p>
                    ) : schedules.length > 0 ? (
                        <Select value={selectedScheduleId || ""} onValueChange={handleScheduleChange}>
                            <SelectTrigger className="w-full md:w-[250px]">
                                <SelectValue placeholder="Select a schedule..." />
                            </SelectTrigger>
                            <SelectContent>
                                {schedules.map(schedule => (
                                    <SelectItem key={schedule.id} value={schedule.id}>
                                        {schedule.name} ({schedule.status})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <p>No schedules found for this project.</p>
                    )}
                    {/* Add New Schedule Button */} 
                    <Button variant="outline">New Schedule</Button>
                </div>
            </div>

            {selectedScheduleId && (
                <div className="border rounded-lg p-4 space-y-4">
                    {/* View Controls */} 
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Tabs value={currentView} onValueChange={setCurrentView} className="w-full md:w-auto">
                            <TabsList>
                                <TabsTrigger value="gantt"><GanttChartSquare className="mr-2 h-4 w-4" />Gantt</TabsTrigger>
                                <TabsTrigger value="calendar"><CalendarDays className="mr-2 h-4 w-4" />Calendar</TabsTrigger>
                                <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            {/* Date Range Picker - Assuming component exists */} 
                            {/* <DatePickerWithRange date={dateRange} onDateChange={handleDateRangeChange} /> */} 
                            <Button variant="outline" size="sm">Filters</Button>
                            <Button variant="outline" size="sm">Baselines</Button>
                            <Button variant="outline" size="sm">Critical Path</Button>
                            <Button variant="outline" size="sm">Export</Button>
                            <Button variant="outline" size="sm">Settings</Button>
                        </div>
                    </div>

                    {/* Content Area */} 
                    <div className="min-h-[400px]">
                        {isLoadingDetails ? (
                            <div className="text-center p-8">Loading schedule details...</div>
                        ) : !scheduleDetails ? (
                            <div className="text-center p-8 text-muted-foreground">Select a schedule to view details.</div>
                        ) : (
                            <Tabs value={currentView} className="w-full">
                                <TabsContent value="gantt">
                                    <GanttChartView scheduleId={selectedScheduleId} dateRange={dateRange} />
                                </TabsContent>
                                <TabsContent value="calendar">
                                    <CalendarView scheduleId={selectedScheduleId} dateRange={dateRange} />
                                </TabsContent>
                                <TabsContent value="list">
                                    <ScheduleListView scheduleId={selectedScheduleId} dateRange={dateRange} />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;

