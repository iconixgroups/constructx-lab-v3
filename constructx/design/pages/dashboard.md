# ConstructX Dashboard Design

## Overview

The dashboard serves as the central hub for users after logging in, providing an overview of their projects, tasks, and key metrics. It is designed to be highly customizable, allowing users to focus on the information most relevant to their role and current priorities.

## Design Goals

1. **Information Hierarchy**: Present the most important information prominently
2. **Customization**: Allow users to personalize their dashboard experience
3. **Efficiency**: Provide quick access to common tasks and important data
4. **Insights**: Surface AI-generated insights and recommendations
5. **Responsiveness**: Ensure optimal experience across all device sizes
6. **Role Relevance**: Show information relevant to the user's role and permissions

## Dashboard Components

### 1. Header Section

**Components:**
- Company logo and name
- Global search bar with AI-powered search capabilities
- Notification bell with counter
- User profile menu with:
  - User avatar and name
  - Role indicator
  - Account settings link
  - Theme toggle (Light/Dark mode)
  - Help & Support link
  - Logout option
- Company switcher (for users with multiple company access)

**Behavior:**
- Sticky header remains visible while scrolling
- Notifications expand in a dropdown panel
- Search shows real-time suggestions and recent searches
- Profile menu expands on click

### 2. Navigation Sidebar

**Components:**
- Collapsible sidebar with toggle button
- Module navigation links with icons:
  - Dashboard (home)
  - Projects
  - Documents
  - Schedule
  - Team
  - Finance
  - And other modules based on permissions
- Module groups with expand/collapse functionality
- Quick action buttons for common tasks
- Collapse to icon-only view option

**Behavior:**
- Highlight active section
- Expand/collapse module groups
- Collapse to icon-only mode for more screen space
- Hide completely on mobile (accessible via menu button)

### 3. Welcome Section

**Components:**
- Personalized greeting with user name
- Date and day display
- Weather information (optional, location-based)
- Quick summary of today's priorities
- AI assistant prompt/button

**Behavior:**
- Personalized content based on user activity
- Collapsible to save space if desired
- AI assistant expands when clicked

### 4. Project Overview Widget

**Components:**
- Project selection dropdown
- Key project metrics:
  - Overall completion percentage
  - Days remaining/overdue
  - Budget status (with variance)
  - Open issues count
- Project health indicator (Green/Yellow/Red)
- Quick links to project dashboard

**Behavior:**
- Updates when selected project changes
- Visual indicators for metrics (progress bars, icons)
- Click-through to detailed project view

### 5. Tasks & Activities Widget

**Components:**
- Tabs for "My Tasks", "Assigned to Me", "Recent Activity"
- Task list with:
  - Task name
  - Associated project
  - Due date (with overdue highlighting)
  - Priority indicator
  - Status
  - Quick actions (complete, reassign)
- Activity feed showing recent updates
- "View All" link to full task management

**Behavior:**
- Tab switching changes displayed content
- Sort and filter options
- Complete tasks without leaving dashboard
- Infinite scroll or pagination for longer lists

### 6. Calendar Widget

**Components:**
- Mini-calendar view of current month
- Today highlight
- Event/deadline indicators on dates
- Upcoming events list:
  - Meeting/event name
  - Time and duration
  - Associated project
  - Participants
  - Location/virtual link
- "Add Event" quick action

**Behavior:**
- Click dates to see events for that day
- Click events for details/actions
- Toggle between day, week, month views
- Sync with external calendars (optional)

### 7. AI Insights Widget

**Components:**
- Carousel of AI-generated insights:
  - Risk alerts
  - Opportunity suggestions
  - Performance insights
  - Process optimization recommendations
- Insight cards with:
  - Insight title
  - Brief description
  - Relevance/confidence indicator
  - "Take Action" or "Learn More" button
- Feedback buttons (helpful/not helpful)

**Behavior:**
- Carousel auto-advances with pause on hover
- Manual navigation controls
- Expand insights for more details
- Capture feedback to improve AI recommendations

### 8. Financial Summary Widget

