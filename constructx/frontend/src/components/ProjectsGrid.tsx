import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation on click
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";

// Helper to format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "active": return "success";
        case "completed": return "default";
        case "planning": return "info"; // Assuming custom variant
        case "on hold": return "warning"; // Assuming custom variant
        case "cancelled": return "destructive";
        default: return "secondary";
    }
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/projects/${project.id}`); // Navigate to project details page
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
            <CardHeader className="p-4 pb-2 cursor-pointer" onClick={handleCardClick}>
                {/* Optional: Add thumbnail/image here */}
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold leading-tight mb-1 line-clamp-2" title={project.name}>{project.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 p-0 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}>
                                <ExternalLink className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground">{project.code} | {project.location}</p>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-sm flex-grow cursor-pointer" onClick={handleCardClick}>
                <div className="flex justify-between items-center mb-2">
                    <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                    <span className="text-xs text-muted-foreground">PM: {project.projectManager?.name || "N/A"}</span>
                </div>
                <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                </div>
                <div className="text-xs text-muted-foreground">
                    <span>Budget: {formatCurrency(project.budget)}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t mt-auto cursor-pointer" onClick={handleCardClick}>
                <span>Start: {project.startDate ? format(new Date(project.startDate), "PP") : "N/A"}</span>
                <span>Target: {project.targetCompletionDate ? format(new Date(project.targetCompletionDate), "PP") : "N/A"}</span>
            </CardFooter>
        </Card>
    );
};

const ProjectsGrid = ({ projects, onEditProject, onDeleteProject }) => {
    if (!projects || projects.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No projects found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={onEditProject}
                    onDelete={onDeleteProject}
                />
            ))}
        </div>
    );
};

export default ProjectsGrid;

