# Submittals Management Module - Complete CRUD & UX Design

## Overview
The Submittals Management module handles the review and approval process for material and equipment submittals in construction projects. It provides comprehensive tools for submittal log management, review workflows, markup capabilities, and approval tracking to ensure quality control and compliance with specifications.

## Entity Model

### Submittal
- `id`: UUID (Primary Key)
- `projectId`: UUID (Foreign Key to Project)
- `submittalNumber`: String (Unique identifier within project)
- `title`: String
- `description`: Text
- `specificationSection`: String
- `status`: String (Draft, Submitted, Under Review, Approved, Approved as Noted, Revise and Resubmit, Rejected)
- `priority`: String (Low, Medium, High, Critical)
- `category`: String (Material, Equipment, Shop Drawing, Sample, etc.)
- `dueDate`: Date
- `submittedDate`: Date (optional)
- `returnedDate`: Date (optional)
- `submittedBy`: UUID (Foreign Key to User)
- `contractor`: String
- `supplier`: String
- `ballInCourt`: String (Contractor, Architect, Engineer, Owner, etc.)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SubmittalItem
- `id`: UUID (Primary Key)
- `submittalId`: UUID (Foreign Key to Submittal)
- `name`: String
- `description`: Text
- `quantity`: Integer
- `unit`: String
- `status`: String (same options as Submittal)
- `comments`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SubmittalReview
- `id`: UUID (Primary Key)
- `submittalId`: UUID (Foreign Key to Submittal)
- `reviewerId`: UUID (Foreign Key to User)
- `role`: String (Architect, Engineer, Owner, etc.)
- `status`: String (Pending, In Progress, Completed)
- `decision`: String (Approved, Approved as Noted, Revise and Resubmit, Rejected)
- `comments`: Text
- `startDate`: DateTime
- `completedDate`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SubmittalAttachment
- `id`: UUID (Primary Key)
- `submittalId`: UUID (Foreign Key to Submittal)
- `name`: String
- `description`: Text (optional)
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path)
- `version`: Integer
- `isMarkup`: Boolean
- `uploadedBy`: UUID (Foreign Key to User)
- `uploadedAt`: DateTime

### SubmittalMarkup
- `id`: UUID (Primary Key)
- `attachmentId`: UUID (Foreign Key to SubmittalAttachment)
- `reviewId`: UUID (Foreign Key to SubmittalReview)
- `markupData`: JSON (annotations, highlights, comments)
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SubmittalComment
- `id`: UUID (Primary Key)
- `submittalId`: UUID (Foreign Key to Submittal)
- `reviewId`: UUID (Foreign Key to SubmittalReview, optional)
- `content`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SubmittalDistribution
- `id`: UUID (Primary Key)
- `submittalId`: UUID (Foreign Key to Submittal)
- `userId`: UUID (Foreign Key to User)
- `role`: String (Reviewer, Observer)
- `notified`: Boolean
- `viewed`: Boolean
- `viewedAt`: DateTime (optional)
- `createdAt`: DateTime

## API Endpoints

### Submittals
- `GET /api/projects/:projectId/submittals` - List all submittals for a project with filtering and pagination
- `GET /api/submittals/:id` - Get specific submittal details
- `POST /api/projects/:projectId/submittals` - Create new submittal
- `PUT /api/submittals/:id` - Update submittal details
- `DELETE /api/submittals/:id` - Delete submittal (soft delete)
- `GET /api/submittals/statuses` - Get available submittal statuses
- `GET /api/submittals/categories` - Get available submittal categories
- `PUT /api/submittals/:id/status` - Update submittal status
- `PUT /api/submittals/:id/ball-in-court` - Update ball in court

### Submittal Items
- `GET /api/submittals/:submittalId/items` - List all items for a submittal
- `POST /api/submittals/:submittalId/items` - Add item to submittal
- `PUT /api/submittal-items/:id` - Update item details
- `DELETE /api/submittal-items/:id` - Delete item
- `PUT /api/submittal-items/:id/status` - Update item status

