# ConstructX Implementation Plan (Part 5)

## 16. Inspections Management Module

### Frontend Implementation

**Key Components:**
- `InspectionListPage.tsx`: Table or calendar view of scheduled and completed inspections.
- `InspectionTemplateManager.tsx`: Interface for creating and managing inspection templates and checklists.
- `InspectionForm.tsx`: Mobile-optimized form for conducting inspections, with checklist items, pass/fail toggles, and photo documentation.
- `InspectionDetailsPage.tsx`: View of a completed inspection with results and follow-up actions.
- `PhotoAnnotationTool.tsx`: Tool for marking up photos with annotations to highlight issues.
- `SignatureCapture.tsx`: Component for capturing electronic signatures to verify inspections.
- `InspectionReportGenerator.tsx`: Interface to generate formal inspection reports.

**State Management:**
- React Query for inspection data, templates, and history.
- Zustand for form state, photo annotation, signature capture, and UI interactions.

**API Interactions:**
- CRUD operations for inspections and templates.
- Managing checklist items and inspection criteria.
- Uploading and annotating photos.
- Capturing and storing electronic signatures.
- Generating inspection reports.

**UI/UX Considerations:**
- Mobile-optimized interface for field use.
- Intuitive checklist completion with clear pass/fail indicators.
- Seamless photo capture and annotation.
- Easy signature capture on touch devices.
- Clear visualization of inspection results and issues.

