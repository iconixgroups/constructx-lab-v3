# Quotes Management Module - Complete CRUD & UX Design

## Overview
The Quotes Management module facilitates the creation, sending, and tracking of quotes for services or materials provided to clients or requested from vendors/subcontractors. It streamlines the quoting process, manages revisions, and integrates with bids, projects, and financial modules.

## Entity Model

### Quote
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `projectId`: UUID (Foreign Key to Project, optional)
- `bidId`: UUID (Foreign Key to Bid, optional)
- `leadId`: UUID (Foreign Key to Lead, optional)
- `quoteNumber`: String (Unique identifier)
- `title`: String
- `description`: Text
- `type`: String (Client Quote, Vendor Quote Request)
- `recipientCompanyId`: UUID (Foreign Key to Company, for client quotes)
- `recipientContactName`: String
- `recipientEmail`: String
- `vendorId`: UUID (Foreign Key to Vendor/Subcontractor, for vendor requests)
- `status`: String (Draft, Sent, Viewed, Accepted, Rejected, Expired, Converted)
- `issueDate`: Date
- `expiryDate`: Date
- `totalAmount`: Decimal
- `currency`: String
- `terms`: Text
- `notes`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `tags`: Array of Strings

### QuoteSection
- `id`: UUID (Primary Key)
- `quoteId`: UUID (Foreign Key to Quote)
- `name`: String
- `description`: Text
- `order`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

### QuoteItem
- `id`: UUID (Primary Key)
- `quoteId`: UUID (Foreign Key to Quote)
- `sectionId`: UUID (Foreign Key to QuoteSection, optional)
- `name`: String
- `description`: Text
- `quantity`: Decimal
- `unit`: String
- `unitPrice`: Decimal
- `discountPercentage`: Decimal (0-100)
- `taxRatePercentage`: Decimal (0-100)
- `totalPrice`: Decimal (calculated)
- `notes`: Text
- `order`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

### QuoteDocument
- `id`: UUID (Primary Key)
- `quoteId`: UUID (Foreign Key to Quote)
- `name`: String
- `description`: Text
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path)
- `documentType`: String (Generated Quote PDF, Supporting Document, etc.)
- `isGenerated`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### QuoteVersion
- `id`: UUID (Primary Key)
- `quoteId`: UUID (Foreign Key to Quote)
- `versionNumber`: Integer
- `description`: Text (reason for new version)
- `data`: JSON (complete quote data snapshot)
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime

### QuoteComment
- `id`: UUID (Primary Key)
- `quoteId`: UUID (Foreign Key to Quote)
- `content`: Text
- `isInternal`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Quotes
- `GET /api/quotes` - List all quotes with filtering and pagination
- `GET /api/quotes/:id` - Get specific quote details
- `POST /api/quotes` - Create new quote
- `PUT /api/quotes/:id` - Update quote details
- `DELETE /api/quotes/:id` - Delete quote (soft delete)
- `GET /api/quotes/statuses` - Get available quote statuses
- `GET /api/quotes/types` - Get available quote types
- `PUT /api/quotes/:id/status` - Update quote status
- `POST /api/quotes/:id/send` - Send quote to recipient
- `POST /api/quotes/:id/convert` - Convert quote (to project, order, etc.)
- `GET /api/projects/:projectId/quotes` - Get quotes for a project
- `GET /api/leads/:leadId/quotes` - Get quotes for a lead

### Quote Sections
- `GET /api/quotes/:quoteId/sections` - List all sections for a quote
- `POST /api/quotes/:quoteId/sections` - Create new section
- `PUT /api/quote-sections/:id` - Update section
- `DELETE /api/quote-sections/:id` - Delete section
- `PUT /api/quotes/:quoteId/sections/reorder` - Reorder sections

### Quote Items
- `GET /api/quotes/:quoteId/items` - List all items for a quote
- `GET /api/quote-sections/:sectionId/items` - List all items for a section
- `POST /api/quotes/:quoteId/items` - Create new item
- `POST /api/quote-sections/:sectionId/items` - Create new item in section
- `PUT /api/quote-items/:id` - Update item
- `DELETE /api/quote-items/:id` - Delete item
- `PUT /api/quotes/:quoteId/items/reorder` - Reorder items

### Quote Documents
- `GET /api/quotes/:quoteId/documents` - List all documents for a quote
- `POST /api/quotes/:quoteId/documents` - Upload supporting document
- `POST /api/quotes/:quoteId/generate-pdf` - Generate quote PDF document
- `GET /api/quote-documents/:id/download` - Download document file
- `DELETE /api/quote-documents/:id` - Delete document

### Quote Versions
- `GET /api/quotes/:quoteId/versions` - List all versions of a quote
- `POST /api/quotes/:quoteId/versions` - Create new version
- `GET /api/quote-versions/:id` - Get specific version details
- `PUT /api/quotes/:id/restore/:versionId` - Restore quote to specific version

### Quote Comments
- `GET /api/quotes/:quoteId/comments` - List all comments for a quote
- `POST /api/quotes/:quoteId/comments` - Add comment to quote
- `PUT /api/quote-comments/:id` - Update comment
- `DELETE /api/quote-comments/:id` - Delete comment

## Frontend Components

### QuotesPage
- Main container for quotes management
- Quotes list/grid view toggle
- Filtering and sorting controls (by status, date, type, project)
- Search functionality
- Create quote button
- Quote metrics summary (total value, acceptance rate)
- Export quotes button

### QuotesList
- Tabular view of quotes
- Sortable columns
- Filterable data
- Pagination
- Bulk action support
- Row-level actions (view, edit, delete, send, duplicate)
- Status indicators with color coding
- Expiry date highlighting
- Quote type indicators
- Recipient/Vendor information

