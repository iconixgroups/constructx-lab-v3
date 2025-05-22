# ConstructX Implementation Plan (Part 4)

## 13. Quotes Management Module

### Frontend Implementation

**Key Components:**
- `QuoteListPage.tsx`: Table view of quotes with status, value, and client.
- `QuoteForm.tsx`: Form for creating/editing quotes, including line items, terms, and validity period.
- `QuoteDetailsPage.tsx`: Comprehensive view of a quote, including versions, linked project/change order, and approval status.
- `QuoteVersionHistory.tsx`: Component to display and compare different versions of a quote.
- `QuoteToChangeOrderModal.tsx`: Interface to convert an approved quote into a change order.
- `QuoteStatusStepper.tsx`: Visual stepper for quote lifecycle (Draft, Submitted, Approved, Rejected, Converted).

**State Management:**
- React Query for quote data, versions, and approval status.
- Zustand for form state, UI states, and conversion modal logic.

**API Interactions:**
- CRUD operations for quotes and quote versions.
- Submitting quotes for approval (integrates with Approvals Module).
- Converting approved quotes to change orders (integrates with Contracts Module).
- Generating quote documents (e.g., PDF).

**UI/UX Considerations:**
- Clear presentation of quote line items and total calculations.
- Intuitive version control for quote revisions.
- Seamless conversion process to change orders.
- Visual cues for quote status and validity.