**AI Integration (Frontend Aspects):**
- Display AI-detected defects in inspection photos.
- Show AI-identified patterns in inspection failures.
- Present AI-optimized inspection scheduling suggestions.
- Enable automated report generation based on inspection data.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/inspections`
- `POST /api/v1/projects/{projectId}/inspections`
- `GET /api/v1/projects/{projectId}/inspections/{inspectionId}`
- `PUT /api/v1/projects/{projectId}/inspections/{inspectionId}`
- `GET /api/v1/projects/{projectId}/inspection-templates`
- `POST /api/v1/projects/{projectId}/inspection-templates`
- `POST /api/v1/projects/{projectId}/inspections/{inspectionId}/photos`
- `POST /api/v1/projects/{projectId}/inspections/{inspectionId}/signature`
- `GET /api/v1/projects/{projectId}/inspections/{inspectionId}/report` (generate)

**Data Model (Prisma Schema - `inspections.prisma` - conceptual):**
```prisma
model Inspection {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String    // Company conducting the inspection
  company             Company   @relation(fields: [companyId], references: [id])
  templateId          String?
  template            InspectionTemplate? @relation(fields: [templateId], references: [id])
  title               String
  description         String?
  location            String?
  scheduledDate       DateTime?
  completedDate       DateTime?
  status              InspectionStatus @default(SCHEDULED)
  result              InspectionResult?
  inspectedBy         String?   // UserId
  inspectedByUser     User?     @relation(fields: [inspectedBy], references: [id])
  items               InspectionItem[]
  photos              InspectionPhoto[]
  signature           String?   // Base64 encoded signature
  signatureDate       DateTime?
  signedBy            String?   // Name of person who signed
  notes               String?
  followUpActions     String?
  aiDefectDetection   Json?
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model InspectionTemplate {
  id                  String    @id @default(cuid())
  companyId           String    // Company that owns the template
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  category            String?
  isGlobal            Boolean   @default(false) // Whether it's available to all projects
  items               InspectionTemplateItem[]
  inspections         Inspection[]
  createdBy           String    // UserId
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model InspectionTemplateItem {
  id                  String    @id @default(cuid())
  templateId          String
  template            InspectionTemplate @relation(fields: [templateId], references: [id])
  itemNumber          Int
  description         String
  category            String?
  requiresPhoto       Boolean   @default(false)
  requiresComment     Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model InspectionItem {
  id                  String    @id @default(cuid())
  inspectionId        String
  inspection          Inspection @relation(fields: [inspectionId], references: [id])
  templateItemId      String?   // Optional link to template item
  itemNumber          Int
  description         String
  category            String?
  result              ItemResult?
  comment             String?
  photos              InspectionPhoto[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model InspectionPhoto {
  id                  String    @id @default(cuid())
  inspectionId        String
  inspection          Inspection @relation(fields: [inspectionId], references: [id])
  itemId              String?
  item                InspectionItem? @relation(fields: [itemId], references: [id])
  documentId          String    // Link to a Document entry
  document            Document  @relation(fields: [documentId], references: [id])
  annotations         Json?     // Stored annotations/markups
  caption             String?
  uploadedAt          DateTime  @default(now())
}

enum InspectionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum InspectionResult {
  PASS
  FAIL
  CONDITIONAL_PASS
}

enum ItemResult {
  PASS
  FAIL
  NOT_APPLICABLE
}
```

**Business Logic:**
- Inspection template management with reusable checklists.
- Scheduling and tracking of inspections.
- Mobile-friendly inspection process with checklist completion.
- Photo documentation with annotation capabilities.
- Electronic signature capture for verification.
- Report generation for completed inspections.
- Follow-up action tracking for failed items.

**Security & Permissions:**
- RBAC for creating templates, scheduling, and conducting inspections.
- Secure storage of inspection results and signatures.
- Tamper-evident records for compliance and legal protection.
- Audit trail for all inspection activities.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Defect recognition in inspection photos.
  - Pattern identification in inspection failures across projects.
  - Inspection schedule optimization based on risk factors and resource availability.
  - Automated report generation with highlighted issues and recommendations.
- Store AI insights in the `Inspection` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Schedule Service**: For inspection scheduling and resource allocation.
- **Documents Service**: For storing inspection photos and reports.
- **Smart Logs Service**: For linking daily activities to inspection findings.
- **Notification Service**: For alerts on scheduled inspections and failed items.
- **Activity Service**: For audit trails.

## 17. Material Management Module

### Frontend Implementation

**Key Components:**
- `MaterialListPage.tsx`: Table view of materials with status, quantities, and location.
- `MaterialForm.tsx`: Form for adding/editing material information, including specifications and procurement details.
- `MaterialDetailsPage.tsx`: Comprehensive view of a material, including procurement status, delivery tracking, and usage.
- `MaterialProcurementTracker.tsx`: Visual timeline of the procurement process (Ordered, Shipped, Delivered).
- `MaterialDeliveryScheduler.tsx`: Interface for scheduling and tracking material deliveries.
- `MaterialInventoryManager.tsx`: Tool for tracking material quantities on-site and in storage.
- `MaterialLocationMap.tsx`: Visual representation of material storage locations on site.

**State Management:**
- React Query for material data, procurement status, and inventory levels.
- Zustand for form state, delivery scheduling, and UI interactions.

**API Interactions:**
- CRUD operations for materials.
- Managing procurement status and delivery tracking.
- Updating inventory levels and material usage.
- Linking materials to submittals and specifications.
- Tracking material locations on site.

**UI/UX Considerations:**
- Clear visualization of procurement status and timeline.
- Easy interface for recording material receipts and usage.
- Mobile-friendly forms for on-site inventory management.
- Visual mapping of material storage locations.
- Alerts for low inventory or delayed deliveries.

**AI Integration (Frontend Aspects):**
- Display AI-predicted delivery delays.
- Show AI-suggested inventory optimization recommendations.
- Present AI-analyzed waste reduction opportunities.
- Highlight AI-generated material takeoffs from plans.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/materials`
- `POST /api/v1/projects/{projectId}/materials`
- `GET /api/v1/projects/{projectId}/materials/{materialId}`
- `PUT /api/v1/projects/{projectId}/materials/{materialId}`
- `POST /api/v1/projects/{projectId}/materials/{materialId}/procurement`
- `POST /api/v1/projects/{projectId}/materials/{materialId}/deliveries`
- `PUT /api/v1/projects/{projectId}/materials/{materialId}/inventory`
- `GET /api/v1/projects/{projectId}/materials/locations`

**Data Model (Prisma Schema - `materials.prisma` - conceptual):**
```prisma
model Material {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  companyId           String    // Company responsible for the material
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  category            String?
  specificationSection String?
  submittalId         String?   // Link to related submittal
  submittal           Submittal? @relation(fields: [submittalId], references: [id])
  unit                String    // e.g., "sq ft", "each", "cubic yard"
  estimatedQuantity   Decimal?
  receivedQuantity    Decimal   @default(0)
  usedQuantity        Decimal   @default(0)
  wastedQuantity      Decimal   @default(0)
  remainingQuantity   Decimal   @default(0)
  unitCost            Decimal?
  totalCost           Decimal?
  currency            String    @default("USD")
  status              MaterialStatus @default(PLANNED)
  procurement         MaterialProcurement?
  deliveries          MaterialDelivery[]
  locations           MaterialLocation[]
  aiDeliveryRisk      Float?
  aiWasteMetrics      Json?
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model MaterialProcurement {
  id                  String    @id @default(cuid())
  materialId          String    @unique
  material            Material  @relation(fields: [materialId], references: [id])
  supplierId          String?
  supplierName        String
  purchaseOrderNumber String?
  orderDate           DateTime?
  expectedDeliveryDate DateTime?
  actualDeliveryDate  DateTime?
  status              ProcurementStatus @default(PLANNED)
  notes               String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model MaterialDelivery {
  id                  String    @id @default(cuid())
  materialId          String
  material            Material  @relation(fields: [materialId], references: [id])
  deliveryDate        DateTime
  quantity            Decimal
  deliveryNumber      String?
  receivedBy          String?   // UserId
  notes               String?
  photos              Json?     // Array of Document IDs
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model MaterialLocation {
  id                  String    @id @default(cuid())
  materialId          String
  material            Material  @relation(fields: [materialId], references: [id])
  locationName        String
  quantity            Decimal
  coordinates         Json?     // {x, y} or {latitude, longitude}
  notes               String?
  updatedBy           String?   // UserId
  updatedAt           DateTime  @updatedAt
}

enum MaterialStatus {
  PLANNED
  ORDERED
  PARTIALLY_DELIVERED
  DELIVERED
  IN_USE
  DEPLETED
}

enum ProcurementStatus {
  PLANNED
  QUOTED
  ORDERED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Business Logic:**
- Material tracking throughout the procurement lifecycle.
- Inventory management with quantity tracking (estimated, received, used, wasted, remaining).
- Delivery scheduling and receipt documentation.
- Location tracking for materials on site.
- Integration with submittals for material approvals.
- Cost tracking and waste monitoring.

**Security & Permissions:**
- RBAC for material management functions.
- Special permissions for cost information.
- Audit trail for inventory changes and deliveries.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Delivery delay prediction based on supplier history and external factors.
  - Inventory optimization recommendations based on usage patterns and schedule.
  - Waste reduction analysis by comparing estimated vs. actual usage.
  - Automated material takeoff from uploaded plans and specifications.
- Store AI insights in the `Material` model.

**Integration Points:**
- **Projects Service**: For project context.
- **Submittals Service**: For material approval documentation.
- **Schedule Service**: For coordinating material needs with project timeline.
- **Documents Service**: For storing delivery photos and documentation.
- **Notification Service**: For alerts on low inventory, deliveries, and delays.
- **Activity Service**: For audit trails.

## 18. Equipment Management Module

### Frontend Implementation

**Key Components:**
- `EquipmentListPage.tsx`: Table view of equipment with status, allocation, and maintenance info.
- `EquipmentForm.tsx`: Form for adding/editing equipment information, including specifications and ownership details.
- `EquipmentDetailsPage.tsx`: Comprehensive view of equipment, including usage history, maintenance records, and current allocation.
- `EquipmentMaintenanceScheduler.tsx`: Interface for scheduling and tracking maintenance activities.
- `EquipmentReservationCalendar.tsx`: Calendar view for equipment reservations and allocations.
- `EquipmentLocationTracker.tsx`: Map or site plan showing current equipment locations.
- `EquipmentUtilizationChart.tsx`: Visual representation of equipment utilization over time.

**State Management:**
- React Query for equipment data, maintenance records, and reservations.
- Zustand for form state, reservation management, and UI interactions.

**API Interactions:**
- CRUD operations for equipment.
- Managing maintenance schedules and records.
- Creating and managing equipment reservations.
- Tracking equipment location and movements.
- Monitoring equipment utilization and performance.

**UI/UX Considerations:**
- Clear visualization of equipment availability and reservations.
- Easy interface for scheduling maintenance activities.
- Mobile-friendly forms for field updates on equipment status.
- Visual mapping of equipment locations on site.
- Alerts for maintenance due dates and equipment issues.

**AI Integration (Frontend Aspects):**
- Display AI-predicted maintenance needs.
- Show AI-optimized equipment allocation suggestions.
- Present AI-recommended equipment utilization improvements.
- Highlight AI-assessed failure risk warnings.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/equipment`
- `POST /api/v1/projects/{projectId}/equipment`
- `GET /api/v1/projects/{projectId}/equipment/{equipmentId}`
- `PUT /api/v1/projects/{projectId}/equipment/{equipmentId}`
- `POST /api/v1/projects/{projectId}/equipment/{equipmentId}/maintenance`
- `GET /api/v1/projects/{projectId}/equipment/{equipmentId}/maintenance`
- `POST /api/v1/projects/{projectId}/equipment/{equipmentId}/reservations`
- `GET /api/v1/projects/{projectId}/equipment/{equipmentId}/reservations`
- `PUT /api/v1/projects/{projectId}/equipment/{equipmentId}/location`

**Data Model (Prisma Schema - `equipment.prisma` - conceptual):**
```prisma
model Equipment {
  id                  String    @id @default(cuid())
  projectId           String?   // Optional if equipment is company-wide
  project             Project?  @relation(fields: [projectId], references: [id])
  companyId           String    // Company that owns or rents the equipment
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  category            String?
  type                String?
  manufacturer        String?
  model               String?
  serialNumber        String?
  identificationNumber String?  // Company-specific ID
  status              EquipmentStatus @default(AVAILABLE)
  ownership           OwnershipType
  rentalInfo          Json?     // If rented: {vendor, contract, startDate, endDate, cost}
  purchaseInfo        Json?     // If owned: {purchaseDate, cost, expectedLifespan}
  currentLocationId   String?
  currentLocation     EquipmentLocation? @relation("CurrentLocation", fields: [currentLocationId], references: [id])
  locations           EquipmentLocation[] @relation("LocationHistory")
  maintenanceRecords  EquipmentMaintenance[]
  reservations        EquipmentReservation[]
  utilization         Json?     // Historical utilization data
  aiMaintenancePrediction Json?
  aiFailureRisk       Float?
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model EquipmentLocation {
  id                  String    @id @default(cuid())
  equipmentId         String
  equipment           Equipment @relation("LocationHistory", fields: [equipmentId], references: [id])
  currentForEquipment Equipment[] @relation("CurrentLocation")
  locationName        String
  coordinates         Json?     // {x, y} or {latitude, longitude}
  movedAt             DateTime  @default(now())
  movedBy             String?   // UserId
  notes               String?
}

model EquipmentMaintenance {
  id                  String    @id @default(cuid())
  equipmentId         String
  equipment           Equipment @relation(fields: [equipmentId], references: [id])
  maintenanceType     MaintenanceType
  description         String
  scheduledDate       DateTime?
  completedDate       DateTime?
  status              MaintenanceStatus @default(SCHEDULED)
  performedBy         String?   // Person or company who performed maintenance
  cost                Decimal?
  notes               String?
  attachments         Json?     // Array of Document IDs
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model EquipmentReservation {
  id                  String    @id @default(cuid())
  equipmentId         String
  equipment           Equipment @relation(fields: [equipmentId], references: [id])
  startDate           DateTime
  endDate             DateTime
  requestedBy         String    // UserId
  requestedByUser     User      @relation(fields: [requestedBy], references: [id])
  purpose             String?
  status              ReservationStatus @default(REQUESTED)
  approvedBy          String?   // UserId
  approvedAt          DateTime?
  notes               String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum EquipmentStatus {
  AVAILABLE
  IN_USE
  UNDER_MAINTENANCE
  OUT_OF_SERVICE
  IN_TRANSIT
}

enum OwnershipType {
  OWNED
  RENTED
  LEASED
}

enum MaintenanceType {
  ROUTINE
  PREVENTIVE
  REPAIR
  INSPECTION
  CALIBRATION
}

enum MaintenanceStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum ReservationStatus {
  REQUESTED
  APPROVED
  DENIED
  CANCELLED
  COMPLETED
}
```

**Business Logic:**
- Equipment inventory management with detailed specifications.
- Maintenance scheduling and history tracking.
- Reservation system for equipment allocation.
- Location tracking for equipment on site.
- Utilization monitoring and reporting.
- Cost tracking for rentals, purchases, and maintenance.

**Security & Permissions:**
- RBAC for equipment management functions.
- Special permissions for cost information and maintenance records.
- Audit trail for equipment movements and status changes.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Predictive maintenance scheduling based on usage patterns and manufacturer recommendations.
  - Utilization optimization suggestions to maximize equipment efficiency.
  - Equipment allocation recommendations based on project needs and availability.
  - Failure risk assessment based on maintenance history and usage patterns.
- Store AI insights in the `Equipment` model.

**Integration Points:**
- **Projects Service**: For project context and equipment needs.
- **Schedule Service**: For coordinating equipment needs with project timeline.
- **Documents Service**: For storing maintenance records and documentation.
- **Team Service**: For equipment operators and maintenance personnel.
- **Notification Service**: For alerts on maintenance due dates and reservation approvals.
- **Activity Service**: For audit trails.

## 19. Site 360 Management Module

### Frontend Implementation

**Key Components:**
- `Site360ViewerPage.tsx`: Main viewer for 360° panoramic images with navigation controls.
- `Site360TimelineSlider.tsx`: Slider control to navigate through historical captures of the same location.
- `Site360CaptureUploader.tsx`: Interface for uploading and processing new 360° captures.
- `Site360AnnotationTools.tsx`: Tools for adding annotations, measurements, and notes to 360° images.
- `Site360MapNavigator.tsx`: Site plan or map interface for selecting viewing locations.
- `Site360ComparisonView.tsx`: Side-by-side comparison of the same location at different times.
- `Site360MobileCapture.tsx`: Mobile-optimized interface for capturing new 360° images on site.

**State Management:**
- React Query for 360° image data, locations, and annotations.
- Zustand for viewer state, annotation tools, and timeline navigation.

**API Interactions:**
- Fetching 360° panoramic images with progressive loading.
- Uploading and processing new 360° captures.
- Managing annotations and measurements.
- Navigating through spatial and temporal dimensions.
- Linking 360° views to site plans and project entities.

**UI/UX Considerations:**
- Smooth and intuitive navigation within 360° environments.
- Responsive viewer that works well on various devices.
- Easy-to-use annotation tools for highlighting issues or progress.
- Clear temporal navigation to track changes over time.
- Integration with site plans for spatial context.

**AI Integration (Frontend Aspects):**
- Display AI-tracked progress between captures.
- Show AI-detected objects and issues in the scene.
- Present AI-identified changes between temporal captures.
- Highlight AI-assessed site conditions and safety concerns.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/projects/{projectId}/site360/locations`
- `POST /api/v1/projects/{projectId}/site360/locations`
- `GET /api/v1/projects/{projectId}/site360/locations/{locationId}/captures`
- `POST /api/v1/projects/{projectId}/site360/captures`
- `GET /api/v1/projects/{projectId}/site360/captures/{captureId}`
- `POST /api/v1/projects/{projectId}/site360/captures/{captureId}/annotations`
- `GET /api/v1/projects/{projectId}/site360/captures/{captureId}/annotations`

**Data Model (Prisma Schema - `site360.prisma` - conceptual):**
```prisma
model Site360Location {
  id                  String    @id @default(cuid())
  projectId           String
  project             Project   @relation(fields: [projectId], references: [id])
  name                String
  description         String?
  coordinates         Json      // {x, y} or {latitude, longitude}
  floorLevel          Int?      // For multi-story buildings
  captures            Site360Capture[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model Site360Capture {
  id                  String    @id @default(cuid())
  locationId          String
  location            Site360Location @relation(fields: [locationId], references: [id])
  captureDate         DateTime
  capturedBy          String    // UserId
  capturedByUser      User      @relation(fields: [capturedBy], references: [id])
  imageUrl            String    // URL to the 360° image
  thumbnailUrl        String?   // URL to a thumbnail preview
  processingStatus    ProcessingStatus @default(PROCESSING)
  tilesetPath         String?   // Path to image tiles for progressive loading
  metadata            Json?     // Camera info, resolution, etc.
  annotations         Site360Annotation[]
  aiProgressData      Json?
  aiDetectedObjects   Json?
  aiChanges           Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model Site360Annotation {
  id                  String    @id @default(cuid())
  captureId           String
  capture             Site360Capture @relation(fields: [captureId], references: [id])
  type                AnnotationType
  position            Json      // {yaw, pitch} or {x, y, z}
  content             String?   // Text content of the annotation
  color               String?   // Color for visual distinction
  entityType          String?   // Optional link to another entity type (e.g., "Issue", "RFI")
  entityId            String?   // ID of the linked entity
  createdBy           String    // UserId
  createdByUser       User      @relation(fields: [createdBy], references: [id])
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum ProcessingStatus {
  UPLOADING
  PROCESSING
  COMPLETE
  FAILED
}

enum AnnotationType {
  MARKER
  TEXT
  MEASUREMENT
  ISSUE
  PROGRESS
  LINK
}
```

**Business Logic:**
- Management of 360° capture locations and their spatial relationships.
- Processing and storage of 360° panoramic images.
- Temporal organization of captures for the same location.
- Annotation system for marking points of interest, issues, or measurements.
- Progressive loading of high-resolution panoramas for performance.
- Linking annotations to other project entities (RFIs, Issues, etc.).

**Security & Permissions:**
- RBAC for viewing, capturing, and annotating 360° images.
- Secure storage for potentially sensitive site imagery.
- Watermarking options for exported views.
- Audit trail for captures and annotations.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Automatic progress tracking by comparing temporal captures.
  - Object and issue detection in 360° images.
  - Change detection between captures of the same location.
  - Automated site condition assessment.
- Store AI insights in the `Site360Capture` model.

**Integration Points:**
- **Projects Service**: For project context and site information.
- **Documents Service**: For storing and managing large image files.
- **RFI/Issues Services**: For linking annotations to relevant project issues.
- **Schedule Service**: For relating captures to project timeline and progress.
- **Team Service**: For capture permissions and annotation attribution.
- **Activity Service**: For audit trails.

## 20. Project Archives Module

### Frontend Implementation

**Key Components:**
- `ArchiveProjectsListPage.tsx`: Table view of archived projects with search and filtering.
- `ArchiveProjectDetailsPage.tsx`: Comprehensive view of an archived project with access to all preserved data.
- `ArchiveSearchInterface.tsx`: Advanced search interface for finding information across archived projects.
- `LessonsLearnedDatabase.tsx`: Interface for viewing and searching lessons learned from past projects.
- `ProjectComparisonTool.tsx`: Tool for comparing metrics and outcomes between archived projects.
- `KnowledgeExtractionInterface.tsx`: Interface for extracting and organizing knowledge from archived projects.

**State Management:**
- React Query for archived project data and search results.
- Zustand for search parameters, comparison selections, and UI states.

**API Interactions:**
- Searching and browsing archived projects.
- Accessing archived project documents and data.
- Extracting lessons learned and knowledge items.
- Comparing metrics between archived projects.
- Exporting archive data for reference.

**UI/UX Considerations:**
- Intuitive search interface for finding specific information in archives.
- Clear organization of archived project data for easy navigation.
- Visual comparison tools for project metrics and outcomes.
- Knowledge management features for capturing and sharing lessons learned.

**AI Integration (Frontend Aspects):**
- Display AI-extracted knowledge and insights from project history.
- Show AI-identified similar projects for reference.
- Present AI-analyzed success factors and patterns.
- Enable natural language querying of the project knowledge base.

### Backend Implementation

**API Endpoints:**
- `GET /api/v1/archives/projects`
- `GET /api/v1/archives/projects/{projectId}`
- `GET /api/v1/archives/search`
- `GET /api/v1/archives/lessons-learned`
- `POST /api/v1/archives/lessons-learned`
- `GET /api/v1/archives/compare` (with project IDs as parameters)
- `GET /api/v1/archives/knowledge-base`

**Data Model (Prisma Schema - `archives.prisma` - conceptual):**
```prisma
model ArchivedProject {
  id                  String    @id @default(cuid())
  originalProjectId   String    @unique // ID from the original Project
  companyId           String
  company             Company   @relation(fields: [companyId], references: [id])
  name                String
  description         String?
  clientName          String?
  projectNumber       String?
  startDate           DateTime?
  endDate             DateTime?
  archiveDate         DateTime  @default(now())
  archivedBy          String    // UserId
  archivedByUser      User      @relation(fields: [archivedBy], references: [id])
  status              String?   // Final status at archiving
  metrics             Json?     // Key project metrics at completion
  snapshot            Json?     // Complete snapshot of project data
  lessonsLearned      LessonLearned[]
  knowledgeItems      KnowledgeItem[]
  searchIndex         String?   // Indexed content for full-text search
  aiInsights          Json?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model LessonLearned {
  id                  String    @id @default(cuid())
  archivedProjectId   String
  archivedProject     ArchivedProject @relation(fields: [archivedProjectId], references: [id])
  category            String
  title               String
  description         String
  impact              String?
  recommendation      String?
  tags                String[]
  createdBy           String    // UserId
  createdByUser       User      @relation(fields: [createdBy], references: [id])
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model KnowledgeItem {
  id                  String    @id @default(cuid())
  archivedProjectId   String
  archivedProject     ArchivedProject @relation(fields: [archivedProjectId], references: [id])
  title               String
  content             String
  category            String?
  tags                String[]
  references          Json?     // Links to specific archived entities
  aiGenerated         Boolean   @default(false)
  createdBy           String    // UserId or "AI" for generated items
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

**Business Logic:**
- Archiving process for completed projects, preserving all relevant data.
- Full-text search indexing for archived content.
- Lessons learned collection and categorization.
- Knowledge extraction and organization from project history.
- Project comparison and metric analysis.
- Long-term storage optimization for archived data.

**Security & Permissions:**
- RBAC for accessing archived project data.
- Long-term access controls for compliance and reference.
- Immutable record keeping for audit purposes.
- Secure long-term storage with integrity verification.

**AI Integration (Backend Aspects):**
- Service methods to call AI API for:
  - Knowledge extraction from project history and documentation.
  - Identifying similar projects based on characteristics and outcomes.
  - Success factor analysis to identify patterns in successful projects.
  - Automated lessons learned compilation from project data.
- Store AI insights in the `ArchivedProject` and `KnowledgeItem` models.

**Integration Points:**
- **Projects Service**: For archiving completed projects.
- **Documents Service**: For long-term storage of project documents.
- **Search Service**: For indexing and searching archived content.
- **Company Service**: For company-specific archive access.
- **Activity Service**: For audit trails of archive access.

Continuing with other modules in subsequent steps...
