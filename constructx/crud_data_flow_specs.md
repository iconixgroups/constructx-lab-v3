# ConstructX: Detailed CRUD and Data Flow Specifications

This document outlines the detailed Create, Read, Update, Delete (CRUD) operations and data flow specifications for each of the 23 modules in the ConstructX SaaS application. These specifications will guide the full implementation of frontend and backend components.

## General Principles

- **API**: All operations will be exposed via RESTful API endpoints.
- **Authentication**: All endpoints require authentication (JWT).
- **Authorization**: Role-Based Access Control (RBAC) will be applied to all operations based on user roles within the company and project.
- **Validation**: Input data will be validated on both frontend and backend.
- **Data Flow**: Data changes in one module may trigger updates or notifications in related modules (e.g., task completion updates project progress).
- **AI Integration**: CRUD operations will provide data for AI analysis and suggestions.

## Module Specifications

### 1. Leads Management

- **Entities**: Lead, Contact, Company (Client)
- **CRUD Operations**:
  - **Lead**: Create, Read (List, Details), Update (Status, Details), Delete
  - **Contact**: Create, Read, Update, Delete (associated with Lead/Company)
  - **Company**: Create, Read, Update, Delete (Client companies)
- **Data Flow**:
  - Lead creation captures contact and company info.
  - Lead status updates (e.g., Qualified, Unqualified, Converted).
  - Conversion of Lead to Project (triggers Project creation).
- **API Endpoints**: `/api/leads`, `/api/leads/{id}`, `/api/contacts`, `/api/companies`
- **RBAC**: Sales roles manage leads.

### 2. Bids Management

- **Entities**: Bid, BidItem, Vendor
- **CRUD Operations**:
  - **Bid**: Create, Read (List, Details), Update (Status, Details), Delete
  - **BidItem**: Create, Read, Update, Delete (within a Bid)
  - **Vendor**: Create, Read, Update, Delete
- **Data Flow**:
  - Bid creation links to Project/Lead.
  - Vendors submit bids (potentially via a portal or manual entry).
  - Bid status updates (e.g., Submitted, Awarded, Rejected).
  - Awarded bid links to Contracts/Purchase Orders.
- **API Endpoints**: `/api/bids`, `/api/bids/{id}`, `/api/bids/{id}/items`, `/api/vendors`
- **RBAC**: Estimator/Project Manager roles manage bids.

### 3. Contracts Management

- **Entities**: Contract, ContractClause, ContractVersion
- **CRUD Operations**:
  - **Contract**: Create (from template/bid), Read (List, Details), Update (Status, Details), Delete
  - **ContractClause**: Create, Read, Update, Delete (within a Contract)
  - **ContractVersion**: Create (on update), Read
- **Data Flow**:
  - Contract creation links to Project, Client, Vendor.
  - Versioning tracks changes during negotiation.
  - Contract status updates (e.g., Draft, Sent, Signed, Executed).
  - Signed contract triggers project phase updates.
- **API Endpoints**: `/api/contracts`, `/api/contracts/{id}`, `/api/contracts/{id}/versions`
- **RBAC**: Legal/Project Manager roles manage contracts.

### 4. Projects Management

- **Entities**: Project, ProjectPhase, ProjectMember
- **CRUD Operations**:
  - **Project**: Create, Read (List, Details), Update (Status, Details, Dates), Delete
  - **ProjectPhase**: Create, Read, Update, Delete (within a Project)
  - **ProjectMember**: Create (Add Member), Read, Update (Role), Delete (Remove Member)
- **Data Flow**:
  - Project creation links to Client, Contract.
  - Project status updates (e.g., Planning, Active, On Hold, Completed).
  - Adding/removing members controls access to project data.
  - Project progress calculated based on Tasks/Phases.
- **API Endpoints**: `/api/projects`, `/api/projects/{id}`, `/api/projects/{id}/phases`, `/api/projects/{id}/members`
- **RBAC**: Project Managers manage projects, Team Members have read/update access based on role.

### 5. Team Management

