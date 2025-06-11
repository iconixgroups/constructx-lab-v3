# Emails Management Module - Complete CRUD & UX Design

## Overview
The Emails Management module provides a centralized system for managing project-related emails directly within the ConstructX platform. It enables linking emails to projects, tasks, and other entities, ensuring communication history is captured and accessible in context.

## Entity Model

### EmailAccount
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to User)
- `companyId`: UUID (Foreign Key to Company)
- `emailAddress`: String
- `provider`: String (Gmail, Outlook, IMAP, SMTP)
- `connectionDetails`: JSON (encrypted credentials, server settings)
- `status`: String (Connected, Disconnected, Error)
- `lastSyncTime`: DateTime (optional)
- `isDefault`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Email
- `id`: UUID (Primary Key)
- `accountId`: UUID (Foreign Key to EmailAccount)
- `projectId`: UUID (Foreign Key to Project, optional)
- `messageId`: String (Unique ID from email provider)
- `threadId`: String (Thread ID from email provider)
- `subject`: String
- `fromAddress`: String
- `toAddresses`: Array of Strings
- `ccAddresses`: Array of Strings
- `bccAddresses`: Array of Strings
- `bodyHtml`: Text
- `bodyText`: Text
- `sentDate`: DateTime
- `receivedDate`: DateTime
- `isRead`: Boolean
- `isSent`: Boolean (true if sent from ConstructX)
- `isArchived`: Boolean
- `isFlagged`: Boolean
- `folderId`: UUID (Foreign Key to EmailFolder, optional)
- `tags`: Array of Strings
- `linkedEntityType`: String (Task, RFI, Submittal, etc., optional)
- `linkedEntityId`: UUID (Foreign Key to linked entity, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EmailAttachment
- `id`: UUID (Primary Key)
- `emailId`: UUID (Foreign Key to Email)
- `name`: String
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path, optional if stored externally)
- `contentId`: String (for inline attachments)
- `downloadUrl`: String (if stored externally)
- `createdAt`: DateTime

### EmailFolder
- `id`: UUID (Primary Key)
- `accountId`: UUID (Foreign Key to EmailAccount)
- `name`: String
- `providerFolderId`: String (ID from email provider)
- `parentFolderId`: UUID (Foreign Key to EmailFolder, optional)
- `isSystemFolder`: Boolean (Inbox, Sent, Drafts, etc.)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EmailTag
- `id`: UUID (Primary Key)
- `accountId`: UUID (Foreign Key to EmailAccount)
- `name`: String
- `color`: String (hex code)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EmailTemplate
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `name`: String
- `subject`: String
- `bodyHtml`: Text
- `isShared`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Email Accounts
- `GET /api/email/accounts` - List all connected email accounts for the user
- `GET /api/email/accounts/:id` - Get specific account details
- `POST /api/email/accounts` - Connect new email account (OAuth flow or manual config)
- `PUT /api/email/accounts/:id` - Update account settings
- `DELETE /api/email/accounts/:id` - Disconnect email account
- `POST /api/email/accounts/:id/sync` - Trigger manual sync for an account

### Emails
- `GET /api/email/emails` - List emails with filtering, sorting, and pagination
- `GET /api/email/emails/:id` - Get specific email details
- `POST /api/email/emails` - Send new email
- `POST /api/email/emails/draft` - Save email draft
- `PUT /api/email/emails/:id/read` - Mark email as read
- `PUT /api/email/emails/:id/unread` - Mark email as unread
- `PUT /api/email/emails/:id/archive` - Archive email
- `PUT /api/email/emails/:id/unarchive` - Unarchive email
- `PUT /api/email/emails/:id/flag` - Flag email
- `PUT /api/email/emails/:id/unflag` - Unflag email
- `PUT /api/email/emails/:id/move` - Move email to folder
- `PUT /api/email/emails/:id/tag` - Add tag to email
- `DELETE /api/email/emails/:id/tag` - Remove tag from email
- `PUT /api/email/emails/:id/link` - Link email to project entity
- `DELETE /api/email/emails/:id/link` - Unlink email from project entity
- `GET /api/projects/:projectId/emails` - Get emails linked to a project
- `GET /api/entities/:entityType/:entityId/emails` - Get emails linked to a specific entity

### Email Attachments
- `GET /api/email/emails/:emailId/attachments` - List attachments for an email
- `GET /api/email/attachments/:id/download` - Download attachment
- `POST /api/email/attachments/upload` - Upload attachment for composing email

### Email Folders
- `GET /api/email/accounts/:accountId/folders` - List folders for an account
- `POST /api/email/accounts/:accountId/folders` - Create new folder
- `PUT /api/email/folders/:id` - Rename folder
- `DELETE /api/email/folders/:id` - Delete folder

### Email Tags
- `GET /api/email/accounts/:accountId/tags` - List tags for an account
- `POST /api/email/accounts/:accountId/tags` - Create new tag
- `PUT /api/email/tags/:id` - Update tag (name, color)
- `DELETE /api/email/tags/:id` - Delete tag

### Email Templates
- `GET /api/email/templates` - List available email templates
- `GET /api/email/templates/:id` - Get specific template details
- `POST /api/email/templates` - Create new template
- `PUT /api/email/templates/:id` - Update template
- `DELETE /api/email/templates/:id` - Delete template

## Frontend Components

### EmailClientPage
- Main container for email management
- Folder tree navigation
- Email list view
- Email preview pane
- Compose email button
- Search bar
- Filtering and sorting controls
- Account switcher
- Settings button

