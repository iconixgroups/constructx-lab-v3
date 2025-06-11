# Invoices Management Module - Complete CRUD & UX Design

## Overview
The Invoices Management module handles the creation, sending, tracking, and management of invoices issued to clients for completed work or services, as well as processing incoming invoices from vendors or subcontractors. It integrates closely with projects, contracts, payments, and financial modules.

## Entity Model

### Invoice
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `projectId`: UUID (Foreign Key to Project, optional)
- `contractId`: UUID (Foreign Key to Contract, optional)
- `quoteId`: UUID (Foreign Key to Quote, optional)
- `invoiceNumber`: String (Unique identifier)
- `title`: String
- `description`: Text
- `type`: String (Outgoing Client Invoice, Incoming Vendor Invoice)
- `clientId`: UUID (Foreign Key to Client Company, for outgoing)
- `vendorId`: UUID (Foreign Key to Vendor/Subcontractor, for incoming)
- `status`: String (Draft, Sent, Viewed, Partially Paid, Paid, Overdue, Void)
- `issueDate`: Date
- `dueDate`: Date
- `totalAmount`: Decimal
- `amountDue`: Decimal
- `amountPaid`: Decimal
- `currency`: String
- `terms`: Text
- `notes`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `tags`: Array of Strings

### InvoiceLineItem
- `id`: UUID (Primary Key)
- `invoiceId`: UUID (Foreign Key to Invoice)
- `description`: String
- `quantity`: Decimal
- `unit`: String
- `unitPrice`: Decimal
- `discountPercentage`: Decimal (0-100)
- `taxRatePercentage`: Decimal (0-100)
- `totalPrice`: Decimal (calculated)
- `relatedEntityType`: String (Task, BudgetItem, ContractMilestone, etc., optional)
- `relatedEntityId`: UUID (Foreign Key to related entity, optional)
- `order`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

### InvoiceDocument
- `id`: UUID (Primary Key)
- `invoiceId`: UUID (Foreign Key to Invoice)
- `name`: String
- `description`: Text
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path)
- `documentType`: String (Generated Invoice PDF, Supporting Document, Receipt)
- `isGenerated`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### InvoicePaymentLink (Defined in Payments Module, referenced here)
- `invoiceId`: UUID (Foreign Key to Invoice)
- `paymentId`: UUID (Foreign Key to Payment)
- `amountApplied`: Decimal

### InvoiceReminder
- `id`: UUID (Primary Key)
- `invoiceId`: UUID (Foreign Key to Invoice)
- `type`: String (Manual, Automatic)
- `sentDate`: DateTime
- `recipientEmail`: String
- `subject`: String
- `body`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime

### InvoiceComment
- `id`: UUID (Primary Key)
- `invoiceId`: UUID (Foreign Key to Invoice)
- `content`: Text
- `isInternal`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Invoices
- `GET /api/invoices` - List all invoices with filtering and pagination
- `GET /api/invoices/:id` - Get specific invoice details
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice details
- `DELETE /api/invoices/:id` - Delete invoice (soft delete/void)
- `GET /api/invoices/statuses` - Get available invoice statuses
- `GET /api/invoices/types` - Get available invoice types
- `PUT /api/invoices/:id/status` - Update invoice status
- `POST /api/invoices/:id/send` - Send invoice to recipient
- `GET /api/projects/:projectId/invoices` - Get invoices for a project
- `GET /api/clients/:clientId/invoices` - Get invoices for a client
- `GET /api/vendors/:vendorId/invoices` - Get invoices from a vendor

### Invoice Line Items
- `GET /api/invoices/:invoiceId/items` - List all items for an invoice
- `POST /api/invoices/:invoiceId/items` - Create new item
- `PUT /api/invoice-items/:id` - Update item
- `DELETE /api/invoice-items/:id` - Delete item
- `PUT /api/invoices/:invoiceId/items/reorder` - Reorder items

### Invoice Documents
- `GET /api/invoices/:invoiceId/documents` - List all documents for an invoice
- `POST /api/invoices/:invoiceId/documents` - Upload supporting document
- `POST /api/invoices/:invoiceId/generate-pdf` - Generate invoice PDF document
- `GET /api/invoice-documents/:id/download` - Download document file
- `DELETE /api/invoice-documents/:id` - Delete document

### Invoice Payments (Links to Payments Module)
- `GET /api/invoices/:invoiceId/payments` - Get payments applied to an invoice
- `POST /api/invoices/:invoiceId/record-payment` - Record payment against invoice

### Invoice Reminders
- `GET /api/invoices/:invoiceId/reminders` - List reminders sent for an invoice
- `POST /api/invoices/:invoiceId/reminders` - Send manual reminder
- `GET /api/invoices/overdue` - List overdue invoices

### Invoice Comments
- `GET /api/invoices/:invoiceId/comments` - List all comments for an invoice
- `POST /api/invoices/:invoiceId/comments` - Add comment to invoice
- `PUT /api/invoice-comments/:id` - Update comment
- `DELETE /api/invoice-comments/:id` - Delete comment

## Frontend Components

### InvoicesPage
- Main container for invoices management
- Invoices list/grid view toggle
- Filtering and sorting controls (by status, date, type, project, client/vendor)
- Search functionality
- Create invoice button
- Invoice metrics summary (total invoiced, total paid, total overdue)
- Export invoices button

### InvoicesList
- Tabular view of invoices
- Sortable columns
- Filterable data
- Pagination
- Bulk action support
- Row-level actions (view, edit, delete/void, send, record payment)
- Status indicators with color coding
- Due date highlighting
- Amount due display
- Client/Vendor information

### InvoicesGrid
- Card-based view of invoices
- Visual status indicators
- Key invoice information (number, client/vendor, amount due)
- Due date display
- Quick action buttons
- Filtering and sorting support

