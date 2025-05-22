# ConstructX Design System

## Overview

The ConstructX Design System provides a comprehensive set of UI components, patterns, and guidelines to ensure a consistent, accessible, and high-quality user experience across the entire application. Built on ShadcnUI components, the design system supports both light and dark modes and follows modern enterprise application best practices.

## Design Principles

1. **Clarity**: Interfaces should be intuitive and easy to understand
2. **Efficiency**: Optimize for productivity and minimize clicks for common tasks
3. **Consistency**: Maintain visual and interaction consistency across all modules
4. **Accessibility**: Ensure the application is usable by people of all abilities
5. **Responsiveness**: Provide optimal experience across all device sizes
6. **Modularity**: Design components that can be reused across the application

## Color System

### Primary Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Primary | #0284c7 | #38bdf8 | Primary actions, links, active states |
| Primary-Foreground | #ffffff | #000000 | Text on primary background |
| Secondary | #64748b | #94a3b8 | Secondary actions, less prominent elements |
| Secondary-Foreground | #ffffff | #000000 | Text on secondary background |
| Accent | #f59e0b | #fbbf24 | Highlights, accents, attention-grabbing elements |
| Accent-Foreground | #000000 | #000000 | Text on accent background |

### Neutral Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Background | #ffffff | #020617 | Page background |
| Foreground | #020617 | #f8fafc | Primary text |
| Card | #ffffff | #0f172a | Card background |
| Card-Foreground | #020617 | #f8fafc | Text on cards |
| Muted | #f1f5f9 | #1e293b | Subtle backgrounds, disabled states |
| Muted-Foreground | #64748b | #94a3b8 | Subtle text, placeholders |
| Border | #e2e8f0 | #1e293b | Borders, dividers |

### Semantic Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Success | #16a34a | #22c55e | Success states, confirmations |
| Success-Foreground | #ffffff | #000000 | Text on success background |
| Warning | #f59e0b | #fbbf24 | Warning states, cautions |
| Warning-Foreground | #000000 | #000000 | Text on warning background |
| Destructive | #dc2626 | #ef4444 | Destructive actions, errors |
| Destructive-Foreground | #ffffff | #ffffff | Text on destructive background |
| Info | #0ea5e9 | #38bdf8 | Informational states |
| Info-Foreground | #ffffff | #000000 | Text on info background |

## Typography

### Font Family

- Primary Font: Inter
- Fallback: system-ui, sans-serif

### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 0.75rem (12px) | 1rem (16px) | Fine print, captions |
| sm | 0.875rem (14px) | 1.25rem (20px) | Secondary text, labels |
| base | 1rem (16px) | 1.5rem (24px) | Body text |
| lg | 1.125rem (18px) | 1.75rem (28px) | Emphasized body text |
| xl | 1.25rem (20px) | 1.75rem (28px) | Small headings |
| 2xl | 1.5rem (24px) | 2rem (32px) | Medium headings |
| 3xl | 1.875rem (30px) | 2.25rem (36px) | Large headings |
| 4xl | 2.25rem (36px) | 2.5rem (40px) | Extra large headings |

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing System

| Name | Size | Usage |
|------|------|-------|
| px | 1px | Borders |
| 0.5 | 0.125rem (2px) | Tiny spacing |
| 1 | 0.25rem (4px) | Very small spacing |
| 1.5 | 0.375rem (6px) | Small spacing |
| 2 | 0.5rem (8px) | Default spacing for compact elements |
| 2.5 | 0.625rem (10px) | Medium-small spacing |
| 3 | 0.75rem (12px) | Default spacing |
| 3.5 | 0.875rem (14px) | Medium spacing |
| 4 | 1rem (16px) | Standard spacing |
| 5 | 1.25rem (20px) | Medium-large spacing |
| 6 | 1.5rem (24px) | Large spacing |
| 7 | 1.75rem (28px) | Extra large spacing |
| 8 | 2rem (32px) | Section spacing |
| 9 | 2.25rem (36px) | Large section spacing |
| 10 | 2.5rem (40px) | Extra large section spacing |
| 11 | 2.75rem (44px) | Huge spacing |
| 12 | 3rem (48px) | Very huge spacing |

## Border Radius

| Name | Size | Usage |
|------|------|-------|
| none | 0px | No rounding |
| sm | 0.125rem (2px) | Subtle rounding |
| DEFAULT | 0.25rem (4px) | Default rounding |
| md | 0.375rem (6px) | Medium rounding |
| lg | 0.5rem (8px) | Large rounding |
| xl | 0.75rem (12px) | Extra large rounding |
| 2xl | 1rem (16px) | Very large rounding |
| full | 9999px | Circular elements |

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| sm | 0 1px 2px 0 rgb(0 0 0 / 0.05) | Subtle elevation |
| DEFAULT | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | Default elevation |
| md | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Medium elevation |
| lg | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | Large elevation |
| xl | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | Extra large elevation |
| 2xl | 0 25px 50px -12px rgb(0 0 0 / 0.25) | Very large elevation |

## Core Components

### Buttons

#### Primary Button
- Purpose: Main actions, form submissions
- States: Default, Hover, Active, Disabled
- Variants: Default, Outline, Ghost, Link

#### Secondary Button
- Purpose: Secondary actions, alternative options
- States: Default, Hover, Active, Disabled
- Variants: Default, Outline, Ghost, Link

#### Destructive Button
- Purpose: Destructive actions (delete, remove)
- States: Default, Hover, Active, Disabled
- Variants: Default, Outline, Ghost, Link

### Form Elements

