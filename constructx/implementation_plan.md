# ConstructX Implementation Plan

## Introduction
This document outlines the frontend and backend implementation details for each of the 23 modules of the ConstructX SaaS application. It builds upon the requirements defined in `modules_list.md` and the architecture specified in `architecture.md`.

## 1. Leads Management Module

### Frontend Implementation (React, Next.js, ShadcnUI, TypeScript)

**Key Components:**
- `LeadListPage.tsx`: Displays a sortable, filterable table of leads using ShadcnUI Table component. Includes search and quick filter functionality.
- `LeadCard.tsx`: Represents a single lead in a Kanban/pipeline view (using a library like `react-beautiful-dnd` or a custom ShadcnUI-styled board).
- `LeadForm.tsx`: A reusable form (using React Hook Form and Zod for validation) for creating and editing leads. Utilizes ShadcnUI Input, Select, DatePicker, Textarea components.
- `LeadDetailsPage.tsx`: Displays comprehensive lead information, activity timeline (custom component or ShadcnUI Card), and related entities.
- `LeadStatusBadge.tsx`: A ShadcnUI Badge component to visually indicate lead status.
- `LeadConversionModal.tsx`: A ShadcnUI Dialog component to handle the conversion of a lead to a Bid or Project, guiding the user through the process.
- `LeadDashboardWidget.tsx`: A widget for the main dashboard displaying key lead metrics (e.g., pipeline, conversion rates) using ShadcnUI Card and potentially a simple chart component.

**State Management (Zustand/React Query):
**- Server state (leads list, lead details) managed by React Query, with appropriate caching and refetching strategies.
- Client state (form data, UI toggles, modal states) managed by Zustand or local component state.

**API Interactions:**
- Fetching list of leads with pagination, sorting, and filtering.
- Fetching single lead details.
- Creating, updating, and archiving leads.
- Converting leads to Bids/Projects.
- Fetching activity timeline for a lead.

**UI/UX Considerations:**
- Intuitive drag-and-drop interface for pipeline view.
- Clear visual indicators for lead status and priority.
- Responsive design for mobile and tablet access, particularly for sales teams on the go.
- Inline validation and clear error messaging in forms.
- Autosave functionality for lead forms to prevent data loss.

**AI Integration (Frontend Aspects):**
- Display AI-generated lead scores and qualification suggestions.
- Show AI-powered follow-up reminders and action recommendations.
- Interface for uploading documents for automated data extraction (results displayed in lead details).
- Display enriched client company information.

### Backend Implementation (Node.js, Express, Prisma, PostgreSQL)

**API Endpoints (RESTful with Express.js):**
- `GET /api/v1/leads`: List leads (with query params for pagination, sort, filter).
- `POST /api/v1/leads`: Create a new lead.
- `GET /api/v1/leads/{leadId}`: Get a specific lead.
- `PUT /api/v1/leads/{leadId}`: Update a specific lead.
- `DELETE /api/v1/leads/{leadId}`: Archive/soft-delete a lead (actual deletion restricted).
- `POST /api/v1/leads/{leadId}/convert-to-bid`: Convert lead to Bid.
- `POST /api/v1/leads/{leadId}/convert-to-project`: Convert lead to Project.
- `GET /api/v1/leads/{leadId}/activities`: Get activity timeline for a lead.

**Data Model (Prisma Schema - `leads.prisma` - conceptual):**
```prisma
model Lead {
  id              String    @id @default(cuid())
  companyId       String    // Foreign key to Company
  company         Company   @relation(fields: [companyId], references: [id])
  leadName        String
  clientCompany   String
  clientContactName String?
  clientEmail     String?
  clientPhone     String?
  estimatedValue  Decimal?
  currency        String    @default("USD")
  source          String?
  status          LeadStatus @default(NEW)
  description     String?
  notes           Json?     // For storing structured notes or custom fields
  ownerId         String?   // Foreign key to User
  owner           User?     @relation(fields: [ownerId], references: [id])
  assignedToId    String?   // Foreign key to User
  assignedTo      User?     @relation("LeadAssignedTo", fields: [assignedToId], references: [id])
  lostReason      String?
  isArchived      Boolean   @default(false)
  conversionDetails Json?   // Details if converted
  aiScore         Float?    // AI-generated lead score
  aiInsights      Json?     // AI-generated insights/recommendations
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  activities      Activity[]
  linkedBidId     String?   @unique // If converted to Bid
  linkedProjectId String?   @unique // If converted to Project
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL_SENT
  NEGOTIATION
  WON
  LOST
  ARCHIVED
}
```

**Business Logic:**
- Lead status transition validation (e.g., cannot move from WON to NEW without justification).
- Automatic recording of creation/update timestamps and user performing action.
- Handling lead conversion logic, including data pre-population to Bid/Project (respecting integration toggles).
- Duplicate detection logic (e.g., based on client company and lead name within the same `companyId`).
- Notification generation for assignments, status changes, and follow-ups.

**Security & Permissions:**
- Enforce company-scoped data access (`companyId` checks on all queries).
- Role-based access control (RBAC): Define who can view, create, edit, delete, and convert leads (e.g., Sales Manager, Sales Rep).
- Field-level security for sensitive data if necessary.
- Audit all CRUD operations and status changes in the `Activity` table.

**AI Integration (Backend Aspects):**
- Service methods to call OpenRouter/Claude API for:
    - Lead scoring: Input lead data, get a score.
    - Qualification suggestions: Input lead data, get qualification insights.
    - Follow-up recommendations: Based on lead activity and status.
    - Document data extraction: Process uploaded documents linked to leads.
    - Client info enrichment: Use client company name to fetch additional public info.