### InvoiceForm
- Form for creating/editing invoices
- Input validation
- Invoice type selection (Outgoing/Incoming)
- Client/Vendor selection
- Project/Contract linking
- Issue date and due date pickers
- Line items management
- Terms and notes fields
- Save as draft/Save and Send buttons

### InvoiceDetailsPage
- Comprehensive view of a single invoice
- Header with key information and actions (Send, Record Payment, Void)
- Invoice details section
- Line items display
- Documents section (generated PDF, supporting docs)
- Payments history section
- Reminders section
- Comments section (internal/external toggle)
- Status update controls

### InvoiceLineItemsComponent
- List of line items on the invoice
- Inline editing capabilities
- Quantity, unit, unit price inputs
- Discount and tax rate inputs
- Automatic total calculation
- Add/delete item controls
- Link to project task/budget item
- Product/Service catalog integration

### InvoiceDocumentsComponent
- List of all documents associated with the invoice
- Generated PDF preview/download
- Supporting document upload/download/delete
- Regenerate PDF button
- Send document controls

### InvoicePaymentsComponent
- List of payments applied to the invoice
- Payment date, amount, method display
- Link to payment details
- Record new payment button
- Remaining balance calculation

### InvoiceRemindersComponent
- List of reminders sent for the invoice
- Reminder date and type display
- Send manual reminder button
- Automatic reminder configuration (future feature)

### InvoiceCommentsComponent
- Threaded view of comments
- Internal vs. external comment visibility
- Add comment form
- Edit/delete controls for own comments
- User avatars and timestamps

### InvoicePDFPreview
- Component for previewing the generated invoice PDF
- Zoom and navigation controls
- Download button
- Print button
- Send via email button

### InvoiceMetricsComponent
- Summary statistics for invoices
- Status distribution chart (paid, overdue, draft)
- Aging report visualization
- Average payment time metrics
- Invoices by client/vendor chart
- Revenue/Expense trend analysis

## User Experience Flow

### Creating an Invoice
1. User navigates to Invoices page
2. User clicks "Create Invoice" button
3. User selects invoice type and client/vendor
4. User links to project/contract if applicable
5. User fills out invoice details and line items
6. User adds terms and notes
7. User saves invoice as draft or saves and sends
8. If sent, system generates PDF and emails to recipient

### Managing Invoices
1. User views invoices list or grid
2. User filters/sorts invoices as needed
3. User clicks on invoice to view details
4. User can edit draft invoices
5. User can track status changes (sent, viewed, paid)
6. User can record payments received/made
7. User can send reminders for overdue invoices
8. User can void incorrect invoices

### Sending and Tracking
1. User creates or opens a draft invoice
2. User clicks "Send" button
3. System generates PDF and sends email
4. Invoice status changes to "Sent"
5. System tracks if email is opened/viewed (if possible)
6. Status updates to "Viewed"

### Recording Payments
1. User receives/makes a payment for an invoice
2. User navigates to the invoice details
3. User clicks "Record Payment" button
4. User enters payment details (amount, date, method)
5. System links payment to invoice (via Payments module)
6. Invoice status updates (Partially Paid, Paid)
7. Amount due is recalculated

### Handling Overdue Invoices
1. System automatically flags overdue invoices
2. User filters list to view overdue invoices
3. User selects overdue invoice
4. User clicks "Send Reminder" button
5. User confirms reminder details and sends
6. Reminder history is tracked

## Responsive Design

### Desktop View
- Full invoices list with multiple columns
- Advanced filtering and sorting options
- Side-by-side invoice details and PDF preview
- Comprehensive line item editing interface
- Detailed metrics and aging reports

### Tablet View
- Simplified list with fewer visible columns
- Collapsible filtering options
- Stacked layout for invoice details
- Streamlined line item editing
- Essential metrics display

### Mobile View
- List view optimized for small screens
- Essential information display
- Full-screen forms for creating/editing invoices
- Basic PDF preview
- Key metrics only
- Optimized for quick payment recording

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for both modes
- PDF preview styling adapted for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Invoice Processing (Incoming)
- OCR for extracting data from vendor invoices
- Automatic matching with purchase orders or contracts
- Duplicate invoice detection
- GL code suggestions
- Approval workflow initiation suggestions

### Payment Prediction
- Prediction of client payment dates based on history
- Identification of clients likely to pay late
- Cash flow forecasting based on invoice due dates and predictions
- Optimal reminder timing suggestions
- DSO (Days Sales Outstanding) calculation and prediction

### Line Item Generation
- Suggestions for line items based on project progress or contract milestones
- Automatic population from timesheets or task completion
- Pricing suggestions based on catalog or past invoices
- Tax calculation assistance
- Consistency checks with contract terms

## Implementation Considerations

### Performance Optimization
- Efficient loading of invoice lists with pagination
- Optimized PDF generation for complex invoices
- Caching of client/vendor data
- Efficient calculation of invoice totals and balances
- Fast search and filtering on large datasets

### Data Integration
- Integration with Projects, Contracts, Quotes modules
- Tight integration with Payments module
- Integration with Financial module for reporting
- Integration with Time Tracking for billing
- Potential integration with accounting software

### Security
- Role-based access to invoice information
- Secure handling of financial data
- Audit logging for invoice creation, modification, and status changes
- Secure PDF generation and delivery
- Protection of client/vendor financial details

## Testing Strategy
- Unit tests for invoice total calculations (discounts, taxes, payments)
- Integration tests with Payments and Projects modules
- Performance testing for large invoice volumes
- PDF generation accuracy testing
- Usability testing for invoice creation and payment recording
- Security testing for financial data access
- Cross-browser and responsive design testing
