# Equipment Management Module - Complete CRUD & UX Design

## Overview
The Equipment Management module provides tools for tracking construction equipment, including owned, rented, or leased assets. It covers equipment cataloging, maintenance scheduling, usage tracking, location monitoring, and cost analysis, integrating with resource management, schedule, and financial modules.

## Entity Model

### EquipmentCatalogItem
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `name`: String (e.g., Excavator 320, Tower Crane TC-5)
- `description`: Text
- `type`: String (Heavy Equipment, Vehicle, Tool, etc.)
- `category`: String
- `manufacturer`: String
- `model`: String
- `specifications`: JSON (capacity, dimensions, power, etc.)
- `purchaseCost`: Decimal (optional)
- `hourlyRate`: Decimal (standard internal charge-out rate)
- `dailyRate`: Decimal
- `isActive`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Equipment
- `id`: UUID (Primary Key)
- `catalogItemId`: UUID (Foreign Key to EquipmentCatalogItem)
- `assetTag`: String (Unique identifier for the specific piece of equipment)
- `serialNumber`: String
- `status`: String (Available, In Use, Maintenance, Out of Service, Disposed)
- `ownershipType`: String (Owned, Rented, Leased)
- `ownerCompanyId`: UUID (Foreign Key to Company, if owned)
- `rentalVendorId`: UUID (Foreign Key to Vendor, if rented/leased)
- `rentalStartDate`: Date (optional)
- `rentalEndDate`: Date (optional)
- `purchaseDate`: Date (optional)
- `warrantyExpirationDate`: Date (optional)
- `currentLocationId`: UUID (Foreign Key to InventoryLocation or Project Site)
- `currentProjectId`: UUID (Foreign Key to Project, optional)
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EquipmentMaintenanceSchedule
- `id`: UUID (Primary Key)
- `equipmentId`: UUID (Foreign Key to Equipment)
- `maintenanceType`: String (Preventive, Corrective, Inspection)
- `description`: Text
- `frequencyType`: String (Hours, Miles/Km, Calendar Days, Date)
- `frequencyValue`: Integer
- `lastMaintenanceDate`: Date (optional)
- `lastMaintenanceReading`: Decimal (hours/miles)
- `nextDueDate`: Date (calculated or set)
- `nextDueReading`: Decimal (calculated or set)
- `estimatedDuration`: Integer (hours)
- `estimatedCost`: Decimal
- `assignedTo`: UUID (Foreign Key to User/Team, optional)
- `isActive`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EquipmentMaintenanceLog
- `id`: UUID (Primary Key)
- `equipmentId`: UUID (Foreign Key to Equipment)
- `scheduleId`: UUID (Foreign Key to EquipmentMaintenanceSchedule, optional)
- `logNumber`: String
- `maintenanceType`: String
- `status`: String (Scheduled, In Progress, Completed, Cancelled)
- `startDate`: DateTime
- `completedDate`: DateTime (optional)
- `performedBy`: String (Internal Team or External Vendor)
- `vendorId`: UUID (Foreign Key to Vendor, if external)
- `descriptionOfWork`: Text
- `partsUsed`: JSON (list of parts and quantities)
- `actualDuration`: Integer (hours)
- `actualCost`: Decimal
- `currentReading`: Decimal (hours/miles at time of maintenance)
- `notes`: Text
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### EquipmentUsageLog
- `id`: UUID (Primary Key)
- `equipmentId`: UUID (Foreign Key to Equipment)
- `projectId`: UUID (Foreign Key to Project)
- `taskId`: UUID (Foreign Key to Task, optional)
- `operatorId`: UUID (Foreign Key to User)
- `startDate`: DateTime
- `endDate`: DateTime
- `startReading`: Decimal (hours/miles)
- `endReading`: Decimal (hours/miles)
- `duration`: Decimal (calculated hours/miles)
- `fuelConsumed`: Decimal (optional)
- `notes`: Text
- `createdAt`: DateTime

### EquipmentAttachment
- `id`: UUID (Primary Key)
- `equipmentId`: UUID (Foreign Key to Equipment)
- `maintenanceLogId`: UUID (Foreign Key to EquipmentMaintenanceLog, optional)
- `usageLogId`: UUID (Foreign Key to EquipmentUsageLog, optional)
- `name`: String
- `description`: Text (optional)
- `fileSize`: Integer (bytes)
- `fileType`: String (MIME type)
- `filePath`: String (storage path)
- `documentType`: String (Manual, Warranty, Maintenance Record, Photo)
- `uploadedBy`: UUID (Foreign Key to User)
- `uploadedAt`: DateTime

## API Endpoints

### Equipment Catalog
- `GET /api/equipment-catalog` - List all catalog items
- `GET /api/equipment-catalog/:id` - Get specific catalog item details
- `POST /api/equipment-catalog` - Create new catalog item
- `PUT /api/equipment-catalog/:id` - Update catalog item
- `DELETE /api/equipment-catalog/:id` - Delete catalog item

