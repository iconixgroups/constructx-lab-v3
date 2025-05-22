# ConstructX Implementation Plan (Continued)

## 3. Contracts Management Module

### Frontend Implementation

**Key Components:**
- `ContractListPage.tsx`: Table view of contracts with filtering and sorting capabilities.
- `ContractForm.tsx`: Form for creating/editing contracts with sections for parties, terms, obligations, and milestones.
- `ContractDetailsPage.tsx`: Comprehensive view of a contract with all related information.
- `ContractVersionHistory.tsx`: Component to track and display contract revisions.
- `ContractApprovalWorkflow.tsx`: Visual representation of the approval process.
- `ContractObligationsTracker.tsx`: Timeline view of contract obligations and deadlines.
- `ChangeOrderForm.tsx`: Interface for creating and managing contract change orders.

**State Management:**
- React Query for contract data, versions, and approval status.
- Zustand for form state, approval workflow, and UI states.

**API Interactions:**
- CRUD operations for contracts and contract versions.
- Submitting contracts for approval.
- Managing contract obligations and milestones.
- Creating and processing change orders.
- Converting contracts to projects.

**UI/UX Considerations:**
- Clear presentation of complex legal terms and conditions.
- Visual timeline for contract milestones and obligations.
- Intuitive change order process with clear impact visualization.
- Document comparison tools for version differences.

**AI Integration (Frontend Aspects):**
- Display AI-identified contract risks and obligations.
- Show AI-extracted key dates and milestones.
- Present AI-generated contract summaries.
- Highlight AI-assessed impact of proposed changes.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/contracts`
- `POST /api/v1/contracts`
- `GET /api/v1/contracts/{contractId}`
- `PUT /api/v1/contracts/{contractId}`
- `GET /api/v1/contracts/{contractId}/versions`
- `POST /api/v1/contracts/{contractId}/versions`
- `POST /api/v1/contracts/{contractId}/submit-for-approval`
- `GET /api/v1/contracts/{contractId}/obligations`
- `POST /api/v1/contracts/{contractId}/change-orders`
- `GET /api/v1/contracts/{contractId}/change-orders`
- `POST /api/v1/contracts/{contractId}/convert-to-project`

**Data Model (Prisma Schema - `contracts.prisma` - conceptual):**
```prisma
model Contract {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  contractNumber  String    // Unique within company
  title           String
  description     String?
  clientId        String?
  clientName      String
  status          ContractStatus @default(DRAFT)
  value           Decimal
  currency        String    @default("USD")
  startDate       DateTime?
  endDate         DateTime?
  bidId           String?   @unique // Link to originating Bid
  bid             Bid?      @relation(fields: [bidId], references: [id])
  currentVersionId String?
  versions        ContractVersion[]
  obligations     ContractObligation[]
  changeOrders    ChangeOrder[]
  linkedProjectId String?   @unique
  documentPath    String?   // Path to the main contract document
  aiRiskScore     Float?
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  activities      Activity[]
}

model ContractVersion {
  id              String    @id @default(cuid())
  contractId      String
  contract        Contract  @relation(fields: [contractId], references: [id])
  versionNumber   Int
  terms           String?   // Could be rich text or path to document
  parties         Json?     // Array of involved parties and their roles
  approvalStatus  ApprovalStatus @default(PENDING)
  approvedBy      String?   // UserId if approved
  approvedAt      DateTime?
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
}

