# Leads Management Module - Complete CRUD & UX Design

## Overview
The Leads Management module enables tracking and managing potential business opportunities before they become formal projects. It provides a comprehensive pipeline visualization, activity tracking, and conversion workflows to transform leads into projects.

## Entity Model

### Lead
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `name`: String (Lead name/title)
- `clientCompanyId`: UUID (Foreign Key to Client Company, optional)
- `source`: String (How the lead was acquired)
- `description`: Text
- `estimatedValue`: Decimal
- `estimatedStartDate`: Date
- `estimatedDuration`: Integer (days/weeks/months)
- `status`: String (New, Contacted, Qualified, Proposal, Negotiation, Won, Lost)
- `probability`: Integer (0-100%)
- `assignedTo`: UUID (Foreign Key to User)
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `lastActivityAt`: DateTime
- `tags`: Array of Strings

### LeadContact
- `id`: UUID (Primary Key)
- `leadId`: UUID (Foreign Key to Lead)
- `firstName`: String
- `lastName`: String
- `email`: String
- `phone`: String
- `position`: String
- `isPrimary`: Boolean
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LeadActivity
- `id`: UUID (Primary Key)
- `leadId`: UUID (Foreign Key to Lead)
- `type`: String (Call, Email, Meeting, Note, Task, Document)
- `title`: String
- `description`: Text
- `performedBy`: UUID (Foreign Key to User)
- `performedAt`: DateTime
- `scheduledAt`: DateTime (optional, for planned activities)
- `outcome`: String (optional)
- `documentId`: UUID (Foreign Key to Document, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LeadNote
- `id`: UUID (Primary Key)
- `leadId`: UUID (Foreign Key to Lead)
- `content`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Leads
- `GET /api/leads` - List all leads with filtering and pagination
- `GET /api/leads/:id` - Get specific lead details
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead details
- `DELETE /api/leads/:id` - Delete lead (soft delete)
- `GET /api/leads/statuses` - Get available lead statuses
- `GET /api/leads/sources` - Get available lead sources
- `GET /api/leads/metrics` - Get lead metrics (counts by status, value by status, etc.)

### Lead Contacts
- `GET /api/leads/:leadId/contacts` - List all contacts for a lead
- `GET /api/leads/contacts/:id` - Get specific contact details
- `POST /api/leads/:leadId/contacts` - Add contact to lead
- `PUT /api/leads/contacts/:id` - Update contact details
- `DELETE /api/leads/contacts/:id` - Remove contact from lead
- `PUT /api/leads/contacts/:id/primary` - Set contact as primary

### Lead Activities
- `GET /api/leads/:leadId/activities` - List all activities for a lead
- `GET /api/leads/activities/:id` - Get specific activity details
- `POST /api/leads/:leadId/activities` - Add activity to lead
- `PUT /api/leads/activities/:id` - Update activity details
- `DELETE /api/leads/activities/:id` - Remove activity from lead
- `GET /api/leads/activity-types` - Get available activity types

### Lead Notes
- `GET /api/leads/:leadId/notes` - List all notes for a lead
- `POST /api/leads/:leadId/notes` - Add note to lead
- `PUT /api/leads/notes/:id` - Update note
- `DELETE /api/leads/notes/:id` - Delete note

### Lead Conversion
- `POST /api/leads/:id/convert-to-project` - Convert lead to project
- `GET /api/leads/:id/conversion-preview` - Preview lead conversion to project

## Frontend Components

### LeadsPage
- Main container for leads management
- Lead pipeline visualization
- List/table view toggle
- Filtering and sorting controls
- Search functionality
- Add lead button
- Lead metrics summary
- Export leads button

### LeadPipeline
- Kanban-style board with columns for each lead status
- Drag-and-drop functionality for status updates
- Lead cards with key information
- Visual indicators for lead value and probability
- Column totals (count and value)
- Collapsible columns

### LeadsList
- Tabular view of leads
- Sortable columns
- Filterable data
- Pagination
- Bulk action support
- Row-level actions (edit, delete, convert)
- Status indicators

### LeadCard
- Visual representation of lead in pipeline view
- Lead name and client
- Estimated value
- Probability indicator
- Days in current status
- Assigned user avatar
- Last activity timestamp
- Quick action buttons

### LeadForm
- Form for creating/editing leads
- Input validation
- Client company selection (with create new option)
- Contact information section
- Lead details section
- Status and assignment section
- Tags input
- Save/cancel buttons

### LeadDetailsPage
- Comprehensive view of a single lead
- Header with key information and actions
- Tabbed interface for different sections
- Activity timeline
- Contacts list
- Notes section
- Documents section
- Related leads/projects section
- Convert to project button

### LeadActivityTimeline
- Chronological display of all lead activities
- Activity type icons
- Activity details with expandable content
- User avatars for performed by
- Date/time indicators
- Add activity button

### LeadContactsList
- List of all contacts associated with the lead
- Primary contact indicator
- Contact details
- Contact action buttons (call, email, edit, delete)
- Add contact button

### LeadNotesSection
- List of all notes for the lead
- Note content with formatting
- User and timestamp for each note
- Edit/delete note actions
- Add note form

### LeadConversionWizard
- Step-by-step process to convert lead to project
- Project details form
- Team assignment
- Initial tasks creation
- Document transfer options
- Confirmation step

## User Experience Flow

### Lead Management
1. User navigates to Leads page
2. User views leads in pipeline or list view
3. User can filter, sort, and search leads
4. User can add new lead via form
5. User can edit lead details by clicking on lead
6. User can drag lead between status columns to update status

### Lead Details
1. User clicks on lead to view details
2. User can view and edit all lead information
3. User can add/edit/delete contacts
4. User can log activities and notes
5. User can upload and link documents
6. User can convert lead to project

### Activity Tracking
1. User logs activities (calls, emails, meetings) on lead
2. Activities appear in chronological timeline
3. User can schedule future activities
4. System sends reminders for scheduled activities
5. User can mark activities as completed

### Lead Conversion
1. User clicks "Convert to Project" button
2. Conversion wizard guides through project setup
3. Lead information is transferred to new project
4. User can customize project details
5. On completion, lead status updates to "Won"
6. User is redirected to new project

## Responsive Design

### Desktop View
- Full pipeline visualization with multiple columns
- Detailed lead cards with all information
- Advanced filtering and sorting options
- Side-by-side forms and information panels

### Tablet View
- Scrollable pipeline with fewer visible columns
- Simplified lead cards with essential information
- Collapsible filtering options
- Stacked forms and information panels

### Mobile View
- List view as default with optional pipeline view
- Minimal lead cards with expandable details
- Filter button revealing modal filters
- Full-screen forms with progressive disclosure

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for both modes
- Card and form styling for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Lead Scoring
- AI-generated lead score based on activities, details, and historical data
- Probability prediction for conversion
- Suggested next actions to progress lead
- Similar lead identification

### Data Enrichment
- Automatic company information retrieval
- Contact details completion suggestions
- Industry and market insights
- Competitor analysis

### Activity Recommendations
- Suggested follow-up activities based on lead status
- Optimal timing for follow-ups
- Communication templates based on context
- Success probability for different approaches

## Implementation Considerations

### Performance Optimization
- Pagination and lazy loading for leads list
- Optimized drag-and-drop for pipeline view
- Caching of frequently accessed lead data
- Efficient filtering implementation

### Data Integration
- Integration with email systems for activity tracking
- CRM data import/export capabilities
- Integration with Projects module for conversion
- Calendar integration for scheduled activities

### Security
- Role-based access to lead information
- Field-level permissions for sensitive data
- Audit logging for all lead changes
- Data masking for exported lead information

## Testing Strategy
- Unit tests for all lead components
- Integration tests for lead conversion flow
- Performance testing for pipeline with many leads
- Usability testing for drag-and-drop functionality
- Cross-browser and responsive design testing
