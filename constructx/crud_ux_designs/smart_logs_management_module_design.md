# Smart Logs Management Module - Complete CRUD & UX Design

## Overview
The Smart Logs Management module provides a digital solution for maintaining various project logs, such as daily logs, safety logs, visitor logs, and equipment logs. It enables structured data entry, real-time updates, reporting, and integration with other project data for comprehensive site activity tracking.

## Entity Model

### LogType
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `name`: String (e.g., Daily Log, Safety Log, Visitor Log, Equipment Usage Log)
- `description`: Text
- `templateSchema`: JSON (defines the structure and fields for this log type)
- `icon`: String (optional, icon identifier)
- `isActive`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LogEntry
- `id`: UUID (Primary Key)
- `projectId`: UUID (Foreign Key to Project)
- `logTypeId`: UUID (Foreign Key to LogType)
- `entryNumber`: String (Unique identifier within project and log type)
- `entryDate`: Date
- `title`: String (optional, auto-generated or user-defined)
- `status`: String (Draft, Submitted, Approved, Archived)
- `data`: JSON (stores the actual log data based on LogType templateSchema)
- `createdBy`: UUID (Foreign Key to User)
- `submittedBy`: UUID (Foreign Key to User, optional)
- `submittedAt`: DateTime (optional)
- `approvedBy`: UUID (Foreign Key to User, optional)
- `approvedAt`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LogEntryAttachment
- `id`: UUID (Primary Key)
- `logEntryId`: UUID (Foreign Key to LogEntry)
- `name`: String
- `description`: Text (optional)
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path)
- `uploadedBy`: UUID (Foreign Key to User)
- `uploadedAt`: DateTime

### LogEntryComment
- `id`: UUID (Primary Key)
- `logEntryId`: UUID (Foreign Key to LogEntry)
- `content`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LogEntrySignature
- `id`: UUID (Primary Key)
- `logEntryId`: UUID (Foreign Key to LogEntry)
- `userId`: UUID (Foreign Key to User)
- `signatureData`: Text (Base64 encoded image or vector data)
- `signedAt`: DateTime
- `purpose`: String (e.g., Submission, Approval)

## API Endpoints

### Log Types
- `GET /api/log-types` - List all available log types for the company
- `GET /api/log-types/:id` - Get specific log type details (including schema)
- `POST /api/log-types` - Create new log type (Admin only)
- `PUT /api/log-types/:id` - Update log type details or schema (Admin only)
- `DELETE /api/log-types/:id` - Delete log type (Admin only)
- `PUT /api/log-types/:id/activate` - Activate log type
- `PUT /api/log-types/:id/deactivate` - Deactivate log type

### Log Entries
- `GET /api/projects/:projectId/log-entries` - List log entries for a project with filtering (by type, date, status)
- `GET /api/log-entries/:id` - Get specific log entry details
- `POST /api/projects/:projectId/log-entries` - Create new log entry (draft)
- `PUT /api/log-entries/:id` - Update log entry data (draft only)
- `DELETE /api/log-entries/:id` - Delete log entry (draft only)
- `PUT /api/log-entries/:id/submit` - Submit log entry
- `PUT /api/log-entries/:id/approve` - Approve log entry
- `GET /api/log-entries/statuses` - Get available log entry statuses
- `GET /api/projects/:projectId/log-entries/type/:logTypeId` - Get entries for a specific log type

### Log Entry Attachments
- `GET /api/log-entries/:logEntryId/attachments` - List attachments for a log entry
- `POST /api/log-entries/:logEntryId/attachments` - Upload attachment to log entry
- `GET /api/log-attachments/:id/download` - Download attachment
- `DELETE /api/log-attachments/:id` - Delete attachment

### Log Entry Comments
- `GET /api/log-entries/:logEntryId/comments` - List comments for a log entry
- `POST /api/log-entries/:logEntryId/comments` - Add comment to log entry
- `PUT /api/log-comments/:id` - Update comment
- `DELETE /api/log-comments/:id` - Delete comment

### Log Entry Signatures
- `GET /api/log-entries/:logEntryId/signatures` - List signatures for a log entry
- `POST /api/log-entries/:logEntryId/signatures` - Add signature to log entry

## Frontend Components

### SmartLogsPage
- Main container for smart logs management
- Log type selector/tabs
- Log entries list view for selected type
- Filtering and sorting controls (by date, status, creator)
- Search functionality within logs
- Create new log entry button
- Log metrics summary
- Export log data button
- Log types management section (for Admins)