### QuotesGrid
- Card-based view of quotes
- Visual status indicators
- Key quote information (number, title, recipient, value)
- Expiry date display
- Quick action buttons
- Filtering and sorting support

### QuoteForm
- Form for creating/editing quotes
- Input validation
- Quote type selection (Client/Vendor)
- Recipient/Vendor selection
- Title and description fields
- Issue date and expiry date pickers
- Sections and items management
- Terms and notes fields
- Save as draft/Save and Send buttons

### QuoteDetailsPage
- Comprehensive view of a single quote
- Header with key information and actions (Send, Accept, Reject, Convert)
- Quote details section
- Sections and items display
- Documents section (generated PDF, supporting docs)
- Versions section
- Comments section (internal/external toggle)
- Status update controls

### QuoteSectionsComponent
- Hierarchical display of quote sections
- Drag-and-drop reordering
- Expand/collapse controls
- Add/edit/delete section controls
- Section totals calculation
- Items management within sections

### QuoteItemsComponent
- List of items within section or quote
- Inline editing capabilities
- Quantity, unit, unit price inputs
- Discount and tax rate inputs
- Automatic total calculation
- Add/delete item controls
- Bulk import/export options
- Product/Service catalog integration

### QuoteDocumentsComponent
- List of all documents associated with the quote
- Generated PDF preview/download
- Supporting document upload/download/delete
- Regenerate PDF button
- Send document controls

### QuoteVersionsComponent
- Timeline of quote versions
- Version comparison view
- Version details (date, user, description)
- Restore to version option
- Create new version button
- Automatic/manual version creation toggle

### QuoteCommentsComponent
- Threaded view of comments
- Internal vs. external comment visibility
- Add comment form
- Edit/delete controls for own comments
- User avatars and timestamps

### QuotePDFPreview
- Component for previewing the generated quote PDF
- Zoom and navigation controls
- Download button
- Print button
- Send via email button

### QuoteMetricsComponent
- Summary statistics for quotes
- Status distribution chart
- Acceptance rate trend
- Average quote value
- Quotes by type chart
- Time-to-acceptance metrics

## User Experience Flow

### Creating a Quote
1. User navigates to Quotes page
2. User clicks "Create Quote" button
3. User selects quote type and recipient/vendor
4. User fills out quote details, sections, and items
5. User adds terms and notes
6. User saves quote as draft or saves and sends
7. If sent, system generates PDF and emails to recipient

### Managing Quotes
1. User views quotes list or grid
2. User filters/sorts quotes as needed
3. User clicks on quote to view details
4. User can edit draft quotes
5. User can create new versions of sent quotes
6. User can track status changes (viewed, accepted, rejected)
7. User can add internal comments

### Sending and Tracking
1. User creates or opens a draft quote
2. User clicks "Send" button
3. System generates PDF and sends email
4. Quote status changes to "Sent"
5. System tracks if email is opened/viewed (if possible)
6. Status updates to "Viewed"

### Handling Responses
1. Recipient accepts or rejects quote (via email link or manual update)
2. User updates quote status accordingly
3. If accepted, user can initiate conversion process (e.g., create project, order)
4. If rejected, user can archive or create revised version

### Version Management
1. User needs to revise a sent quote
2. User creates a new version
3. User makes necessary changes to items, pricing, etc.
4. User saves and sends the new version
5. Previous versions are retained in history
6. User can compare versions

## Responsive Design

### Desktop View
- Full quotes list with multiple columns
- Advanced filtering and sorting options
- Side-by-side quote details and PDF preview
- Comprehensive item editing interface
- Detailed metrics and charts

### Tablet View
- Simplified list with fewer visible columns
- Collapsible filtering options
- Stacked layout for quote details
- Streamlined item editing
- Essential metrics display

### Mobile View
- List view optimized for small screens
- Essential information display
- Full-screen forms for creating/editing quotes
- Basic PDF preview
- Key metrics only
- Optimized for quick status updates

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for both modes
- PDF preview styling adapted for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Pricing Optimization
- AI-suggested pricing based on historical data and margins
- Discount level recommendations
- Competitor pricing analysis (if data available)
- Profitability prediction for quote items
- Upsell/cross-sell suggestions

### Content Generation
- Automatic generation of item descriptions
- Suggested terms and conditions based on quote type
- Personalized email content for sending quotes
- Grammar and style checking for quote text
- Template recommendation based on context

### Acceptance Prediction
- Quote acceptance probability scoring
- Identification of factors influencing acceptance
- Suggestions for improving acceptance rate
- Optimal follow-up timing recommendations
- Client-specific insights based on past interactions

## Implementation Considerations

### Performance Optimization
- Efficient loading of quote lists with pagination
- Optimized PDF generation for complex quotes
- Caching of product/service catalog data
- Efficient calculation of quote totals
- Fast version comparison

### Data Integration
- Integration with Leads and Bids modules
- Integration with Projects module upon conversion
- Integration with Product/Service Catalog
- Integration with Financial module (Invoices)
- Client/Vendor data from CRM/Contacts module

### Security
- Role-based access to quote information
- Secure handling of pricing data
- Version control for audit trail
- Secure PDF generation and delivery
- Protection of client/vendor confidential information

## Testing Strategy
- Unit tests for quote total calculations (including discounts, taxes)
- Integration tests for PDF generation
- Performance testing for large quotes with many items
- Usability testing for quote creation and sending workflow
- Security testing for pricing data access
- Cross-browser and responsive design testing
