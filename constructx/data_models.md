# ConstructX: Data Models and Schema Design

This document outlines the comprehensive data models and schema design for all modules in the ConstructX SaaS application. These models will guide the implementation of database schemas, API structures, and state management patterns.

## Core Data Models

### User & Authentication Models

```typescript
// User Model
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string; // Stored securely
  phone?: string;
  jobTitle?: string;
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  companyId: string; // Reference to Company
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationPreferences;
    timezone: string;
  };
}

// Role Model
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean; // System roles cannot be modified
  createdAt: Date;
  updatedAt: Date;
  companyId: string; // Reference to Company
}

// Permission Model
interface Permission {
  resource: string; // e.g., 'projects', 'documents'
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// UserRole Model (Many-to-Many)
interface UserRole {
  userId: string;
  roleId: string;
  projectId?: string; // Optional, for project-specific roles
  createdAt: Date;
}
```

### Company & Subscription Models

```typescript
// Company Model
interface Company {
  id: string;
  name: string;
  logo?: string;
  address: Address;
  phone?: string;
  website?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  subscriptionId: string; // Reference to Subscription
  settings: CompanySettings;
}

// Address Model
interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Subscription Model
interface Subscription {
  id: string;
  planId: string; // Reference to Plan
  companyId: string; // Reference to Company
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Plan Model
interface Plan {
  id: string;
  name: string; // e.g., 'Standard', 'Professional', 'Enterprise'
  description: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: PlanFeature[];
  limits: {
    projects: number; // -1 for unlimited
    storage: number; // in GB
    users: number; // -1 for unlimited
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// PlanFeature Model
interface PlanFeature {
  name: string;
  description?: string;
  included: boolean;
}
```

## Pre-Construction Models

### Leads Management Models

```typescript
// Lead Model
interface Lead {
  id: string;
  name: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  value: number;
  probability: number; // 0-100
  notes?: string;
  assignedTo: string; // Reference to User
  companyId: string; // Reference to Company
  contactId: string; // Reference to Contact
  clientCompanyId?: string; // Reference to ClientCompany
  createdAt: Date;
  updatedAt: Date;
  convertedToProjectId?: string; // Reference to Project if converted
  tags: string[];
  customFields: Record<string, any>;
}

// Contact Model
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  clientCompanyId?: string; // Reference to ClientCompany
  companyId: string; // Reference to Company (owner)
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  lastContactedAt?: Date;
}

// ClientCompany Model
interface ClientCompany {
  id: string;
  name: string;
  logo?: string;
  address?: Address;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  companyId: string; // Reference to Company (owner)
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  primaryContactId?: string; // Reference to Contact
}
```

### Bids Management Models

```typescript
// Bid Model
interface Bid {
  id: string;
  name: string;
  status: 'draft' | 'submitted' | 'awarded' | 'rejected' | 'expired';
  projectId?: string; // Reference to Project
  leadId?: string; // Reference to Lead
  clientCompanyId: string; // Reference to ClientCompany
  dueDate: Date;
  submittedDate?: Date;
  awardedDate?: Date;
  rejectedDate?: Date;
  totalAmount: number;
  margin: number; // Percentage
  notes?: string;
  companyId: string; // Reference to Company (owner)
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
  customFields: Record<string, any>;
}

// BidItem Model
interface BidItem {
  id: string;
  bidId: string; // Reference to Bid
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  category?: string;
  costCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Model
interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  category: string[];
  rating?: number; // 1-5
  notes?: string;
  companyId: string; // Reference to Company (owner)
  createdAt: Date;
  updatedAt: Date;
}

// VendorBid Model
interface VendorBid {
  id: string;
  bidId: string; // Reference to Bid
  vendorId: string; // Reference to Vendor
  status: 'requested' | 'received' | 'awarded' | 'rejected';
  requestedDate: Date;
  receivedDate?: Date;
  amount: number;
  notes?: string;
  attachmentIds: string[]; // References to Documents
  createdAt: Date;
  updatedAt: Date;
}
```

### Contracts Management Models