### Equipment
- `GET /api/equipment` - List all equipment assets with filtering
- `GET /api/equipment/:id` - Get specific equipment asset details
- `POST /api/equipment` - Add new equipment asset
- `PUT /api/equipment/:id` - Update equipment asset details
- `DELETE /api/equipment/:id` - Dispose/delete equipment asset
- `GET /api/equipment/statuses` - Get available equipment statuses
- `PUT /api/equipment/:id/status` - Update equipment status
- `PUT /api/equipment/:id/location` - Update equipment location
- `GET /api/projects/:projectId/equipment` - Get equipment assigned to a project

### Equipment Maintenance Schedules
- `GET /api/equipment/:equipmentId/maintenance-schedules` - List schedules for equipment
- `POST /api/equipment/:equipmentId/maintenance-schedules` - Create new schedule
- `PUT /api/equipment-maintenance-schedules/:id` - Update schedule
- `DELETE /api/equipment-maintenance-schedules/:id` - Delete schedule
- `GET /api/maintenance-schedules/due` - List maintenance schedules due soon

### Equipment Maintenance Logs
- `GET /api/equipment/:equipmentId/maintenance-logs` - List logs for equipment
- `GET /api/maintenance-logs/:id` - Get specific log details
- `POST /api/equipment/:equipmentId/maintenance-logs` - Create new maintenance log
- `PUT /api/maintenance-logs/:id` - Update log details
- `DELETE /api/maintenance-logs/:id` - Delete log
- `PUT /api/maintenance-logs/:id/complete` - Mark log as completed

### Equipment Usage Logs
- `GET /api/equipment/:equipmentId/usage-logs` - List usage logs for equipment
- `POST /api/equipment/:equipmentId/usage-logs` - Create new usage log
- `PUT /api/usage-logs/:id` - Update usage log
- `DELETE /api/usage-logs/:id` - Delete usage log
- `GET /api/projects/:projectId/usage-logs` - Get usage logs for a project

### Equipment Attachments
- `GET /api/equipment/:equipmentId/attachments` - List attachments for equipment
- `POST /api/equipment/:equipmentId/attachments` - Upload attachment to equipment
- `GET /api/maintenance-logs/:logId/attachments` - List attachments for maintenance log
- `POST /api/maintenance-logs/:logId/attachments` - Upload attachment to maintenance log
- `GET /api/usage-logs/:logId/attachments` - List attachments for usage log
- `POST /api/usage-logs/:logId/attachments` - Upload attachment to usage log
- `GET /api/equipment-attachments/:id/download` - Download attachment
- `DELETE /api/equipment-attachments/:id` - Delete attachment

## Frontend Components

### EquipmentManagementPage
- Main container for equipment management
- Tabs/Sections for Catalog, Fleet, Maintenance, Usage
- Global search across equipment
- Quick actions (Add Equipment, Log Maintenance, Log Usage)
- Equipment metrics summary (utilization rate, maintenance costs, availability)

### EquipmentCatalogList
- List/grid view of equipment catalog items
- Filtering by type, category, manufacturer
- Search functionality
- Add/edit/delete catalog item controls
- Link to view fleet assets of this type

### EquipmentCatalogForm
- Form for creating/editing catalog items
- Details, specifications, rates fields
- Manufacturer and model inputs
- Type and category management
- Save/cancel buttons

### EquipmentFleetList
- List/grid view of all equipment assets
- Filtering by status, type, location, project
- Search by asset tag or serial number
- Add new equipment asset button
- Row-level actions (view details, edit, log maintenance/usage, update status/location)
- Status indicators
- Current location display

### EquipmentForm
- Form for adding/editing equipment assets
- Catalog item selection
- Asset tag and serial number inputs
- Ownership type selection (Owned/Rented/Leased) with relevant fields
- Purchase/Rental dates
- Initial location assignment
- Save/cancel buttons

### EquipmentDetailsPage
- Comprehensive view of a single equipment asset
- Header with key information (tag, type, status, location)
- Catalog details section
- Ownership and warranty information
- Current assignment (project)
- Maintenance schedule section
- Maintenance history section
- Usage log section
- Attachments section
- Update status/location controls

### MaintenanceSchedulesComponent
- List of maintenance schedules for the equipment
- Type, frequency, next due date/reading display
- Add/edit/delete schedule controls
- Activate/deactivate schedule toggle
- Link to create maintenance log

### MaintenanceLogsList
- List of maintenance logs for the equipment
- Filtering by type, status, date range
- Log number, type, status, completion date display
- Cost and duration summary
- Add new log button
- View log details action

### MaintenanceLogForm
- Form for creating/editing maintenance logs
- Link to schedule (optional)
- Type, status, dates fields
- Performed by (internal/external vendor)
- Description of work, parts used fields
- Cost and duration inputs
- Current reading input
- Attachment upload
- Save/Complete buttons

