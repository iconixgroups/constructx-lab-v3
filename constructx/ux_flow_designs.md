# ConstructX: UX Flow Designs

This document outlines the key user experience (UX) flows for the modules requiring full implementation or enhancement in the ConstructX SaaS application.

## General UX Principles

- **Consistency**: Maintain consistent UI patterns, navigation, and interactions across all modules (using ShadcnUI).
- **Clarity**: Ensure clear information hierarchy, intuitive labeling, and actionable feedback.
- **Efficiency**: Streamline common tasks, minimize clicks, and provide quick access to relevant information.
- **Responsiveness**: Ensure seamless experience across desktop, tablet, and mobile devices.
- **Accessibility**: Adhere to WCAG 2.1 guidelines.
- **AI Integration**: Seamlessly integrate AI suggestions, contextual help, and chatbot access within relevant workflows.

## UX Flows by Module Group

### Pre-Construction (Leads, Bids, Contracts)

1.  **Lead Creation & Qualification Flow**:
    *   User (Sales) navigates to Leads module.
    *   Clicks "Create Lead".
    *   Fills lead details, contact info, company info.
    *   Saves lead (appears in list view).
    *   User updates lead status (e.g., New -> Contacted -> Qualified).
    *   AI suggests next steps or provides company insights.
    *   User converts qualified lead to Project (initiates Project creation flow).

2.  **Bid Creation & Submission Flow**:
    *   User (Estimator) navigates to Bids module.
    *   Creates a new Bid, linking it to a Project/Lead.
    *   Adds Bid Items (scope, quantity, estimated cost).
    *   Invites Vendors to bid.
    *   Vendors (potentially via portal or manual entry) submit their pricing.
    *   User compares bids, AI provides comparison insights.
    *   User updates Bid status (Awarded/Rejected).
    *   Awarded bid can initiate Contract creation.

3.  **Contract Creation & Execution Flow**:
    *   User (Legal/PM) creates a Contract (from template or linked Bid).
    *   Adds/edits clauses, links relevant documents.
    *   Sends contract for review/negotiation (versioning tracks changes).
    *   Receives feedback, updates contract (new version created).
    *   Sends final contract for signature (e-signature integration or manual status update).
    *   Updates status to Executed upon signing.

### Project Management Core (Projects, Team, Schedule, Documents)

1.  **Project Setup Flow**:
    *   User (PM) creates a new Project (potentially from a Lead).
    *   Enters project details (name, dates, budget, client).
    *   Assigns Project Manager and initial team members.
    *   Sets up initial project phases.
    *   Configures project settings (e.g., currency, units).

2.  **Team Assignment Flow**:
    *   User (PM/Admin) navigates to Team Management (global or project-specific).
    *   Invites new users to the company/project.
    *   Assigns roles (with predefined permissions) to users.
    *   Creates project-specific teams and assigns members.

3.  **Schedule Building Flow**:
    *   User (Scheduler/PM) navigates to Schedule module within a Project.
    *   Creates Tasks (name, duration, start/end dates).
    *   Creates Milestones.
    *   Assigns Tasks to team members.
    *   Creates Dependencies between tasks (drag-and-drop or selection).
    *   Views schedule in Gantt or Calendar view.
    *   AI suggests schedule optimizations or identifies risks.

4.  **Document Upload & Collaboration Flow**:
    *   User navigates to Documents module.
    *   Creates Folders to organize documents.
    *   Uploads a Document (drag-and-drop or file selection).
    *   Adds metadata (tags, description).
    *   AI analysis runs automatically (summary, key points).
    *   User shares document/folder with specific users/roles.
    *   Users add Comments to the document.
    *   User uploads a new version of the document.

### Communication & Approvals (RFI, Submittals, Emails, Approvals)

1.  **RFI Creation & Response Flow**:
    *   User (Site Team) creates an RFI, detailing the question and linking relevant documents/photos.
    *   Assigns RFI to the responsible party (e.g., Architect).
    *   Recipient receives notification.
    *   Recipient reviews RFI, adds response and attachments.
    *   User reviews response, updates status (Closed/Requires More Info).
    *   AI summarizes RFI impact.

2.  **Submittal Creation & Review Flow**:
    *   User (Contractor) creates a Submittal package, attaching relevant documents (shop drawings, etc.).
    *   Assigns Submittal to reviewers.
    *   Reviewers receive notification.
    *   Reviewers add comments and status (Approved, Rejected, Revise & Resubmit).
    *   User receives notification of review outcome.

3.  **Approval Workflow Flow**:
    *   User initiates an Approval Request linked to an item (Document, Change Order, etc.).
    *   Selects an Approval Workflow template.
    *   Request is routed to the first approver(s).
    *   Approvers receive notification, review the item, and provide decision (Approve/Reject).
    *   Request moves to the next step or is finalized.
    *   Originator tracks approval status.

### Financial Management (Payments, Quotes, Invoices)

1.  **Invoice Creation & Payment Tracking Flow**:
    *   User (Finance/PM) creates an Invoice (manual or based on project progress).
    *   Adds line items, sets due date.
    *   Sends invoice to client.
    *   Records Payment received against the invoice.
    *   Invoice status updates automatically (Paid/Partially Paid/Overdue).
    *   AI flags overdue invoices or potential cash flow issues.

### Field Operations (Logs, Inspections, Material, Equipment, Site 360)

1.  **Daily Log Creation Flow**:
    *   User (Superintendent) opens Daily Log for the current date.
    *   Records manpower count, equipment used, weather.
    *   Adds notes about work performed, delays, safety observations.
    *   Uploads site photos.
    *   Submits the log.

2.  **Inspection Performing Flow**:
    *   User (Inspector) selects a scheduled Inspection.
    *   Uses a digital Checklist on a mobile device.
    *   Marks items as Pass/Fail/NA, adds comments/photos for failed items.
    *   Creates Issues linked to failed items.
    *   Completes and submits the inspection report.

### Post-Construction & Cross-Cutting (Archives, O&M, Facility, Reports)

1.  **Project Archiving Flow**:
    *   User (PM/Admin) navigates to completed Project.
    *   Initiates Archive process.
    *   System confirms all data to be archived (read-only).
    *   Project moves to Archived Projects list.

2.  **Report Generation Flow**:
    *   User navigates to Reports module.
    *   Selects a Report Template or creates a custom report.
    *   Defines parameters (date range, project scope, data filters).
    *   Generates the report.
    *   Views report online or exports to PDF/CSV.
    *   Schedules recurring report generation/distribution.

---

These flows provide a high-level overview. Detailed wireframes and prototypes will further refine the specific UI elements and interactions for each step.
