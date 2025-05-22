# ConstructX Implementation Plan (Part 6)

## 21. Operations & Manuals Management Module

### Frontend Implementation

**Key Components:**
- `OMManualListPage.tsx`: Organized view of O&M manuals by system, equipment, or category.
- `OMManualOrganizer.tsx`: Interface for organizing and categorizing O&M documentation.
- `OMDocumentUploader.tsx`: Specialized uploader for O&M documents with metadata tagging.
- `OMEquipmentLinker.tsx`: Tool for linking manuals to specific equipment items.
- `OMSearchInterface.tsx`: Searchable interface for finding specific O&M information.
- `OMHandoverPackageGenerator.tsx`: Tool for compiling complete handover packages.
- `OMDigitalManualViewer.tsx`: Interactive viewer for digital O&M manuals.

**State Management:**
- React Query for O&M document data, equipment links, and search results.
- Zustand for organization structure, package generation, and UI states.

**API Interactions:**
- CRUD operations for O&M manuals and documents.
- Organizing and categorizing O&M documentation.
- Linking manuals to equipment and building systems.
- Searching O&M content by various criteria.
- Generating and exporting handover packages.

**UI/UX Considerations:**
- Intuitive organization of complex O&M documentation.
- Easy-to-use search functionality for finding specific information.
- Clear linking between equipment and corresponding manuals.
- Streamlined handover package generation process.
- Digital manual viewer with navigation and search capabilities.

