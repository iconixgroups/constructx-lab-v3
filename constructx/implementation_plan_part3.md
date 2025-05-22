# ConstructX Implementation Plan (Part 3)

## 11. Approvals Management Module

### Frontend Implementation

**Key Components:**
- `ApprovalsDashboardPage.tsx`: Unified dashboard showing all pending and recent approvals for the user.
- `ApprovalRequestForm.tsx`: Generic form for initiating an approval request, adaptable to different entity types (e.g., document, payment, change order).
- `ApprovalDetailsPage.tsx`: View showing the details of a specific approval request, including history, comments, and current status.
- `ApprovalWorkflowVisualizer.tsx`: Component to display the steps and status of an approval workflow.
- `ApprovalActionButtons.tsx`: Standardized buttons (Approve, Reject, Request Changes) with comment modals.
- `ElectronicSignatureModal.tsx`: (If required) Modal for capturing electronic signatures for high-stakes approvals.

**State Management:**
- React Query for fetching approval requests, workflow definitions, and history.
- Zustand for managing form state, modal states, and signature capture data.

**API Interactions:**
- Fetching pending, approved, and rejected approval requests.
- Creating new approval requests linked to specific entities.
- Submitting approval actions (approve, reject, request changes).
- Fetching approval workflow definitions and history.
- Capturing and verifying electronic signatures.

**UI/UX Considerations:**
- Clear and concise presentation of items requiring approval.
- Intuitive interface for reviewing and acting on approval requests.
- Visual cues for approval status, deadlines, and priority.
- Mobile-friendly design for approving items on the go.
- Consistent approval experience across different modules.