```typescript
// Contract Model
interface Contract {
  id: string;
  name: string;
  type: 'client' | 'vendor' | 'subcontractor' | 'other';
  status: 'draft' | 'sent' | 'negotiating' | 'signed' | 'executed' | 'expired' | 'terminated';
  projectId?: string; // Reference to Project
  bidId?: string; // Reference to Bid
  clientCompanyId?: string; // Reference to ClientCompany
  vendorId?: string; // Reference to Vendor
  value: number;
  startDate?: Date;
  endDate?: Date;
  executionDate?: Date;
  notes?: string;
  companyId: string; // Reference to Company (owner)
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
  customFields: Record<string, any>;
}

// ContractClause Model
interface ContractClause {
  id: string;
  contractId: string; // Reference to Contract
  title: string;
  content: string;
  section: string;
  order: number;
  isStandard: boolean; // Is this a standard clause or custom
  createdAt: Date;
  updatedAt: Date;
}

// ContractVersion Model
interface ContractVersion {
  id: string;
  contractId: string; // Reference to Contract
  versionNumber: number;
  createdBy: string; // Reference to User
  createdAt: Date;
  documentId: string; // Reference to Document (PDF/snapshot)
  notes?: string;
  changes?: string; // Description of changes from previous version
}
```

## Project Management Core Models

### Projects Management Models