model ContractObligation {
  id              String    @id @default(cuid())
  contractId      String
  contract        Contract  @relation(fields: [contractId], references: [id])
  description     String
  dueDate         DateTime?
  responsibleParty String?
  status          ObligationStatus @default(PENDING)
  completedAt     DateTime?
  completedBy     String?   // UserId if completed
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ChangeOrder {
  id              String    @id @default(cuid())
  contractId      String
  contract        Contract  @relation(fields: [contractId], references: [id])
  changeOrderNumber String
  description     String
  valueChange     Decimal
  timeExtension   Int?      // Days
  status          ChangeOrderStatus @default(DRAFT)
  requestedBy     String    // UserId
  approvedBy      String?   // UserId if approved
  approvedAt      DateTime?
  effectiveDate   DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum ContractStatus {
  DRAFT
  PENDING_APPROVAL
  ACTIVE
  COMPLETED
  TERMINATED
  ARCHIVED
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ObligationStatus {
  PENDING
  COMPLETED
  OVERDUE
}

enum ChangeOrderStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
}
```

**Business Logic:**
- Contract numbering and versioning system.
- Approval workflow for contracts and change orders.
- Obligation tracking with deadline notifications.
- Change order impact calculation (value and schedule).
- Logic for converting contracts to Projects (respecting `contract-to-project` toggle).
- Document generation and management for contract documents.

**Security & Permissions:**
- RBAC for creating, viewing, editing, and approving contracts.
- Special permissions for financial terms and change orders.
- Secure handling of legal documents.
- Comprehensive audit trail for all contract activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Contract clause analysis and risk identification.
  - Obligation extraction from contract text.
  - Automated contract summary generation.
  - Change order impact assessment.
- Store AI outputs in the `Contract` model.

**Integration Points:**
- **Bids Service**: For creating contracts from awarded bids.
- **Projects Service**: For converting contracts to projects.
- **Documents Service**: For storing contract documents.
- **Approvals Service**: For contract approval workflows.
- **Notification Service**: For obligation deadlines and approval requests.
- **Activity Service**: For audit trails.

## 4. Projects Management Module

### Frontend Implementation

**Key Components:**
- `ProjectListPage.tsx`: Dashboard view of all projects with filtering and sorting.
- `ProjectSetupWizard.tsx`: Multi-step wizard for creating new projects.
- `ProjectDetailsPage.tsx`: Central hub for accessing all project information and modules.
- `ProjectDashboard.tsx`: Visual dashboard with key metrics, status, and recent activities.
- `ProjectSettingsPage.tsx`: Interface for configuring project settings and permissions.
- `ProjectTeamManagement.tsx`: Component for managing project team members and roles.
- `ProjectHealthIndicator.tsx`: Visual indicator of project health based on key metrics.

**State Management:**
- React Query for project data, metrics, and related entities.
- Zustand for wizard state, dashboard configuration, and UI states.

**API Interactions:**
- CRUD operations for projects.
- Fetching project metrics and health indicators.
- Managing project settings and configurations.
- Handling project team and company participation.
- Accessing cross-module project data.

**UI/UX Considerations:**
- Intuitive project navigation with clear module access.
- Visual dashboard with customizable widgets.
- Streamlined project setup process with templates.
- Clear indicators of project health and status.
- Mobile-responsive design for on-the-go access.

**AI Integration (Frontend Aspects):**
- Display AI-generated project health assessments.
- Show AI-identified risks and mitigation suggestions.
- Present AI-recommended resource optimizations.
- Highlight AI-generated progress insights.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{projectId}`
- `PUT /api/v1/projects/{projectId}`
- `GET /api/v1/projects/{projectId}/metrics`
- `GET /api/v1/projects/{projectId}/health`
- `GET /api/v1/projects/{projectId}/activities`
- `POST /api/v1/projects/{projectId}/companies` (add participating company)
- `GET /api/v1/projects/{projectId}/companies`
- `GET /api/v1/projects/{projectId}/settings`
- `PUT /api/v1/projects/{projectId}/settings`

**Data Model (Prisma Schema - `projects.prisma` - conceptual):**
```prisma
model Project {
  id              String    @id @default(cuid())
  companyId       String    // Owner company
  company         Company   @relation(fields: [companyId], references: [id])
  projectNumber   String    // Unique within company
  name            String
  description     String?
  clientId        String?
  clientName      String
  status          ProjectStatus @default(PLANNING)
  startDate       DateTime?
  targetEndDate   DateTime?
  actualEndDate   DateTime?
  contractId      String?   @unique // Link to originating Contract
  contract        Contract? @relation(fields: [contractId], references: [id])
  leadId          String?   @unique // Link to originating Lead
  lead            Lead?     @relation(fields: [leadId], references: [id])
  budget          Decimal?
  currency        String    @default("USD")
  location        String?
  gpsCoordinates  Json?     // {latitude, longitude}
  settings        Json?     // Project-specific settings
  moduleToggles   Json?     // Which modules are enabled
  aiHealthScore   Float?
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  activities      Activity[]
  // Relations to other module entities (e.g., documents, RFIs, etc.)
  documents       Document[]
  rfis            RFI[]
  submittals      Submittal[]
  // ... other relations
}

model ProjectCompany {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  role            String    // e.g., "General Contractor", "Subcontractor", "Architect"
  permissions     Json      // Company-level permissions for this project
  joinedAt        DateTime  @default(now())
  invitedBy       String    // UserId
  status          ParticipationStatus @default(ACTIVE)
  
  @@unique([projectId, companyId])
}

model ProjectUser {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  companyId       String    // The company context for this user in this project
  role            String    // Project-specific role
  permissions     Json      // User-specific permissions for this project
  assignedAt      DateTime  @default(now())
  assignedBy      String    // UserId
  
  @@unique([projectId, userId, companyId])
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum ParticipationStatus {
  INVITED
  ACTIVE
  INACTIVE
}
```

**Business Logic:**
- Project creation from templates or from scratch.
- Multi-company participation management with role-based permissions.
- Project status workflow with appropriate validations.
- Project health calculation based on schedule, budget, and issue metrics.
- Integration toggle management for module interactions.
- Cross-module data aggregation for dashboards and reporting.

**Security & Permissions:**
- Multi-level permission system:
  - Company-level permissions for project participation.
  - User-level permissions within project context.
  - Module-specific permissions.
- Strict data segregation between participating companies.
- Comprehensive audit trail for all project activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Project health monitoring and scoring.
  - Risk prediction and mitigation suggestions.
  - Resource optimization recommendations.
  - Automated progress analysis and reporting.
- Store AI outputs in the `Project` model.
- Scheduled background jobs for periodic AI analysis.

**Integration Points:**
- **Company Service**: For company participation management.
- **User Service**: For team member management.
- **Leads/Contracts Services**: For project creation from these sources.
- **All Module Services**: As the central hub, Projects integrates with all other modules.
- **Notification Service**: For project events and alerts.
- **Activity Service**: For comprehensive audit trails.

## 5. Team Management Module

### Frontend Implementation

**Key Components:**
- `TeamListPage.tsx`: Roster view of all team members with roles and contact info.
- `TeamMemberForm.tsx`: Form for adding/editing team members and their roles.
- `TeamRoleMatrix.tsx`: Visual matrix of team members and their permissions.
- `TeamAvailabilityCalendar.tsx`: Calendar view of team member availability.
- `TeamDirectoryPage.tsx`: Contact directory with search and filtering.
- `TeamOrgChart.tsx`: Visual organization chart of the project team.
- `TeamInvitationModal.tsx`: Interface for inviting new team members.

**State Management:**
- React Query for team data, roles, and availability.
- Zustand for form state, invitation workflow, and UI states.

**API Interactions:**
- CRUD operations for team members.
- Managing team roles and permissions.
- Sending and tracking invitations.
- Fetching availability and workload data.
- Accessing contact information.

**UI/UX Considerations:**
- Clear visualization of team structure and roles.
- Intuitive interface for permission management.
- Responsive design for mobile access to team directory.
- Visual indicators for team member availability and workload.
- Seamless invitation process for new team members.

**AI Integration (Frontend Aspects):**
- Display AI-suggested resource allocations.
- Show AI-recommended team compositions.
- Present AI-identified skills gaps.
- Highlight AI-suggested workload balancing.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/team`
- `POST /api/v1/projects/{projectId}/team`
- `GET /api/v1/projects/{projectId}/team/{userId}`
- `PUT /api/v1/projects/{projectId}/team/{userId}`
- `DELETE /api/v1/projects/{projectId}/team/{userId}`
- `POST /api/v1/projects/{projectId}/team/invite`
- `GET /api/v1/projects/{projectId}/team/roles`
- `PUT /api/v1/projects/{projectId}/team/roles`
- `GET /api/v1/projects/{projectId}/team/availability`
- `GET /api/v1/projects/{projectId}/team/directory`

**Data Model (Prisma Schema - `team.prisma` - conceptual):**
```prisma
// Note: Core team data is in ProjectUser model from Projects module
// This module adds additional team-specific data

model TeamMemberProfile {
  id              String    @id @default(cuid())
  projectUserId   String    @unique
  projectUser     ProjectUser @relation(fields: [projectUserId], references: [id])
  skills          String[]
  availability    Json?     // Availability patterns
  workload        Float?    // Current workload percentage
  contactPreferences Json?  // Preferred contact methods
  notes           String?
  aiInsights      Json?     // AI-generated insights about team member
  updatedAt       DateTime  @updatedAt
}

model TeamInvitation {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  email           String
  role            String
  companyId       String    // Company context for the invitation
  company         Company   @relation(fields: [companyId], references: [id])
  permissions     Json
  invitedBy       String    // UserId
  invitedAt       DateTime  @default(now())
  expiresAt       DateTime
  status          InvitationStatus @default(PENDING)
  acceptedAt      DateTime?
  acceptedBy      String?   // UserId if accepted
  
  @@unique([projectId, email, companyId])
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
}
```

**Business Logic:**
- Team member invitation and onboarding workflow.
- Role and permission management within project context.
- Team directory with contact information.
- Availability tracking and workload management.
- Skills tracking and team composition analysis.

**Security & Permissions:**
- RBAC for team management functions.
- Privacy controls for contact information.
- Secure invitation process with expiration and validation.
- Audit trail for all team changes and permission updates.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Resource allocation optimization.
  - Team composition recommendations based on project needs.
  - Skills gap analysis compared to project requirements.
  - Workload balancing suggestions.
- Store AI outputs in the `TeamMemberProfile` model.

**Integration Points:**
- **Projects Service**: For project context and basic team structure.
- **User Service**: For user information and authentication.
- **Company Service**: For company context and cross-company collaboration.
- **Schedule Service**: For availability and workload integration.
- **Notification Service**: For team invitations and updates.
- **Activity Service**: For audit trails.

## 6. Schedule Management Module

### Frontend Implementation

**Key Components:**
- `ScheduleGanttChart.tsx`: Interactive Gantt chart with dependencies and critical path.
- `ScheduleCalendarView.tsx`: Calendar view of schedule items by day/week/month.
- `ScheduleTaskForm.tsx`: Form for creating and editing schedule tasks.
- `ScheduleDependencyManager.tsx`: Interface for managing task dependencies.
- `ScheduleProgressTracker.tsx`: Component for updating and visualizing task progress.
- `ScheduleCriticalPathView.tsx`: Visual highlighting of the critical path.
- `ScheduleBaselineComparison.tsx`: Tool to compare current schedule against baseline.

**State Management:**
- React Query for schedule data, tasks, and dependencies.
- Zustand for Gantt chart interactions, form state, and UI states.

**API Interactions:**
- CRUD operations for schedule tasks.
- Managing task dependencies.
- Updating task progress and status.
- Calculating and fetching critical path.
- Creating and comparing schedule baselines.

**UI/UX Considerations:**
- Intuitive drag-and-drop interface for Gantt chart.
- Clear visualization of task dependencies and critical path.
- Responsive design with simplified mobile view.
- Visual indicators for task status, delays, and progress.
- Seamless switching between different schedule views.

**AI Integration (Frontend Aspects):**
- Display AI-suggested schedule optimizations.
- Show AI-predicted delay risks.
- Present AI-recommended resource leveling.
- Highlight AI-generated progress updates based on field data.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/schedule`
- `POST /api/v1/projects/{projectId}/schedule/tasks`
- `GET /api/v1/projects/{projectId}/schedule/tasks/{taskId}`
- `PUT /api/v1/projects/{projectId}/schedule/tasks/{taskId}`
- `DELETE /api/v1/projects/{projectId}/schedule/tasks/{taskId}`
- `POST /api/v1/projects/{projectId}/schedule/tasks/{taskId}/dependencies`
- `GET /api/v1/projects/{projectId}/schedule/critical-path`
- `POST /api/v1/projects/{projectId}/schedule/baselines`
- `GET /api/v1/projects/{projectId}/schedule/baselines`
- `GET /api/v1/projects/{projectId}/schedule/baselines/{baselineId}`

**Data Model (Prisma Schema - `schedule.prisma` - conceptual):**
```prisma
model Schedule {
  id              String    @id @default(cuid())
  projectId       String    @unique
  project         Project   @relation(fields: [projectId], references: [id])
  name            String    @default("Project Schedule")
  description     String?
  startDate       DateTime?
  endDate         DateTime?
  currentBaselineId String?
  baselines       ScheduleBaseline[]
  tasks           ScheduleTask[]
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ScheduleTask {
  id              String    @id @default(cuid())
  scheduleId      String
  schedule        Schedule  @relation(fields: [scheduleId], references: [id])
  name            String
  description     String?
  startDate       DateTime
  endDate         DateTime
  duration        Int       // In days
  progress        Float     @default(0) // 0-100%
  status          TaskStatus @default(NOT_STARTED)
  priority        TaskPriority @default(MEDIUM)
  assigneeId      String?   // UserId
  assigneeCompanyId String? // CompanyId
  parentTaskId    String?   // For hierarchical tasks
  parentTask      ScheduleTask? @relation("TaskHierarchy", fields: [parentTaskId], references: [id])
  subtasks        ScheduleTask[] @relation("TaskHierarchy")
  predecessors    TaskDependency[] @relation("TaskDependencyPredecessor")
  successors      TaskDependency[] @relation("TaskDependencySuccessor")
  isMilestone     Boolean   @default(false)
  isOnCriticalPath Boolean  @default(false)
  aiDelayRisk     Float?    // AI-predicted risk of delay (0-100%)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model TaskDependency {
  id              String    @id @default(cuid())
  predecessorId   String
  predecessor     ScheduleTask @relation("TaskDependencyPredecessor", fields: [predecessorId], references: [id])
  successorId     String
  successor       ScheduleTask @relation("TaskDependencySuccessor", fields: [successorId], references: [id])
  type            DependencyType @default(FINISH_TO_START)
  lag             Int       @default(0) // In days
  
  @@unique([predecessorId, successorId])
}

model ScheduleBaseline {
  id              String    @id @default(cuid())
  scheduleId      String
  schedule        Schedule  @relation(fields: [scheduleId], references: [id])
  name            String
  description     String?
  createdAt       DateTime  @default(now())
  createdBy       String    // UserId
  taskSnapshots   Json      // Snapshot of tasks at baseline creation
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  ON_HOLD
  DELAYED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum DependencyType {
  FINISH_TO_START
  START_TO_START
  FINISH_TO_FINISH
  START_TO_FINISH
}
```

**Business Logic:**
- Schedule creation and task management.
- Dependency management with different types (FS, SS, FF, SF).
- Critical path calculation and updates.
- Progress tracking and status updates.
- Baseline creation and comparison.
- Schedule impact analysis for delays and changes.

**Security & Permissions:**
- RBAC for schedule management functions.
- Special permissions for critical path and baseline management.
- Audit trail for all schedule changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Schedule optimization suggestions.
  - Delay risk prediction for tasks.
  - Resource leveling recommendations.
  - Automated progress updates based on field data.
- Store AI outputs in the `Schedule` and `ScheduleTask` models.
- Background jobs for periodic schedule analysis.

**Integration Points:**
- **Projects Service**: For project context and dates.
- **Team Service**: For task assignments and resource management.
- **Smart Logs Service**: For field progress data integration.
- **RFI Service**: For schedule impact from RFIs.
- **Notification Service**: For schedule updates and delay alerts.
- **Activity Service**: For audit trails.

## 7. Documents Management Module

### Frontend Implementation

**Key Components:**
- `DocumentExplorer.tsx`: File browser with folder structure and search.
- `DocumentUploader.tsx`: Drag-and-drop interface for file uploads.
- `DocumentViewer.tsx`: Preview component for various document types.
- `DocumentVersionHistory.tsx`: Interface to view and manage document versions.
- `DocumentMetadataEditor.tsx`: Form for editing document metadata and tags.
- `DocumentSearchResults.tsx`: Results display for document searches.
- `DocumentPermissionsManager.tsx`: Interface for managing document access.

**State Management:**
- React Query for document data, folders, and search results.
- Zustand for upload state, viewer state, and UI states.

**API Interactions:**
- CRUD operations for documents and folders.
- Uploading and downloading files.
- Managing document versions.
- Searching documents by content and metadata.
- Setting document permissions.

**UI/UX Considerations:**
- Intuitive file browser with familiar interactions.
- Seamless document preview for common file types.
- Responsive design for mobile document access.
- Progress indicators for uploads and downloads.
- Clear version history visualization.

**AI Integration (Frontend Aspects):**
- Display AI-suggested document classifications.
- Show AI-extracted content and metadata.
- Present AI-recommended similar documents.
- Enable natural language search queries.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/documents`
- `POST /api/v1/projects/{projectId}/documents`
- `GET /api/v1/projects/{projectId}/documents/{documentId}`
- `PUT /api/v1/projects/{projectId}/documents/{documentId}`
- `DELETE /api/v1/projects/{projectId}/documents/{documentId}`
- `POST /api/v1/projects/{projectId}/documents/{documentId}/versions`
- `GET /api/v1/projects/{projectId}/documents/{documentId}/versions`
- `GET /api/v1/projects/{projectId}/documents/search`
- `POST /api/v1/projects/{projectId}/documents/folders`
- `GET /api/v1/projects/{projectId}/documents/folders`
- `PUT /api/v1/projects/{projectId}/documents/{documentId}/permissions`

**Data Model (Prisma Schema - `documents.prisma` - conceptual):**
```prisma
model Document {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  companyId       String    // Owner company
  company         Company   @relation(fields: [companyId], references: [id])
  name            String
  description     String?
  folderId        String?
  folder          DocumentFolder? @relation(fields: [folderId], references: [id])
  currentVersionId String?
  versions        DocumentVersion[]
  metadata        Json?     // Custom metadata fields
  tags            String[]
  permissions     Json?     // Access permissions
  aiClassification String?
  aiTags          String[]
  aiInsights      Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model DocumentVersion {
  id              String    @id @default(cuid())
  documentId      String
  document        Document  @relation(fields: [documentId], references: [id])
  versionNumber   Int
  fileName        String
  fileSize        Int       // In bytes
  fileType        String    // MIME type
  storagePath     String    // Path in storage system
  uploadedBy      String    // UserId
  uploadedAt      DateTime  @default(now())
  comment         String?
}

model DocumentFolder {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  name            String
  description     String?
  parentFolderId  String?
  parentFolder    DocumentFolder? @relation("FolderHierarchy", fields: [parentFolderId], references: [id])
  subfolders      DocumentFolder[] @relation("FolderHierarchy")
  documents       Document[]
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Business Logic:**
- Document and folder management with hierarchical structure.
- Version control for documents.
- Metadata and tagging system.
- Full-text search capabilities.
- Document preview generation for common file types.
- Permission management for document access.

**Security & Permissions:**
- Document-level access controls.
- Watermarking for sensitive documents.
- Virus scanning for uploaded files.
- Download and access logging.
- Audit trail for all document activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Automatic document classification.
  - Content extraction and indexing.
  - Similar document suggestions.
  - Natural language processing for search.
- Store AI outputs in the `Document` model.
- Background jobs for document processing and analysis.

**Integration Points:**
- **Projects Service**: For project context.
- **Company Service**: For company ownership and permissions.
- **Storage Service**: For secure file storage and retrieval.
- **Search Service**: For document indexing and search.
- **Submittals/RFI Services**: For document references and attachments.
- **Activity Service**: For audit trails.

## 8. RFI (Request for Information) Management Module

### Frontend Implementation

**Key Components:**
- `RFIListPage.tsx`: Table view of RFIs with filtering and sorting.
- `RFIForm.tsx`: Form for creating and editing RFIs.
- `RFIDetailsPage.tsx`: Comprehensive view of an RFI with responses and history.
- `RFIResponseForm.tsx`: Interface for responding to RFIs.
- `RFIStatusTracker.tsx`: Visual indicator of RFI status and timeline.
- `RFIImpactAssessment.tsx`: Form for documenting schedule/cost impacts.
- `RFIRelatedDocuments.tsx`: Component showing linked documents and references.

**State Management:**
- React Query for RFI data, responses, and related documents.
- Zustand for form state, response workflow, and UI states.

**API Interactions:**
- CRUD operations for RFIs.
- Submitting and managing RFI responses.
- Linking RFIs to documents and other entities.
- Tracking RFI status and impact.
- Managing RFI distribution and notifications.

**UI/UX Considerations:**
- Clear visualization of RFI status and ball-in-court.
- Intuitive interface for attaching references and documents.
- Mobile-optimized forms for field RFI creation.
- Visual timeline of RFI history and responses.
- Seamless document viewer integration.

**AI Integration (Frontend Aspects):**
- Display AI-identified similar RFIs.
- Show AI-suggested responses based on historical data.
- Present AI-assessed schedule and cost impacts.
- Highlight AI-generated categorization and priority.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/rfis`
- `POST /api/v1/projects/{projectId}/rfis`
- `GET /api/v1/projects/{projectId}/rfis/{rfiId}`
- `PUT /api/v1/projects/{projectId}/rfis/{rfiId}`
- `POST /api/v1/projects/{projectId}/rfis/{rfiId}/responses`
- `GET /api/v1/projects/{projectId}/rfis/{rfiId}/responses`
- `POST /api/v1/projects/{projectId}/rfis/{rfiId}/documents`
- `GET /api/v1/projects/{projectId}/rfis/{rfiId}/documents`
- `POST /api/v1/projects/{projectId}/rfis/{rfiId}/impact`
- `GET /api/v1/projects/{projectId}/rfis/analytics`

**Data Model (Prisma Schema - `rfis.prisma` - conceptual):**
```prisma
model RFI {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  companyId       String    // Originating company
  company         Company   @relation(fields: [companyId], references: [id])
  rfiNumber       String    // Unique within project
  subject         String
  description     String
  category        String?
  priority        RFIPriority @default(MEDIUM)
  status          RFIStatus @default(DRAFT)
  dueDate         DateTime?
  assignedToCompanyId String?
  assignedToUserId String?
  responses       RFIResponse[]
  documents       RFIDocument[]
  impacts         RFIImpact?
  aiSimilarRFIs   Json?     // IDs of similar RFIs
  aiSuggestedResponse String?
  aiCategory      String?
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model RFIResponse {
  id              String    @id @default(cuid())
  rfiId           String
  rfi             RFI       @relation(fields: [rfiId], references: [id])
  response        String
  companyId       String    // Responding company
  company         Company   @relation(fields: [companyId], references: [id])
  respondedBy     String    // UserId
  respondedAt     DateTime  @default(now())
  attachments     RFIDocument[]
  isOfficial      Boolean   @default(false) // Whether this is the official response
}

model RFIDocument {
  id              String    @id @default(cuid())
  rfiId           String
  rfi             RFI       @relation(fields: [rfiId], references: [id])
  documentId      String
  document        Document  @relation(fields: [documentId], references: [id])
  responseId      String?
  response        RFIResponse? @relation(fields: [responseId], references: [id])
  addedBy         String    // UserId
  addedAt         DateTime  @default(now())
}

model RFIImpact {
  id              String    @id @default(cuid())
  rfiId           String    @unique
  rfi             RFI       @relation(fields: [rfiId], references: [id])
  scheduleImpact  Int?      // Days
  costImpact      Decimal?
  description     String?
  assessedBy      String    // UserId
  assessedAt      DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum RFIStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  RESPONDED
  CLOSED
  VOID
}

enum RFIPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

**Business Logic:**
- RFI numbering and tracking system.
- Workflow for RFI submission, routing, and response.
- Document attachment and reference management.
- Impact assessment for schedule and cost.
- Response tracking and official response designation.
- Analytics for response times and trends.

**Security & Permissions:**
- RBAC for RFI creation, viewing, and responding.
- Company-based permissions for multi-company collaboration.
- Audit trail for all RFI activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Similar RFI identification based on content.
  - Response suggestions based on historical data.
  - Impact analysis on schedule and cost.
  - Automatic categorization and priority assignment.
- Store AI outputs in the `RFI` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Company Service**: For company context and routing.
- **Documents Service**: For attachments and references.
- **Schedule Service**: For schedule impact integration.
- **Approvals Service**: For response approval workflows.
- **Notification Service**: For RFI alerts and reminders.
- **Activity Service**: For audit trails.

## 9. Submittals Management Module

### Frontend Implementation

**Key Components:**
- `SubmittalLogPage.tsx`: Table view of submittals with filtering and sorting.
- `SubmittalForm.tsx`: Form for creating and editing submittals.
- `SubmittalDetailsPage.tsx`: Comprehensive view of a submittal with review history.
- `SubmittalReviewForm.tsx`: Interface for reviewing and marking up submittals.
- `SubmittalStatusTracker.tsx`: Visual indicator of submittal status and timeline.
- `SubmittalSpecificationLink.tsx`: Component for linking submittals to specifications.
- `SubmittalBallInCourtIndicator.tsx`: Visual indicator of current responsible party.

**State Management:**
- React Query for submittal data, reviews, and related documents.
- Zustand for form state, review workflow, and UI states.

**API Interactions:**
- CRUD operations for submittals.
- Submitting and managing submittal reviews.
- Linking submittals to specifications and documents.
- Tracking submittal status and review cycles.
- Managing submittal distribution and notifications.

**UI/UX Considerations:**
- Clear visualization of submittal status and ball-in-court.
- Intuitive interface for document markup and annotations.
- Mobile-optimized forms for field submittal creation.
- Visual timeline of submittal history and review cycles.
- Seamless document viewer integration with markup tools.

**AI Integration (Frontend Aspects):**
- Display AI-assessed specification compliance.
- Show AI-identified similar submittals.
- Present AI-suggested review comments.
- Highlight AI-generated submittal register from specs.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/submittals`
- `POST /api/v1/projects/{projectId}/submittals`
- `GET /api/v1/projects/{projectId}/submittals/{submittalId}`
- `PUT /api/v1/projects/{projectId}/submittals/{submittalId}`
- `POST /api/v1/projects/{projectId}/submittals/{submittalId}/reviews`
- `GET /api/v1/projects/{projectId}/submittals/{submittalId}/reviews`
- `POST /api/v1/projects/{projectId}/submittals/{submittalId}/documents`
- `GET /api/v1/projects/{projectId}/submittals/{submittalId}/documents`
- `POST /api/v1/projects/{projectId}/submittals/register`
- `GET /api/v1/projects/{projectId}/submittals/analytics`

**Data Model (Prisma Schema - `submittals.prisma` - conceptual):**
```prisma
model Submittal {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  companyId       String    // Originating company
  company         Company   @relation(fields: [companyId], references: [id])
  submittalNumber String    // Unique within project
  title           String
  description     String?
  specificationSection String?
  type            SubmittalType
  status          SubmittalStatus @default(DRAFT)
  currentReviewCycle Int     @default(1)
  dueDate         DateTime?
  assignedToCompanyId String?
  assignedToUserId String?
  reviews         SubmittalReview[]
  documents       SubmittalDocument[]
  aiComplianceScore Float?  // AI-assessed compliance with specifications
  aiSimilarSubmittals Json? // IDs of similar submittals
  aiSuggestedComments String?
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model SubmittalReview {
  id              String    @id @default(cuid())
  submittalId     String
  submittal       Submittal @relation(fields: [submittalId], references: [id])
  reviewCycle     Int       @default(1)
  response        SubmittalResponse
  comments        String?
  companyId       String    // Reviewing company
  company         Company   @relation(fields: [companyId], references: [id])
  reviewedBy      String    // UserId
  reviewedAt      DateTime  @default(now())
  markups         Json?     // Stored markup data
  attachments     SubmittalDocument[]
}

model SubmittalDocument {
  id              String    @id @default(cuid())
  submittalId     String
  submittal       Submittal @relation(fields: [submittalId], references: [id])
  documentId      String
  document        Document  @relation(fields: [documentId], references: [id])
  reviewId        String?
  review          SubmittalReview? @relation(fields: [reviewId], references: [id])
  addedBy         String    // UserId
  addedAt         DateTime  @default(now())
}

enum SubmittalType {
  PRODUCT_DATA
  SHOP_DRAWING
  SAMPLE
  QUALITY_ASSURANCE
  DESIGN_DATA
  TEST_REPORT
  CERTIFICATE
  MANUFACTURER_INSTRUCTION
  OTHER
}

enum SubmittalStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  APPROVED_AS_NOTED
  REVISE_AND_RESUBMIT
  REJECTED
  CLOSED
}

enum SubmittalResponse {
  APPROVED
  APPROVED_AS_NOTED
  REVISE_AND_RESUBMIT
  REJECTED
  FOR_INFORMATION_ONLY
}
```

**Business Logic:**
- Submittal numbering and tracking system.
- Workflow for submittal submission, routing, and review.
- Document attachment and markup management.
- Review cycle tracking and response management.
- Specification section linking and compliance checking.
- Analytics for review times and trends.

**Security & Permissions:**
- RBAC for submittal creation, viewing, and reviewing.
- Company-based permissions for multi-company collaboration.
- Audit trail for all submittal activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Specification compliance checking.
  - Similar submittal identification.
  - Review comment suggestions based on historical data.
  - Automatic submittal register generation from specifications.
- Store AI outputs in the `Submittal` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Company Service**: For company context and routing.
- **Documents Service**: For attachments and references.
- **Schedule Service**: For deadline tracking.
- **Approvals Service**: For review approval workflows.
- **Notification Service**: For submittal alerts and reminders.
- **Activity Service**: For audit trails.

## 10. Emails Management Module

### Frontend Implementation

**Key Components:**
- `EmailInboxPage.tsx`: Email list view with filtering and search.
- `EmailComposer.tsx`: Interface for composing new emails with project context.
- `EmailViewerPage.tsx`: Detailed view of email with thread history.
- `EmailEntityLinker.tsx`: Component for linking emails to project entities.
- `EmailTemplateSelector.tsx`: Interface for selecting and using email templates.
- `EmailSearchResults.tsx`: Results display for email searches.
- `EmailThreadVisualizer.tsx`: Visual representation of email conversation threads.

**State Management:**
- React Query for email data, threads, and search results.
- Zustand for composer state, viewer state, and UI states.

**API Interactions:**
- CRUD operations for emails.
- Sending emails with project context.
- Linking emails to project entities.
- Searching and filtering emails.
- Managing email templates.

**UI/UX Considerations:**
- Familiar email client interface for easy adoption.
- Clear indication of project context in email composition.
- Intuitive linking of emails to relevant project entities.
- Responsive design for mobile email access.
- Thread visualization for conversation tracking.

**AI Integration (Frontend Aspects):**
- Display AI-categorized emails.
- Show AI-suggested response options.
- Present AI-extracted action items.
- Highlight AI-generated follow-up reminders.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/emails`
- `POST /api/v1/projects/{projectId}/emails`
- `GET /api/v1/projects/{projectId}/emails/{emailId}`
- `PUT /api/v1/projects/{projectId}/emails/{emailId}`
- `DELETE /api/v1/projects/{projectId}/emails/{emailId}`
- `POST /api/v1/projects/{projectId}/emails/{emailId}/links`
- `GET /api/v1/projects/{projectId}/emails/{emailId}/links`
- `GET /api/v1/projects/{projectId}/emails/search`
- `GET /api/v1/projects/{projectId}/emails/templates`
- `POST /api/v1/projects/{projectId}/emails/templates`

**Data Model (Prisma Schema - `emails.prisma` - conceptual):**
```prisma
model Email {
  id              String    @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  companyId       String    // Sending/receiving company
  company         Company   @relation(fields: [companyId], references: [id])
  subject         String
  body            String
  bodyHtml        String?
  from            String
  to              String[]
  cc              String[]
  bcc             String[]
  sentAt          DateTime?
  receivedAt      DateTime?
  isOutgoing      Boolean
  threadId        String?   // For grouping related emails
  parentEmailId   String?   // For replies
  parentEmail     Email?    @relation("EmailThread", fields: [parentEmailId], references: [id])
  replies         Email[]   @relation("EmailThread")
  attachments     EmailAttachment[]
  entityLinks     EmailEntityLink[]
  aiCategory      String?
  aiActionItems   Json?
  aiFollowUpDate  DateTime?
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model EmailAttachment {
  id              String    @id @default(cuid())
  emailId         String
  email           Email     @relation(fields: [emailId], references: [id])
  documentId      String
  document        Document  @relation(fields: [documentId], references: [id])
  fileName        String
  fileSize        Int       // In bytes
  contentType     String
  addedAt         DateTime  @default(now())
}

model EmailEntityLink {
  id              String    @id @default(cuid())
  emailId         String
  email           Email     @relation(fields: [emailId], references: [id])
  entityType      String    // e.g., "RFI", "Submittal", "Task"
  entityId        String
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  
  @@unique([emailId, entityType, entityId])
}

model EmailTemplate {
  id              String    @id @default(cuid())
  projectId       String?   // Null for company-wide templates
  project         Project?  @relation(fields: [projectId], references: [id])
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  name            String
  description     String?
  subject         String
  body            String
  bodyHtml        String?
  category        String?
  isGlobal        Boolean   @default(false)
  createdBy       String    // UserId
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Business Logic:**
- Email sending and receiving with project context.
- Email threading and conversation tracking.
- Entity linking to connect emails with relevant project entities.
- Email template management and usage.
- Email search and filtering capabilities.
- Attachment handling and storage.

**Security & Permissions:**
- RBAC for email access and management.
- Privacy controls for sensitive communications.
- Company-based email segregation.
- Audit trail for email activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Email categorization and priority assignment.
  - Response suggestions based on content and context.
  - Action item extraction from email content.
  - Follow-up reminder generation.
- Store AI outputs in the `Email` model.
- Background jobs for email analysis and processing.

**Integration Points:**
- **Projects Service**: For project context.
- **Company Service**: For company context and email segregation.
- **Documents Service**: For email attachments.
- **Various Entity Services**: For linking emails to entities (RFIs, Submittals, etc.).
- **External Email Provider**: For sending/receiving emails.
- **Activity Service**: For audit trails.