**AI Integration (Frontend Aspects):**
- Display AI-suggested approval routing based on request type and content.
- Show AI-identified potential risks or bottlenecks in the approval process.
- Present AI-generated summaries of items requiring approval.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/approvals` (list user's pending approvals)
- `POST /api/v1/approvals` (create a new approval request)
- `GET /api/v1/approvals/{approvalId}`
- `POST /api/v1/approvals/{approvalId}/actions` (approve, reject, etc.)
- `GET /api/v1/approvals/workflows` (get workflow definitions)
- `POST /api/v1/approvals/workflows` (create/update workflow definitions - admin only)
- `GET /api/v1/entities/{entityType}/{entityId}/approvals` (get approvals for a specific item)

**Data Model (Prisma Schema - `approvals.prisma` - conceptual):**
```prisma
model ApprovalRequest {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  projectId       String?   // Optional if approval is not project-specific
  project         Project?  @relation(fields: [projectId], references: [id])
  entityType      String    // e.g., "Document", "PaymentApplication", "ChangeOrder"
  entityId        String    // ID of the entity requiring approval
  workflowDefinitionId String?
  workflowDefinition ApprovalWorkflowDefinition? @relation(fields: [workflowDefinitionId], references: [id])
  currentStepId   String?
  currentStep     ApprovalStep? @relation("CurrentApprovalStep", fields: [currentStepId], references: [id])
  status          ApprovalStatus @default(PENDING)
  requesterId     String    // UserId of the person requesting approval
  requester       User      @relation("ApprovalRequester", fields: [requesterId], references: [id])
  details         Json?     // Additional details about the request
  history         ApprovalHistory[]
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ApprovalWorkflowDefinition {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  name            String
  description     String?
  entityType      String    // Which entity this workflow applies to
  steps           ApprovalStepDefinition[]
  isDefault       Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ApprovalStepDefinition {
  id              String    @id @default(cuid())
  workflowId      String
  workflow        ApprovalWorkflowDefinition @relation(fields: [workflowId], references: [id])
  stepNumber      Int
  name            String
  description     String?
  approverRole    String?   // Role required to approve this step
  approverUserId  String?   // Specific user to approve this step
  approverGroupId String?   // Group of users who can approve
  requiredApprovals Int     @default(1) // Number of approvals needed if group
  nextStepId      String?
  rejectStepId    String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ApprovalStep {
  id              String    @id @default(cuid())
  approvalRequestId String
  approvalRequest ApprovalRequest @relation(fields: [approvalRequestId], references: [id])
  stepDefinitionId String
  stepDefinition  ApprovalStepDefinition @relation(fields: [stepDefinitionId], references: [id])
  status          ApprovalStepStatus @default(PENDING)
  assignedTo      Json?     // List of UserIds this step is assigned to
  actions         ApprovalAction[]
  dueDate         DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ApprovalAction {
  id              String    @id @default(cuid())
  approvalStepId  String
  approvalStep    ApprovalStep @relation(fields: [approvalStepId], references: [id])
  actorId         String    // UserId of the person performing the action
  actor           User      @relation(fields: [actorId], references: [id])
  actionType      ApprovalActionType
  comments        String?
  signature       String?   // If electronic signature is captured
  createdAt       DateTime  @default(now())
}

model ApprovalHistory {
  id              String    @id @default(cuid())
  approvalRequestId String
  approvalRequest ApprovalRequest @relation(fields: [approvalRequestId], references: [id])
  event           String    // Description of the event
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  timestamp       DateTime  @default(now())
  details         Json?
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  IN_PROGRESS
  CANCELLED
}

enum ApprovalStepStatus {
  PENDING
  APPROVED
  REJECTED
  SKIPPED
}

enum ApprovalActionType {
  SUBMITTED
  APPROVED
  REJECTED
  COMMENTED
  REASSIGNED
  ESCALATED
  CHANGES_REQUESTED
}
```

**Business Logic:**
- Generic approval workflow engine capable of handling multi-step approvals.
- Configurable workflow definitions per entity type and company.
- Routing logic based on roles, users, or groups.
- Notification system for pending approvals, actions taken, and escalations.
- Electronic signature capture and verification (if implemented).
- Comprehensive history tracking for auditability.
- Logic to update the status of the underlying entity upon final approval/rejection.

**Security & Permissions:**
- RBAC for initiating, viewing, and acting on approval requests.
- Secure handling of electronic signatures.
- Permissions to define and manage approval workflows (admin only).
- Audit trail for all approval actions and workflow changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Suggesting appropriate approvers or approval workflows based on request content.
  - Identifying potential bottlenecks or risks in ongoing approval processes.
  - Summarizing complex documents or requests for quicker review by approvers.
- Store AI insights in the `ApprovalRequest` model.

**Integration Points:**
- **All modules requiring approvals**: Documents, Payments, Contracts, Change Orders, RFIs, Submittals, etc. This module acts as a shared service.
- **User Service**: For identifying requesters, approvers, and roles.
- **Company Service**: For company-specific workflow definitions.
- **Project Service**: For project-specific approval contexts.
- **Notification Service**: Crucial for timely alerts and reminders.
- **Activity Service**: For detailed audit trails.

## 12. Payments Management Module

### Frontend Implementation

**Key Components:**
- `PaymentApplicationListPage.tsx`: Table view of payment applications with status.
- `PaymentApplicationForm.tsx`: Form for creating/editing payment applications, including line items, retainage, and supporting documents.
- `PaymentApplicationDetailsPage.tsx`: View of a payment application, linked invoices, approval status, and payment history.
- `PaymentCertificateGenerator.tsx`: Interface to generate payment certificates.
- `PaymentStatusTracker.tsx`: Visual tracker for payment application lifecycle.
- `FinancialDashboardWidget_Payments.tsx`: Widget for dashboards showing payment summaries.

**State Management:**
- React Query for payment application data, related invoices, and approval status.
- Zustand for form states and UI interactions.

**API Interactions:**
- CRUD for payment applications.
- Submitting applications for approval (integrates with Approvals Module).
- Linking to contract schedule of values.
- Generating payment certificates.
- Recording actual payments received/made.

**UI/UX Considerations:**
- Clear breakdown of payment application amounts (original, previous, current, retainage, balance).
- Easy attachment of supporting documentation.
- Seamless integration with approval workflows.
- Visual tracking of payment status.

**AI Integration (Frontend Aspects):**
- Display AI-detected discrepancies in payment applications.
- Show AI-forecasted cash flow based on payment schedules.
- Highlight AI-identified risks of payment delays.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/payment-applications`
- `POST /api/v1/projects/{projectId}/payment-applications`
- `GET /api/v1/projects/{projectId}/payment-applications/{appId}`
- `PUT /api/v1/projects/{projectId}/payment-applications/{appId}`
- `POST /api/v1/projects/{projectId}/payment-applications/{appId}/submit`
- `POST /api/v1/projects/{projectId}/payment-applications/{appId}/record-payment`
- `GET /api/v1/projects/{projectId}/payment-applications/{appId}/certificate` (generate)

**Data Model (Prisma Schema - `payments.prisma` - conceptual):**
```prisma
model PaymentApplication {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String    // Submitting company (e.g., Subcontractor)
  company             Company   @relation(fields: [companyId], references: [id])
  receivingCompanyId  String    // Company to receive payment (e.g., General Contractor)
  receivingCompany    Company   @relation("ReceivingCompanyPayment", fields: [receivingCompanyId], references: [id])
  applicationNumber   String    // Unique within project/company
  periodStartDate     DateTime
  periodEndDate       DateTime
  status              PaymentApplicationStatus @default(DRAFT)
  totalCompletedToDate Decimal
  lessPreviousBilled  Decimal
  retainagePercentage Decimal   @default(0)
  currentPaymentDue   Decimal
  currency            String    @default("USD")
  lineItems           Json?     // Detailed breakdown, possibly linked to Schedule of Values
  supportingDocuments Json?     // Links to Document IDs
  submittedAt         DateTime?
  approvedAt          DateTime?
  paidAt              DateTime?
  paymentDetails      String?
  approvalRequestId   String?   // Link to ApprovalRequest
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model ScheduleOfValues {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  contractId      String?   // Link to the relevant contract
  contract        Contract? @relation(fields: [contractId], references: [id])
  items           SOVItem[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model SOVItem {
  id                  String    @id @default(cuid())
  scheduleOfValuesId  String
  scheduleOfValues    ScheduleOfValues @relation(fields: [scheduleOfValuesId], references: [id])
  itemNumber          String
  description         String
  scheduledValue      Decimal
  previousBilled      Decimal   @default(0)
  workCompletedThisPeriod Decimal @default(0)
  materialsOnSite     Decimal   @default(0)
  totalCompletedAndStored Decimal @default(0)
  retainage           Decimal   @default(0)
  balanceToFinish     Decimal
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum PaymentApplicationStatus {
  DRAFT
  SUBMITTED
  PENDING_APPROVAL
  APPROVED
  PARTIALLY_APPROVED
  REJECTED
  PAID
  PARTIALLY_PAID
}
```

**Business Logic:**
- Calculation of current payment due based on work completed, previous payments, and retainage.
- Linkage to Schedule of Values from the Contract module.
- Workflow for submission and approval (using Approvals Module).
- Generation of payment certificates.
- Tracking of actual payments made/received against applications.
- Notifications for due dates, submissions, and approvals.

**Security & Permissions:**
- RBAC for creating, viewing, approving, and processing payment applications.
- Strict access controls for sensitive financial data.
- Audit trail for all payment application activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Discrepancy detection against contract terms or progress reports.
  - Cash flow forecasting based on payment schedules and history.
  - Payment delay risk assessment.
  - Automated verification of supporting documentation (e.g., lien waivers).
- Store AI insights in `PaymentApplication` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Contracts Service**: For Schedule of Values and contract terms.
- **Approvals Service**: For the approval workflow.
- **Invoices Service**: Payment applications may lead to invoice generation.
- **Documents Service**: For supporting documentation.
- **Notification Service**: For alerts.
- **Activity Service**: For audit trails.

Continuing with other modules in subsequent steps...