- **Entities**: User, Role, Permission, Team
- **CRUD Operations**:
  - **User**: Invite, Read (List, Details), Update (Profile, Role), Deactivate
  - **Role**: Create, Read, Update (Permissions), Delete
  - **Team**: Create, Read, Update (Members), Delete (within a Project/Company)
- **Data Flow**:
  - User invitation sends email.
  - Role assignment determines user permissions across modules.
  - Team assignment links users to specific projects.
- **API Endpoints**: `/api/users`, `/api/users/{id}`, `/api/roles`, `/api/teams`
- **RBAC**: Admins/Project Managers manage teams and roles.

### 6. Schedule Management

- **Entities**: Schedule, Task, Milestone, Dependency
- **CRUD Operations**:
  - **Schedule**: Read (Project Schedule), Update (Baselines)
  - **Task**: Create, Read, Update (Status, Dates, Assignee, Progress), Delete
  - **Milestone**: Create, Read, Update, Delete
  - **Dependency**: Create (Link Tasks), Read, Delete
- **Data Flow**:
  - Tasks and Milestones define the project timeline.
  - Dependencies create relationships (Finish-Start, Start-Start, etc.).
  - Task updates automatically adjust schedule (forward/backward pass).
  - Schedule view (Gantt, Calendar) reflects task data.
- **API Endpoints**: `/api/projects/{id}/schedule`, `/api/tasks`, `/api/tasks/{id}`, `/api/milestones`, `/api/dependencies`
- **RBAC**: Project Managers/Schedulers manage schedule, Team Members update assigned tasks.

### 7. Documents Management

- **Entities**: Document, Folder, DocumentVersion, DocumentComment, DocumentAccess
- **CRUD Operations**:
  - **Document**: Upload, Read (List, Details, Preview), Update (Metadata, Replace), Delete
  - **Folder**: Create, Read, Update (Rename), Delete
  - **DocumentVersion**: Create (on update/upload), Read
  - **DocumentComment**: Create, Read, Update, Delete
  - **DocumentAccess**: Create (Share), Read, Update (Permissions), Delete (Revoke)
- **Data Flow**:
  - Documents organized into folders per project.
  - Version history maintained for each document.
  - Comments allow collaboration.
  - Access control restricts visibility/editing.
  - AI analysis triggered on upload.
- **API Endpoints**: `/api/projects/{id}/documents`, `/api/documents/{id}`, `/api/folders`, `/api/documents/{id}/versions`, `/api/documents/{id}/comments`, `/api/documents/{id}/access`
- **RBAC**: Permissions managed per folder/document.

### 8. RFI Management

- **Entities**: RFI (Request for Information), RFIResponse, RFIAttachment
- **CRUD Operations**:
  - **RFI**: Create, Read (List, Details), Update (Status, Assignee), Delete
  - **RFIResponse**: Create, Read, Update, Delete
  - **RFIAttachment**: Upload, Read, Delete
- **Data Flow**:
  - RFI created and assigned to relevant party (e.g., Architect, Engineer).
  - Status tracking (e.g., Open, Pending, Answered, Closed).
  - Responses and attachments linked to RFI.
  - Potential impact on schedule/cost tracked.
- **API Endpoints**: `/api/projects/{id}/rfis`, `/api/rfis/{id}`, `/api/rfis/{id}/responses`
- **RBAC**: Project team creates RFIs, assigned parties respond.

### 9. Submittals Management

- **Entities**: Submittal, SubmittalItem, SubmittalReview, SubmittalAttachment
- **CRUD Operations**:
  - **Submittal**: Create, Read (List, Details), Update (Status), Delete
  - **SubmittalItem**: Create, Read, Update, Delete (within a Submittal)
  - **SubmittalReview**: Create, Read, Update (Status, Comments)
  - **SubmittalAttachment**: Upload, Read, Delete
- **Data Flow**:
  - Submittal package created (e.g., shop drawings, material data).
  - Assigned to reviewers (e.g., Architect, Engineer).
  - Review status tracking (e.g., Submitted, Under Review, Approved, Rejected, Revise & Resubmit).
  - Approval links to procurement/construction phases.
