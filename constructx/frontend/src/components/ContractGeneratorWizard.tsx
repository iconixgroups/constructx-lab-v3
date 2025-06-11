import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Stepper, Step, StepLabel, StepContent } from "./ui/stepper";
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  FileText, 
  Check, 
  Loader2,
  Download,
  Copy,
  Wand2,
  AlertCircle
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { DatePicker } from "./ui/date-picker";
import { format } from "date-fns";

interface ContractGeneratorWizardProps {
  contractId?: string; // Optional - if provided, we're editing an existing contract
  onComplete?: (contractId: string) => void; // Callback when wizard completes
}

const ContractGeneratorWizard: React.FC<ContractGeneratorWizardProps> = ({ 
  contractId,
  onComplete 
}) => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [contractData, setContractData] = useState({
    // Basic Info
    title: "",
    projectName: "",
    contractType: "Construction",
    startDate: null as Date | null,
    endDate: null as Date | null,
    value: "",
    description: "",
    
    // Parties
    clientName: "",
    clientAddress: "",
    clientContact: "",
    clientEmail: "",
    clientPhone: "",
    contractorName: "",
    contractorAddress: "",
    contractorContact: "",
    contractorEmail: "",
    contractorPhone: "",
    
    // Terms
    paymentTerms: "",
    paymentSchedule: "milestone",
    retainage: "5",
    changeOrderProcess: "",
    disputeResolution: "mediation",
    terminationClauses: "",
    
    // Scope
    scopeOfWork: "",
    deliverables: "",
    exclusions: "",
    assumptions: "",
    
    // Additional
    insuranceRequirements: "",
    bondRequirements: "",
    warrantyPeriod: "12",
    indemnification: "",
    
    // Template
    templateId: "",
    useTemplate: false,
    
    // Preview
    previewMode: "standard" // standard, legal, simplified
  });
  
  // Contract type options
  const contractTypeOptions = [
    { value: "Construction", label: "Construction Contract" },
    { value: "Design-Build", label: "Design-Build Contract" },
    { value: "Renovation", label: "Renovation Contract" },
    { value: "Maintenance", label: "Maintenance Contract" },
    { value: "Consulting", label: "Consulting Contract" },
    { value: "Subcontractor", label: "Subcontractor Agreement" }
  ];
  
  // Payment schedule options
  const paymentScheduleOptions = [
    { value: "milestone", label: "Milestone-Based" },
    { value: "monthly", label: "Monthly" },
    { value: "progress", label: "Progress-Based" },
    { value: "upfront", label: "Upfront Payment" },
    { value: "completion", label: "Upon Completion" },
    { value: "custom", label: "Custom Schedule" }
  ];
  
  // Dispute resolution options
  const disputeResolutionOptions = [
    { value: "mediation", label: "Mediation" },
    { value: "arbitration", label: "Arbitration" },
    { value: "litigation", label: "Litigation" },
    { value: "escalation", label: "Escalation Procedure" }
  ];
  
  // Mock templates
  const templateOptions = [
    { value: "standard-construction", label: "Standard Construction Contract" },
    { value: "aia-a101", label: "AIA A101 - Standard Form of Agreement" },
    { value: "design-build", label: "Design-Build Agreement" },
    { value: "time-materials", label: "Time and Materials Contract" },
    { value: "fixed-price", label: "Fixed Price Contract" },
    { value: "cost-plus", label: "Cost-Plus Contract" }
  ];
  
  // Steps for the wizard
  const steps = [
    {
      label: "Basic Information",
      description: "Enter basic contract details"
    },
    {
      label: "Parties",
      description: "Define contract parties"
    },
    {
      label: "Terms & Conditions",
      description: "Set payment and legal terms"
    },
    {
      label: "Scope of Work",
      description: "Define project scope"
    },
    {
      label: "Additional Provisions",
      description: "Add insurance and other requirements"
    },
    {
      label: "Review & Generate",
      description: "Preview and generate contract"
    }
  ];
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContractData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setContractData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setContractData(prev => ({
      ...prev,
      [name]: date
    }));
  };
  
  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setContractData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle next step
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }
    
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  
  // Validate current step
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: // Basic Information
        if (!contractData.title.trim()) {
          toast({
            title: "Validation Error",
            description: "Contract title is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!contractData.projectName.trim()) {
          toast({
            title: "Validation Error",
            description: "Project name is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!contractData.startDate) {
          toast({
            title: "Validation Error",
            description: "Start date is required.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 1: // Parties
        if (!contractData.clientName.trim()) {
          toast({
            title: "Validation Error",
            description: "Client name is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!contractData.contractorName.trim()) {
          toast({
            title: "Validation Error",
            description: "Contractor name is required.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: // Terms & Conditions
        if (!contractData.paymentTerms.trim()) {
          toast({
            title: "Validation Error",
            description: "Payment terms are required.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3: // Scope of Work
        if (!contractData.scopeOfWork.trim()) {
          toast({
            title: "Validation Error",
            description: "Scope of work is required.",
            variant: "destructive"
          });
          return false;
        }
        break;
      default:
        break;
    }
    
    return true;
  };
  
  // Handle AI generation
  const handleAIGenerate = (section: string) => {
    setIsLoading(true);
    
    // This will be replaced with actual API call
    // contractService.generateContractSection(section, contractData)
    //   .then(response => {
    //     setContractData(prev => ({
    //       ...prev,
    //       [section]: response.data.content
    //     }));
    //     toast({
    //       title: "AI Generation Complete",
    //       description: `${section} has been generated successfully.`
    //     });
    //   })
    //   .catch(err => {
    //     console.error(`Error generating ${section}:`, err);
    //     toast({
    //       title: "Generation Error",
    //       description: `Failed to generate ${section}. Please try again or enter manually.`,
    //       variant: "destructive"
    //     });
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    
    // Mock AI generation for development
    setTimeout(() => {
      let generatedContent = "";
      
      switch (section) {
        case "scopeOfWork":
          generatedContent = `The Contractor shall perform all work required by the Contract Documents for the ${contractData.projectName} project. Work includes all labor, materials, equipment, and services necessary to complete the project as defined in the drawings and specifications.\n\nThe Contractor shall provide and pay for all materials, equipment, labor, transportation, construction equipment and machinery, tools, permits, utilities, and other facilities and services necessary for the proper execution and completion of the Work.`;
          break;
        case "paymentTerms":
          generatedContent = `Payment shall be made according to the ${contractData.paymentSchedule} schedule. All invoices are due within 30 days of receipt. Late payments will incur a 1.5% monthly interest charge on outstanding balances.\n\nA retainage of ${contractData.retainage}% will be withheld from each payment and released upon final completion and acceptance of the Work.`;
          break;
        case "changeOrderProcess":
          generatedContent = `All changes to the Work must be authorized in writing before execution. The Contractor shall submit a detailed proposal including cost and schedule impacts for any proposed change. The Client shall review and approve or reject the proposal within 5 business days.\n\nApproved Change Orders become part of the Contract and adjust the Contract Sum and/or Contract Time accordingly.`;
          break;
        case "terminationClauses":
          generatedContent = `Either party may terminate this Contract for cause if the other party substantially fails to perform in accordance with the Contract terms. Written notice must be provided, allowing 7 days to cure any deficiencies.\n\nThe Client may terminate for convenience with 14 days written notice, and shall pay the Contractor for Work executed and costs incurred by reason of such termination, plus a reasonable profit on the Work not executed.`;
          break;
        case "insuranceRequirements":
          generatedContent = `The Contractor shall purchase and maintain insurance coverage as follows:\n\n1. Commercial General Liability: $2,000,000 per occurrence, $4,000,000 aggregate\n2. Automobile Liability: $1,000,000 combined single limit\n3. Workers' Compensation: As required by state law\n4. Professional Liability (if applicable): $1,000,000 per claim\n\nCertificates of insurance shall be provided to the Client prior to commencement of Work.`;
          break;
        default:
          generatedContent = `AI-generated content for ${section}`;
      }
      
      setContractData(prev => ({
        ...prev,
        [section]: generatedContent
      }));
      
      toast({
        title: "AI Generation Complete",
        description: `Content has been generated successfully.`
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle load template
  const handleLoadTemplate = () => {
    if (!contractData.templateId) {
      toast({
        title: "Template Error",
        description: "Please select a template first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // This will be replaced with actual API call
    // contractService.getContractTemplate(contractData.templateId)
    //   .then(response => {
    //     setContractData(prev => ({
    //       ...prev,
    //       ...response.data,
    //       templateId: prev.templateId,
    //       useTemplate: true
    //     }));
    //     toast({
    //       title: "Template Loaded",
    //       description: "Contract template has been loaded successfully."
    //     });
    //   })
    //   .catch(err => {
    //     console.error("Error loading template:", err);
    //     toast({
    //       title: "Template Error",
    //       description: "Failed to load template. Please try again.",
    //       variant: "destructive"
    //     });
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    
    // Mock template loading for development
    setTimeout(() => {
      // Different template data based on selection
      let templateData = {};
      
      switch (contractData.templateId) {
        case "standard-construction":
          templateData = {
            paymentTerms: "Payment shall be made according to the milestone schedule. All invoices are due within 30 days of receipt.",
            paymentSchedule: "milestone",
            retainage: "5",
            changeOrderProcess: "All changes to the Work must be authorized in writing before execution.",
            disputeResolution: "mediation",
            terminationClauses: "Either party may terminate this Contract for cause if the other party substantially fails to perform.",
            insuranceRequirements: "The Contractor shall purchase and maintain insurance as required by law and the Contract Documents.",
            bondRequirements: "Performance and Payment Bonds in the amount of 100% of the Contract Sum are required.",
            warrantyPeriod: "12",
            indemnification: "The Contractor shall indemnify and hold harmless the Client from and against claims, damages, losses and expenses."
          };
          break;
        case "aia-a101":
          templateData = {
            paymentTerms: "Payment shall be made as provided in the Contract Documents. Applications for Payment shall be submitted to the Architect.",
            paymentSchedule: "monthly",
            retainage: "10",
            changeOrderProcess: "The Contract Sum and Contract Time may be changed only by Change Order or Construction Change Directive.",
            disputeResolution: "arbitration",
            terminationClauses: "The Contract may be terminated by either party as provided in Article 14 of AIA Document A201–2017.",
            insuranceRequirements: "The Contractor shall purchase and maintain insurance and provide bonds as set forth in Article 11 of AIA Document A201–2017.",
            bondRequirements: "The Contractor shall furnish bonds covering faithful performance of the Contract and payment of obligations arising thereunder.",
            warrantyPeriod: "12",
            indemnification: "To the fullest extent permitted by law, the Contractor shall indemnify and hold harmless the Owner, Architect, and their agents and employees."
          };
          break;
        case "design-build":
          templateData = {
            paymentTerms: "Payment shall be made for Design Services and Construction Services as outlined in the Contract Documents.",
            paymentSchedule: "progress",
            retainage: "5",
            changeOrderProcess: "Changes in the Work may be accomplished after execution of the Contract only by Change Order.",
            disputeResolution: "mediation",
            terminationClauses: "The Owner may terminate this Agreement for convenience upon not less than seven days' written notice to the Design-Builder.",
            insuranceRequirements: "The Design-Builder shall procure and maintain insurance for protection from claims arising out of the Design-Build Contract.",
            bondRequirements: "The Design-Builder shall furnish performance and payment bonds, each in an amount at least equal to the Contract Sum.",
            warrantyPeriod: "24",
            indemnification: "The Design-Builder shall indemnify and hold harmless the Owner from and against claims, damages, losses and expenses."
          };
          break;
        default:
          templateData = {
            paymentTerms: "Standard payment terms for selected template.",
            paymentSchedule: "milestone",
            retainage: "5",
            changeOrderProcess: "Standard change order process for selected template.",
            disputeResolution: "mediation",
            terminationClauses: "Standard termination clauses for selected template.",
            insuranceRequirements: "Standard insurance requirements for selected template.",
            bondRequirements: "Standard bond requirements for selected template.",
            warrantyPeriod: "12",
            indemnification: "Standard indemnification clause for selected template."
          };
      }
      
      setContractData(prev => ({
        ...prev,
        ...templateData,
        useTemplate: true
      }));
      
      toast({
        title: "Template Loaded",
        description: "Contract template has been loaded successfully."
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle generate contract
  const handleGenerateContract = () => {
    setIsSubmitting(true);
    
    // This will be replaced with actual API call
    // const dataToSend = {
    //   ...contractData,
    //   startDate: contractData.startDate ? format(contractData.startDate, "yyyy-MM-dd") : null,
    //   endDate: contractData.endDate ? format(contractData.endDate, "yyyy-MM-dd") : null,
    //   value: contractData.value ? parseFloat(contractData.value) : null,
    //   retainage: contractData.retainage ? parseFloat(contractData.retainage) : null,
    //   warrantyPeriod: contractData.warrantyPeriod ? parseInt(contractData.warrantyPeriod) : null
    // };
    
    // if (contractId) {
    //   // Update existing contract
    //   contractService.updateContract(contractId, dataToSend)
    //     .then(response => {
    //       toast({
    //         title: "Success",
    //         description: "Contract updated successfully."
    //       });
    //       if (onComplete) {
    //         onComplete(contractId);
    //       }
    //     })
    //     .catch(err => {
    //       console.error("Error updating contract:", err);
    //       toast({
    //         title: "Error",
    //         description: "Failed to update contract. Please try again.",
    //         variant: "destructive"
    //       });
    //     })
    //     .finally(() => {
    //       setIsSubmitting(false);
    //     });
    // } else {
    //   // Create new contract
    //   contractService.createContract(dataToSend)
    //     .then(response => {
    //       toast({
    //         title: "Success",
    //         description: "Contract generated successfully."
    //       });
    //       if (onComplete) {
    //         onComplete(response.data.id);
    //       }
    //     })
    //     .catch(err => {
    //       console.error("Error generating contract:", err);
    //       toast({
    //         title: "Error",
    //         description: "Failed to generate contract. Please try again.",
    //         variant: "destructive"
    //       });
    //     })
    //     .finally(() => {
    //       setIsSubmitting(false);
    //     });
    // }
    
    // Mock contract generation for development
    setTimeout(() => {
      toast({
        title: "Success",
        description: contractId ? "Contract updated successfully." : "Contract generated successfully."
      });
      
      if (onComplete) {
        onComplete(contractId || `contract-${Date.now()}`);
      }
      
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={contractData.title}
                onChange={handleInputChange}
                placeholder="e.g., Main Street Office Building Construction Contract"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name <span className="text-red-500">*</span></Label>
              <Input
                id="projectName"
                name="projectName"
                value={contractData.projectName}
                onChange={handleInputChange}
                placeholder="e.g., Main Street Office Building"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type</Label>
              <Select
                value={contractData.contractType}
                onValueChange={(value) => handleSelectChange("contractType", value)}
              >
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                <DatePicker
                  id="startDate"
                  selected={contractData.startDate}
                  onSelect={(date) => handleDateChange("startDate", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  id="endDate"
                  selected={contractData.endDate}
                  onSelect={(date) => handleDateChange("endDate", date)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Contract Value ($)</Label>
              <Input
                id="value"
                name="value"
                type="text"
                inputMode="decimal"
                value={contractData.value}
                onChange={handleInputChange}
                placeholder="e.g., 250000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Contract Description</Label>
              <Textarea
                id="description"
                name="description"
                value={contractData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of the contract purpose and scope"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateId">Use Template (Optional)</Label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select
                    value={contractData.templateId}
                    onValueChange={(value) => handleSelectChange("templateId", value)}
                  >
                    <SelectTrigger id="templateId">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  onClick={handleLoadTemplate}
                  disabled={isLoading || !contractData.templateId}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Loading a template will pre-fill many fields in the following steps.
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Client Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={contractData.clientName}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <Textarea
                    id="clientAddress"
                    name="clientAddress"
                    value={contractData.clientAddress}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Full address including city, state, and zip code"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientContact">Contact Person</Label>
                    <Input
                      id="clientContact"
                      name="clientContact"
                      value={contractData.clientContact}
                      onChange={handleInputChange}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      value={contractData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="e.g., john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone</Label>
                    <Input
                      id="clientPhone"
                      name="clientPhone"
                      value={contractData.clientPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Contractor Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractorName">Contractor Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="contractorName"
                    name="contractorName"
                    value={contractData.contractorName}
                    onChange={handleInputChange}
                    placeholder="e.g., XYZ Construction, Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractorAddress">Contractor Address</Label>
                  <Textarea
                    id="contractorAddress"
                    name="contractorAddress"
                    value={contractData.contractorAddress}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Full address including city, state, and zip code"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractorContact">Contact Person</Label>
                    <Input
                      id="contractorContact"
                      name="contractorContact"
                      value={contractData.contractorContact}
                      onChange={handleInputChange}
                      placeholder="e.g., Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorEmail">Email</Label>
                    <Input
                      id="contractorEmail"
                      name="contractorEmail"
                      type="email"
                      value={contractData.contractorEmail}
                      onChange={handleInputChange}
                      placeholder="e.g., jane@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractorPhone">Phone</Label>
                    <Input
                      id="contractorPhone"
                      name="contractorPhone"
                      value={contractData.contractorPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., (555) 987-6543"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Payment Terms</h3>
              {useAI && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIGenerate("paymentTerms")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms <span className="text-red-500">*</span></Label>
                <Textarea
                  id="paymentTerms"
                  name="paymentTerms"
                  value={contractData.paymentTerms}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe payment terms, including due dates, late fees, etc."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentSchedule">Payment Schedule</Label>
                  <Select
                    value={contractData.paymentSchedule}
                    onValueChange={(value) => handleSelectChange("paymentSchedule", value)}
                  >
                    <SelectTrigger id="paymentSchedule">
                      <SelectValue placeholder="Select payment schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentScheduleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retainage">Retainage Percentage (%)</Label>
                  <Input
                    id="retainage"
                    name="retainage"
                    value={contractData.retainage}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Change Orders</h3>
              {useAI && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIGenerate("changeOrderProcess")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeOrderProcess">Change Order Process</Label>
              <Textarea
                id="changeOrderProcess"
                name="changeOrderProcess"
                value={contractData.changeOrderProcess}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the process for requesting, approving, and implementing change orders"
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disputeResolution">Dispute Resolution Method</Label>
                <Select
                  value={contractData.disputeResolution}
                  onValueChange={(value) => handleSelectChange("disputeResolution", value)}
                >
                  <SelectTrigger id="disputeResolution">
                    <SelectValue placeholder="Select dispute resolution method" />
                  </SelectTrigger>
                  <SelectContent>
                    {disputeResolutionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="terminationClauses">Termination Clauses</Label>
                </div>
                {useAI && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIGenerate("terminationClauses")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Generate
                  </Button>
                )}
              </div>
              <Textarea
                id="terminationClauses"
                name="terminationClauses"
                value={contractData.terminationClauses}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe conditions under which either party may terminate the contract"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Scope of Work</h3>
              {useAI && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIGenerate("scopeOfWork")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scopeOfWork">Scope of Work <span className="text-red-500">*</span></Label>
              <Textarea
                id="scopeOfWork"
                name="scopeOfWork"
                value={contractData.scopeOfWork}
                onChange={handleInputChange}
                rows={6}
                placeholder="Detailed description of the work to be performed"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliverables">Deliverables</Label>
              <Textarea
                id="deliverables"
                name="deliverables"
                value={contractData.deliverables}
                onChange={handleInputChange}
                rows={4}
                placeholder="List of specific deliverables to be provided"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exclusions">Exclusions</Label>
                <Textarea
                  id="exclusions"
                  name="exclusions"
                  value={contractData.exclusions}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Items specifically excluded from the scope"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assumptions">Assumptions</Label>
                <Textarea
                  id="assumptions"
                  name="assumptions"
                  value={contractData.assumptions}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Key assumptions made in defining the scope"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Insurance Requirements</h3>
              {useAI && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIGenerate("insuranceRequirements")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceRequirements">Insurance Requirements</Label>
              <Textarea
                id="insuranceRequirements"
                name="insuranceRequirements"
                value={contractData.insuranceRequirements}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe required insurance coverage and limits"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bondRequirements">Bond Requirements</Label>
              <Textarea
                id="bondRequirements"
                name="bondRequirements"
                value={contractData.bondRequirements}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe any required bonds (performance, payment, etc.)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
                <Input
                  id="warrantyPeriod"
                  name="warrantyPeriod"
                  value={contractData.warrantyPeriod}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="indemnification">Indemnification</Label>
              <Textarea
                id="indemnification"
                name="indemnification"
                value={contractData.indemnification}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe indemnification terms"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="useAI"
                checked={useAI}
                onCheckedChange={setUseAI}
              />
              <Label htmlFor="useAI">Enable AI assistance for generating contract clauses</Label>
            </div>
            <div className="text-sm text-muted-foreground">
              AI can help generate standard contract language based on your inputs. You can edit any generated content.
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Contract Preview</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="previewMode" className="text-sm">View Mode:</Label>
                <Select
                  value={contractData.previewMode}
                  onValueChange={(value) => handleSelectChange("previewMode", value)}
                >
                  <SelectTrigger id="previewMode" className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="legal">Legal Format</SelectItem>
                    <SelectItem value="simplified">Simplified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-center">{contractData.title}</CardTitle>
                <CardDescription className="text-center">
                  {contractData.contractType} Agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-bold">1. PARTIES</h4>
                  <p>
                    This Contract is made and entered into on {contractData.startDate ? format(contractData.startDate, "MMMM d, yyyy") : "[Date]"} 
                    by and between <strong>{contractData.clientName || "[Client Name]"}</strong>, hereinafter referred to as "Client", 
                    and <strong>{contractData.contractorName || "[Contractor Name]"}</strong>, hereinafter referred to as "Contractor".
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold">2. PROJECT</h4>
                  <p>
                    The Client hereby engages the Contractor to perform the following project: <strong>{contractData.projectName || "[Project Name]"}</strong>
                  </p>
                  {contractData.description && (
                    <p>{contractData.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold">3. SCOPE OF WORK</h4>
                  <div className="whitespace-pre-wrap">{contractData.scopeOfWork || "[Scope of Work to be defined]"}</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold">4. PAYMENT TERMS</h4>
                  <div className="whitespace-pre-wrap">{contractData.paymentTerms || "[Payment Terms to be defined]"}</div>
                </div>
                
                {/* More sections would be shown here in a real preview */}
                <div className="text-center text-muted-foreground italic">
                  <p>Additional contract sections not shown in this preview</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Client: {contractData.clientName || "[Client Name]"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contractor: {contractData.contractorName || "[Contractor Name]"}</p>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {}}
                disabled={isSubmitting}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Draft
              </Button>
              <Button
                type="button"
                onClick={handleGenerateContract}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {contractId ? "Updating..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    {contractId ? "Update Contract" : "Generate Contract"}
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    This contract generator is provided as a tool to help create contract drafts. It is strongly recommended that all contracts be reviewed by qualified legal counsel before execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return "Unknown step";
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {contractId ? "Edit Contract" : "Contract Generator"}
        </h2>
      </div>
      
      <Stepper activeStep={activeStep} orientation="horizontal">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              {getStepContent(index)}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                {index === steps.length - 1 ? (
                  <div /> // Empty div to maintain spacing
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

// Mock UI components that would be imported from a real UI library
const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px bg-border ${className || ""}`}></div>
);

export default ContractGeneratorWizard;
