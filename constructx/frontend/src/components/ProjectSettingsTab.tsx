import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { PlusCircle, Trash2 } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getProjectSettings: async (projectId) => {
        console.log("Fetching settings for project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            notifications: {
                taskUpdates: true,
                documentChanges: true,
                budgetAlerts: true,
                scheduleMilestones: false,
            },
            customFields: [
                { id: "cf1", name: "Site Contact Name", type: "text", value: "John Doe" },
                { id: "cf2", name: "Permit Number", type: "text", value: "B-12345" },
                { id: "cf3", name: "Soil Condition", type: "select", options: ["Clay", "Sand", "Rock"], value: "Clay" },
            ],
            integrations: {
                accountingSoftware: "quickbooks",
                storageProvider: "google_drive",
            },
            accessControl: {
                defaultRole: "Viewer",
                allowPublicSharing: false,
            },
            archiveStatus: false,
        };
    },
    updateProjectSettings: async (projectId, settings) => {
        console.log("Updating settings for project:", projectId, settings);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true, updatedSettings: settings };
    },
    archiveProject: async (projectId) => {
        console.log("Archiving project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    unarchiveProject: async (projectId) => {
        console.log("Unarchiving project:", projectId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
};

const ProjectSettingsTab = ({ projectId }) => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!projectId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await mockApi.getProjectSettings(projectId);
                // Ensure customFields is always an array
                if (!data.customFields) {
                    data.customFields = [];
                }
                setSettings(data);
            } catch (err) {
                console.error("Error fetching project settings:", err);
                setError("Failed to load project settings.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [projectId]);

    const handleNotificationChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value },
        }));
    };

    const handleCustomFieldChange = (index, field, value) => {
        setSettings(prev => {
            const newCustomFields = [...prev.customFields];
            newCustomFields[index] = { ...newCustomFields[index], [field]: value };
            return { ...prev, customFields: newCustomFields };
        });
    };

    const addCustomField = () => {
        setSettings(prev => ({
            ...prev,
            customFields: [...prev.customFields, { id: `new_${Date.now()}`, name: "", type: "text", value: "" }]
        }));
    };

    const removeCustomField = (index) => {
        setSettings(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const dataToSave = { ...settings };
            // Filter out temporary IDs if needed
            dataToSave.customFields = dataToSave.customFields.map(cf => ({ ...cf, id: cf.id.startsWith("new_") ? undefined : cf.id }));
            await mockApi.updateProjectSettings(projectId, dataToSave);
            alert("Settings saved successfully!");
        } catch (err) {
            console.error("Error saving settings:", err);
            alert("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleArchiveToggle = async () => {
        const action = settings.archiveStatus ? "unarchive" : "archive";
        if (window.confirm(`Are you sure you want to ${action} this project?`)) {
            setIsSaving(true);
            try {
                if (settings.archiveStatus) {
                    await mockApi.unarchiveProject(projectId);
                    setSettings(prev => ({ ...prev, archiveStatus: false }));
                    alert("Project unarchived.");
                } else {
                    await mockApi.archiveProject(projectId);
                    setSettings(prev => ({ ...prev, archiveStatus: true }));
                    alert("Project archived.");
                }
            } catch (err) {
                console.error(`Error ${action}ing project:`, err);
                alert(`Failed to ${action} project.`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading settings...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!settings) {
        return <div className="p-4 text-center">Could not load settings.</div>;
    }

    return (
        <div className="space-y-6">
            <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
                {/* Notification Settings */}
                <AccordionItem value="item-1">
                    <AccordionTrigger>Notification Settings</AccordionTrigger>
                    <AccordionContent className="space-y-4 p-1">
                        {Object.entries(settings.notifications || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 border rounded">
                                <Label htmlFor={`notif-${key}`} className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                                <Switch
                                    id={`notif-${key}`}
                                    checked={value}
                                    onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                                />
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Custom Fields */}
                <AccordionItem value="item-2">
                    <AccordionTrigger>Custom Fields</AccordionTrigger>
                    <AccordionContent className="space-y-3 p-1">
                        {settings.customFields.map((field, index) => (
                            <div key={field.id || index} className="flex items-end gap-2 border p-2 rounded">
                                <div className="flex-grow grid grid-cols-3 gap-2">
                                    <Input value={field.name} onChange={(e) => handleCustomFieldChange(index, "name", e.target.value)} placeholder="Field Name" />
                                    {/* Add Type Selector (Text, Number, Date, Select) */}
                                    <Input value={field.type} readOnly placeholder="Type (e.g., text)" className="text-muted-foreground"/> 
                                    <Input value={field.value} onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)} placeholder="Value" />
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomField(index)} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Field
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Integration Settings */}
                <AccordionItem value="item-3">
                    <AccordionTrigger>Integrations</AccordionTrigger>
                    <AccordionContent className="p-4 border rounded text-center text-muted-foreground">
                        Integration settings placeholder.
                    </AccordionContent>
                </AccordionItem>

                {/* Access Control */}
                <AccordionItem value="item-4">
                    <AccordionTrigger>Access Control</AccordionTrigger>
                     <AccordionContent className="p-4 border rounded text-center text-muted-foreground">
                        Access control settings placeholder.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </div>

            {/* Archive Project Section */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Archive Project</CardTitle>
                    <CardDescription>
                        {settings.archiveStatus
                            ? "This project is currently archived. Unarchiving will make it active again."
                            : "Archiving this project will remove it from active lists but retain its data. This action can be reversed."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant={settings.archiveStatus ? "outline" : "destructive"}
                        onClick={handleArchiveToggle}
                        disabled={isSaving}
                    >
                        {settings.archiveStatus ? "Unarchive Project" : "Archive Project"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectSettingsTab;