- **API Endpoints**: `/api/projects/{id}/submittals`, `/api/submittals/{id}`, `/api/submittals/{id}/reviews`
- **RBAC**: Contractors create submittals, Design team reviews.

### 10. Emails Management

- **Entities**: Email (linked to project), EmailThread
- **CRUD Operations**:
  - **Email**: Create (Send), Read (Inbox, Sent, Thread), Archive, Delete (Soft)
- **Data Flow**:
  - Integrate with user's email (OAuth) or provide project-specific email address.
  - Emails automatically linked to relevant project/contact.
  - Threading groups related emails.
  - Ability to link emails to Tasks, RFIs, etc.
- **API Endpoints**: `/api/projects/{id}/emails`, `/api/emails/{id}`
- **RBAC**: Users manage their linked emails within project context.

### 11. Approvals Management

- **Entities**: ApprovalRequest, ApprovalStep, ApprovalDecision
- **CRUD Operations**:
  - **ApprovalRequest**: Create (linked to Document, RFI, Change Order, etc.), Read, Update (Status), Cancel
  - **ApprovalStep**: Defined by workflow template
  - **ApprovalDecision**: Create (Approve/Reject/Request Changes), Read
- **Data Flow**:
  - Approval workflows defined (e.g., sequential, parallel).
  - Request routed to designated approvers.
  - Status tracking (e.g., Pending, Approved, Rejected).
  - Notifications sent to approvers/requester.
  - Final decision updates status of related item (e.g., Document, Change Order).
- **API Endpoints**: `/api/approval-requests`, `/api/approval-requests/{id}`, `/api/approval-workflows`
- **RBAC**: Based on defined workflow roles.

### 12. Payments Management

- **Entities**: Payment (Incoming/Outgoing), InvoiceLink, PaymentMethod
- **CRUD Operations**:
  - **Payment**: Create (Record Payment), Read (List, Details), Update (Status), Delete
  - **InvoiceLink**: Link payment to one or more invoices.
  - **PaymentMethod**: Create, Read, Update, Delete (e.g., Bank Transfer, Check, Credit Card)
- **Data Flow**:
  - Record payments received from clients or made to vendors/subcontractors.
  - Link payments to specific invoices.
  - Track payment status (e.g., Pending, Cleared, Failed).
  - Update invoice status based on payment.
  - Integrate with accounting systems (optional).
- **API Endpoints**: `/api/payments`, `/api/payments/{id}`, `/api/payment-methods`
- **RBAC**: Finance/Accounting roles manage payments.

### 13. Quotes Management

- **Entities**: Quote, QuoteItem, QuoteVersion
- **CRUD Operations**:
  - **Quote**: Create, Read (List, Details), Update (Status, Details), Delete
  - **QuoteItem**: Create, Read, Update, Delete (within a Quote)
  - **QuoteVersion**: Create (on update), Read
- **Data Flow**:
  - Create quotes for clients based on project scope/estimates.
  - Versioning for revisions.
  - Status tracking (e.g., Draft, Sent, Accepted, Rejected).
  - Accepted quote can generate Contract or Project Budget.
- **API Endpoints**: `/api/quotes`, `/api/quotes/{id}`, `/api/quotes/{id}/versions`
- **RBAC**: Sales/Estimator roles manage quotes.

### 14. Invoices Management

- **Entities**: Invoice, InvoiceItem, InvoicePaymentLink
- **CRUD Operations**:
  - **Invoice**: Create (Manual, From Progress), Read (List, Details), Update (Status, Details), Delete
  - **InvoiceItem**: Create, Read, Update, Delete
  - **InvoicePaymentLink**: Link invoice to payments.
- **Data Flow**:
  - Create client invoices based on contract terms, progress billing, or time/materials.
  - Track invoice status (e.g., Draft, Sent, Paid, Partially Paid, Overdue).
  - Link to received payments.
  - Generate reminders for overdue invoices.