**AI Integration (Frontend Aspects):**
- Display AI-classified document categories.
- Show AI-suggested equipment-manual linkages.
- Present AI-extracted maintenance schedules.
- Enable natural language searching of manual content.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/om-manuals`
- `POST /api/v1/projects/{projectId}/om-manuals`
- `GET /api/v1/projects/{projectId}/om-manuals/{manualId}`
- `PUT /api/v1/projects/{projectId}/om-manuals/{manualId}`
- `POST /api/v1/projects/{projectId}/om-manuals/{manualId}/documents`
- `GET /api/v1/projects/{projectId}/om-manuals/equipment/{equipmentId}`
- `POST /api/v1/projects/{projectId}/om-manuals/link-equipment`
- `GET /api/v1/projects/{projectId}/om-manuals/search`
- `POST /api/v1/projects/{projectId}/om-manuals/handover-package`

**Data Model (Prisma Schema - `om_manuals.prisma` - conceptual):**
```prisma
model OMManual {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String    // Company providing the manual
  company             Company   @relation(fields: [companyId], references: [id])
  title               String
  description         String?
  category            String?   // e.g., "Mechanical", "Electrical", "Plumbing"
  system              String?   // Building system this manual relates to
  documents           OMDocument[]
  equipmentLinks      OMEquipmentLink[]
  maintenanceSchedules OMMaintenanceSchedule[]
  status              OMManualStatus @default(DRAFT)
  aiClassification    String?
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model OMDocument {
  id                  String    @id @default(cuid())
  manualId            String
  manual              OMManual  @relation(fields: [manualId], references: [id])
  documentId          String    // Link to a Document entry
  document            Document  @relation(fields: [documentId], references: [id])
  title               String
  documentType        String?   // e.g., "User Manual", "Warranty", "Specification"
  tags                String[]
  order               Int       @default(0) // For ordering within the manual
  aiExtractedContent  Json?     // Key information extracted by AI
  uploadedBy          String    // UserId
  uploadedAt          DateTime  @default(now())
}

model OMEquipmentLink {
  id                  String    @id @default(cuid())
  manualId            String
  manual              OMManual  @relation(fields: [manualId], references: [id])
  equipmentId         String
  equipment           Equipment @relation(fields: [equipmentId], references: [id])
  linkType            String?   // e.g., "Primary", "Reference"
  notes               String?
  createdAt           DateTime  @default(now())
}

model OMMaintenanceSchedule {
  id                  String    @id @default(cuid())
  manualId            String
  manual              OMManual  @relation(fields: [manualId], references: [id])
  title               String
  frequency           String    // e.g., "Monthly", "Quarterly", "Annually"
  description         String
  procedures          String?
  aiExtracted         Boolean   @default(false) // Whether this was extracted by AI
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model OMHandoverPackage {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  name                String
  description         String?
  generatedDocumentId String?   // Link to the generated package document
  generatedDocument   Document? @relation(fields: [generatedDocumentId], references: [id])
  includedManuals     Json      // Array of manual IDs included in this package
  generatedBy         String    // UserId
  generatedAt         DateTime  @default(now())
}

enum OMManualStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  REJECTED
  FINAL
}
```

**Business Logic:**
- Organization and categorization of O&M documentation.
- Document processing for manuals, warranties, and specifications.
- Linking manuals to specific equipment and building systems.
- Maintenance schedule extraction and management.
- Handover package generation for project completion.
- Search indexing for manual contents.

**Security & Permissions:**
- RBAC for creating, viewing, and managing O&M documentation.
- Secure handover to facility management teams.
- Long-term access controls for warranty period.
- Audit trail for document additions and modifications.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Automatic document classification by type and system.
  - Equipment manual linking based on content analysis.
  - Maintenance schedule extraction from manual text.
  - Creating a searchable knowledge base from manual content.
- Store AI outputs in the `OMManual`, `OMDocument`, and `OMMaintenanceSchedule` models.

**Integration Points:**
- **Projects Service**: For project context and completion status.
- **Documents Service**: For storing and managing manual documents.
- **Equipment Service**: For linking manuals to specific equipment items.
- **Search Service**: For indexing and searching manual content.
- **Facility Management Service**: For transitioning O&M data to ongoing facility management.
- **Activity Service**: For audit trails.

## 22. Facility Management Module

### Frontend Implementation

**Key Components:**
- `FacilityDashboardPage.tsx`: Overview dashboard for facility management with key metrics and alerts.
- `MaintenanceRequestForm.tsx`: Form for creating and managing maintenance requests.
- `PreventiveMaintenanceScheduler.tsx`: Interface for scheduling and tracking preventive maintenance.
- `EquipmentPerformanceMonitor.tsx`: Tool for monitoring equipment performance and issues.
- `WarrantyClaimManager.tsx`: Interface for tracking and managing warranty claims.
- `BuildingSystemsViewer.tsx`: Visual representation of building systems and their status.
- `FacilityIssueTracker.tsx`: Tool for tracking and resolving facility issues.

**State Management:**
- React Query for facility data, maintenance requests, and equipment status.
- Zustand for dashboard configuration, maintenance scheduling, and UI states.

**API Interactions:**
- Managing maintenance requests and their lifecycle.
- Scheduling and tracking preventive maintenance.
- Monitoring equipment performance and issues.
- Managing warranty claims and their resolution.
- Tracking facility issues and their status.

**UI/UX Considerations:**
- Clear dashboard with key facility metrics and alerts.
- Easy-to-use interface for submitting and tracking maintenance requests.
- Visual representation of building systems and equipment.
- Mobile-friendly forms for on-site maintenance activities.
- Intuitive scheduling tools for preventive maintenance.

**AI Integration (Frontend Aspects):**
- Display AI-predicted maintenance needs.
- Show AI-suggested energy optimization opportunities.
- Present AI-forecasted equipment failure risks.
- Highlight AI-analyzed maintenance cost patterns.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/facilities/{facilityId}/dashboard`
- `GET /api/v1/facilities/{facilityId}/maintenance-requests`
- `POST /api/v1/facilities/{facilityId}/maintenance-requests`
- `GET /api/v1/facilities/{facilityId}/maintenance-requests/{requestId}`
- `PUT /api/v1/facilities/{facilityId}/maintenance-requests/{requestId}`
- `GET /api/v1/facilities/{facilityId}/preventive-maintenance`
- `POST /api/v1/facilities/{facilityId}/preventive-maintenance`
- `GET /api/v1/facilities/{facilityId}/equipment-performance`
- `POST /api/v1/facilities/{facilityId}/warranty-claims`
- `GET /api/v1/facilities/{facilityId}/warranty-claims`

**Data Model (Prisma Schema - `facility_management.prisma` - conceptual):**
```prisma
model Facility {
  id                  String    @id @default(cuid())
  projectId           String?   // Link to the original construction project
  project             Project?  @relation(fields: [projectId], references: [id])
  companyId           String    // Company managing the facility
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  location            String?
  address             String?
  gpsCoordinates      Json?     // {latitude, longitude}
  buildingInfo        Json?     // Building details, size, floors, etc.
  systems             FacilitySystem[]
  equipment           FacilityEquipment[]
  maintenanceRequests MaintenanceRequest[]
  preventiveMaintenance PreventiveMaintenance[]
  warrantyClaims      WarrantyClaim[]
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model FacilitySystem {
  id                  String    @id @default(cuid())
  facilityId          String
  facility            Facility  @relation(fields: [facilityId], references: [id])
  name                String
  description         String?
  category            String    // e.g., "HVAC", "Electrical", "Plumbing"
  status              SystemStatus @default(OPERATIONAL)
  equipment           FacilityEquipment[]
  maintenanceHistory  Json?     // Historical maintenance data
  aiHealthScore       Float?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model FacilityEquipment {
  id                  String    @id @default(cuid())
  facilityId          String
  facility            Facility  @relation(fields: [facilityId], references: [id])
  systemId            String?
  system              FacilitySystem? @relation(fields: [systemId], references: [id])
  originalEquipmentId String?   // Link to original Equipment from construction
  name                String
  description         String?
  manufacturer        String?
  model               String?
  serialNumber        String?
  installationDate    DateTime?
  warrantyExpiration  DateTime?
  status              EquipmentStatus @default(OPERATIONAL)
  maintenanceHistory  Json?     // Historical maintenance data
  performanceData     Json?     // Performance metrics
  aiFailurePrediction Float?
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model MaintenanceRequest {
  id                  String    @id @default(cuid())
  facilityId          String
  facility            Facility  @relation(fields: [facilityId], references: [id])
  title               String
  description         String
  priority            RequestPriority @default(MEDIUM)
  status              RequestStatus @default(OPEN)
  category            String?
  location            String?
  reportedBy          String    // UserId
  reportedByUser      User      @relation(fields: [reportedBy], references: [id])
  assignedTo          String?   // UserId
  assignedToUser      User?     @relation("AssignedMaintenance", fields: [assignedTo], references: [id])
  equipmentId         String?
  equipment           FacilityEquipment? @relation(fields: [equipmentId], references: [id])
  requestedDate       DateTime  @default(now())
  scheduledDate       DateTime?
  completedDate       DateTime?
  resolution          String?
  cost                Decimal?
  attachments         Json?     // Array of Document IDs
  aiSuggestions       String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model PreventiveMaintenance {
  id                  String    @id @default(cuid())
  facilityId          String
  facility            Facility  @relation(fields: [facilityId], references: [id])
  title               String
  description         String
  frequency           String    // e.g., "Monthly", "Quarterly", "Annually"
  nextDueDate         DateTime
  equipmentId         String?
  equipment           FacilityEquipment? @relation(fields: [equipmentId], references: [id])
  systemId            String?
  system              FacilitySystem? @relation(fields: [systemId], references: [id])
  procedures          String?
  estimatedDuration   Int?      // In minutes
  assignedTo          String?   // UserId or team
  status              PMStatus  @default(SCHEDULED)
  history             PMHistory[]
  aiOptimized         Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model PMHistory {
  id                  String    @id @default(cuid())
  preventiveMaintenanceId String
  preventiveMaintenance PreventiveMaintenance @relation(fields: [preventiveMaintenanceId], references: [id])
  completedDate       DateTime
  completedBy         String    // UserId
  completedByUser     User      @relation(fields: [completedBy], references: [id])
  notes               String?
  findings            String?
  followUpNeeded      Boolean   @default(false)
  cost                Decimal?
  attachments         Json?     // Array of Document IDs
  createdAt           DateTime  @default(now())
}

model WarrantyClaim {
  id                  String    @id @default(cuid())
  facilityId          String
  facility            Facility  @relation(fields: [facilityId], references: [id])
  title               String
  description         String
  equipmentId         String?
  equipment           FacilityEquipment? @relation(fields: [equipmentId], references: [id])
  warrantyProvider    String
  warrantyReference   String?
  claimDate           DateTime  @default(now())
  status              ClaimStatus @default(SUBMITTED)
  resolution          String?
  resolvedDate        DateTime?
  attachments         Json?     // Array of Document IDs
  createdBy           String    // UserId
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum SystemStatus {
  OPERATIONAL
  DEGRADED
  MAINTENANCE
  OFFLINE
}

enum EquipmentStatus {
  OPERATIONAL
  DEGRADED
  MAINTENANCE
  OFFLINE
  DECOMMISSIONED
}

enum RequestPriority {
  LOW
  MEDIUM
  HIGH
  EMERGENCY
}

enum RequestStatus {
  OPEN
  ASSIGNED
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum PMStatus {
  SCHEDULED
  OVERDUE
  COMPLETED
  SKIPPED
}

enum ClaimStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  RESOLVED
}
```

**Business Logic:**
- Facility setup from completed construction projects.
- Maintenance request workflow from submission to resolution.
- Preventive maintenance scheduling and tracking.
- Equipment performance monitoring and issue detection.
- Warranty claim management and tracking.
- Building system status monitoring and reporting.

**Security & Permissions:**
- RBAC for facility management functions.
- Tenant/owner data separation for multi-tenant facilities.
- Secure handling of building system data.
- Audit trail for maintenance activities and system changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Predictive maintenance scheduling based on equipment usage and history.
  - Energy usage optimization recommendations.
  - Equipment failure prediction based on performance data.
  - Maintenance cost analysis and optimization.
- Store AI insights in the various facility management models.

**Integration Points:**
- **Projects Service**: For transitioning from construction to operations.
- **O&M Manuals Service**: For accessing maintenance procedures and documentation.
- **Equipment Service**: For historical equipment data from construction.
- **Documents Service**: For storing maintenance records and documentation.
- **User Service**: For maintenance staff and tenant management.
- **Notification Service**: For maintenance alerts and reminders.
- **Activity Service**: For audit trails.

## 23. Reports Management Module

### Frontend Implementation

**Key Components:**
- `ReportBuilderPage.tsx`: Drag-and-drop interface for creating custom reports.
- `ReportTemplateLibrary.tsx`: Library of pre-built and saved report templates.
- `ReportVisualizationTools.tsx`: Components for creating charts, tables, and other visualizations.
- `ReportScheduler.tsx`: Interface for scheduling automatic report generation and distribution.
- `ReportViewerPage.tsx`: Viewer for generated reports with interactive elements.
- `ReportExportOptions.tsx`: Tools for exporting reports in various formats (PDF, Excel, etc.).
- `ReportDashboardWidget.tsx`: Widget for embedding reports in dashboards.

**State Management:**
- React Query for report data, templates, and generated reports.
- Zustand for report builder state, visualization options, and UI interactions.

**API Interactions:**
- Building and saving custom reports.
- Generating reports from templates.
- Scheduling automatic report generation.
- Exporting reports in various formats.
- Managing report distribution and sharing.

**UI/UX Considerations:**
- Intuitive drag-and-drop report builder.
- Rich visualization options for data presentation.
- Flexible layout options for report design.
- Interactive elements in generated reports.
- Easy export and sharing capabilities.

**AI Integration (Frontend Aspects):**
- Display AI-generated insights in reports.
- Show AI-detected anomalies in report data.
- Present AI-recommended report templates based on role.
- Enable natural language querying for report generation.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/reports/templates`
- `POST /api/v1/reports/templates`
- `GET /api/v1/reports/templates/{templateId}`
- `PUT /api/v1/reports/templates/{templateId}`
- `POST /api/v1/reports/generate`
- `GET /api/v1/reports/generated`
- `GET /api/v1/reports/generated/{reportId}`
- `POST /api/v1/reports/schedules`
- `GET /api/v1/reports/schedules`
- `GET /api/v1/reports/data-sources`

**Data Model (Prisma Schema - `reports.prisma` - conceptual):**
```prisma
model ReportTemplate {
  id                  String    @id @default(cuid())
  companyId           String    // Company that owns the template
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  category            String?
  isGlobal            Boolean   @default(false) // Whether it's available to all users in company
  definition          Json      // Report structure, layout, and data source mappings
  dataSources         Json      // Array of data sources used
  parameters          Json?     // Configurable parameters for the report
  thumbnail           String?   // Preview image URL
  createdBy           String    // UserId
  createdByUser       User      @relation(fields: [createdBy], references: [id])
  generatedReports    GeneratedReport[]
  schedules           ReportSchedule[]
  aiGenerated         Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model GeneratedReport {
  id                  String    @id @default(cuid())
  templateId          String
  template            ReportTemplate @relation(fields: [templateId], references: [id])
  name                String
  projectId           String?   // Optional project context
  project             Project?  @relation(fields: [projectId], references: [id])
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  parameters          Json?     // Parameters used for generation
  outputFormat        String    // e.g., "PDF", "Excel", "HTML"
  outputUrl           String    // URL to the generated file
  generatedBy         String    // UserId or "System" for scheduled reports
  generatedByUser     User?     @relation(fields: [generatedBy], references: [id])
  scheduleId          String?   // If generated by schedule
  schedule            ReportSchedule? @relation(fields: [scheduleId], references: [id])
  aiInsights          Json?     // AI-generated insights included in the report
  generatedAt         DateTime  @default(now())
}

model ReportSchedule {
  id                  String    @id @default(cuid())
  templateId          String
  template            ReportTemplate @relation(fields: [templateId], references: [id])
  name                String
  description         String?
  frequency           String    // e.g., "Daily", "Weekly", "Monthly"
  cronExpression      String    // For precise scheduling
  parameters          Json?     // Fixed parameters for the schedule
  outputFormat        String    // e.g., "PDF", "Excel", "HTML"
  recipients          Json      // Array of email addresses or user IDs
  projectId           String?   // Optional project context
  project             Project?  @relation(fields: [projectId], references: [id])
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  isActive            Boolean   @default(true)
  lastRunAt           DateTime?
  nextRunAt           DateTime?
  generatedReports    GeneratedReport[]
  createdBy           String    // UserId
  createdByUser       User      @relation(fields: [createdBy], references: [id])
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model ReportDataSource {
  id                  String    @id @default(cuid())
  name                String
  description         String?
  module              String    // e.g., "Projects", "Schedule", "Finance"
  entityType          String    // e.g., "Project", "Task", "Payment"
  availableFields     Json      // Array of available fields and their types
  queryCapabilities   Json      // Supported query operations
  isActive            Boolean   @default(true)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

**Business Logic:**
- Report template creation and management.
- Data aggregation across modules for reporting.
- Scheduled report processing and distribution.
- Export format conversion for various output types.
- Report access control based on user roles and data permissions.
- Cross-module data querying and joining.

**Security & Permissions:**
- RBAC for report creation, viewing, and scheduling.
- Data filtering based on user permissions.
- Secure distribution of potentially sensitive reports.
- Audit trail for report generation and access.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Automated insight generation from report data.
  - Anomaly detection in reported metrics.
  - Report recommendation based on user role and activities.
  - Natural language query processing for ad-hoc reporting.
- Store AI insights in the `GeneratedReport` model.

**Integration Points:**
- **All Module Services**: As a cross-cutting module, Reports integrates with all other modules for data access.
- **User Service**: For report permissions and distribution.
- **Company Service**: For company-specific report templates and access.
- **Project Service**: For project-specific reporting context.
- **Notification Service**: For report distribution and alerts.
- **Activity Service**: For audit trails.

## Cross-Cutting Components

### AI Integration Framework

#### Frontend Implementation

**Key Components:**
- `AIAssistantPanel.tsx`: Collapsible panel providing AI assistance across all modules.
- `AIInsightsWidget.tsx`: Widget for displaying AI-generated insights in dashboards and module pages.
- `AIQueryInterface.tsx`: Natural language query interface for interacting with AI capabilities.
- `AIFeedbackButton.tsx`: Button for providing feedback on AI suggestions to improve accuracy.
- `AISettingsPanel.tsx`: User preferences for AI features and behavior.

**State Management:**
- React Query for AI-generated insights and suggestions.
- Zustand for AI assistant state, query history, and UI interactions.

**API Interactions:**
- Submitting natural language queries to AI services.
- Fetching AI-generated insights for specific contexts.
- Providing feedback on AI suggestions.
- Managing AI feature preferences.

**UI/UX Considerations:**
- Unobtrusive but easily accessible AI assistance.
- Clear distinction between AI-generated and human-created content.
- Intuitive natural language interface.
- Appropriate loading states for AI processing.
- Feedback mechanisms to improve AI accuracy.

#### Backend Implementation

**API Endpoints:**
- `POST /api/v1/ai/query` (natural language query endpoint)
- `GET /api/v1/ai/insights/{moduleType}/{entityId}` (get insights for specific entity)
- `POST /api/v1/ai/feedback` (submit feedback on AI suggestions)
- `GET /api/v1/ai/settings` (get user AI preferences)
- `PUT /api/v1/ai/settings` (update user AI preferences)

**Data Model (Prisma Schema - `ai_framework.prisma` - conceptual):**
```prisma
model AIQuery {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  query               String
  context             Json?     // Module, entity, and other context information
  response            Json?
  feedback            AIFeedback?
  processingTime      Int?      // In milliseconds
  createdAt           DateTime  @default(now())
}

model AIInsight {
  id                  String    @id @default(cuid())
  moduleType          String    // e.g., "Project", "Schedule", "Finance"
  entityId            String    // ID of the entity this insight relates to
  insightType         String    // e.g., "Risk", "Optimization", "Anomaly"
  title               String
  description         String
  confidence          Float     // 0-1 confidence score
  data                Json?     // Supporting data for the insight
  isRead              Boolean   @default(false)
  isActioned          Boolean   @default(false)
  feedback            AIFeedback?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@unique([moduleType, entityId, insightType])
}

model AIFeedback {
  id                  String    @id @default(cuid())
  queryId             String?   @unique
  query               AIQuery?  @relation(fields: [queryId], references: [id])
  insightId           String?   @unique
  insight             AIInsight? @relation(fields: [insightId], references: [id])
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  rating              Int       // 1-5 rating
  comments            String?
  createdAt           DateTime  @default(now())
}

model AIUserSettings {
  id                  String    @id @default(cuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id])
  enableAssistant     Boolean   @default(true)
  enableInsights      Boolean   @default(true)
  enableSuggestions   Boolean   @default(true)
  preferredModel      String?   // Preferred AI model if multiple are available
  updatedAt           DateTime  @updatedAt
}
```

**Business Logic:**
- Integration with OpenRouter API or Claude API for AI capabilities.
- Context-aware AI query processing.
- Automated insight generation for various module entities.
- Feedback collection and processing for AI improvement.
- User preference management for AI features.

**Security & Permissions:**
- Secure handling of potentially sensitive data in AI queries.
- Permission-based filtering of AI insights.
- Rate limiting for AI API usage.
- Audit trail for AI interactions.

**Integration Points:**
- **All Module Services**: For context-specific AI capabilities.
- **User Service**: For user preferences and permissions.
- **OpenRouter/Claude API**: External integration for AI processing.
- **Activity Service**: For audit trails.

### CX Chatbot

#### Frontend Implementation

**Key Components:**
- `ChatbotWidget.tsx`: Floating chat widget accessible from all pages.
- `ChatInterface.tsx`: The main chat interface for user interactions.
- `ChatbotTutorialLauncher.tsx`: Component to initiate guided tutorials.
- `ChatbotFeedbackForm.tsx`: Form for collecting user feedback on chatbot interactions.
- `ChatbotSettingsPanel.tsx`: User preferences for chatbot behavior.

**State Management:**
- React Query for chat history and responses.
- Zustand for chat interface state, tutorial progress, and UI interactions.

**API Interactions:**
- Sending user messages to the chatbot service.
- Fetching chatbot responses and suggestions.
- Initiating and progressing through guided tutorials.
- Providing feedback on chatbot interactions.
- Managing chatbot preferences.

**UI/UX Considerations:**
- Unobtrusive but easily accessible chat widget.
- Natural conversation flow with appropriate response timing.
- Clear guided tutorial experience with step-by-step instructions.
- Visual indicators for chatbot "thinking" and processing.
- Option to minimize or expand the chat interface.

#### Backend Implementation

**API Endpoints:**
- `POST /api/v1/chatbot/message` (send user message)
- `GET /api/v1/chatbot/history` (get chat history)
- `POST /api/v1/chatbot/tutorial/start` (start a guided tutorial)
- `POST /api/v1/chatbot/tutorial/progress` (update tutorial progress)
- `POST /api/v1/chatbot/feedback` (submit feedback)
- `GET /api/v1/chatbot/settings` (get user chatbot preferences)
- `PUT /api/v1/chatbot/settings` (update user chatbot preferences)

**Data Model (Prisma Schema - `chatbot.prisma` - conceptual):**
```prisma
model ChatSession {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  messages            ChatMessage[]
  context             Json?     // Current session context (module, entity, etc.)
  activeTutorialId    String?
  activeTutorial      ChatbotTutorial? @relation(fields: [activeTutorialId], references: [id])
  startedAt           DateTime  @default(now())
  lastActivityAt      DateTime  @updatedAt
}

model ChatMessage {
  id                  String    @id @default(cuid())
  sessionId           String
  session             ChatSession @relation(fields: [sessionId], references: [id])
  isFromUser          Boolean
  content             String
  attachments         Json?     // Links, images, or other attachments
  timestamp           DateTime  @default(now())
}

model ChatbotTutorial {
  id                  String    @id @default(cuid())
  name                String
  description         String
  moduleType          String?   // Specific module this tutorial relates to
  steps               Json      // Array of tutorial steps
  activeSessions      ChatSession[]
  completions         ChatbotTutorialCompletion[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model ChatbotTutorialCompletion {
  id                  String    @id @default(cuid())
  tutorialId          String
  tutorial            ChatbotTutorial @relation(fields: [tutorialId], references: [id])
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  completedAt         DateTime  @default(now())
  feedback            Int?      // 1-5 rating
  comments            String?
  
  @@unique([tutorialId, userId])
}

model ChatbotUserSettings {
  id                  String    @id @default(cuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id])
  enableChatbot       Boolean   @default(true)
  showTutorialPrompts Boolean   @default(true)
  preferredLanguage   String    @default("en")
  updatedAt           DateTime  @updatedAt
}

model ChatbotKnowledgeBase {
  id                  String    @id @default(cuid())
  topic               String
  content             String
  moduleType          String?   // Specific module this knowledge relates to
  tags                String[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

**Business Logic:**
- Integration with OpenRouter API or Claude API for chatbot capabilities.
- Context-aware conversation management.
- Guided tutorial system with step tracking.
- Knowledge base for answering common questions.
- User preference management for chatbot features.

**Security & Permissions:**
- Secure handling of user conversations.
- Permission-based access to module-specific tutorials.
- Rate limiting for chatbot interactions.
- Audit trail for chatbot usage.

**Integration Points:**
- **All Module Services**: For context-specific help and tutorials.
- **User Service**: For user preferences and permissions.
- **OpenRouter/Claude API**: External integration for chatbot intelligence.
- **Activity Service**: For audit trails.

### Authentication and Authorization System

#### Frontend Implementation

**Key Components:**
- `LoginPage.tsx`: Main login interface with various authentication methods.
- `RegistrationPage.tsx`: User registration form for new accounts.
- `ForgotPasswordFlow.tsx`: Password recovery workflow.
- `MFASetupPage.tsx`: Multi-factor authentication setup interface.
- `UserProfilePage.tsx`: User profile management with security settings.
- `CompanySwitcher.tsx`: Interface for switching between companies for users with multiple affiliations.
- `PermissionsManager.tsx`: Admin interface for managing roles and permissions.

**State Management:**
- React Query for user data and permissions.
- Zustand for authentication state, form state, and UI interactions.

**API Interactions:**
- User authentication with various methods.
- User registration and profile management.
- Password reset and recovery.
- MFA setup and verification.
- Company context switching.
- Role and permission management.

**UI/UX Considerations:**
- Clear and secure login experience.
- Intuitive MFA setup and verification.
- Seamless company switching for users with multiple affiliations.
- Comprehensive but understandable permission management for admins.
- Secure password management with appropriate strength indicators.

#### Backend Implementation

**API Endpoints:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/mfa/setup`
- `POST /api/v1/auth/mfa/verify`
- `GET /api/v1/auth/user`
- `PUT /api/v1/auth/user`
- `POST /api/v1/auth/company/switch`
- `GET /api/v1/auth/permissions`
- `POST /api/v1/auth/roles` (admin only)

**Data Model (Prisma Schema - `auth.prisma` - conceptual):**
```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  passwordHash        String?
  firstName           String?
  lastName            String?
  phone               String?
  isActive            Boolean   @default(true)
  lastLogin           DateTime?
  companies           UserCompany[]
  roles               UserRole[]
  mfaEnabled          Boolean   @default(false)
  mfaSecret           String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model UserCompany {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  role                String    // Company-level role
  isActive            Boolean   @default(true)
  isDefault           Boolean   @default(false)
  joinedAt            DateTime  @default(now())
  
  @@unique([userId, companyId])
}

model Company {
  id                  String    @id @default(cuid())
  name                String
  description         String?
  address             String?
  phone               String?
  email               String?
  website             String?
  logo                String?
  users               UserCompany[]
  roles               Role[]
  subscription        Subscription?
  isActive            Boolean   @default(true)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model Role {
  id                  String    @id @default(cuid())
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  isSystem            Boolean   @default(false) // System-defined vs custom
  permissions         Permission[]
  users               UserRole[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@unique([companyId, name])
}

model Permission {
  id                  String    @id @default(cuid())
  module              String    // e.g., "Projects", "Documents"
  action              String    // e.g., "create", "read", "update", "delete"
  description         String?
  roles               Role[]
  createdAt           DateTime  @default(now())
  
  @@unique([module, action])
}

model UserRole {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  roleId              String
  role                Role      @relation(fields: [roleId], references: [id])
  projectId           String?   // Optional project context
  assignedAt          DateTime  @default(now())
  assignedBy          String    // UserId
  
  @@unique([userId, roleId, projectId])
}

model Subscription {
  id                  String    @id @default(cuid())
  companyId           String    @unique
  company             Company   @relation(fields: [companyId], references: [id])
  plan                String    // e.g., "Free", "Basic", "Professional", "Enterprise"
  status              SubscriptionStatus @default(ACTIVE)
  startDate           DateTime  @default(now())
  endDate             DateTime?
  billingCycle        String?   // e.g., "Monthly", "Annual"
  price               Decimal?
  currency            String    @default("USD")
  maxUsers            Int?
  maxProjects         Int?
  features            Json?     // Enabled features based on plan
  paymentMethod       Json?     // Payment method details
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
  TRIAL
}
```

**Business Logic:**
- User authentication with email/password and optional MFA.
- JWT token generation and validation.
- Password hashing and security.
- Role-based access control at company and project levels.
- Company context management for users with multiple affiliations.
- Subscription plan enforcement and feature access control.

**Security & Permissions:**
- Secure password handling with proper hashing.
- Multi-factor authentication support.
- JWT with appropriate expiration and refresh mechanisms.
- Comprehensive permission checking for all API endpoints.
- Audit logging for security-related events.

**Integration Points:**
- **All Module Services**: For permission enforcement.
- **Company Service**: For company context and subscription features.
- **Project Service**: For project-specific roles and permissions.
- **Notification Service**: For security alerts and notifications.
- **Activity Service**: For security audit trails.

### Subscription and Onboarding System

#### Frontend Implementation

**Key Components:**
- `LandingPage.tsx`: Main marketing page with feature highlights and pricing.
- `PricingPage.tsx`: Detailed pricing information and plan comparison.
- `SubscriptionSelectionPage.tsx`: Interface for selecting a subscription plan.
- `PaymentProcessingPage.tsx`: Secure payment information collection and processing.
- `CompanyRegistrationForm.tsx`: Form for setting up a new company account.
- `UserOnboardingFlow.tsx`: Step-by-step onboarding for new users.
- `ProjectSetupWizard.tsx`: Guided project creation based on subscription limits.
- `AccountManagementDashboard.tsx`: Interface for managing subscription and billing.

**State Management:**
- React Query for subscription data and plan information.
- Zustand for onboarding flow state, form state, and UI interactions.

**API Interactions:**
- Fetching subscription plans and pricing.
- Processing subscription payments.
- Company registration and setup.
- User invitation and onboarding.
- Project creation within subscription limits.
- Subscription management and billing.

**UI/UX Considerations:**
- Clear presentation of subscription plans and features.
- Secure and intuitive payment processing.
- Guided onboarding experience for new users.
- Streamlined project creation process.
- Comprehensive account management dashboard.

#### Backend Implementation

**API Endpoints:**
- `GET /api/v1/subscription/plans`
- `POST /api/v1/subscription/subscribe`
- `POST /api/v1/companies` (company registration)
- `POST /api/v1/companies/{companyId}/invite-users`
- `GET /api/v1/companies/{companyId}/subscription`
- `PUT /api/v1/companies/{companyId}/subscription` (change plan)
- `POST /api/v1/projects` (with subscription limit checks)
- `GET /api/v1/account/billing`

**Data Model:**
- Uses the `Subscription` and related models from the Authentication system.

**Business Logic:**
- Subscription plan management with feature sets.
- Payment processing integration.
- Company registration and initial setup.
- User invitation and permission assignment.
- Enforcement of subscription limits (users, projects, features).
- Billing cycle management and renewal processing.

**Security & Permissions:**
- Secure handling of payment information.
- Role-based access to subscription management.
- Validation of subscription limits for resource creation.
- Audit trail for subscription changes and billing events.

**Integration Points:**
- **Authentication Service**: For user and company management.
- **Projects Service**: For enforcing project limits.
- **Payment Gateway**: External integration for payment processing.
- **Email Service**: For sending invitations and billing notifications.
- **Activity Service**: For audit trails.

This completes the detailed implementation plan for all 23 modules and cross-cutting components of the ConstructX SaaS application.
