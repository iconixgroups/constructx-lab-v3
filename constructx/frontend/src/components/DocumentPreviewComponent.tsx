import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Download, Printer, Maximize, FileWarning } from "lucide-react";

// Mock API or utility for preview generation
const mockPreviewApi = {
    generatePreviewUrl: async (document) => {
        console.log("Generating preview for:", document.name);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        // Based on file type, return a mock URL or indicate unsupported
        if (document.fileType === "application/pdf") {
            // In a real app, this might be a URL to a PDF viewer service or a blob URL
            return `/mock-viewer?url=${encodeURIComponent(document.filePath)}`; 
        } else if (document.fileType?.startsWith("image/")) {
            return document.filePath; // Assume direct image URL
        } else if (document.fileType?.startsWith("text/")) {
             return `/mock-text-viewer?url=${encodeURIComponent(document.filePath)}`;
        }
        // Add more supported types (Word, Excel via converters?)
        return null; // Unsupported
    }
};

const DocumentPreviewComponent = ({ document }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const loadPreview = async () => {
            if (!document) return;
            setIsLoading(true);
            setError(null);
            setPreviewUrl(null);
            try {
                const url = await mockPreviewApi.generatePreviewUrl(document);
                setPreviewUrl(url);
            } catch (err) {
                console.error("Error generating preview:", err);
                setError("Could not load preview.");
            } finally {
                setIsLoading(false);
            }
        };
        loadPreview();
    }, [document]);

    const handleFullScreen = () => {
        // Basic full screen toggle - more robust implementation needed for real use
        const elem = document.getElementById("preview-container");
        if (!document.fullscreenElement) {
            if (elem?.requestFullscreen) {
                elem.requestFullscreen().catch(err => console.error(err));
                setIsFullScreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    // Handle fullscreen change event (e.g., user pressing ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const renderPreviewContent = () => {
        if (isLoading) {
            return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading preview...</div>;
        }
        if (error) {
            return (
                <Alert variant="destructive" className="m-4">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Preview Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }
        if (!previewUrl) {
            return (
                <Alert className="m-4">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Preview Not Available</AlertTitle>
                    <AlertDescription>
                        Preview is not available for this file type ({document.fileType || "unknown"}). You can try downloading the file.
                    </AlertDescription>
                </Alert>
            );
        }

        // Render based on type (simplified)
        if (document.fileType === "application/pdf" || document.fileType?.startsWith("text/")) {
            // Use an iframe for PDF viewer or text viewer service/component
            // IMPORTANT: Ensure the source URL is trusted and properly sandboxed if necessary
            return (
                <iframe 
                    src={previewUrl} 
                    title={`Preview of ${document.name}`} 
                    className="w-full h-full border-0"
                    // sandbox="allow-scripts allow-same-origin" // Consider sandboxing
                ></iframe>
            );
        } else if (document.fileType?.startsWith("image/")) {
            return (
                <div className="flex items-center justify-center p-4 h-full bg-muted/20">
                    <img 
                        src={previewUrl} 
                        alt={`Preview of ${document.name}`} 
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        // Fallback for other types if previewUrl was somehow generated
        return <div className="p-4">Preview content for {document.name}</div>;
    };

    return (
        <div id="preview-container" className={`flex flex-col h-full border rounded-md overflow-hidden ${isFullScreen ? "bg-background fixed inset-0 z-50" : "relative"}`}>
            {/* Preview Header/Toolbar */} 
            {!isFullScreen && (
                <div className="flex items-center justify-between p-2 border-b bg-muted/50 flex-shrink-0">
                    <span className="text-sm font-medium truncate px-2">Preview</span>
                    <div className="flex items-center gap-1">
                        {/* Add viewer-specific controls here (zoom, page nav) if possible */} 
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Download" onClick={() => alert("Download placeholder")}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Print" onClick={() => alert("Print placeholder - might trigger browser print or use viewer API")}>
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Full Screen" onClick={handleFullScreen}>
                            <Maximize className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            
            {/* Preview Content Area */} 
            <div className="flex-1 overflow-auto bg-background">
                {renderPreviewContent()}
            </div>
        </div>
    );
};

export default DocumentPreviewComponent;