### LogEntriesList
- Tabular view of log entries for a specific type
- Sortable columns (Date, Entry #, Status, Created By)
- Filterable data
- Pagination
- Row-level actions (view, edit draft, delete draft, submit, approve)
- Status indicators with color coding
- Quick preview of key log data

### LogEntryForm
- Dynamically generated form based on LogType templateSchema
- Standard fields (Date, Title)
- Custom fields as defined in schema (text, number, date, dropdown, checkbox, etc.)
- Attachment upload section
- Signature capture section (if required by schema)
- Save as Draft / Submit buttons

### LogEntryDetailsPage
- Comprehensive view of a single log entry
- Header with key information (Type, Date, Status, Creator)
- Display of all log data based on schema
- Attachments section
- Comments section
- Signatures section
- Approval controls (if applicable)
- Print/Export PDF option
- Edit button (for drafts)

### LogTypeManager
- Interface for managing log types (Admin only)
- List of existing log types
- Add/edit/delete log type controls
- Activate/deactivate controls
- Schema builder/editor interface
- Icon selection

### LogSchemaBuilder
- Visual interface for defining log type schemas
- Drag-and-drop field types (Text, Number, Date, Dropdown, Checkbox, Signature, etc.)
- Field configuration options (label, required, options, etc.)
- Section creation for organizing fields
- Preview of the generated form
- Save schema controls

### LogAttachmentsComponent
- List of attachments for a log entry
- File type icons
- File size and upload date
- Download button
- Delete button (for drafts)
- Preview capability for images and PDFs

### LogCommentsComponent
- Chronological list of comments
- Add comment form
- Edit/delete controls for own comments
- User avatars and timestamps

### LogSignaturesComponent
- Display of captured signatures
- User name and timestamp for each signature
- Purpose of signature
- Add signature button (if user needs to sign)
- Signature capture pad component

### LogMetricsComponent
- Summary statistics for logs
- Entries per log type chart
- Submission/Approval timeliness metrics
- Entries by status chart
- Trend analysis over time
- Custom reporting based on log data

## User Experience Flow

### Creating a Log Entry
1. User navigates to Smart Logs page
2. User selects the desired log type (e.g., Daily Log)
3. User clicks "Create New Entry" button
4. User fills out the form, which is dynamically generated based on the log type schema
5. User uploads attachments if necessary
6. User saves the entry as a draft or submits it
7. If submitted, entry status changes and relevant parties may be notified

### Managing Log Entries
1. User views log entries list for a specific type
2. User filters/sorts entries as needed
3. User clicks on an entry to view details
4. User can edit draft entries
5. User can add comments to submitted entries
6. Approvers can review and approve submitted entries
7. User can export log data for reporting

### Signing a Log Entry
1. User opens a log entry requiring their signature
2. User navigates to the Signatures section
3. User clicks "Add Signature" button
4. Signature capture pad appears
5. User signs using mouse, stylus, or finger
6. User confirms signature
7. Signature is added to the log entry with timestamp

### Managing Log Types (Admin)
1. Admin navigates to Smart Logs page
2. Admin selects Log Types management section
3. Admin views list of existing log types
4. Admin can create a new log type using the Schema Builder
5. Admin defines fields, sections, and requirements for the new log type
6. Admin saves and activates the new log type
7. Admin can edit or deactivate existing log types

## Responsive Design

### Desktop View
- Full log entries list with multiple columns
- Advanced filtering and sorting options
- Side-by-side log details and attachments/comments
- Comprehensive log type schema builder
- Detailed metrics and reporting

### Tablet View
- Simplified list with fewer visible columns
- Collapsible filtering options
- Stacked layout for log entry details
- Streamlined schema builder
- Essential metrics display

### Mobile View
- List view optimized for small screens
- Essential information display
- Full-screen forms for creating/editing log entries
- Optimized signature capture
- Key metrics only
- Designed for easy data entry in the field

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for both modes
- Form styling adapted for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Data Extraction from Logs
- Automatic extraction of key data points (manpower counts, equipment hours, safety incidents)
- Sentiment analysis on log descriptions or comments
- Identification of recurring issues or trends
- Linking log entries to relevant tasks or schedule items
- Summarization of daily log activities

### Anomaly Detection
- Identification of unusual patterns in log data (e.g., sudden drop in productivity, spike in safety incidents)
- Flagging incomplete or inconsistent log entries
- Weather correlation with reported site conditions
- Comparison against project baseline or historical data
- Predictive alerts for potential issues based on log trends

### Reporting Assistance
- AI-generated summaries for weekly/monthly reports
- Natural language querying of log data ("Show me all safety incidents this month")
- Automated report generation based on log type templates
- Identification of key insights from log data
- Suggestions for improving log quality and consistency

## Implementation Considerations

### Performance Optimization
- Efficient loading of log entries with pagination
- Optimized rendering of dynamic forms based on schemas
- Caching of log type schemas
- Efficient search and filtering on JSON data fields
- Fast attachment handling

### Data Integration
- Integration with Projects module for context
- Integration with Team Management for user data
- Integration with Schedule module for linking activities
- Integration with Safety/Quality modules
- Data export capabilities for external reporting tools

### Security
- Role-based access to different log types and entries
- Permissions for creating, submitting, and approving logs
- Secure handling of signatures
- Audit logging for all log entry modifications
- Data validation based on schema definitions

## Testing Strategy
- Unit tests for dynamic form generation and validation
- Integration tests for log submission and approval workflows
- Performance testing with large numbers of log entries and complex schemas
- Signature capture testing on various devices
- Usability testing for field data entry on mobile
- Cross-browser and responsive design testing