**AI Integration (Frontend Aspects):**
- Display AI-suggested pricing optimizations.
- Show AI-identified similar historical quotes for reference.
- Present AI-assisted cost estimation for quote items.
- Highlight AI-assessed approval probability.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/quotes`
- `POST /api/v1/projects/{projectId}/quotes`
- `GET /api/v1/projects/{projectId}/quotes/{quoteId}`
- `PUT /api/v1/projects/{projectId}/quotes/{quoteId}`
- `POST /api/v1/projects/{projectId}/quotes/{quoteId}/submit`
- `POST /api/v1/projects/{projectId}/quotes/{quoteId}/revise` (creates new version)
- `POST /api/v1/projects/{projectId}/quotes/{quoteId}/convert-to-change-order`
- `GET /api/v1/projects/{projectId}/quotes/{quoteId}/document` (generate PDF)

**Data Model (Prisma Schema - `quotes.prisma` - conceptual):**
```prisma
model Quote {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  quoteNumber         String    // Unique within project/company
  title               String
  description         String?
  clientId            String?   // Client company or contact ID
  clientName          String    // Denormalized for display
  status              QuoteStatus @default(DRAFT)
  totalValue          Decimal?
  currency            String    @default("USD")
  validFrom           DateTime?
  validUntil          DateTime?
  currentVersionId    String?
  versions            QuoteVersion[]
  linkedChangeOrderId String?   @unique
  approvalRequestId   String?   // Link to ApprovalRequest
  aiPricingInsights   Json?
  aiApprovalProbability Float?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model QuoteVersion {
  id                  String    @id @default(cuid())
  quoteId             String
  quote               Quote     @relation(fields: [quoteId], references: [id])
  versionNumber       Int
  lineItems           Json?     // Array of {description, quantity, unitPrice, totalPrice}
  termsAndConditions  String?
  notes               String?
  isSubmitted         Boolean   @default(false)
  submittedAt         DateTime?
  createdBy           String    // UserId
  createdAt           DateTime  @default(now())
}

enum QuoteStatus {
  DRAFT
  SUBMITTED
  PENDING_APPROVAL
  APPROVED
  REJECTED
  CONVERTED_TO_CHANGE_ORDER
  EXPIRED
  ARCHIVED
}
```

**Business Logic:**
- Quote numbering and versioning system.
- Calculation engine for quote totals based on line items.
- Workflow for quote submission and approval (using Approvals Module).
- Logic for converting approved quotes to Change Orders within the Contracts module.
- Generation of quote documents.
- Validity period tracking for quotes.

**Security & Permissions:**
- RBAC for creating, viewing, approving, and converting quotes.
- Access controls for sensitive pricing information.
- Audit trail for all quote modifications and status changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Price optimization suggestions based on historical data and market rates.
  - Identifying similar past quotes for reference.
  - Cost estimation assistance for complex line items.
  - Predicting approval probability based on quote parameters and client history.
- Store AI outputs in the `Quote` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Contracts Service**: For creating Change Orders from approved quotes.
- **Approvals Service**: For the quote approval workflow.
- **Documents Service**: For storing generated quote documents.
- **Notification Service**: For alerts on quote status and validity.
- **Activity Service**: For audit trails.

## 14. Invoices Management Module

### Frontend Implementation

**Key Components:**
- `InvoiceListPage.tsx`: Table view of invoices with status, amount, and due date.
- `InvoiceForm.tsx`: Form for creating/editing invoices, linking to payment applications or quotes.
- `InvoiceDetailsPage.tsx`: Comprehensive view of an invoice, including line items, payment history, and linked documents.
- `InvoiceStatusTracker.tsx`: Visual tracker for invoice lifecycle (Draft, Sent, Paid, Partially Paid, Overdue).
- `InvoicePaymentRecorder.tsx`: Modal for recording payments received against an invoice.
- `InvoiceDocumentGenerator.tsx`: Interface to generate invoice PDFs.

**State Management:**
- React Query for invoice data, payment history, and related entities.
- Zustand for form states, payment recording, and UI interactions.

**API Interactions:**
- CRUD operations for invoices.
- Linking invoices to payment applications, quotes, or contracts.
- Recording payments against invoices.
- Generating and sending invoice documents.
- Tracking invoice status and payment reminders.

**UI/UX Considerations:**
- Clear presentation of invoice details, including taxes and totals.
- Easy process for recording partial or full payments.
- Visual cues for invoice status (e.g., paid, overdue).
- Automated reminders for overdue invoices.

**AI Integration (Frontend Aspects):**
- Display AI-predicted payment dates or delay risks.
- Show AI-suggested invoice matching with payments or payment applications.
- Present AI-analyzed cash flow impact of outstanding invoices.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/invoices`
- `POST /api/v1/projects/{projectId}/invoices`
- `GET /api/v1/projects/{projectId}/invoices/{invoiceId}`
- `PUT /api/v1/projects/{projectId}/invoices/{invoiceId}`
- `POST /api/v1/projects/{projectId}/invoices/{invoiceId}/send`
- `POST /api/v1/projects/{projectId}/invoices/{invoiceId}/record-payment`
- `GET /api/v1/projects/{projectId}/invoices/{invoiceId}/document` (generate PDF)

**Data Model (Prisma Schema - `invoices.prisma` - conceptual):**
```prisma
model Invoice {
  id                      String    @id @default(cuid())
  projectId               String
  project                 Project   @relation(fields: [projectId], references: [id])
  companyId               String    // Issuing company
  company                 Company   @relation(fields: [companyId], references: [id])
  recipientCompanyId      String    // Company receiving the invoice
  recipientCompany        Company   @relation("RecipientCompanyInvoice", fields: [recipientCompanyId], references: [id])
  invoiceNumber           String    // Unique within issuing company
  status                  InvoiceStatus @default(DRAFT)
  issueDate               DateTime
  dueDate                 DateTime
  subtotal                Decimal
  taxAmount               Decimal   @default(0)
  totalAmount             Decimal
  amountPaid              Decimal   @default(0)
  amountDue               Decimal
  currency                String    @default("USD")
  notes                   String?
  paymentApplicationId    String?   @unique // Link to a PaymentApplication
  paymentApplication      PaymentApplication? @relation(fields: [paymentApplicationId], references: [id])
  quoteId                 String?   // Link to a Quote
  quote                   Quote?    @relation(fields: [quoteId], references: [id])
  contractId              String?   // Link to a Contract (for recurring or direct invoices)
  contract                Contract? @relation(fields: [contractId], references: [id])
  lineItems               Json?     // Detailed breakdown
  paymentsReceived        InvoicePayment[]
  aiPaymentDelayRisk      Float?
  aiInsights              Json?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}

model InvoicePayment {
  id                  String    @id @default(cuid())
  invoiceId           String
  invoice             Invoice   @relation(fields: [invoiceId], references: [id])
  paymentDate         DateTime
  amount              Decimal
  paymentMethod       String?
  referenceNumber     String?
  notes               String?
  recordedBy          String    // UserId
  createdAt           DateTime  @default(now())
}

enum InvoiceStatus {
  DRAFT
  SENT
  PARTIALLY_PAID
  PAID
  VOID
  OVERDUE
  WRITTEN_OFF
}
```

**Business Logic:**
- Invoice numbering system.
- Calculation of totals, taxes, and outstanding amounts.
- Linkage to Payment Applications, Quotes, or Contracts.
- Tracking of payments received (full or partial).
- Automated reminders for overdue invoices.
- Generation of professional invoice documents.

**Security & Permissions:**
- RBAC for creating, viewing, sending, and managing invoices.
- Strict access controls for financial data.
- Audit trail for all invoice activities and payment recordings.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Predicting payment delays based on client history and invoice terms.
  - Automating the matching of invoices with incoming payments.
  - Analyzing the cash flow impact of outstanding invoices.
  - Detecting anomalies in invoicing patterns or amounts.
- Store AI insights in the `Invoice` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Payments Service**: Invoices can be generated from approved Payment Applications.
- **Quotes Service**: Invoices can be generated from accepted Quotes.
- **Contracts Service**: For direct or recurring invoicing based on contract terms.
- **Documents Service**: For storing generated invoice PDFs.
- **Notification Service**: For sending invoices and payment reminders.
- **Activity Service**: For audit trails.

## 15. Smart Logs Management Module (Daily Logs)

### Frontend Implementation

**Key Components:**
- `DailyLogListPage.tsx`: Calendar or list view of daily logs.
- `DailyLogForm.tsx`: Mobile-optimized form for creating/editing daily logs, including sections for weather, manpower, equipment, work completed, delays, safety notes, and photo/video attachments.
- `DailyLogDetailsPage.tsx`: View of a submitted daily log.
- `PhotoAttachmentGrid.tsx`: Component to display and manage photo/video attachments for logs.
- `WeatherWidget.tsx`: Integrates with weather APIs to automatically fetch and display weather conditions for the log date and location.
- `VoiceToTextButton.tsx`: Button to enable voice input for text fields in the form.

**State Management:**
- React Query for daily log data and weather information.
- Zustand for form state, attachment handling, and UI interactions (especially for mobile).

**API Interactions:**
- CRUD operations for daily logs.
- Uploading and managing photo/video attachments.
- Fetching weather data for a specific date and location.
- Linking logs to specific project tasks or schedule items.

**UI/UX Considerations:**
- Highly optimized for mobile and tablet use by field personnel.
- Quick and easy data entry with minimal typing (e.g., dropdowns, toggles, voice input).
- Seamless photo/video capture and attachment.
- Offline capabilities with later synchronization would be a significant plus.
- Clear presentation of submitted log information.

**AI Integration (Frontend Aspects):**
- Display AI-calculated progress based on log entries.
- Show AI-identified potential issues or delays flagged from log content.
- Present AI-analyzed weather impact on productivity.
- Enable voice-to-text for easy field input.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/daily-logs`
- `POST /api/v1/projects/{projectId}/daily-logs`
- `GET /api/v1/projects/{projectId}/daily-logs/{logId}`
- `PUT /api/v1/projects/{projectId}/daily-logs/{logId}`
- `POST /api/v1/projects/{projectId}/daily-logs/{logId}/attachments`
- `GET /api/v1/projects/{projectId}/weather` (for a specific date/location)

**Data Model (Prisma Schema - `smartlogs.prisma` - conceptual):**
```prisma
model DailyLog {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String    // Company submitting the log
  company             Company   @relation(fields: [companyId], references: [id])
  logDate             DateTime  @db.Date
  submittedBy         String    // UserId
  submittedByUser     User      @relation(fields: [submittedBy], references: [id])
  status              DailyLogStatus @default(DRAFT)
  weatherConditions   Json?     // {temperature, humidity, wind, precipitation, description}
  manpowerLog         Json?     // Array of {trade, company, count, hours}
  equipmentLog        Json?     // Array of {type, count, hoursUsed}
  workCompleted       String?
  materialsDelivered  String?
  delaysEncountered   String?
  safetyObservations  String?
  notes               String?
  attachments         DailyLogAttachment[]
  linkedTaskIds       String[]  // IDs of ScheduleTasks this log relates to
  aiProgressUpdate    Json?
  aiIssueFlags        Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model DailyLogAttachment {
  id              String    @id @default(cuid())
  dailyLogId      String
  dailyLog        DailyLog  @relation(fields: [dailyLogId], references: [id])
  documentId      String    // Link to a Document entry (for photos/videos)
  document        Document  @relation(fields: [documentId], references: [id])
  caption         String?
  uploadedAt      DateTime  @default(now())
}

enum DailyLogStatus {
  DRAFT
  SUBMITTED
  REVIEWED
  APPROVED
}
```

**Business Logic:**
- Daily log creation, submission, and review workflow.
- Integration with weather APIs to fetch conditions based on project location and log date.
- Storage and management of multimedia attachments.
- Linkage to project schedule tasks for progress updates.
- Automated report generation from daily log data (e.g., weekly summaries).

**Security & Permissions:**
- RBAC for creating, viewing, and approving daily logs.
- Secure storage and access control for photo/video attachments.
- Location verification for field entries (if GPS data is captured).
- Tamper-evident logging for legal and compliance purposes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Automatic progress calculation by analyzing work completed descriptions and linking to tasks.
  - Issue identification by parsing text fields for keywords related to delays, safety, or problems.
  - Assessing weather impact on reported productivity.
  - Transcribing voice notes into text fields.
- Store AI insights in the `DailyLog` model.

**Integration Points:**
- **Projects Service**: For project context and location.
- **Schedule Service**: For linking logs to tasks and updating progress.
- **Team Service**: For manpower logging (linking to companies/users).
- **Documents Service**: For storing photo/video attachments.
- **Weather API**: External integration for weather data.
- **Notification Service**: For alerts on critical log entries or required reviews.
- **Activity Service**: For audit trails.

Continuing with other modules in subsequent steps...