**Components:**
- Key financial metrics:
  - Current month invoices (issued/received)
  - Outstanding payments
  - Budget variance across projects
  - Cash flow forecast
- Mini charts for visual representation
- Alert indicators for issues requiring attention

**Behavior:**
- Toggle between company-wide and project-specific data
- Click-through to detailed financial reports
- Hover for additional metric details

### 9. Document Activity Widget

**Components:**
- Recent document activity:
  - Recently uploaded documents
  - Documents requiring review/approval
  - Recently updated documents
- Document cards with:
  - Document name and type icon
  - Project association
  - Last modified date/user
  - Status indicator
  - Quick actions (view, download)

**Behavior:**
- Filter by document type or project
- Preview documents on hover/click
- Quick access to document details

### 10. Customizable Widget Area

**Components:**
- Grid layout for additional widgets
- Widget library with options like:
  - Weather
  - News feed
  - Team availability
  - Equipment status
  - Material deliveries
  - Quality metrics
  - Safety incidents
- "Add Widget" button
- Widget configuration options

**Behavior:**
- Drag-and-drop widget positioning
- Resize widgets
- Configure widget settings
- Save layout preferences

## Dashboard Customization

### Widget Management

**Components:**
- Edit mode toggle
- Widget library panel
- Widget configuration panel
- Layout grid with snap-to positioning
- Save/Cancel layout changes buttons

**Behavior:**
- Enter/exit edit mode
- Drag widgets from library to dashboard
- Resize widgets within grid constraints
- Configure widget data sources and display options
- Save personal layout preferences

### Layout Templates

**Components:**
- Predefined layout templates:
  - Project Manager view
  - Executive view
  - Financial view
  - Field Supervisor view
- Template preview thumbnails
- Apply template button
- Save as template option

**Behavior:**
- Preview templates before applying
- Apply template with confirmation
- Save current layout as custom template
- Share templates with team (admin only)

## Responsive Behavior

### Desktop (1024px and above)
- Full layout with multiple columns of widgets
- Expanded sidebar navigation
- All widgets visible based on user preference

### Tablet (768px - 1023px)
- Reduced to 2-column layout
- Collapsible sidebar (defaults to collapsed)
- Widgets maintain relative sizing

### Mobile (below 768px)
- Single column layout
- Hidden sidebar (accessible via menu)
- Stacked widgets in priority order
- Simplified widget views optimized for small screens

## Interactions and Animations

1. **Widget Interactions**:
   - Smooth expand/collapse animations
   - Subtle hover states for interactive elements
   - Loading states with skeleton screens

2. **Navigation**:
   - Smooth transitions between sections
   - Subtle animations for sidebar collapse/expand
   - Micro-interactions for active states

3. **Data Visualization**:
   - Animated chart rendering
   - Interactive data points with tooltips
   - Dynamic updates when data changes

## Visual Design

### Typography
- Clear hierarchy with distinct heading and body styles
- Consistent with design system specifications
- Emphasis on readability for data-dense displays

### Color Usage
- Status colors for indicators (success, warning, error)
- Data visualization color schemes optimized for clarity
- Consistent with overall design system
- Accessible color combinations for all elements

### Layout
- Grid-based organization for consistency
- White space used strategically to group related information
- Clear visual hierarchy through sizing and positioning

## Dark Mode Considerations

- Adjusted contrast for data visualizations
- Modified widget backgrounds and borders
- Preserved status color meanings while adjusting brightness/saturation
- Reduced eye strain for extended dashboard use

## Accessibility Considerations

- Keyboard navigable interface
- Screen reader friendly widget labels and data
- Sufficient color contrast for all text and data visualizations
- Alternative text for charts and graphs
- Focus indicators for interactive elements

## Implementation Notes

- Use React with ShadcnUI components
- Implement responsive grid system with React Grid Layout
- Use React Query for data fetching and caching
- Implement widget state management with Context API or Redux
- Use Recharts or D3.js for data visualizations
- Store user preferences in database for persistence across sessions
- Implement skeleton loading states for all widgets
