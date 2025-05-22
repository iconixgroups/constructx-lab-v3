# ConstructX Onboarding Flow Design

## Overview

The onboarding flow guides new users through the process of setting up their account, selecting a subscription plan, registering their company, and creating their first project. This critical journey establishes the foundation for user success with the platform.

## Design Goals

1. **Simplicity**: Create a clear, step-by-step process that minimizes friction
2. **Guidance**: Provide helpful information at each stage to assist decision-making
3. **Value Communication**: Reinforce the value proposition throughout the process
4. **Conversion**: Optimize for successful completion of the onboarding journey
5. **Personalization**: Tailor the experience based on user role and company needs
6. **Trust**: Build confidence through security indicators and transparent information

## Onboarding Journey

### 1. User Registration

**Components:**
- Clean, focused registration form
- Logo and welcome message
- Form fields:
  - Full Name
  - Email Address
  - Password (with strength indicator)
  - Confirm Password
- Social sign-up options (Google, Microsoft)
- "Already have an account?" link
- Terms of service and privacy policy checkboxes
- "Create Account" button

**Behavior:**
- Real-time validation for all fields
- Password strength indicator updates as user types
- Submit button enables only when form is valid
- Smooth transition to next step on successful submission

### 2. Email Verification

**Components:**
- Confirmation message about verification email
- Email illustration
- Instructions to check inbox (and spam folder)
- Resend verification email option
- Email change option
- Loading indicator during verification process

**Behavior:**
- Automatic detection of verification when possible
- Countdown timer before allowing resend
- Clear feedback when verification is complete

### 3. Subscription Plan Selection

**Components:**
- Plan comparison table with:
  - Pricing tiers (Standard, Professional, Enterprise)
  - Monthly/Annual toggle with savings callout
  - Feature comparison by plan
  - User/project limits by plan
  - Highlighted recommended plan
- Plan selection cards with:
  - Plan name and brief description
  - Price and billing frequency
  - Key features list
  - "Select Plan" button
- "Contact Sales for Custom Pricing" option
- "30-day free trial" messaging
- "No credit card required for trial" reassurance

**Behavior:**
- Toggle switches between monthly and annual pricing
- Selected plan is visually highlighted
- Smooth transition to next step on plan selection
- Special path for "Contact Sales" option

### 4. Company Registration

**Components:**
- Multi-step form with progress indicator
- Step 1: Company Information
  - Company Name
  - Industry (dropdown)
  - Company Size (dropdown)
  - Website (optional)
  - Company Logo Upload (optional)
- Step 2: Company Address
  - Country
  - Address Line 1
  - Address Line 2 (optional)
  - City
  - State/Province
  - Postal Code
- Step 3: Company Settings
  - Default Currency
  - Time Zone
  - Date Format Preference
  - Fiscal Year Start
- Navigation buttons (Previous, Next, Complete)

**Behavior:**
- Save progress between steps
- Validate each step before proceeding
- Allow going back to previous steps
- Show completion percentage
- Provide contextual help for each field

### 5. Team Setup (Optional during trial)

**Components:**
- Team setup introduction with benefits
- Options:
  - "Set up now" button
  - "Skip for now" link
- If "Set up now":
  - Team member invitation form
  - Bulk invite option (CSV upload)
  - Role assignment dropdown for each member
  - Personalized invitation message
  - Preview of invitation email
  - Send invitations button

**Behavior:**
- Email validation for each team member
- Role description tooltips
- Feedback on successful invitations
- Option to add more team members
- Clear path to continue regardless of choice

### 6. Project Creation

**Components:**
- Project creation form with:
  - Project Name
  - Project Description
  - Project Type (dropdown)
  - Start Date (date picker)
  - Estimated End Date (date picker)
  - Project Address
  - Client Information (optional)
  - Project Image Upload (optional)
- Module selection section:
  - Checkboxes for relevant modules
  - Brief description of each module
  - Recommended modules based on project type