### Submittal Reviews
- `GET /api/submittals/:submittalId/reviews` - List all reviews for a submittal
- `POST /api/submittals/:submittalId/reviews` - Create new review
- `PUT /api/submittal-reviews/:id` - Update review details
- `DELETE /api/submittal-reviews/:id` - Delete review
- `PUT /api/submittal-reviews/:id/complete` - Complete review with decision
- `GET /api/users/:userId/pending-reviews` - Get pending reviews for a user

### Submittal Attachments
- `GET /api/submittals/:submittalId/attachments` - List all attachments for a submittal
- `POST /api/submittals/:submittalId/attachments` - Upload attachment to submittal
- `GET /api/submittal-attachments/:id/download` - Download attachment
- `DELETE /api/submittal-attachments/:id` - Delete attachment
- `GET /api/submittal-attachments/:id/versions` - Get all versions of an attachment

### Submittal Markups
- `GET /api/submittal-attachments/:attachmentId/markups` - List all markups for an attachment
- `POST /api/submittal-attachments/:attachmentId/markups` - Create new markup
- `PUT /api/submittal-markups/:id` - Update markup
- `DELETE /api/submittal-markups/:id` - Delete markup
- `GET /api/submittal-reviews/:reviewId/markups` - Get all markups for a review

### Submittal Comments
- `GET /api/submittals/:submittalId/comments` - List all comments for a submittal
- `POST /api/submittals/:submittalId/comments` - Add comment to submittal
- `PUT /api/submittal-comments/:id` - Update comment
- `DELETE /api/submittal-comments/:id` - Delete comment

### Submittal Distribution
- `GET /api/submittals/:submittalId/distribution` - List distribution for a submittal
- `POST /api/submittals/:submittalId/distribution` - Add user to distribution
- `DELETE /api/submittal-distribution/:id` - Remove user from distribution
- `PUT /api/submittals/:submittalId/notify` - Send notifications to distribution list

## Frontend Components

### SubmittalsPage
- Main container for submittals management
- Submittal log table view
- Filtering and sorting controls
- Search functionality
- Add submittal button
- Submittal metrics summary
- Export submittal log button
- Ball-in-court filter toggle

### SubmittalLog
- Tabular view of submittals
- Sortable columns
- Filterable data
- Pagination
- Bulk action support
- Row-level actions (edit, delete, view)
- Status indicators with color coding
- Due date highlighting
- Ball-in-court indicators
- Specification section grouping

### SubmittalForm
- Form for creating/editing submittals
- Input validation
- Title and description fields
- Specification section selection
- Category selection
- Priority selection
- Due date picker
- Contractor and supplier fields
- Items section
- Distribution list management
- Save/submit buttons

### SubmittalDetailsPage
- Comprehensive view of a single submittal
- Header with key information and actions
- Description and details section
- Items section
- Attachments section
- Reviews section
- Comments section
- Distribution list section
- Status update controls
- Ball-in-court indicator and controls

### SubmittalItemsComponent
- List of all items in submittal
- Item details display
- Status indicators
- Add/edit/delete item controls
- Bulk status update option
- Item-level comments

### SubmittalAttachmentsComponent
- List of all attachments
- File type icons
- File size and upload date
- Version indicators
- Download button
- Delete button
- Markup button
- Drag-and-drop upload area
- Preview capability for images and PDFs

### SubmittalReviewsComponent
- List of all reviewers and their status
- Review status indicators
- Decision indicators
- Comments display
- Add reviewer button
- Send reminder button
- Review completion controls
- Review history timeline

### SubmittalMarkupEditor
- Document viewer with annotation tools
- Drawing tools (lines, shapes, text)
- Comment placement tools
- Highlight and strikethrough tools
- Measurement tools
- Markup layer toggling
- Save/discard markup controls
- View other reviewers' markups option

