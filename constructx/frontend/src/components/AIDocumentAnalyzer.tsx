import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface AIDocumentAnalyzerProps {
  moduleContext: string;
  projectId: string;
  documentId?: string;
  documentUrl?: string;
  documentType?: 'contract' | 'drawing' | 'specification' | 'report' | 'invoice' | 'other';
  onAnalysisComplete?: (results: any) => void;
}

export const AIDocumentAnalyzer: React.FC<AIDocumentAnalyzerProps> = ({
  moduleContext,
  projectId,
  documentId,
  documentUrl,
  documentType = 'other',
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customAnalysisLoading, setCustomAnalysisLoading] = useState(false);
  const [customAnalysisResult, setCustomAnalysisResult] = useState('');
  
  // Simulate document analysis
  const analyzeDocument = () => {
    if (!documentUrl) return;
    
    setIsAnalyzing(true);
    
    // This would be replaced with actual AI API calls in production
    setTimeout(() => {
      // Generate mock analysis results based on document type
      const results = generateMockResults(documentType);
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    }, 3000);
  };
  
  // Generate mock analysis results based on document type
  const generateMockResults = (type: string) => {
    switch (type) {
      case 'contract':
        return {
          summary: "This is a standard construction contract for residential building services. The contract outlines the scope of work, payment terms, timeline, and legal obligations of both parties.",
          keyPoints: [
            { category: "Payment", text: "Payment schedule is structured in 4 installments of 25% each", importance: "high" },
            { category: "Timeline", text: "Project duration is set at 120 days from commencement", importance: "high" },
            { category: "Penalties", text: "Late completion penalty of $500 per day after grace period", importance: "medium" },
            { category: "Change Orders", text: "All change orders must be approved in writing", importance: "medium" },
            { category: "Warranty", text: "1-year warranty on all workmanship", importance: "medium" }
          ],
          risks: [
            { description: "No force majeure clause for weather delays", severity: "high" },
            { description: "Ambiguous language regarding material substitutions", severity: "medium" },
            { description: "No clear dispute resolution process", severity: "medium" }
          ],
          entities: [
            { name: "ABC Construction Co.", role: "Contractor", contact: "john.doe@abcconstruction.com" },
            { name: "Homeowner LLC", role: "Client", contact: "client@example.com" }
          ],
          dates: [
            { description: "Contract Signing", date: "2025-01-15" },
            { description: "Project Start", date: "2025-02-01" },
            { description: "Projected Completion", date: "2025-06-01" },
            { description: "Final Inspection", date: "2025-06-15" }
          ]
        };
      
      case 'drawing':
        return {
          summary: "This drawing shows the floor plan for the first floor of a residential building. It includes room layouts, dimensions, and key structural elements.",
          keyPoints: [
            { category: "Dimensions", text: "Total floor area is approximately 2,400 sq ft", importance: "high" },
            { category: "Rooms", text: "4 bedrooms, 3 bathrooms, kitchen, living room, dining room", importance: "medium" },
            { category: "Structure", text: "Load-bearing walls identified on north and east sides", importance: "high" },
            { category: "Utilities", text: "Electrical panel location in utility room", importance: "medium" }
          ],
          measurements: [
            { description: "Master Bedroom", dimensions: "16' x 14'", area: "224 sq ft" },
            { description: "Kitchen", dimensions: "18' x 12'", area: "216 sq ft" },
            { description: "Living Room", dimensions: "22' x 16'", area: "352 sq ft" },
            { description: "Bathroom 1", dimensions: "8' x 10'", area: "80 sq ft" }
          ],
          annotations: [
            { location: "North Wall", note: "Potential conflict with plumbing layout" },
            { location: "Kitchen", note: "Island dimensions may need adjustment for code compliance" },
            { location: "Bedroom 2", note: "Window placement differs from specifications" }
          ]
        };
      
      case 'specification':
        return {
          summary: "This document contains detailed specifications for the HVAC system installation, including equipment requirements, installation procedures, and quality standards.",
          keyPoints: [
            { category: "Equipment", text: "Carrier 5-ton split system with 16 SEER rating required", importance: "high" },
            { category: "Ductwork", text: "Insulated flex duct with R-8 value for all runs", importance: "medium" },
            { category: "Testing", text: "System must be balanced and tested to within 10% of design", importance: "high" },
            { category: "Warranty", text: "10-year manufacturer warranty on parts, 2-year labor warranty", importance: "medium" }
          ],
          materials: [
            { item: "Condenser Unit", specification: "Carrier 24ANB660A003", quantity: "1" },
            { item: "Air Handler", specification: "Carrier FV4CNF005", quantity: "1" },
            { item: "Thermostat", specification: "Ecobee SmartThermostat", quantity: "2" },
            { item: "Refrigerant Line", specification: "3/8\" and 7/8\" copper", quantity: "75 ft" }
          ],
          standards: [
            { code: "ASHRAE 62.2", description: "Ventilation requirements for indoor air quality" },
            { code: "IECC 2021", description: "Energy efficiency requirements" },
            { code: "UL 1995", description: "Safety standard for heating and cooling equipment" }
          ]
        };
      
      case 'report':
        return {
          summary: "This is a monthly progress report for April 2025, detailing the current status of the project, completed work, challenges, and next steps.",
          keyPoints: [
            { category: "Progress", text: "Project is currently 68% complete, 3% behind schedule", importance: "high" },
            { category: "Budget", text: "Current expenditure is $342,500, which is 4% under budget", importance: "high" },
            { category: "Issues", text: "Material delivery delays impacting framing completion", importance: "medium" },
            { category: "Safety", text: "Zero incidents reported this month", importance: "medium" }
          ],
          completedTasks: [
            { task: "Foundation work", completion: "100%", notes: "Passed inspection on April 10" },
            { task: "Framing", completion: "75%", notes: "Delayed due to lumber delivery issues" },
            { task: "Electrical rough-in", completion: "40%", notes: "Started ahead of schedule" },
            { task: "Plumbing rough-in", completion: "35%", notes: "On schedule" }
          ],
          issues: [
            { description: "Lumber delivery delay", impact: "3-day schedule slip", resolution: "Alternate supplier secured" },
            { description: "Unexpected rock formation", impact: "Additional excavation costs", resolution: "Change order approved" },
            { description: "Inspector availability", impact: "Potential delay for rough-in approval", resolution: "Pending" }
          ],
          nextSteps: [
            { action: "Complete framing", target: "May 10, 2025" },
            { action: "Begin roofing", target: "May 15, 2025" },
            { action: "Complete rough-in inspections", target: "May 25, 2025" }
          ]
        };
      
      case 'invoice':
        return {
          summary: "This is an invoice from ABC Suppliers for materials delivered on April 15, 2025. The total amount due is $28,450.75 with payment terms of Net 30.",
          keyPoints: [
            { category: "Amount", text: "Total due: $28,450.75", importance: "high" },
            { category: "Due Date", text: "Payment due by May 15, 2025", importance: "high" },
            { category: "Terms", text: "Net 30, 2% discount if paid within 10 days", importance: "medium" },
            { category: "PO Reference", text: "Purchase Order #PO-2025-0412", importance: "medium" }
          ],
          lineItems: [
            { item: "Lumber - 2x4x8 Studs", quantity: "500", unitPrice: "$8.75", total: "$4,375.00" },
            { item: "Plywood - 4x8x1/2\"", quantity: "200", unitPrice: "$32.50", total: "$6,500.00" },
            { item: "Concrete Mix - 80lb bags", quantity: "150", unitPrice: "$7.25", total: "$1,087.50" },
            { item: "Roofing Shingles - Bundles", quantity: "180", unitPrice: "$65.00", total: "$11,700.00" },
            { item: "Misc. Hardware", quantity: "1", unitPrice: "$4,788.25", total: "$4,788.25" }
          ],
          verification: [
            { check: "Purchase order match", status: "Verified", notes: "All items match PO-2025-0412" },
            { check: "Pricing accuracy", status: "Verified", notes: "Prices match contracted rates" },
            { check: "Delivery confirmation", status: "Verified", notes: "Signed by site manager J. Smith" },
            { check: "Budget allocation", status: "Warning", notes: "Exceeds monthly material budget by 5%" }
          ]
        };
      
      default:
        return {
          summary: "This document appears to be related to the construction project, but more specific analysis would require additional context.",
          keyPoints: [
            { category: "General", text: "Document contains project-related information", importance: "medium" },
            { category: "Context", text: "Additional context needed for detailed analysis", importance: "medium" }
          ],
          recommendation: "Please specify the document type for more detailed analysis or use the custom analysis feature to ask specific questions about this document."
        };
    }
  };
  
  // Handle custom analysis
  const handleCustomAnalysis = () => {
    if (!customPrompt.trim()) return;
    
    setCustomAnalysisLoading(true);
    
    // This would be replaced with actual AI API calls in production
    setTimeout(() => {
      // Generate mock custom analysis based on prompt
      let response = `Based on my analysis of this ${documentType} document, `;
      
      if (customPrompt.toLowerCase().includes('risk')) {
        response += "I've identified several key risks:\n\n1. There are potential timeline conflicts with the proposed schedule, particularly in the foundation and framing phases.\n\n2. The material specifications may not fully comply with updated building codes from 2024.\n\n3. The payment terms create cash flow risks during the middle phase of the project.\n\nI recommend reviewing these areas carefully and potentially updating the document to address these concerns.";
      } else if (customPrompt.toLowerCase().includes('cost') || customPrompt.toLowerCase().includes('budget')) {
        response += "the cost implications are significant:\n\n1. The total projected costs are within 5% of the budgeted amount, which is within acceptable variance.\n\n2. There are three line items that exceed individual budget allocations by more than 10%: concrete work, electrical fixtures, and finish carpentry.\n\n3. The contingency fund allocation of 7% appears insufficient based on project complexity; industry standard for this type of project is typically 10-15%.\n\nConsider revising the budget allocations or securing additional contingency funding.";
      } else if (customPrompt.toLowerCase().includes('schedule') || customPrompt.toLowerCase().includes('timeline')) {
        response += "the schedule appears to have several critical considerations:\n\n1. The overall timeline of 8 months is aggressive for this scope of work, with limited buffer for delays.\n\n2. There are two potential bottlenecks: the approval process for electrical work and the lead time for custom cabinetry.\n\n3. Weather contingency days appear insufficient given the project's location and season.\n\nI recommend adding 15-20 additional buffer days and developing a specific mitigation plan for the identified bottlenecks.";
      } else {
        response += "here's what I found regarding your question about " + customPrompt + ":\n\nThe document contains relevant information that addresses your query, though some details may require further clarification. The key points related to your question include specifications on pages 3-4, references to industry standards on page 7, and the implementation requirements outlined in the appendix.\n\nFor a more comprehensive answer, consider providing additional context or specifying particular aspects you're most interested in.";
      }
      
      setCustomAnalysisResult(response);
      setCustomAnalysisLoading(false);
    }, 2000);
  };
  
  // Trigger analysis when document URL changes
  useEffect(() => {
    if (documentUrl) {
      analyzeDocument();
    }
  }, [documentUrl]);
  
  // If no document URL is provided, show upload prompt
  if (!documentUrl) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 18v-6"></path>
                <path d="M9 15h6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium">No Document Selected</h3>
            <p className="text-sm text-muted-foreground">
              Upload or select a document to analyze with AI
            </p>
            <Button>
              Select Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <h3 className="text-lg font-medium">Analyzing Document</h3>
            <p className="text-sm text-muted-foreground">
              Our AI is analyzing your {documentType} document. This may take a moment...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render analysis results
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <span className="font-medium">AI Document Analysis</span>
          </div>
          <Badge variant="outline">
            {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Document Summary</h3>
                <p className="text-sm">{analysisResults?.summary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Points</h3>
                <div className="space-y-2">
                  {analysisResults?.keyPoints.map((point: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <Badge 
                        className={`mr-2 ${
                          point.importance === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                            : point.importance === 'medium'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {point.category}
                      </Badge>
                      <span className="text-sm">{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('details')}>
                  View Details
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              {/* Contract-specific details */}
              {documentType === 'contract' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Identified Risks</h3>
                    <div className="space-y-2">
                      {analysisResults?.risks.map((risk: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <Badge 
                            className={`mr-2 ${
                              risk.severity === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                : risk.severity === 'medium'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {risk.severity}
                          </Badge>
                          <span className="text-sm">{risk.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Entities</h3>
                    <div className="space-y-2">
                      {analysisResults?.entities.map((entity: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="font-medium">{entity.name}</div>
                          <div className="text-sm text-muted-foreground">Role: {entity.role}</div>
                          <div className="text-sm text-muted-foreground">Contact: {entity.contact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Dates</h3>
                    <div className="space-y-2">
                      {analysisResults?.dates.map((date: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <span className="text-sm">{date.description}</span>
                          <span className="text-sm font-medium">{date.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Drawing-specific details */}
              {documentType === 'drawing' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Measurements</h3>
                    <div className="space-y-2">
                      {analysisResults?.measurements.map((measurement: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <span className="text-sm">{measurement.description}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{measurement.dimensions}</div>
                            <div className="text-xs text-muted-foreground">{measurement.area}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Annotations</h3>
                    <div className="space-y-2">
                      {analysisResults?.annotations.map((annotation: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="font-medium">{annotation.location}</div>
                          <div className="text-sm text-muted-foreground">{annotation.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Specification-specific details */}
              {documentType === 'specification' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Materials</h3>
                    <div className="space-y-2">
                      {analysisResults?.materials.map((material: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div>
                            <div className="font-medium">{material.item}</div>
                            <div className="text-sm text-muted-foreground">{material.specification}</div>
                          </div>
                          <div className="text-sm font-medium">Qty: {material.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Standards & Codes</h3>
                    <div className="space-y-2">
                      {analysisResults?.standards.map((standard: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="font-medium">{standard.code}</div>
                          <div className="text-sm text-muted-foreground">{standard.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Report-specific details */}
              {documentType === 'report' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
                    <div className="space-y-2">
                      {analysisResults?.completedTasks.map((task: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{task.task}</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {task.completion}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{task.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Issues</h3>
                    <div className="space-y-2">
                      {analysisResults?.issues.map((issue: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="font-medium">{issue.description}</div>
                          <div className="text-sm text-muted-foreground">Impact: {issue.impact}</div>
                          <div className="text-sm text-muted-foreground">Resolution: {issue.resolution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                    <div className="space-y-2">
                      {analysisResults?.nextSteps.map((step: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <span className="text-sm">{step.action}</span>
                          <span className="text-sm font-medium">{step.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Invoice-specific details */}
              {documentType === 'invoice' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Line Items</h3>
                    <div className="space-y-2">
                      {analysisResults?.lineItems.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div>
                            <div className="font-medium">{item.item}</div>
                            <div className="text-sm text-muted-foreground">Qty: {item.quantity} × {item.unitPrice}</div>
                          </div>
                          <div className="text-sm font-medium">{item.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Verification</h3>
                    <div className="space-y-2">
                      {analysisResults?.verification.map((check: any, index: number) => (
                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{check.check}</span>
                            <Badge 
                              className={`${
                                check.status === 'Verified' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                              }`}
                            >
                              {check.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{check.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Generic details for other document types */}
              {(documentType !== 'contract' && 
                documentType !== 'drawing' && 
                documentType !== 'specification' && 
                documentType !== 'report' && 
                documentType !== 'invoice') && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                  <p className="text-sm mb-4">{analysisResults?.recommendation}</p>
                  <Button onClick={() => setActiveTab('custom')}>
                    Try Custom Analysis
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Custom Document Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask specific questions about this document to get targeted insights.
                </p>
                
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="E.g., What are the main risks in this document?"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCustomAnalysis} 
                    disabled={customAnalysisLoading || !customPrompt.trim()}
                  >
                    {customAnalysisLoading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                    ) : null}
                    Analyze
                  </Button>
                </div>
                
                {customAnalysisResult && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="whitespace-pre-line text-sm">
                        {customAnalysisResult}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Suggested Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-2"
                    onClick={() => {
                      setCustomPrompt("What are the main risks in this document?");
                      handleCustomAnalysis();
                    }}
                  >
                    What are the main risks in this document?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-2"
                    onClick={() => {
                      setCustomPrompt("How does this impact our budget?");
                      handleCustomAnalysis();
                    }}
                  >
                    How does this impact our budget?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-2"
                    onClick={() => {
                      setCustomPrompt("Are there any schedule implications?");
                      handleCustomAnalysis();
                    }}
                  >
                    Are there any schedule implications?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-2"
                    onClick={() => {
                      setCustomPrompt("Summarize the key action items from this document.");
                      handleCustomAnalysis();
                    }}
                  >
                    Summarize the key action items.
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIDocumentAnalyzer;