- "Create Project" button
- "Projects remaining in plan" indicator

**Behavior:**
- Dynamic form fields based on project type
- Module recommendations update based on selections
- Validation before submission
- Clear feedback on successful creation

### 7. Success & Next Steps

**Components:**
- Success message and celebration graphic
- Project dashboard preview
- "Getting Started" checklist with:
  - Complete your profile
  - Explore key features (with links)
  - Watch tutorial videos
  - Schedule a demo with our team
- CX Chatbot introduction
- "Enter Dashboard" primary button

**Behavior:**
- Animated success celebration
- Chatbot proactively offers help
- Clear path to begin using the platform
- Email confirmation of successful onboarding

## Special Flows

### Free Trial to Paid Conversion

**Components:**
- Trial status bar showing days remaining
- Conversion CTA in dashboard
- Plan selection reminder
- Payment information form:
  - Credit card details with secure input
  - Billing address
  - VAT/Tax ID (if applicable)
  - Billing email
- Order summary with:
  - Selected plan details
  - Prorated charges (if applicable)
  - Taxes
  - Total amount
  - Billing frequency reminder
- Terms acceptance checkbox
- "Complete Purchase" button

**Behavior:**
- Secure credit card form with validation
- Clear feedback on successful payment
- Smooth transition to full account access
- Email receipt and confirmation

### Enterprise Onboarding

**Components:**
- Welcome message from assigned account manager
- Customized onboarding checklist
- Implementation timeline
- Training resources section
- Support contact information
- Integration planning tools
- Data migration assistance

**Behavior:**
- Personalized experience based on sales discussions
- Integration with calendar for scheduling setup calls
- Document upload for enterprise-specific requirements

## Responsive Behavior

### Desktop (1024px and above)
- Side-by-side layout for many components
- Horizontal progress indicators
- Multi-column forms where appropriate

### Tablet (768px - 1023px)
- Optimized layouts with some side-by-side components
- Adjusted form layouts for medium screens
- Touch-friendly input elements

### Mobile (below 768px)
- Stacked, single-column layouts
- Simplified forms with larger touch targets
- Vertical progress indicators
- Collapsible sections for complex forms

## Interactions and Animations

1. **Progress Indication**:
   - Animated progress bar or stepper
   - Micro-animations for step completion
   - Smooth transitions between steps

2. **Form Interactions**:
   - Field focus states with clear visual feedback
   - Inline validation with helpful error messages
   - Success animations for completed sections

3. **Guidance Elements**:
   - Contextual tooltips that appear on focus/hover
   - Expandable help sections for complex choices
   - Subtle highlighting for recommended options

## Visual Design

### Typography
- Clear hierarchy with distinct heading and body styles
- Consistent with design system specifications
- Emphasis on readability for form labels and instructions

### Color Usage
- Primary brand colors for key actions and progress
- Success colors for completion indicators
- Warning/error colors for validation feedback
- Neutral colors for form fields and containers

### Imagery and Icons
- Consistent iconography for feature representation
- Subtle illustrations to enhance understanding
- Progress-appropriate imagery for each step

## Dark Mode Considerations

- Adjusted form field contrast for readability
- Modified progress indicators for dark backgrounds
- Preserved brand colors for recognition and consistency
- Reduced eye strain for longer form completion sessions

## Accessibility Considerations

- Logical tab order through all form elements
- Clear error messages with instructions for correction
- Screen reader friendly form labels and descriptions
- Keyboard navigable interface throughout
- Sufficient color contrast for all text elements
- No time-based requirements that could disadvantage users

## Implementation Notes

- Use form state management with React Hook Form
- Implement multi-step form with state persistence
- Use ShadcnUI form components for consistency
- Implement proper form validation on both client and server
- Store progress to allow resuming the onboarding process
- Track completion metrics for onboarding optimization
- Implement A/B testing framework for onboarding improvements