### SubmittalCommentsComponent
- Chronological list of comments
- Comment form for adding new comments
- Edit/delete controls for own comments
- User avatars and timestamps
- Markdown support for formatting
- Comment filtering by reviewer

### SubmittalDistributionComponent
- List of all users in distribution
- Role indicators (Reviewer, Observer)
- Viewed status indicators
- Add user to distribution
- Remove user from distribution
- Notify all button
- User selection with role assignment

### SubmittalStatusWorkflow
- Visual workflow diagram of submittal process
- Current status highlighting
- Available status transitions
- Status update controls
- Ball-in-court transfer controls
- Status history timeline

### SubmittalMetricsComponent
- Summary statistics for submittals
- Status distribution chart
- Review time metrics
- Overdue submittals count
- Submittals by category chart
- Trend analysis over time

## User Experience Flow

### Submittal Creation
1. User navigates to Submittals page
2. User clicks "Add Submittal" button
3. User fills out submittal form with details
4. User adds items to the submittal
5. User uploads attachments if needed
6. User selects distribution list and reviewers
7. User submits submittal and system assigns number
8. System notifies assigned reviewers

### Submittal Review
1. Reviewer receives notification
2. Reviewer navigates to submittal details
3. Reviewer reviews submittal information and attachments
4. Reviewer can add markup to attachments
5. Reviewer can add comments
6. Reviewer selects decision (Approved, Approved as Noted, etc.)
7. Reviewer completes review
8. System updates submittal status based on review decisions

### Submittal Revision
1. If submittal requires revision, status changes to "Revise and Resubmit"
2. Contractor receives notification
3. Contractor views markup and comments
4. Contractor uploads revised attachments
5. Contractor resubmits for review
6. System creates new version and notifies reviewers
7. Review process repeats until approved

### Submittal Management
1. Project manager views submittal log
2. Manager can filter and sort submittals by status, ball-in-court, etc.
3. Manager can identify overdue or critical submittals
4. Manager can reassign reviews if needed
5. Manager can export submittal log for reporting
6. Manager can analyze submittal metrics for process improvement

## Responsive Design

### Desktop View
- Full submittal log with multiple columns
- Advanced filtering and sorting options
- Side-by-side document preview and markup tools
- Comprehensive attachment management
- Detailed review interface

### Tablet View
- Simplified log with fewer visible columns
- Collapsible filtering options
- Scrollable document preview
- Essential markup tools
- Streamlined review interface

### Mobile View
- List view optimized for small screens
- Essential information display
- Basic document preview with option to open full view
- Simplified markup tools
- Focused review interface with progressive disclosure
- Optimized for quick status updates in the field

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for both modes
- Document preview and markup styling for both modes
- Form and table styling for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Submittal Classification
- Automatic category suggestion based on content
- Specification section matching
- Similar submittal identification
- Automatic tagging based on content analysis
- Reviewer assignment suggestions based on expertise

### Review Assistance
- Automatic compliance checking with specifications
- Discrepancy identification
- Review comment suggestions based on similar past submittals
- Technical terminology suggestions
- Completeness assessment

### Process Optimization
- Review time prediction
- Bottleneck identification
- Reviewer workload balancing
- Submittal register generation from specifications
- Automated reminder scheduling

## Implementation Considerations

### Performance Optimization
- Efficient loading of submittal log with pagination
- Optimized attachment handling for large files
- Document preview and markup rendering optimization
- Caching of specification data
- Efficient filtering implementation

### Data Integration
- Integration with Documents module for attachments
- Specification module integration for reference
- Team module integration for reviewer assignment
- Notification system integration
- Mobile app integration for field use

### Security
- Role-based access to submittal information
- Audit logging for all submittal activities
- Secure attachment handling
- Review integrity protection
- Version control for submittals and attachments

## Testing Strategy
- Unit tests for submittal status workflow
- Integration tests for review process
- Performance testing for submittal log with many items
- Markup tool functionality testing
- Attachment handling with large files
- Usability testing for review workflow
- Cross-browser and responsive design testing