- **API Endpoints**: `/api/invoices`, `/api/invoices/{id}`
- **RBAC**: Finance/Project Manager roles manage invoices.

### 15. Smart Logs Management (Daily Logs)

- **Entities**: DailyLog, LogEntry (Weather, Manpower, Equipment, Materials, Notes, Photos)
- **CRUD Operations**:
  - **DailyLog**: Create (for a specific date), Read (List, Details), Update, Submit
  - **LogEntry**: Create, Read, Update, Delete (within a DailyLog)
- **Data Flow**:
  - Site personnel create daily logs.
  - Record weather conditions (potentially automated), manpower count, equipment usage, material deliveries, work performed, safety incidents, general notes.
  - Attach photos.
  - Submit log for review/archiving.
  - Data feeds into reports and progress tracking.
- **API Endpoints**: `/api/projects/{id}/dailylogs`, `/api/dailylogs/{id}`
- **RBAC**: Site Superintendents/Foremen create logs, Project Managers review.

### 16. Inspections Management

- **Entities**: Inspection, Checklist, ChecklistItem, InspectionResult, InspectionIssue
- **CRUD Operations**:
  - **Inspection**: Create (Schedule), Read (List, Details), Update (Status, Details), Complete
  - **Checklist**: Create (Template), Read, Update, Delete
  - **ChecklistItem**: Create, Read, Update, Delete (within a Checklist)
  - **InspectionResult**: Record Pass/Fail/NA for ChecklistItems.
  - **InspectionIssue**: Create (linked to failed item), Read, Update (Status), Resolve
- **Data Flow**:
  - Schedule inspections based on project phase/requirements.
  - Use predefined checklists.
  - Record results during inspection (mobile friendly).
  - Create issues for failed items, link to Tasks or RFIs.
  - Track issue resolution.
- **API Endpoints**: `/api/projects/{id}/inspections`, `/api/inspections/{id}`, `/api/checklists`, `/api/inspection-issues`
- **RBAC**: QA/QC personnel, Site Superintendents perform inspections.

### 17. Material Management

- **Entities**: Material, PurchaseOrder, Delivery, MaterialInventory
- **CRUD Operations**:
  - **Material**: Create (Catalog), Read, Update, Delete
  - **PurchaseOrder**: Create, Read, Update (Status), Delete
  - **Delivery**: Create (Record Receipt), Read, Update
  - **MaterialInventory**: Read (Stock Levels), Update (Adjustments)
- **Data Flow**:
  - Maintain material catalog.
  - Create purchase orders for materials, link to Vendors.
  - Track PO status (e.g., Sent, Confirmed, Delivered).
  - Record material deliveries against POs.
  - Update inventory levels (optional).
  - Link materials to project tasks/budget.
- **API Endpoints**: `/api/materials`, `/api/purchase-orders`, `/api/deliveries`, `/api/inventory`
- **RBAC**: Procurement/Site personnel manage materials.

### 18. Equipment Management

- **Entities**: Equipment, EquipmentLog (Usage, Maintenance), EquipmentAssignment
- **CRUD Operations**:
  - **Equipment**: Create (Catalog), Read, Update, Delete
  - **EquipmentLog**: Create (Record Usage/Maintenance), Read
  - **EquipmentAssignment**: Create (Assign to Project/Task), Read, Update (Dates), Delete
- **Data Flow**:
  - Maintain equipment catalog (owned/rented).
  - Assign equipment to projects/tasks for specific periods.
  - Log usage hours/mileage.
  - Schedule and log maintenance.
  - Track equipment location and availability.
- **API Endpoints**: `/api/equipment`, `/api/equipment/{id}/logs`, `/api/equipment/{id}/assignments`
- **RBAC**: Fleet Managers/Site personnel manage equipment.

### 19. Site 360 Management

- **Entities**: SitePhoto, SiteVideo, 360Tour, SiteMapMarker
- **CRUD Operations**:
  - **SitePhoto/Video**: Upload, Read (Gallery, Map View), Update (Metadata, Tags), Delete
  - **360Tour**: Upload (link external), Read, Update, Delete
  - **SiteMapMarker**: Create (Link Photo/Video/Tour to map location), Read, Update, Delete
