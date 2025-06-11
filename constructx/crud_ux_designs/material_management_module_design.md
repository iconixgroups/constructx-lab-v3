# Material Management Module - Complete CRUD & UX Design

## Overview
The Material Management module provides tools for tracking construction materials from procurement through inventory to site usage. It includes features for material cataloging, inventory management, purchase orders, deliveries, and consumption tracking, integrating with procurement, schedule, and financial modules.

## Entity Model

### MaterialCatalogItem
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `name`: String
- `description`: Text
- `sku`: String (Stock Keeping Unit)
- `category`: String
- `unitOfMeasure`: String (e.g., kg, m, piece, box)
- `specifications`: JSON (technical details, properties)
- `supplierId`: UUID (Foreign Key to Vendor/Supplier, optional - preferred supplier)
- `unitCost`: Decimal (estimated or standard cost)
- `isActive`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### InventoryLocation
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `projectId`: UUID (Foreign Key to Project, optional)
- `name`: String (e.g., Main Warehouse, Site A Storage, Laydown Yard B)
- `type`: String (Warehouse, Site Storage, Yard, Virtual)
- `address`: JSON (optional)
- `coordinates`: JSON (optional, latitude/longitude)
- `isActive`: Boolean
- `createdBy`: UUID (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### InventoryItem
- `id`: UUID (Primary Key)
- `catalogItemId`: UUID (Foreign Key to MaterialCatalogItem)
- `locationId`: UUID (Foreign Key to InventoryLocation)
- `quantityOnHand`: Decimal
- `quantityReserved`: Decimal
- `quantityOnOrder`: Decimal
- `reorderPoint`: Decimal (optional)
- `lastCountDate`: Date (optional)
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### PurchaseOrder
- `id`: UUID (Primary Key)
- `companyId`: UUID (Foreign Key to Company)
- `projectId`: UUID (Foreign Key to Project, optional)
- `poNumber`: String (Unique identifier)
- `vendorId`: UUID (Foreign Key to Vendor/Supplier)
- `status`: String (Draft, Submitted, Approved, Partially Received, Received, Closed, Cancelled)
- `orderDate`: Date
- `expectedDeliveryDate`: Date
- `totalAmount`: Decimal
- `currency`: String
- `shippingAddressId`: UUID (Foreign Key to InventoryLocation or custom address)
- `billingAddress`: JSON
- `terms`: Text
- `notes`: Text
- `createdBy`: UUID (Foreign Key to User)
- `approvedBy`: UUID (Foreign Key to User, optional)
- `approvedAt`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### PurchaseOrderItem
- `id`: UUID (Primary Key)
- `purchaseOrderId`: UUID (Foreign Key to PurchaseOrder)
- `catalogItemId`: UUID (Foreign Key to MaterialCatalogItem)
- `description`: String (can override catalog item description)
- `quantityOrdered`: Decimal
- `unitOfMeasure`: String
- `unitPrice`: Decimal
- `totalPrice`: Decimal (calculated)
- `quantityReceived`: Decimal
- `receivedDate`: Date (optional, date of last receipt)
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### MaterialDelivery
- `id`: UUID (Primary Key)
- `projectId`: UUID (Foreign Key to Project)
- `purchaseOrderId`: UUID (Foreign Key to PurchaseOrder, optional)
- `deliveryNumber`: String (e.g., Packing Slip #)
- `vendorId`: UUID (Foreign Key to Vendor/Supplier)
- `status`: String (Scheduled, In Transit, Partially Received, Received, Rejected)
- `deliveryDate`: Date
- `receivedById`: UUID (Foreign Key to User)
- `receivedLocationId`: UUID (Foreign Key to InventoryLocation)
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### MaterialDeliveryItem
- `id`: UUID (Primary Key)
- `deliveryId`: UUID (Foreign Key to MaterialDelivery)
- `purchaseOrderItemId`: UUID (Foreign Key to PurchaseOrderItem, optional)
- `catalogItemId`: UUID (Foreign Key to MaterialCatalogItem)
- `quantityReceived`: Decimal
- `quantityAccepted`: Decimal
- `quantityRejected`: Decimal
- `rejectionReason`: Text (optional)
- `notes`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### MaterialConsumption
- `id`: UUID (Primary Key)
- `projectId`: UUID (Foreign Key to Project)
- `taskId`: UUID (Foreign Key to Task, optional)
- `catalogItemId`: UUID (Foreign Key to MaterialCatalogItem)
- `locationId`: UUID (Foreign Key to InventoryLocation)
- `quantityConsumed`: Decimal
- `consumptionDate`: Date
- `consumedBy`: UUID (Foreign Key to User)
- `notes`: Text
- `createdAt`: DateTime

## API Endpoints

### Material Catalog
- `GET /api/material-catalog` - List all catalog items
- `GET /api/material-catalog/:id` - Get specific catalog item details
- `POST /api/material-catalog` - Create new catalog item
- `PUT /api/material-catalog/:id` - Update catalog item
- `DELETE /api/material-catalog/:id` - Delete catalog item

### Inventory Locations
- `GET /api/inventory-locations` - List all inventory locations
- `POST /api/inventory-locations` - Create new location
- `PUT /api/inventory-locations/:id` - Update location
- `DELETE /api/inventory-locations/:id` - Delete location

### Inventory Items
- `GET /api/inventory` - List all inventory items with filtering (by location, item)
- `GET /api/inventory/:id` - Get specific inventory item details
- `POST /api/inventory/adjust` - Adjust inventory quantity (manual count, etc.)
- `GET /api/inventory/low-stock` - List items below reorder point

### Purchase Orders
- `GET /api/purchase-orders` - List all purchase orders
- `GET /api/purchase-orders/:id` - Get specific PO details
- `POST /api/purchase-orders` - Create new PO
- `PUT /api/purchase-orders/:id` - Update PO
- `DELETE /api/purchase-orders/:id` - Delete/Cancel PO
- `PUT /api/purchase-orders/:id/submit` - Submit PO for approval
- `PUT /api/purchase-orders/:id/approve` - Approve PO
- `GET /api/projects/:projectId/purchase-orders` - Get POs for a project

### Purchase Order Items
- `GET /api/purchase-orders/:poId/items` - List items for a PO
- `POST /api/purchase-orders/:poId/items` - Add item to PO
- `PUT /api/purchase-order-items/:id` - Update PO item
- `DELETE /api/purchase-order-items/:id` - Delete PO item

### Material Deliveries
- `GET /api/material-deliveries` - List all deliveries
- `GET /api/material-deliveries/:id` - Get specific delivery details
- `POST /api/material-deliveries` - Record new delivery
- `PUT /api/material-deliveries/:id` - Update delivery details
- `PUT /api/material-deliveries/:id/receive` - Mark delivery as received

### Material Delivery Items
- `GET /api/material-deliveries/:deliveryId/items` - List items for a delivery
- `POST /api/material-deliveries/:deliveryId/items` - Add received item to delivery
- `PUT /api/material-delivery-items/:id` - Update received item details (accepted/rejected qty)

### Material Consumption
- `GET /api/material-consumption` - List all consumption records
- `POST /api/material-consumption` - Record material consumption
- `GET /api/projects/:projectId/material-consumption` - Get consumption for a project
- `GET /api/tasks/:taskId/material-consumption` - Get consumption for a task

## Frontend Components

### MaterialManagementPage
- Main container for material management
- Tabs/Sections for Catalog, Inventory, Purchase Orders, Deliveries, Consumption
- Global search across materials
- Quick actions (Create PO, Record Delivery, Record Consumption)
- Material metrics summary (inventory value, low stock items)

### MaterialCatalogList
- List/grid view of catalog items
- Filtering by category, supplier
- Search functionality
- Add/edit/delete catalog item controls
- View inventory levels link

### MaterialCatalogForm
- Form for creating/editing catalog items
- Details, specifications, unit of measure, cost fields
- Supplier selection
- Category management
- Save/cancel buttons

### InventoryLocationsList
- List of inventory locations
- Type and project indicators
- Add/edit/delete location controls
- View inventory at location link

### InventoryView
- List/grid view of inventory items across locations
- Filtering by location, catalog item
- Quantity on hand, reserved, on order display
- Reorder point indicators
- Adjust inventory button
- Inventory count recording interface

### PurchaseOrdersList
- Tabular view of purchase orders
- Filtering by status, vendor, project
- Search functionality
- Create PO button
- Row-level actions (view, edit draft, submit, approve)
- Status indicators
- Total amount display

### PurchaseOrderForm
- Form for creating/editing purchase orders
- Vendor selection
- Project linking
- Shipping/Billing address selection
- Line items management
- Terms and notes fields
- Save as draft / Submit for approval buttons

### PurchaseOrderDetailsPage
- Comprehensive view of a single PO
- Header with key information and status
- Vendor and address details
- Line items display with received quantities
- Linked deliveries section
- Approval history
- Print/Export PDF option

### PurchaseOrderItemsComponent
- List of items on the PO
- Inline editing for drafts
- Quantity ordered vs. received display
- Link to catalog item
- Add/delete item controls

### MaterialDeliveriesList
- List of material deliveries
- Filtering by status, vendor, PO
- Search functionality
- Record delivery button
- Row-level actions (view, edit, receive)
- Status indicators

### MaterialDeliveryForm
- Form for recording/editing deliveries
- Vendor selection
- PO linking (optional)
- Delivery date and received by fields
- Received location selection
- Line items management (received quantities)
- Notes and attachment upload (packing slip)
- Save/Mark as Received buttons

### MaterialDeliveryDetailsPage
- View of a single delivery
- Header with key information
- Vendor and PO details
- Received items list with accepted/rejected quantities
- Link to update inventory
- Attachments (packing slip)

### MaterialConsumptionForm
- Form for recording material usage
- Project and task selection
- Catalog item selection
- Consumed quantity input
- Source inventory location selection
- Consumption date and user
- Notes field
- Save consumption record button

### MaterialConsumptionList
- List of material consumption records
- Filtering by project, task, material, date
- Search functionality
- View consumption details
- Export consumption data

### MaterialMetricsComponent
- Inventory valuation report
- Stock level dashboard (on hand, low stock, on order)
- Purchase order status summary
- Delivery tracking overview
- Consumption analysis by project/task

## User Experience Flow

### Managing Material Catalog
1. User navigates to Material Management > Catalog
2. User views list of catalog items
3. User can add new items with specifications, cost, etc.
4. User can edit existing items
5. User can search or filter catalog

### Managing Inventory
1. User navigates to Material Management > Inventory
2. User views current stock levels across locations
3. User can filter by location or item
4. User can perform stock counts and record adjustments
5. System highlights items below reorder point

### Creating a Purchase Order
1. User navigates to Material Management > Purchase Orders
2. User clicks "Create PO" button
3. User selects vendor, project, and delivery location
4. User adds items from catalog, specifying quantity and price
5. User saves draft or submits for approval
6. If approval needed, it follows workflow (via Approvals module)

### Receiving Materials
1. User navigates to Material Management > Deliveries
2. User clicks "Record Delivery" button
3. User selects vendor and optionally links to PO
4. User enters delivery details and received items/quantities
5. User uploads packing slip photo/scan
6. User marks delivery as received
7. System prompts to update inventory levels based on accepted quantities

### Recording Consumption
1. User navigates to Material Management > Consumption
2. User clicks "Record Consumption" button
3. User selects project, task, material, and source location
4. User enters quantity consumed
5. User saves consumption record
6. System automatically deducts quantity from inventory

## Responsive Design

### Desktop View
- Full lists with multiple columns for catalog, inventory, POs, etc.
- Advanced filtering and reporting options
- Side-by-side views for PO/Delivery details
- Comprehensive catalog and inventory management forms
- Detailed metrics dashboards

### Tablet View
- Simplified list views
- Collapsible filtering options
- Stacked layouts for details pages
- Optimized forms for PO creation and delivery recording
- Essential metrics display

### Mobile View
- Focused views for specific tasks (e.g., Record Delivery, Record Consumption)
- Simplified lists optimized for viewing key info
- Easy barcode scanning for item identification (future consideration)
- Quick inventory lookup
- Streamlined forms for field data entry

## Dark/Light Mode Support
- Color scheme variables for all components
- Status color indicators for POs/Deliveries for both modes
- Inventory level indicators styled for both modes
- Consistent contrast ratios for accessibility

## AI Integration

### Inventory Optimization
- Demand forecasting for materials based on project schedules
- Reorder point optimization suggestions
- Identification of slow-moving or obsolete stock
- Optimal storage location suggestions
- Stockout prediction and prevention alerts

### Procurement Assistance
- Supplier recommendation based on price, reliability, lead time
- Automated PO generation based on low stock levels or project needs
- Price comparison across vendors
- Negotiation support with historical pricing data
- Identification of bulk purchase opportunities

### Consumption Analysis
- Actual vs. estimated material usage variance analysis
- Waste factor calculation and optimization suggestions
- Linking consumption patterns to project progress
- Anomaly detection in material usage
- Budget impact analysis based on consumption

## Implementation Considerations

### Performance Optimization
- Efficient loading of large material catalogs and inventory lists
- Optimized inventory level calculations after transactions
- Caching of vendor and catalog data
- Fast search across all material-related entities
- Scalability for high transaction volumes

### Data Integration
- Integration with Procurement module (if separate)
- Integration with Schedule module for demand forecasting
- Integration with Financial module for PO costs and inventory valuation
- Integration with Projects and Tasks for consumption tracking
- Barcode/RFID scanning integration (future consideration)

### Security
- Role-based access to catalog, inventory, and procurement functions
- Permissions for creating POs, approving POs, receiving goods, adjusting inventory
- Secure handling of vendor pricing and cost data
- Audit logging for all inventory movements and PO changes
- Data integrity for stock levels

## Testing Strategy
- Unit tests for inventory level calculations and PO totals
- Integration tests for PO -> Delivery -> Inventory update workflow
- Performance testing with large catalogs and inventory volumes
- Usability testing for PO creation and receiving process
- Mobile usability testing for field consumption recording
- Cross-browser and responsive design testing