#### Text Input
- Purpose: Single-line text entry
- States: Default, Focus, Disabled, Error
- Variants: Default, With Icon, With Button

#### Text Area
- Purpose: Multi-line text entry
- States: Default, Focus, Disabled, Error

#### Select
- Purpose: Selection from predefined options
- States: Default, Open, Focus, Disabled, Error

#### Checkbox
- Purpose: Multiple selection or toggle
- States: Unchecked, Checked, Indeterminate, Disabled

#### Radio Button
- Purpose: Single selection from options
- States: Unchecked, Checked, Disabled

#### Switch
- Purpose: Toggle between two states
- States: Off, On, Disabled

### Navigation

#### Sidebar Navigation
- Purpose: Main application navigation
- States: Default, Active, Collapsed
- Features: Collapsible, Icon-only mode, Nested items

#### Tabs
- Purpose: Content organization within a page
- States: Default, Active, Hover, Disabled
- Variants: Default, Underlined, Boxed, Minimal

#### Breadcrumbs
- Purpose: Hierarchical navigation path
- States: Default, Hover, Active

### Data Display

#### Table
- Purpose: Structured data display
- Features: Sortable columns, Pagination, Row selection
- Variants: Default, Compact, Striped

#### Card
- Purpose: Content containers
- Variants: Default, Interactive, Outlined

#### Badge
- Purpose: Status indicators, counts
- Variants: Default, Outline, Secondary, Destructive, Success

#### Avatar
- Purpose: User representation
- Variants: Image, Initials, Icon
- Sizes: Small, Medium, Large

### Feedback

#### Alert
- Purpose: Important messages
- Variants: Info, Success, Warning, Error

#### Toast
- Purpose: Temporary notifications
- Variants: Info, Success, Warning, Error
- Positions: Top, Bottom, Top-Right, Bottom-Left

#### Dialog
- Purpose: Modal interactions
- Variants: Default, Destructive, Form

#### Progress
- Purpose: Operation progress indication
- Variants: Bar, Circular, Indeterminate

### Layout

#### Container
- Purpose: Content width constraint
- Variants: Default, Small, Large, Full

#### Grid
- Purpose: Two-dimensional layout
- Features: Responsive, Gap control

#### Flex
- Purpose: One-dimensional layout
- Features: Direction, Alignment, Wrapping

## Page Templates

### Dashboard Layout
- Header with user menu and global actions
- Collapsible sidebar navigation
- Main content area with breadcrumbs
- Responsive behavior for mobile devices

### List View Layout
- Filtering and search controls
- Data table with pagination
- Bulk action controls
- Create/Add button

### Detail View Layout
- Header with actions and back navigation
- Tabs for content organization
- Form sections with appropriate spacing
- Action buttons (Save, Cancel, Delete)

### Form Layout
- Logical grouping of form fields
- Clear labeling and help text
- Validation feedback
- Action buttons with appropriate hierarchy

## Responsive Breakpoints

| Name | Width | Description |
|------|-------|-------------|
| xs | < 640px | Mobile phones |
| sm | >= 640px | Small tablets, large phones |
| md | >= 768px | Tablets |
| lg | >= 1024px | Laptops, small desktops |
| xl | >= 1280px | Desktops |
| 2xl | >= 1536px | Large desktops |

## Accessibility Guidelines

1. **Color Contrast**: Maintain WCAG 2.1 AA compliance (4.5:1 for normal text, 3:1 for large text)
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Screen Reader Support**: Provide appropriate ARIA labels and roles
4. **Focus Indicators**: Visible focus states for all interactive elements
5. **Text Alternatives**: Alt text for images and meaningful labels for form controls
6. **Responsive Design**: Ensure usability across different screen sizes and orientations

## Dark Mode Implementation

The design system uses CSS variables to manage theme colors, allowing seamless switching between light and dark modes:

```css
:root {
  /* Light mode (default) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 199 89% 39%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 47%;
  --secondary-foreground: 0 0% 100%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 35 92% 51%;
  --accent-foreground: 0 0% 0%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 199 89% 39%;
}

.dark {
  /* Dark mode */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 9.8%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 9.8%;
  --popover-foreground: 210 40% 98%;
  --primary: 199 89% 60%;
  --primary-foreground: 0 0% 0%;
  --secondary: 217.2 32.6% 65%;
  --secondary-foreground: 0 0% 0%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 35 92% 60%;
  --accent-foreground: 0 0% 0%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 199 89% 60%;
}
```

## Implementation with ShadcnUI

ShadcnUI provides the foundation for our component library, with customizations to match our design system. Key implementation details:

1. **Component Customization**: Extend ShadcnUI components with our design tokens
2. **Theme Configuration**: Use the ShadcnUI theming system with our color palette
3. **Composition**: Combine primitive components to create more complex UI patterns
4. **Consistency**: Maintain consistent props and behavior across all components

## Usage Guidelines

1. **Component Selection**: Choose the appropriate component for each use case
2. **Consistency**: Maintain consistent spacing, typography, and color usage
3. **Responsiveness**: Test designs across all breakpoints
4. **Accessibility**: Follow accessibility guidelines for all components
5. **Performance**: Consider performance implications of complex components
6. **Documentation**: Document any custom components or variations

## Design-to-Development Handoff

1. **Component Specifications**: Provide detailed specs for all components
2. **Design Tokens**: Share design tokens as code variables
3. **Interaction States**: Document all interaction states
4. **Responsive Behavior**: Specify behavior across breakpoints
5. **Accessibility Requirements**: Include accessibility requirements in specs