- **Data Flow**:
  - Upload photos/videos (potentially with GPS data).
  - Tag media with date, location, project phase, category.
  - Link media to specific locations on a site plan or map.
  - Create virtual 360 tours.
  - Provide visual progress documentation.
- **API Endpoints**: `/api/projects/{id}/media`, `/api/media/{id}`, `/api/projects/{id}/tours`, `/api/projects/{id}/mapmarkers`
- **RBAC**: Site personnel upload media, project team views.

### 20. Project Archives

- **Entities**: ArchivedProject, ArchivedDataSnapshot
- **CRUD Operations**:
  - **ArchivedProject**: Create (Archive Active Project), Read (List, Details), Restore (Unarchive), Delete (Permanent - restricted)
  - **ArchivedDataSnapshot**: Read (Access archived documents, logs, etc.)
- **Data Flow**:
  - When a project is completed, archive its data.
  - Archived data becomes read-only.
  - Ability to search and retrieve archived project information.
  - Restoration process moves data back to active state.
- **API Endpoints**: `/api/archived-projects`, `/api/archived-projects/{id}`
- **RBAC**: Admins/Project Managers archive/restore projects.

### 21. Operations & Manuals Management

- **Entities**: OandMManual, ManualSection, AssetLink
- **CRUD Operations**:
  - **OandMManual**: Create (per Project), Read, Update, Assemble, Export
  - **ManualSection**: Create (e.g., Warranties, Equipment Specs), Read, Update, Delete
  - **AssetLink**: Link sections/documents to specific building assets.
- **Data Flow**:
  - Compile O&M information during project closeout.
  - Link relevant documents (warranties, specs, drawings) into sections.
  - Associate information with specific building assets (e.g., HVAC unit, pump).
  - Export complete manual for client handover.
- **API Endpoints**: `/api/projects/{id}/om-manuals`, `/api/om-manuals/{id}/sections`
- **RBAC**: Project Managers/Closeout team manage manuals.

### 22. Facility Management

- **Entities**: Asset, WorkOrder, MaintenanceSchedule, FacilityTicket
- **CRUD Operations**:
  - **Asset**: Create (From O&M Manual/Manual Entry), Read, Update, Delete
  - **WorkOrder**: Create, Read, Update (Status, Assignee), Complete
  - **MaintenanceSchedule**: Create (Preventive), Read, Update, Trigger WorkOrder
  - **FacilityTicket**: Create (Report Issue), Read, Update (Status), Resolve
- **Data Flow**:
  - Manage building assets post-handover.
  - Schedule preventive maintenance.
  - Create and track work orders for repairs/maintenance.
  - Allow building occupants/managers to submit facility tickets.
  - Link work back to asset history and O&M manuals.
- **API Endpoints**: `/api/facilities/{id}/assets`, `/api/work-orders`, `/api/maintenance-schedules`, `/api/facility-tickets`
- **RBAC**: Facility Managers manage assets and work orders.

### 23. Reports Management

- **Entities**: Report, ReportTemplate, ReportSchedule
- **CRUD Operations**:
  - **Report**: Create (Generate from Template/Custom), Read (View, List), Export (PDF, CSV), Delete
  - **ReportTemplate**: Create, Read, Update, Delete
  - **ReportSchedule**: Create (Schedule Generation/Distribution), Read, Update, Delete
- **Data Flow**:
  - Generate reports based on data from various modules (e.g., Project Progress, Budget Variance, RFI Log).
  - Use predefined templates or build custom reports.
  - Schedule reports to be generated and emailed automatically.
  - Export reports in different formats.
- **API Endpoints**: `/api/reports`, `/api/report-templates`, `/api/report-schedules`
- **RBAC**: Project Managers/Admins create and manage reports.

---

This specification provides a foundation for implementing the full CRUD operations and data flows required for each module. Further details regarding specific fields, complex business logic, and UI interactions will be defined during the design and implementation phases.
