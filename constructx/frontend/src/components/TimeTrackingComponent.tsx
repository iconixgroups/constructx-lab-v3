import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, Clock, Play, Square, PlusCircle, Edit, Trash2, Timer } from "lucide-react";
import { format, formatDistanceStrict, parseISO, differenceInSeconds } from "date-fns";
import { cn } from "../lib/utils";

// Mock API (replace with actual API calls)
const mockApi = {
    getTimeEntries: async (taskId) => {
        console.log("Fetching time entries for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return mock time entries
        return [
            { id: "te1", taskId: taskId, userId: "user1", userName: "Alice Smith", startTime: "2024-02-10T09:00:00Z", endTime: "2024-02-10T11:30:00Z", durationSeconds: 9000, notes: "Worked on initial draft" },
            { id: "te2", taskId: taskId, userId: "user3", userName: "Charlie Brown", startTime: "2024-02-11T13:00:00Z", endTime: "2024-02-11T17:00:00Z", durationSeconds: 14400, notes: "Research and planning" },
            { id: "te3", taskId: taskId, userId: "user1", userName: "Alice Smith", startTime: "2024-02-12T10:00:00Z", endTime: null, durationSeconds: null, notes: "Reviewing feedback" }, // Active timer
        ].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    },
    addTimeEntry: async (taskId, entryData) => {
        console.log("Adding time entry:", taskId, entryData);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Assume currentUser is available
        const currentUser = { id: "user1", name: "Alice Smith" };
        return {
            ...entryData,
            id: `te${Math.random().toString(36).substring(7)}`,
            taskId: taskId,
            userId: currentUser.id,
            userName: currentUser.name,
        };
    },
    updateTimeEntry: async (entryId, entryData) => {
        console.log("Updating time entry:", entryId, entryData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...entryData, id: entryId };
    },
    deleteTimeEntry: async (entryId) => {
        console.log("Deleting time entry:", entryId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    startTimer: async (taskId, notes = "") => {
        console.log("Starting timer for task:", taskId);
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentUser = { id: "user1", name: "Alice Smith" };
        return {
            id: `te${Math.random().toString(36).substring(7)}`,
            taskId: taskId,
            userId: currentUser.id,
            userName: currentUser.name,
            startTime: new Date().toISOString(),
            endTime: null,
            durationSeconds: null,
            notes: notes,
        };
    },
    stopTimer: async (entryId) => {
        console.log("Stopping timer:", entryId);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Find the entry, calculate duration, set end time
        // This is simplified, real API would handle this
        return { 
            id: entryId, 
            endTime: new Date().toISOString(), 
            // durationSeconds should be calculated based on actual start time
            durationSeconds: 3600 // Mock duration
        };
    },
};

// Helper to format duration
const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return "-";
    return formatDistanceStrict(0, seconds * 1000, { unit: "hour", roundingMethod: "ceil" });
    // Or more detailed: 
    // const hours = Math.floor(seconds / 3600);
    // const minutes = Math.floor((seconds % 3600) / 60);
    // return `${hours}h ${minutes}m`;
};

const TimeEntryForm = ({ entry, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: entry?.startTime ? parseISO(entry.startTime) : new Date(),
        startTime: entry?.startTime ? format(parseISO(entry.startTime), "HH:mm") : "",
        endTime: entry?.endTime ? format(parseISO(entry.endTime), "HH:mm") : "",
        durationHours: entry?.durationSeconds ? (entry.durationSeconds / 3600).toFixed(2) : "",
        notes: entry?.notes || "",
    });
    const [isManualDuration, setIsManualDuration] = useState(!!entry?.durationSeconds && !entry?.startTime);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-calculate duration if start/end times are present
        if (name === "startTime" || name === "endTime") {
            const start = name === "startTime" ? value : formData.startTime;
            const end = name === "endTime" ? value : formData.endTime;
            if (start && end && formData.date) {
                const startDate = new Date(`${format(formData.date, "yyyy-MM-dd")}T${start}:00`);
                const endDate = new Date(`${format(formData.date, "yyyy-MM-dd")}T${end}:00`);
                if (endDate > startDate) {
                    const durationSec = differenceInSeconds(endDate, startDate);
                    setFormData(prev => ({ ...prev, durationHours: (durationSec / 3600).toFixed(2) }));
                    setIsManualDuration(false);
                }
            }
        }
        if (name === "durationHours") {
            setIsManualDuration(true);
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date: date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let dataToSave = { notes: formData.notes };
        if (isManualDuration && formData.durationHours) {
            dataToSave.durationSeconds = parseFloat(formData.durationHours) * 3600;
            dataToSave.startTime = format(formData.date, "yyyy-MM-dd") + "T00:00:00Z"; // Use date for reference
            dataToSave.endTime = null; // Indicate manual duration entry
        } else if (formData.startTime && formData.endTime && formData.date) {
            const startDate = new Date(`${format(formData.date, "yyyy-MM-dd")}T${formData.startTime}:00`);
            const endDate = new Date(`${format(formData.date, "yyyy-MM-dd")}T${formData.endTime}:00`);
            if (endDate <= startDate) {
                alert("End time must be after start time.");
                return;
            }
            dataToSave.startTime = startDate.toISOString();
            dataToSave.endTime = endDate.toISOString();
            dataToSave.durationSeconds = differenceInSeconds(endDate, startDate);
        } else {
            alert("Please provide either start/end times or a duration.");
            return;
        }
        onSave(entry?.id, dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/40 mb-4">
            <h3 className="text-lg font-semibold">{entry ? "Edit" : "Add"} Time Entry</h3>
            <div>
                <label htmlFor="timeEntryDate" className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus /></PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="timeEntryStart" className="text-sm font-medium">Start Time</label>
                    <Input id="timeEntryStart" name="startTime" type="time" value={formData.startTime} onChange={handleChange} disabled={isManualDuration} />
                </div>
                <div>
                    <label htmlFor="timeEntryEnd" className="text-sm font-medium">End Time</label>
                    <Input id="timeEntryEnd" name="endTime" type="time" value={formData.endTime} onChange={handleChange} disabled={isManualDuration} />
                </div>
                <div>
                    <label htmlFor="timeEntryDuration" className="text-sm font-medium">Duration (hours)</label>
                    <Input id="timeEntryDuration" name="durationHours" type="number" step="0.01" min="0" value={formData.durationHours} onChange={handleChange} placeholder="e.g., 2.5" />
                </div>
            </div>
            <div>
                <label htmlFor="timeEntryNotes" className="text-sm font-medium">Notes</label>
                <Textarea id="timeEntryNotes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Describe the work done" rows={2} />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Entry</Button>
            </div>
        </form>
    );
};

const TimeTrackingComponent = ({ taskId, initialTimeEntries }) => {
    const [timeEntries, setTimeEntries] = useState(initialTimeEntries || []);
    const [isLoading, setIsLoading] = useState(!initialTimeEntries);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [activeTimer, setActiveTimer] = useState(null); // Stores the active time entry object
    const [timerDuration, setTimerDuration] = useState(0); // Live duration for active timer
    const timerIntervalRef = useRef(null);

    const fetchTimeEntries = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await mockApi.getTimeEntries(taskId);
            setTimeEntries(data);
            const runningTimer = data.find(entry => !entry.endTime);
            setActiveTimer(runningTimer || null);
        } catch (err) {
            console.error("Error fetching time entries:", err);
            setError("Failed to load time entries.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        if (!initialTimeEntries) {
            fetchTimeEntries();
        }
    }, [taskId, initialTimeEntries, fetchTimeEntries]);

    // Effect to manage the live timer display
    useEffect(() => {
        if (activeTimer) {
            const updateDuration = () => {
                const now = new Date();
                const start = parseISO(activeTimer.startTime);
                setTimerDuration(differenceInSeconds(now, start));
            };
            updateDuration(); // Initial update
            timerIntervalRef.current = setInterval(updateDuration, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
            setTimerDuration(0);
        }
        return () => clearInterval(timerIntervalRef.current);
    }, [activeTimer]);

    const handleSaveEntry = async (entryId, entryData) => {
        try {
            if (entryId) {
                await mockApi.updateTimeEntry(entryId, entryData);
            } else {
                await mockApi.addTimeEntry(taskId, entryData);
            }
            fetchTimeEntries(); // Refresh list
            setShowAddForm(false);
            setEditingEntry(null);
        } catch (err) {
            console.error("Error saving time entry:", err);
            alert("Failed to save time entry.");
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (window.confirm("Are you sure you want to delete this time entry?")) {
            try {
                await mockApi.deleteTimeEntry(entryId);
                setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
            } catch (err) {
                console.error("Error deleting time entry:", err);
                alert("Failed to delete time entry.");
            }
        }
    };

    const handleStartTimer = async () => {
        if (activeTimer) {
            alert("Another timer is already running for this task.");
            return;
        }
        try {
            const startedEntry = await mockApi.startTimer(taskId);
            setActiveTimer(startedEntry);
            setTimeEntries(prev => [startedEntry, ...prev]); // Add to list immediately
        } catch (err) {
            console.error("Error starting timer:", err);
            alert("Failed to start timer.");
        }
    };

    const handleStopTimer = async () => {
        if (!activeTimer) return;
        try {
            const stoppedEntry = await mockApi.stopTimer(activeTimer.id);
            setActiveTimer(null);
            // Update the entry in the list
            setTimeEntries(prev => prev.map(entry => 
                entry.id === stoppedEntry.id ? { ...entry, ...stoppedEntry } : entry
            ));
        } catch (err) {
            console.error("Error stopping timer:", err);
            alert("Failed to stop timer.");
        }
    };

    const totalTrackedSeconds = timeEntries.reduce((sum, entry) => {
        if (entry.id === activeTimer?.id) {
            return sum + timerDuration; // Use live duration for active timer
        } else if (entry.durationSeconds) {
            return sum + entry.durationSeconds;
        }
        return sum;
    }, 0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Time Tracking</CardTitle>
                <div className="flex gap-2">
                    {activeTimer ? (
                        <Button size="sm" variant="destructive" onClick={handleStopTimer}>
                            <Square className="mr-2 h-4 w-4 fill-current" /> Stop Timer ({formatDuration(timerDuration)})
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={handleStartTimer}>
                            <Play className="mr-2 h-4 w-4 fill-current" /> Start Timer
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => { setEditingEntry(null); setShowAddForm(!showAddForm); }}>
                        {showAddForm ? "Cancel" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Manual Entry</>}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {showAddForm && (
                    <TimeEntryForm 
                        entry={editingEntry} 
                        onSave={handleSaveEntry} 
                        onCancel={() => { setShowAddForm(false); setEditingEntry(null); }} 
                    />
                )}

                {isLoading && <div className="text-center p-4">Loading time entries...</div>}
                {error && <div className="text-center p-4 text-red-500">{error}</div>}
                {!isLoading && !error && timeEntries.length === 0 && !showAddForm && (
                    <div className="text-center p-8 text-muted-foreground">No time tracked for this task yet.</div>
                )}

                {!isLoading && !error && timeEntries.length > 0 && (
                    <div className="mt-4 border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timeEntries.map((entry) => (
                                    <TableRow key={entry.id} className={entry.id === activeTimer?.id ? "bg-green-100/50 dark:bg-green-900/30" : ""}>
                                        <TableCell>{entry.userName || "Unknown"}</TableCell>
                                        <TableCell>{entry.startTime ? format(parseISO(entry.startTime), "PP") : "N/A"}</TableCell>
                                        <TableCell>{entry.startTime ? format(parseISO(entry.startTime), "p") : "-"}</TableCell>
                                        <TableCell>{entry.endTime ? format(parseISO(entry.endTime), "p") : (entry.id === activeTimer?.id ? "Running..." : "-")}</TableCell>
                                        <TableCell className="font-medium">
                                            {entry.id === activeTimer?.id ? formatDuration(timerDuration) : formatDuration(entry.durationSeconds)}
                                        </TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate" title={entry.notes}>{entry.notes}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {entry.id !== activeTimer?.id && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingEntry(entry); setShowAddForm(true); }} title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteEntry(entry.id)} title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-end">
                 <div className="text-sm font-medium">Total Time Tracked: {formatDuration(totalTrackedSeconds)}</div>
            </CardFooter>
        </Card>
    );
};

export default TimeTrackingComponent;