- Store AI-generated data (scores, insights) in the `Lead` model.
- Background jobs (Bull queue) for asynchronous AI processing (e.g., document analysis).

**Integration Points:**
- **Company Service**: To validate `companyId`.
- **User Service**: To validate `ownerId`, `assignedToId`.
- **Notification Service**: To send alerts for assignments, status changes, follow-ups.
- **Bids Service**: When converting a lead to a bid (if `lead-to-bid` toggle is ON).
- **Projects Service**: When converting a lead to a project (if `lead-to-project` toggle is ON).
- **Activity Service/Audit Trail**: Log all significant actions.

## 2. Bids Management Module

### Frontend Implementation

**Key Components:**
- `BidListPage.tsx`: Table view of bids with status, value, client, etc.
- `BidForm.tsx`: Form for creating/editing bids, including line items, terms, and document attachments.
- `BidDetailsPage.tsx`: Comprehensive view of a bid, including versions, linked lead/contract, and approval status.
- `BidVersionHistory.tsx`: Component to display and compare different versions of a bid.
- `BidProposalGenerator.tsx`: Interface to select templates and generate proposal documents (e.g., PDF).
- `BidStatusStepper.tsx`: Visual stepper (ShadcnUI-styled) to show bid progress (Draft, Submitted, Under Review, Awarded, Lost).
- `BidComparisonTool.tsx`: (Advanced) UI to compare key aspects of multiple bids.

**State Management:**
- React Query for bid data, versions, and related documents.
- Zustand for form state, UI states, and proposal generation options.

**API Interactions:**
- CRUD operations for bids and bid versions.
- Fetching bid templates.
- Generating and downloading bid proposal documents.
- Submitting bids for approval.
- Linking bids to Leads or converting to Contracts.

**UI/UX Considerations:**
- Clear version control and differentiation between bid revisions.
- Intuitive interface for adding and managing bid line items.
- Seamless document generation and preview.
- Visual cues for bid status and deadlines.

**AI Integration (Frontend Aspects):**
- Display AI-predicted win probability.
- Show AI-suggested competitive analysis points.
- Present AI-assisted cost estimation adjustments.
- Highlight AI-identified risk factors in the bid details.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/bids`
- `POST /api/v1/bids`
- `GET /api/v1/bids/{bidId}`
- `PUT /api/v1/bids/{bidId}`
- `POST /api/v1/bids/{bidId}/submit`
- `POST /api/v1/bids/{bidId}/revise` (creates a new version)
- `GET /api/v1/bids/{bidId}/versions`
- `GET /api/v1/bids/{bidId}/versions/{versionId}`
- `POST /api/v1/bids/{bidId}/generate-proposal`
- `POST /api/v1/bids/{bidId}/convert-to-contract`

**Data Model (Prisma Schema - `bids.prisma` - conceptual):**
```prisma
model Bid {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  bidNumber       String    // Auto-generated or manual, unique within company
  title           String
  description     String?
  clientId        String?   // Could be a client company ID or contact ID
  clientName      String    // Denormalized for display
  status          BidStatus @default(DRAFT)
  totalValue      Decimal?
  currency        String    @default("USD")
  submissionDate  DateTime?
  validUntilDate  DateTime?
  leadId          String?   @unique // Link to originating Lead
  lead            Lead?     @relation(fields: [leadId], references: [id])
  currentVersionId String?   // Points to the active BidVersion
  versions        BidVersion[]
  linkedContractId String?  @unique
  aiWinProbability Float?
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  activities      Activity[]
}

model BidVersion {
  id              String    @id @default(cuid())
  bidId           String
  bid             Bid       @relation(fields: [bidId], references: [id])
  versionNumber   Int
  lineItems       Json?     // Array of {description, quantity, unitPrice, totalPrice}
  termsAndConditions String?
  proposalDocumentPath String? // Path to generated PDF
  isSubmitted     Boolean   @default(false)
  submittedAt     DateTime?
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
}

enum BidStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  REVISION_REQUESTED
  AWARDED
  LOST
  ARCHIVED
}
```

**Business Logic:**
- Bid numbering and versioning system.
- Calculation engine for bid totals based on line items.
- Workflow for bid submission, review, and approval (may involve Approvals module).
- Logic for converting awarded bids to Contracts (respecting `bid-to-contract` toggle).
- Secure generation and storage of proposal documents.
- Notifications for bid deadlines, status changes, and revision requests.

**Security & Permissions:**
- RBAC for creating, viewing, editing, and submitting bids.
- Permissions for accessing sensitive financial data within bids.
- Secure handling of generated proposal documents (access controls, potential encryption).
- Audit trail for all bid modifications and status changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
    - Win probability prediction (based on bid data, client history, market conditions).
    - Competitive analysis suggestions (if relevant data is available or can be inputted).
    - Cost estimation assistance (e.g., sanity checks, suggestions based on historical data).
    - Risk factor identification (e.g., unclear scope, tight deadlines).
- Store AI outputs in the `Bid` model.

**Integration Points:**
- **Leads Service**: For creating bids from leads.
- **Contracts Service**: For converting awarded bids to contracts.
- **Documents Service**: For storing proposal documents and attachments.
- **Approvals Service**: If a formal approval workflow is needed for bid submission/award.
- **Notification Service**: For alerts.
- **Activity Service**: For audit trails.

Continuing with other modules in subsequent steps...