### UsageLogsList
- List of usage logs for the equipment
- Filtering by project, task, operator, date range
- Date range, duration, operator display
- Start/end readings
- Add new usage log button
- View log details action

### UsageLogForm
- Form for creating/editing usage logs
- Project and task selection
- Operator selection
- Start/end date and time pickers
- Start/end reading inputs (hours/miles)
- Fuel consumed input (optional)
- Notes field
- Attachment upload (e.g., operator checklist)
- Save log button

### EquipmentAttachmentsComponent
- List of attachments for equipment/maintenance/usage
- File type icons
- Document type display (Manual, Warranty, Photo, etc.)
- Upload date and user
- Download button
- Delete button

### EquipmentMetricsComponent
- Utilization rate charts (by asset, type, project)
- Maintenance cost analysis (by asset, type, period)
- Downtime analysis
- Availability dashboard
- Fuel efficiency report (if tracked)
- Total cost of ownership calculation

## User Experience Flow

### Adding New Equipment
1. User navigates to Equipment Management > Fleet
2. User clicks "Add Equipment" button
3. User selects item from Equipment Catalog
4. User enters asset tag, serial number, ownership details
5. User sets initial status and location
6. User saves the new equipment asset
7. User can then set up maintenance schedules

### Scheduling Maintenance
1. User navigates to Equipment Details > Maintenance Schedule
2. User clicks "Add Schedule" button
3. User defines maintenance type, frequency, and other details
4. User saves the schedule
5. System calculates next due date/reading based on usage/logs

### Logging Maintenance
1. User navigates to Equipment Details > Maintenance History or receives notification
2. User clicks "Log Maintenance" button
3. User fills in details of work performed, parts, cost, duration
4. User uploads any relevant documents/photos
5. User marks log as completed
6. System updates equipment status if needed and recalculates next maintenance due

### Logging Usage
1. Operator navigates to Equipment Management > Usage (likely on mobile/tablet)
2. Operator selects equipment being used
3. Operator clicks "Log Usage" button
4. Operator enters start/end times, readings, project/task
5. Operator saves usage log
6. System updates equipment readings and calculates utilization

### Managing Fleet
1. Manager navigates to Equipment Management > Fleet
2. Manager views list of equipment, filtering by status, location, etc.
3. Manager updates equipment status (e.g., Available -> In Use)
4. Manager updates equipment location as it moves between sites/projects
5. Manager reviews maintenance due list and schedules work
6. Manager reviews utilization metrics

## Responsive Design

### Desktop View
- Full fleet list with multiple columns
- Advanced filtering and reporting options
- Side-by-side equipment details and maintenance/usage history
- Comprehensive maintenance scheduling interface
- Detailed metrics dashboards

### Tablet View
- Optimized interfaces for logging maintenance and usage
- Simplified list views
- Collapsible filtering options
- Stacked layouts for details pages
- Essential metrics display

### Mobile View
- Primarily focused on logging usage and basic maintenance tasks
- Quick status and location updates
- Simplified equipment lookup (search, barcode scan)
- Easy photo attachment for logs
- Offline capability for usage logging (future consideration)

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for equipment/maintenance for both modes
- Chart and metric styling adapted for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Predictive Maintenance
- Prediction of equipment failure based on usage patterns, sensor data (if available), and maintenance history
- Optimized maintenance scheduling suggestions
- Remaining useful life estimation
- Identification of abnormal operating parameters
- Parts failure prediction

### Utilization Optimization
- Recommendations for equipment allocation based on project needs and availability
- Identification of underutilized or overutilized assets
- Optimal equipment dispatching suggestions
- Fuel consumption optimization recommendations
- Right-sizing fleet suggestions based on historical usage

### Cost Analysis
- AI-driven calculation of true total cost of ownership
- Rent vs. buy analysis recommendations
- Maintenance cost forecasting
- Identification of cost-saving opportunities in maintenance or operations
- Benchmarking equipment costs against industry standards

## Implementation Considerations

### Performance Optimization
- Efficient loading of large equipment fleets and log histories
- Optimized calculation of maintenance due dates/readings
- Caching of catalog and location data
- Fast search and filtering capabilities
- Scalability for telematics data integration (future consideration)

### Data Integration
- Integration with Resource Management module
- Integration with Schedule module for allocation
- Integration with Financial module for costs and depreciation
- Integration with Projects and Tasks for usage tracking
- Telematics/IoT integration for real-time data (future consideration)

### Security
- Role-based access to equipment data, maintenance logs, and cost information
- Permissions for updating status, location, and logs
- Secure handling of rental/lease agreement details
- Audit logging for all equipment status changes and maintenance activities
- Data integrity for usage readings and maintenance records

## Testing Strategy
- Unit tests for maintenance due date calculations and utilization metrics
- Integration tests for usage log -> maintenance schedule updates
- Performance testing with large fleet sizes and extensive log histories
- Mobile usability testing for field usage/maintenance logging
- Attachment handling testing
- Cross-browser and responsive design testing