### EmailFolderTree
- Hierarchical view of email folders
- Expand/collapse controls
- Unread count indicators
- System folders (Inbox, Sent, Drafts, etc.)
- Custom folders
- Create/rename/delete folder options
- Drag-and-drop for moving emails

### EmailList
- List of emails in selected folder
- Sender, subject, date preview
- Read/unread indicators
- Attachment indicators
- Flag indicators
- Tag indicators
- Project link indicators
- Pagination
- Bulk actions (read, archive, delete, tag, move)
- Sorting options

### EmailPreviewPane
- Displays content of selected email
- Header with sender, recipients, subject, date
- HTML email rendering
- Attachment viewer/downloader
- Reply, Reply All, Forward buttons
- Print button
- Link to project entity button
- Tag management controls
- Move to folder controls
- Mark as read/unread, flag/unflag controls

### EmailComposeModal
- Modal window for composing new emails
- To, CC, BCC fields with contact suggestions
- Subject field
- Rich text editor for body
- Attachment upload/management
- Template selection
- Signature selection
- Send, Save Draft, Discard buttons
- Link to project entity option

### EmailAttachmentViewer
- Component for viewing/downloading attachments
- File type icons
- File size display
- Download button
- Preview for common file types (images, PDFs)
- Save to project documents option

### EmailTagManager
- Interface for managing tags
- List of existing tags with colors
- Create new tag form
- Edit/delete tag controls
- Apply tags to selected emails
- Filter emails by tag

### EmailTemplateManager
- Interface for managing email templates
- List of existing templates
- Preview template content
- Create new template form
- Edit/delete template controls
- Share template option
- Use template in compose window

### EmailAccountSettings
- Interface for managing connected accounts
- List of connected accounts
- Add new account button (OAuth/Manual)
- Edit connection details
- Set default account
- Sync status and controls
- Disconnect account option

### EmailLinkingComponent
- Interface for linking emails to project entities
- Search for project entities (Tasks, RFIs, Submittals, etc.)
- Select entity to link
- View linked entity details
- Unlink email control
- Display linked entity information in email preview

## User Experience Flow

### Connecting Account
1. User navigates to Email settings
2. User clicks "Add Account"
3. User selects provider (Gmail, Outlook, IMAP)
4. User follows OAuth flow or enters manual configuration
5. Account connects and initial sync begins
6. User can set account as default

### Reading Emails
1. User navigates to Email client page
2. User selects account and folder (e.g., Inbox)
3. User views list of emails
4. User clicks on email to view in preview pane
5. User can read email content and view attachments
6. User can perform actions (reply, forward, archive, tag, link)

### Sending Emails
1. User clicks "Compose" button
2. User fills in recipients, subject, and body
3. User can optionally use template or attach files
4. User can link email to project entity
5. User clicks "Send"
6. Email is sent via connected account and appears in Sent folder

### Linking Emails to Projects
1. User views an email in preview pane
2. User clicks "Link to Project" button
3. User searches for relevant project entity (Task, RFI, etc.)
4. User selects entity to link
5. Email is now linked and accessible from the entity's communication history
6. Linked indicator appears on email list and preview

### Managing Emails
1. User selects one or more emails in list
2. User uses toolbar or context menu for actions
3. User can mark as read/unread, archive, delete, flag
4. User can move emails to different folders
5. User can apply or remove tags

## Responsive Design

### Desktop View
- Multi-pane layout (Folder Tree, List, Preview)
- Full rich text editor for composing
- Advanced filtering and sorting options
- Side-by-side attachment preview
- Comprehensive settings management

### Tablet View
- Collapsible folder tree
- List and preview panes adjust dynamically
- Simplified rich text editor
- Essential filtering options
- Optimized attachment handling
- Streamlined settings

### Mobile View
- Single pane view, navigating between list and detail
- Simplified email list display
- Full-screen compose view
- Basic filtering options
- Touch-optimized actions
- Minimal settings accessible

## Dark/Light Mode Support
- Color scheme variables for all components
- Email content rendering adapted for both modes
- Tag color visibility ensured in both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Smart Sorting/Filtering
- Automatic categorization of emails (Project-related, Personal, etc.)
- Priority inbox based on sender and content
- Suggested folders or tags for incoming emails
- Identification of emails requiring action
- Spam detection enhancement

### Compose Assistance
- AI-suggested replies based on email content
- Subject line recommendations
- Tone analysis and suggestions
- Grammar and spelling correction
- Automatic linking suggestions to project entities

### Information Extraction
- Extraction of key information (dates, actions, contacts)
- Automatic creation of tasks or calendar events from emails
- Summarization of long email threads
- Identification of required actions or decisions
- Contact information extraction

## Implementation Considerations

### Performance Optimization
- Efficient email syncing with providers
- Lazy loading of email content and attachments
- Optimized search indexing for large mailboxes
- Caching of folder structures and tags
- Efficient rendering of long email lists

### Data Integration
- Secure handling of email credentials (encryption)
- Robust error handling for sync issues
- Integration with all modules for linking capabilities
- Contact management integration
- Notification system integration for new emails

### Security
- OAuth 2.0 for secure account connection
- Encryption of sensitive connection details
- Protection against XSS in HTML email rendering
- Permission controls for accessing shared accounts/templates
- Compliance with email provider API terms of service

## Testing Strategy
- Unit tests for email parsing and rendering
- Integration tests with email provider APIs (mocked/live)
- Performance testing for email sync and search
- Security testing for credential handling and XSS
- Usability testing for compose and management workflows
- Cross-browser and responsive design testing