```typescript
// Project Model
interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'canceled';
  clientCompanyId: string; // Reference to ClientCompany
  contractId?: string; // Reference to Contract
  startDate?: Date;
  targetEndDate?: Date;
  actualEndDate?: Date;
  budget?: number;
  location?: {
    address?: Address;
    latitude?: number;
    longitude?: number;
  };
  projectManagerId: string; // Reference to User
  companyId: string; // Reference to Company (owner)
  createdAt: Date;
  updatedAt: Date;
  customFields: Record<string, any>;
  tags: string[];
}

// ProjectPhase Model
interface ProjectPhase {
  id: string;
  projectId: string; // Reference to Project
  name: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  startDate?: Date;
  endDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ProjectMember Model
interface ProjectMember {
  id: string;
  projectId: string; // Reference to Project
  userId: string; // Reference to User
  roleId: string; // Reference to Role
  joinedAt: Date;
  removedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Team Management Models

```typescript
// Team Model
interface Team {
  id: string;
  name: string;
  description?: string;
  companyId: string; // Reference to Company
  projectId?: string; // Optional, for project-specific teams
  leaderId: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// TeamMember Model
interface TeamMember {
  id: string;
  teamId: string; // Reference to Team
  userId: string; // Reference to User
  role?: string; // Role within the team (not the same as system Role)
  joinedAt: Date;
  removedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Schedule Management Models

```typescript
// Task Model
interface Task {
  id: string;
  projectId: string; // Reference to Project
  phaseId?: string; // Reference to ProjectPhase
  name: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date;
  endDate?: Date;
  duration: number; // In days
  progress: number; // 0-100
  assigneeId?: string; // Reference to User
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  customFields: Record<string, any>;
}

// Milestone Model
interface Milestone {
  id: string;
  projectId: string; // Reference to Project
  name: string;
  description?: string;
  date: Date;
  status: 'planned' | 'completed' | 'missed' | 'rescheduled';
  createdAt: Date;
  updatedAt: Date;
}

// Dependency Model
interface Dependency {
  id: string;
  predecessorId: string; // Reference to Task
  successorId: string; // Reference to Task
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag: number; // In days
  createdAt: Date;
  updatedAt: Date;
}
```

### Documents Management Models

```typescript
// Document Model
interface Document {
  id: string;
  name: string;
  description?: string;
  fileType: string; // MIME type
  fileSize: number; // In bytes
  filePath: string; // Storage path
  folderId?: string; // Reference to Folder
  projectId?: string; // Reference to Project
  uploadedBy: string; // Reference to User
  status: 'draft' | 'final' | 'archived' | 'deleted';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  aiAnalysis?: {
    summary?: string;
    keyPoints?: string[];
    entities?: string[];
  };
}

// Folder Model
interface Folder {
  id: string;
  name: string;
  description?: string;
  parentFolderId?: string; // Reference to parent Folder
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// DocumentVersion Model
interface DocumentVersion {
  id: string;
  documentId: string; // Reference to Document
  versionNumber: number;
  filePath: string; // Storage path
  fileSize: number; // In bytes
  uploadedBy: string; // Reference to User
  notes?: string;
  createdAt: Date;
}

// DocumentComment Model
interface DocumentComment {
  id: string;
  documentId: string; // Reference to Document
  userId: string; // Reference to User
  content: string;
  pageNumber?: number;
  coordinates?: { x: number; y: number }; // For positioned comments
  createdAt: Date;
  updatedAt: Date;
}

// DocumentAccess Model
interface DocumentAccess {
  id: string;
  documentId: string; // Reference to Document
  folderId?: string; // Reference to Folder
  userId?: string; // Reference to User
  roleId?: string; // Reference to Role
  teamId?: string; // Reference to Team
  accessLevel: 'view' | 'comment' | 'edit' | 'manage';
  createdAt: Date;
  updatedAt: Date;
}
```

## Communication & Approvals Models

### RFI Management Models

```typescript
// RFI Model
interface RFI {
  id: string;
  projectId: string; // Reference to Project
  number: string; // RFI-001, etc.
  subject: string;
  description: string;
  status: 'draft' | 'open' | 'answered' | 'closed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string; // Reference to User
  assignedTo: string; // Reference to User
  dueDate?: Date;
  dateSubmitted: Date;
  dateAnswered?: Date;
  dateClosed?: Date;
  costImpact?: number;
  scheduleImpact?: number; // In days
  createdAt: Date;
  updatedAt: Date;
}

// RFIResponse Model
interface RFIResponse {
  id: string;
  rfiId: string; // Reference to RFI
  respondedBy: string; // Reference to User
  response: string;
  dateResponded: Date;
  createdAt: Date;
  updatedAt: Date;
}

// RFIAttachment Model
interface RFIAttachment {
  id: string;
  rfiId: string; // Reference to RFI
  documentId: string; // Reference to Document
  uploadedBy: string; // Reference to User
  createdAt: Date;
}
```

### Submittals Management Models

```typescript
// Submittal Model
interface Submittal {
  id: string;
  projectId: string; // Reference to Project
  number: string; // SUB-001, etc.
  title: string;
  description?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'approved_with_comments' | 'rejected' | 'revise_resubmit';
  submittedBy: string; // Reference to User
  submittedDate?: Date;
  requiredDate?: Date;
  reviewCompletedDate?: Date;
  specSection?: string;
  createdAt: Date;
  updatedAt: Date;
}

// SubmittalItem Model
interface SubmittalItem {
  id: string;
  submittalId: string; // Reference to Submittal
  description: string;
  quantity?: number;
  status: 'pending' | 'approved' | 'approved_with_comments' | 'rejected' | 'revise_resubmit';
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

// SubmittalReview Model
interface SubmittalReview {
  id: string;
  submittalId: string; // Reference to Submittal
  reviewerId: string; // Reference to User
  status: 'pending' | 'in_progress' | 'completed';
  decision: 'approved' | 'approved_with_comments' | 'rejected' | 'revise_resubmit';
  comments?: string;
  reviewStartDate?: Date;
  reviewCompletedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// SubmittalAttachment Model
interface SubmittalAttachment {
  id: string;
  submittalId: string; // Reference to Submittal
  documentId: string; // Reference to Document
  uploadedBy: string; // Reference to User
  createdAt: Date;
}
```

### Emails Management Models

```typescript
// Email Model
interface Email {
  id: string;
  projectId?: string; // Reference to Project
  subject: string;
  body: string;
  fromEmail: string;
  fromName: string;
  toEmails: string[];
  ccEmails?: string[];
  bccEmails?: string[];
  sentDate: Date;
  status: 'draft' | 'sent' | 'failed' | 'archived';
  threadId?: string; // For grouping related emails
  hasAttachments: boolean;
  userId: string; // Reference to User who sent/received
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// EmailAttachment Model
interface EmailAttachment {
  id: string;
  emailId: string; // Reference to Email
  documentId: string; // Reference to Document
  createdAt: Date;
}

// EmailThread Model
interface EmailThread {
  id: string;
  subject: string;
  lastEmailDate: Date;
  participantEmails: string[];
  emailCount: number;
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}
```

### Approvals Management Models

```typescript
// ApprovalRequest Model
interface ApprovalRequest {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'canceled';
  requestedBy: string; // Reference to User
  requestedDate: Date;
  completedDate?: Date;
  dueDate?: Date;
  projectId?: string; // Reference to Project
  itemType: 'document' | 'change_order' | 'submittal' | 'invoice' | 'other';
  itemId: string; // Reference to the item being approved
  workflowId: string; // Reference to ApprovalWorkflow
  currentStepIndex: number;
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// ApprovalWorkflow Model
interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  isTemplate: boolean;
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// ApprovalStep Model
interface ApprovalStep {
  id: string;
  workflowId: string; // Reference to ApprovalWorkflow
  name: string;
  description?: string;
  order: number;
  approvalType: 'any' | 'all'; // Any approver or all approvers
  createdAt: Date;
  updatedAt: Date;
}

// ApprovalStepApprover Model
interface ApprovalStepApprover {
  id: string;
  stepId: string; // Reference to ApprovalStep
  approverId: string; // Reference to User
  roleId?: string; // Reference to Role (alternative to specific user)
  createdAt: Date;
  updatedAt: Date;
}

// ApprovalDecision Model
interface ApprovalDecision {
  id: string;
  requestId: string; // Reference to ApprovalRequest
  stepId: string; // Reference to ApprovalStep
  approverId: string; // Reference to User
  decision: 'approved' | 'rejected' | 'changes_requested';
  comments?: string;
  decisionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Financial Management Models

### Payments Management Models

```typescript
// Payment Model
interface Payment {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  paymentDate: Date;
  paymentMethod: string;
  reference?: string; // Check number, transaction ID, etc.
  notes?: string;
  projectId?: string; // Reference to Project
  clientCompanyId?: string; // Reference to ClientCompany (for incoming)
  vendorId?: string; // Reference to Vendor (for outgoing)
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// InvoicePayment Model (Many-to-Many)
interface InvoicePayment {
  id: string;
  paymentId: string; // Reference to Payment
  invoiceId: string; // Reference to Invoice
  amount: number; // Amount applied to this invoice
  createdAt: Date;
  updatedAt: Date;
}

// PaymentMethod Model
interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'check' | 'cash' | 'other';
  isDefault: boolean;
  details: Record<string, any>; // Encrypted/tokenized payment details
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}
```

### Quotes Management Models

```typescript
// Quote Model
interface Quote {
  id: string;
  number: string; // QUO-001, etc.
  title: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  clientCompanyId: string; // Reference to ClientCompany
  contactId?: string; // Reference to Contact
  projectId?: string; // Reference to Project
  leadId?: string; // Reference to Lead
  issueDate: Date;
  validUntil: Date;
  acceptedDate?: Date;
  rejectedDate?: Date;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// QuoteItem Model
interface QuoteItem {
  id: string;
  quoteId: string; // Reference to Quote
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
  total: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// QuoteVersion Model
interface QuoteVersion {
  id: string;
  quoteId: string; // Reference to Quote
  versionNumber: number;
  documentId: string; // Reference to Document (PDF/snapshot)
  createdBy: string; // Reference to User
  createdAt: Date;
  changes?: string; // Description of changes from previous version
}
```

### Invoices Management Models

```typescript
// Invoice Model
interface Invoice {
  id: string;
  number: string; // INV-001, etc.
  title: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'canceled';
  clientCompanyId: string; // Reference to ClientCompany
  contactId?: string; // Reference to Contact
  projectId?: string; // Reference to Project
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
  terms?: string;
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// InvoiceItem Model
interface InvoiceItem {
  id: string;
  invoiceId: string; // Reference to Invoice
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
  total: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Field Operations Models

### Smart Logs Management Models

```typescript
// DailyLog Model
interface DailyLog {
  id: string;
  projectId: string; // Reference to Project
  date: Date;
  weather: {
    temperature?: number;
    conditions?: string;
    precipitation?: number;
  };
  status: 'draft' | 'submitted' | 'approved';
  submittedBy?: string; // Reference to User
  submittedAt?: Date;
  approvedBy?: string; // Reference to User
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// LogEntry Model
interface LogEntry {
  id: string;
  dailyLogId: string; // Reference to DailyLog
  type: 'manpower' | 'equipment' | 'material' | 'note' | 'safety' | 'photo';
  content: Record<string, any>; // Varies based on type
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// ManpowerEntry Model (extends LogEntry)
interface ManpowerEntry {
  company: string;
  trade: string;
  headcount: number;
  hours: number;
  workArea?: string;
}

// EquipmentEntry Model (extends LogEntry)
interface EquipmentEntry {
  equipmentId?: string; // Reference to Equipment
  description: string;
  quantity: number;
  hours: number;
  workArea?: string;
}

// MaterialEntry Model (extends LogEntry)
interface MaterialEntry {
  description: string;
  quantity: number;
  unit: string;
  deliveredBy?: string;
  receivedBy?: string;
}
```

### Inspections Management Models

```typescript
// Inspection Model
interface Inspection {
  id: string;
  projectId: string; // Reference to Project
  title: string;
  type: string; // e.g., 'quality', 'safety', 'regulatory'
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  scheduledDate: Date;
  completedDate?: Date;
  location?: string;
  inspectorId: string; // Reference to User
  checklistId: string; // Reference to Checklist
  score?: number; // Overall score if applicable
  notes?: string;
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// Checklist Model
interface Checklist {
  id: string;
  title: string;
  description?: string;
  category: string;
  isTemplate: boolean;
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// ChecklistItem Model
interface ChecklistItem {
  id: string;
  checklistId: string; // Reference to Checklist
  description: string;
  category?: string;
  order: number;
  required: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// InspectionResult Model
interface InspectionResult {
  id: string;
  inspectionId: string; // Reference to Inspection
  checklistItemId: string; // Reference to ChecklistItem
  result: 'pass' | 'fail' | 'n/a';
  comments?: string;
  photos?: string[]; // References to Documents
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// InspectionIssue Model
interface InspectionIssue {
  id: string;
  inspectionId: string; // Reference to Inspection
  inspectionResultId: string; // Reference to InspectionResult
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string; // Reference to User
  dueDate?: Date;
  resolvedDate?: Date;
  verifiedDate?: Date;
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

### Material Management Models

```typescript
// Material Model
interface Material {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  unitCost?: number;
  sku?: string;
  manufacturer?: string;
  notes?: string;
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// PurchaseOrder Model
interface PurchaseOrder {
  id: string;
  number: string; // PO-001, etc.
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'canceled';
  vendorId: string; // Reference to Vendor
  projectId?: string; // Reference to Project
  issueDate: Date;
  expectedDeliveryDate?: Date;
  deliveryAddress?: Address;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// PurchaseOrderItem Model
interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string; // Reference to PurchaseOrder
  materialId?: string; // Reference to Material
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
  total: number;
  receivedQuantity: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Delivery Model
interface Delivery {
  id: string;
  purchaseOrderId: string; // Reference to PurchaseOrder
  deliveryDate: Date;
  receivedBy: string; // Reference to User
  notes?: string;
  status: 'complete' | 'partial' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// DeliveryItem Model
interface DeliveryItem {
  id: string;
  deliveryId: string; // Reference to Delivery
  purchaseOrderItemId: string; // Reference to PurchaseOrderItem
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// MaterialInventory Model
interface MaterialInventory {
  id: string;
  materialId: string; // Reference to Material
  projectId?: string; // Reference to Project
  location?: string;
  quantity: number;
  lastUpdated: Date;
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}
```

### Equipment Management Models

```typescript
// Equipment Model
interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  currentLocation?: string;
  notes?: string;
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// EquipmentLog Model
interface EquipmentLog {
  id: string;
  equipmentId: string; // Reference to Equipment
  type: 'usage' | 'maintenance' | 'repair' | 'inspection';
  date: Date;
  hours?: number;
  mileage?: number;
  description: string;
  performedBy: string; // Reference to User
  cost?: number;
  projectId?: string; // Reference to Project
  createdAt: Date;
  updatedAt: Date;
}

// EquipmentAssignment Model
interface EquipmentAssignment {
  id: string;
  equipmentId: string; // Reference to Equipment
  projectId: string; // Reference to Project
  assignedTo?: string; // Reference to User
  startDate: Date;
  endDate?: Date;
  notes?: string;
  status: 'scheduled' | 'active' | 'completed' | 'canceled';
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

### Site 360 Management Models

```typescript
// SiteMedia Model
interface SiteMedia {
  id: string;
  projectId: string; // Reference to Project
  type: 'photo' | 'video' | '360';
  title: string;
  description?: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  location?: {
    latitude?: number;
    longitude?: number;
    elevation?: number;
  };
  captureDate: Date;
  tags: string[];
  uploadedBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// SiteMapMarker Model
interface SiteMapMarker {
  id: string;
  projectId: string; // Reference to Project
  title: string;
  description?: string;
  mediaId?: string; // Reference to SiteMedia
  location: {
    x: number; // Coordinates on site plan
    y: number;
    latitude?: number; // GPS coordinates
    longitude?: number;
  };
  icon: string;
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// SiteTour Model
interface SiteTour {
  id: string;
  projectId: string; // Reference to Project
  title: string;
  description?: string;
  date: Date;
  status: 'draft' | 'published';
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// SiteTourPoint Model
interface SiteTourPoint {
  id: string;
  tourId: string; // Reference to SiteTour
  mediaId: string; // Reference to SiteMedia
  order: number;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Post-Construction Models

### Project Archives Models

```typescript
// ArchivedProject Model
interface ArchivedProject {
  id: string;
  projectId: string; // Reference to original Project
  archiveDate: Date;
  archivedBy: string; // Reference to User
  reason?: string;
  status: 'archived' | 'restored';
  restoredDate?: Date;
  restoredBy?: string; // Reference to User
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// ArchivedDataSnapshot Model
interface ArchivedDataSnapshot {
  id: string;
  archivedProjectId: string; // Reference to ArchivedProject
  dataType: string; // e.g., 'documents', 'tasks', 'rfis'
  dataPath: string; // Storage path to archived data
  recordCount: number;
  createdAt: Date;
}
```

### Operations & Manuals Management Models

```typescript
// OandMManual Model
interface OandMManual {
  id: string;
  projectId: string; // Reference to Project
  title: string;
  description?: string;
  status: 'draft' | 'in_progress' | 'completed';
  completedDate?: Date;
  documentId?: string; // Reference to Document (final compiled manual)
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// ManualSection Model
interface ManualSection {
  id: string;
  manualId: string; // Reference to OandMManual
  title: string;
  description?: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// ManualDocument Model
interface ManualDocument {
  id: string;
  sectionId: string; // Reference to ManualSection
  documentId: string; // Reference to Document
  title?: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// AssetLink Model
interface AssetLink {
  id: string;
  manualId: string; // Reference to OandMManual
  sectionId?: string; // Reference to ManualSection
  documentId?: string; // Reference to Document
  assetId: string; // Reference to Asset
  createdAt: Date;
  updatedAt: Date;
}
```

### Facility Management Models

```typescript
// Asset Model
interface Asset {
  id: string;
  projectId: string; // Reference to Project
  name: string;
  description?: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: Date;
  warrantyStart?: Date;
  warrantyEnd?: Date;
  location?: string;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// WorkOrder Model
interface WorkOrder {
  id: string;
  number: string; // WO-001, etc.
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'canceled';
  assetId?: string; // Reference to Asset
  projectId: string; // Reference to Project
  assignedTo?: string; // Reference to User
  requestedBy: string; // Reference to User
  requestedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  cost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// MaintenanceSchedule Model
interface MaintenanceSchedule {
  id: string;
  assetId: string; // Reference to Asset
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom';
  customFrequency?: number; // In days, if frequency is 'custom'
  nextDueDate: Date;
  lastCompletedDate?: Date;
  status: 'active' | 'paused' | 'completed';
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// FacilityTicket Model
interface FacilityTicket {
  id: string;
  projectId: string; // Reference to Project
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'canceled';
  location?: string;
  reportedBy: string; // Reference to User
  assignedTo?: string; // Reference to User
  reportedDate: Date;
  resolvedDate?: Date;
  closedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Cross-Cutting Models

### Reports Management Models

```typescript
// Report Model
interface Report {
  id: string;
  title: string;
  description?: string;
  type: string; // e.g., 'project_progress', 'financial', 'safety'
  format: 'pdf' | 'csv' | 'excel';
  parameters: Record<string, any>;
  generatedBy: string; // Reference to User
  generatedDate: Date;
  filePath?: string; // Path to generated report file
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// ReportTemplate Model
interface ReportTemplate {
  id: string;
  title: string;
  description?: string;
  type: string;
  format: 'pdf' | 'csv' | 'excel';
  content: Record<string, any>; // Template definition
  isSystem: boolean; // System template or custom
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// ReportSchedule Model
interface ReportSchedule {
  id: string;
  reportTemplateId: string; // Reference to ReportTemplate
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6, if frequency is 'weekly'
  dayOfMonth?: number; // 1-31, if frequency is 'monthly' or 'quarterly'
  time: string; // HH:MM format
  parameters: Record<string, any>;
  recipients: string[]; // Email addresses
  projectId?: string; // Reference to Project
  active: boolean;
  lastRunDate?: Date;
  nextRunDate: Date;
  createdBy: string; // Reference to User
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}
```

### AI Integration Models

```typescript
// AIConfiguration Model
interface AIConfiguration {
  id: string;
  provider: 'openrouter' | 'claude' | 'auto';
  apiKey: string; // Encrypted
  models: string[]; // Selected AI models
  features: string[]; // Enabled AI features
  companyId: string; // Reference to Company
  createdBy: string; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// AIUsageLog Model
interface AIUsageLog {
  id: string;
  configurationId: string; // Reference to AIConfiguration
  feature: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  responseTime: number; // In milliseconds
  success: boolean;
  errorMessage?: string;
  moduleContext: string;
  userId: string; // Reference to User
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdAt: Date;
}

// AISuggestion Model
interface AISuggestion {
  id: string;
  type: 'optimization' | 'warning' | 'insight' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionText?: string;
  moduleContext: string;
  status: 'active' | 'dismissed' | 'implemented';
  userId: string; // Reference to User
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// ChatConversation Model
interface ChatConversation {
  id: string;
  title: string;
  moduleContext?: string;
  userId: string; // Reference to User
  projectId?: string; // Reference to Project
  companyId: string; // Reference to Company
  createdAt: Date;
  updatedAt: Date;
}

// ChatMessage Model
interface ChatMessage {
  id: string;
  conversationId: string; // Reference to ChatConversation
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}
```

## Database Schema Relationships

The data models defined above form a comprehensive schema with the following key relationships:

1. **Company-centric data segregation**:
   - All major entities have a `companyId` field linking to the Company that owns the data.
   - This enables multi-tenant architecture while keeping data isolated between companies.

2. **Project-based organization**:
   - Most operational data is linked to specific Projects via `projectId`.
   - This creates a hierarchical organization where Projects contain related Tasks, Documents, RFIs, etc.

3. **User associations**:
   - Users are associated with Companies via `companyId`.
   - Users are associated with Projects via ProjectMember.
   - Users are assigned various roles via UserRole.
   - Actions are tracked via `createdBy`, `updatedBy`, `assignedTo` fields.

4. **Module interconnections**:
   - Leads can be converted to Projects.
   - Bids can be linked to Contracts.
   - Tasks can have Dependencies.
   - Documents can be linked to various entities (RFIs, Submittals, etc.).
   - Approvals can reference different item types.

5. **Versioning patterns**:
   - Documents, Contracts, and Quotes maintain version history.
   - This allows tracking changes over time while preserving historical records.

6. **Status workflows**:
   - Most entities have a `status` field that follows a defined workflow.
   - Status transitions drive business logic and notifications.

7. **AI integration points**:
   - AI features are integrated across modules via the AIConfiguration, AIUsageLog, and AISuggestion models.
   - Chat functionality is supported by ChatConversation and ChatMessage models.

This schema design provides a solid foundation for implementing the full CRUD operations and data flows required for the ConstructX SaaS application.
