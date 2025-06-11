import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material"; // Assuming Material UI Stepper is available or installable
// Or use a Shadcn-compatible stepper component if available
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Mock API (replace with actual API calls)
const mockApi = {
    getLeadDetails: async (leadId) => {
        console.log("Fetching lead details for conversion:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return a simplified lead object needed for conversion
        return {
            id: leadId,
            name: "Beta Corp Expansion Lead",
            clientCompanyId: "client2",
            estimatedValue: 120000,
            description: "Office expansion project.",
            // ... other relevant lead fields
        };
    },
    getProjectTemplates: async () => [
        { id: "temp1", name: "Standard Commercial Build" },
        { id: "temp2", name: "Office Renovation Template" },
    ],
    getUsers: async () => [
        { id: "user1", name: "Alice Smith" },
        { id: "user2", name: "Bob Johnson" },
        { id: "user3", name: "Charlie Brown" },
    ],
    convertToProject: async (leadId, projectData) => {
        console.log("Converting lead to project:", leadId, projectData);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate successful conversion, return new project ID
        return { success: true, projectId: `proj_${Math.random().toString(36).substring(7)}` };
    },
};

const LeadConversionWizard = ({ leadId, onComplete, onCancel }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [leadData, setLeadData] = useState(null);
    const [projectData, setProjectData] = useState({
        name: "",
        projectManagerId: "",
        startDate: new Date().toISOString().split("T")[0], // Default to today
        templateId: "",
        description: "",
        initialTasks: [], // Example: [{ title: "Setup meeting", assignedTo: "user1" }]
        transferDocuments: true,
    });
    const [templates, setTemplates] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [fetchedLead, fetchedTemplates, fetchedUsers] = await Promise.all([
                    mockApi.getLeadDetails(leadId),
                    mockApi.getProjectTemplates(),
                    mockApi.getUsers(),
                ]);
                setLeadData(fetchedLead);
                setTemplates(fetchedTemplates);
                setUsers(fetchedUsers);
                // Pre-fill project data from lead
                setProjectData(prev => ({
                    ...prev,
                    name: fetchedLead.name.replace(" Lead", " Project") || "New Project",
                    description: fetchedLead.description || "",
                    // Potentially pre-select manager based on lead owner
                }));
            } catch (error) {
                console.error("Error loading conversion data:", error);
                // Handle error
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [leadId]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProjectData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSelectChange = (name, value) => {
        setProjectData(prev => ({ ...prev, [name]: value }));
    };

    const handleConvert = async () => {
        setIsConverting(true);
        try {
            const result = await mockApi.convertToProject(leadId, projectData);
            if (result.success) {
                alert(`Lead successfully converted to Project ID: ${result.projectId}`);
                onComplete(result.projectId); // Pass new project ID back
            } else {
                alert("Failed to convert lead.");
            }
        } catch (error) {
            console.error("Conversion error:", error);
            alert("An error occurred during conversion.");
        } finally {
            setIsConverting(false);
        }
    };

    const steps = [
        {
            label: "Project Details",
            content: (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Project Name*</Label>
                        <Input id="name" name="name" value={projectData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="projectManagerId">Project Manager*</Label>
                        <Select value={projectData.projectManagerId} onValueChange={(value) => handleSelectChange("projectManagerId", value)} required>
                            <SelectTrigger id="projectManagerId">
                                <SelectValue placeholder="Select project manager" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" value={projectData.startDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={projectData.description} onChange={handleChange} />
                    </div>
                </div>
            ),
        },
        {
            label: "Setup & Options",
            content: (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="templateId">Project Template (Optional)</Label>
                        <Select value={projectData.templateId} onValueChange={(value) => handleSelectChange("templateId", value)}>
                            <SelectTrigger id="templateId">
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">No Template</SelectItem>
                                {templates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Add options for initial tasks, document transfer etc. */}
                    {/* Example: <Checkbox name="transferDocuments" checked={projectData.transferDocuments} onCheckedChange={(checked) => setProjectData(prev => ({...prev, transferDocuments: checked}))}> Transfer Lead Documents</Checkbox> */}
                </div>
            ),
        },
        {
            label: "Confirmation",
            content: (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Conversion Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Lead:</strong> {leadData?.name}</p>
                        <p><strong>New Project Name:</strong> {projectData.name}</p>
                        <p><strong>Project Manager:</strong> {users.find(u => u.id === projectData.projectManagerId)?.name || "N/A"}</p>
                        <p><strong>Start Date:</strong> {projectData.startDate}</p>
                        <p><strong>Template:</strong> {templates.find(t => t.id === projectData.templateId)?.name || "None"}</p>
                        {/* Display other selected options */}
                    </CardContent>
                </Card>
            ),
        },
    ];

    if (isLoading) {
        return <div className="p-4 text-center">Loading conversion wizard...</div>;
    }

    return (
        <div className="p-4">
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                        <StepContent>
                            <div className="py-4">{step.content}</div>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                {activeStep < steps.length - 1 ? (
                                    <Button onClick={handleNext}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button onClick={handleConvert} disabled={isConverting}>
                                        {isConverting ? "Converting..." : "Convert to Project"}
                                    </Button>
                                )}
                                <Button variant="outline" onClick={onCancel} className="ml-auto">
                                    Cancel Conversion
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
};

export default LeadConversionWizard;

