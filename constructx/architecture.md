# ConstructX Application Architecture and Technology Stack

## 1. Architecture Overview

ConstructX is designed as a modern, scalable, and secure SaaS application with a microservices-based architecture to support the 23 interconnected modules while maintaining clear separation of concerns. The architecture follows enterprise-grade standards with emphasis on security, scalability, and maintainability.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      ┌──────────────┐ │
│  │  Browser │  │  Mobile  │  │  Tablet  │  ... │  PWA Client  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      └──────┬───────┘ │
└───────┼──────────────┼──────────────┼─────────────────┼─────────┘
        │              │              │                 │
        └──────────────┼──────────────┼─────────────────┘
                       │              │
                       ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           API Gateway                           │
│  ┌──────────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │ Authentication & │  │ Rate Limiting │  │ Request Routing  │  │
│  │  Authorization   │  │               │  │                  │  │
│  └──────────────────┘  └───────────────┘  └──────────────────┘  │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Microservices Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      ┌──────────────┐ │
│  │   User   │  │ Company  │  │ Project  │      │    Module    │ │
│  │ Service  │  │ Service  │  │ Service  │  ... │   Services   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      └──────┬───────┘ │
└───────┼──────────────┼──────────────┼─────────────────┼─────────┘
        │              │              │                 │
        ▼              ▼              ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Shared Services                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │   AI     │  │ Notifi-  │  │  File    │  │    Integration   │ │
│  │ Service  │  │ cations  │  │ Storage  │  │     Service      │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────────┘ │
└───────┼──────────────┼──────────────┼─────────────┼─────────────┘
        │              │              │             │
        ▼              ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌──────────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │   PostgreSQL     │  │   Redis       │  │  Object Storage  │  │
│  │   Database       │  │   Cache       │  │  (S3-compatible) │  │
│  └──────────────────┘  └───────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

### Frontend Stack

1. **Core Framework**:
   - **React**: For building a dynamic, component-based UI
   - **Next.js**: For server-side rendering, routing, and API routes
   - **TypeScript**: For type safety and better developer experience

2. **UI Components and Styling**:
   - **ShadcnUI**: As specified, for modern UI components
   - **Tailwind CSS**: For utility-first styling
   - **Radix UI**: For accessible UI primitives
   - **Framer Motion**: For smooth animations and transitions

3. **State Management**:
   - **React Query**: For server state management
   - **Zustand**: For client-side state management
   - **Context API**: For theme and global state

4. **Form Handling**:
   - **React Hook Form**: For efficient form management
   - **Zod**: For schema validation

5. **Data Visualization**:
   - **D3.js**: For custom visualizations
   - **Chart.js**: For standard charts
   - **react-gantt**: For schedule visualization

6. **Document Handling**:
   - **PDF.js**: For PDF rendering
   - **react-pdf**: For PDF generation
   - **Excalidraw**: For markup and annotations

7. **Maps and Geospatial**:
   - **Mapbox GL JS**: For interactive maps
   - **Turf.js**: For geospatial analysis

8. **3D and Site Visualization**:
   - **Three.js**: For 3D rendering
   - **Pannellum**: For 360° image viewing

### Backend Stack

1. **Core Framework**:
   - **Node.js**: For JavaScript runtime
   - **Express.js**: For API framework
   - **TypeScript**: For type safety

2. **API Design**:
   - **RESTful API**: For standard CRUD operations
   - **GraphQL** (with Apollo Server): For complex data fetching
   - **WebSockets**: For real-time features

3. **Authentication & Authorization**:
   - **JWT**: For stateless authentication
   - **Passport.js**: For authentication strategies
   - **CASL**: For fine-grained authorization

4. **Database**:
   - **PostgreSQL**: Primary relational database
   - **Prisma**: ORM for database access
   - **Redis**: For caching and session management

5. **File Storage**:
   - **S3-compatible storage**: For document and media storage
   - **ImageKit**: For image processing and optimization

6. **Search**:
   - **Elasticsearch**: For full-text search capabilities
   - **MeiliSearch**: For fast, typo-tolerant search

7. **Background Processing**:
   - **Bull**: For job queues and background tasks
   - **Redis**: As queue backend

8. **Email and Notifications**:
   - **Nodemailer**: For email sending
   - **SendGrid**: For transactional emails
   - **Socket.io**: For real-time notifications

### AI and Machine Learning

1. **AI Integration**:
   - **OpenRouter API**: For routing to various AI models
   - **Claude API**: For advanced AI capabilities
   - **Langchain**: For building AI applications

2. **Natural Language Processing**:
   - **Hugging Face Transformers**: For text processing
   - **spaCy**: For entity recognition and text analysis

3. **Computer Vision**:
   - **TensorFlow.js**: For client-side image processing
   - **OpenCV.js**: For image analysis

4. **Chatbot Framework**:
   - **Botpress**: For conversational AI
   - **Custom integration** with Claude API

### DevOps and Infrastructure

1. **Containerization**:
   - **Docker**: For containerization
   - **Docker Compose**: For local development

2. **CI/CD**:
   - **GitHub Actions**: For continuous integration
   - **Vercel**: For frontend deployment
   - **AWS/GCP**: For backend services

3. **Monitoring and Logging**:
   - **Sentry**: For error tracking
   - **Prometheus**: For metrics
   - **Grafana**: For visualization
   - **ELK Stack**: For logging

4. **Security**:
   - **Helmet.js**: For securing HTTP headers
   - **CORS**: For cross-origin resource sharing
   - **Rate limiting**: For API protection
   - **Content Security Policy**: For XSS protection

## 3. Data Architecture

### Multi-Company Data Model

The data architecture is designed with multi-company data segregation as a core principle:

1. **Company Scoping**:
   - All primary entities include a `companyId` field
   - Database queries automatically filter by company context
   - Row-level security in PostgreSQL for additional protection

2. **Project Collaboration**:
   - Project participation table links companies to projects
   - Permission matrix defines access levels for each company-project pair
   - Data visibility controlled by both company and project context

3. **Data Partitioning**:
   - Logical partitioning by company for improved performance
   - Shared tables for reference data
   - Company-specific tables for sensitive information

### Database Schema (Simplified)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Companies    │       │     Users       │       │  UserCompanies  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ name            │       │ email           │       │ userId          │
│ subscription    │       │ passwordHash    │       │ companyId       │
│ settings        │       │ firstName       │       │ role            │
│ createdAt       │       │ lastName        │       │ isActive        │
└─────────────────┘       │ lastLogin       │       └─────────────────┘
        │                 └─────────────────┘               │
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Projects     │       │ProjectCompanies │       │  ProjectUsers   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ name            │       │ projectId       │       │ projectId       │
│ ownerId         │       │ companyId       │       │ userId          │
│ companyId       │       │ role            │       │ role            │
│ status          │       │ permissions     │       │ permissions     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│Module-Specific  │       │  Documents      │       │   Activities    │
│    Tables       │       ├─────────────────┤       ├─────────────────┤
├─────────────────┤       │ id              │       │ id              │
│ id              │       │ projectId       │       │ entityType      │
│ projectId       │       │ companyId       │       │ entityId        │
│ companyId       │       │ name            │       │ userId          │
│ ...             │       │ path            │       │ action          │
└─────────────────┘       │ version         │       │ timestamp       │
                          └─────────────────┘       └─────────────────┘
```

## 4. API Architecture

### API Design Principles

1. **RESTful Resources**:
   - Resource-based URL structure
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Consistent response formats

2. **GraphQL for Complex Queries**:
   - Used for dashboards and reporting
   - Reduces over-fetching and under-fetching
   - Allows clients to request exactly what they need

3. **API Versioning**:
   - URL-based versioning (e.g., `/api/v1/`)
   - Ensures backward compatibility

4. **Authentication and Authorization**:
   - JWT-based authentication
   - Role-based access control
   - Company and project context validation

### API Gateway

The API Gateway serves as the entry point for all client requests and provides:

1. **Authentication and Authorization**:
   - Validates JWT tokens
   - Enforces role-based permissions
   - Adds user and company context to requests

2. **Request Routing**:
   - Routes requests to appropriate microservices
   - Handles service discovery

3. **Rate Limiting and Throttling**:
   - Prevents abuse and ensures fair usage
   - Configurable limits based on subscription tier

4. **Request/Response Transformation**:
   - Standardizes API responses
   - Handles error formatting

5. **Logging and Monitoring**:
   - Captures request metrics
   - Logs API usage for auditing

## 5. Security Architecture

### Authentication System

1. **Multi-Factor Authentication**:
   - Email/password primary authentication
   - Optional TOTP (Time-based One-Time Password)
   - WebAuthn support for biometric authentication

2. **Single Sign-On (SSO)**:
   - SAML 2.0 support for enterprise customers
   - OAuth 2.0 integration for social logins
   - OIDC compliance

3. **Session Management**:
   - JWT with short expiration
   - Refresh token rotation
   - Secure cookie handling

### Authorization Framework

1. **Role-Based Access Control (RBAC)**:
   - Company-level roles
   - Project-level roles
   - Module-specific permissions

2. **Attribute-Based Access Control (ABAC)**:
   - Context-aware permission evaluation
   - Dynamic permission rules based on data attributes

3. **Permission Enforcement**:
   - API-level permission checks
   - UI component conditional rendering
   - Data filtering based on permissions

### Data Protection

1. **Encryption**:
   - Data encryption at rest
   - TLS for data in transit
   - Field-level encryption for sensitive data

2. **Data Segregation**:
   - Multi-company isolation
   - Row-level security in database
   - Query filtering by company context

3. **Audit Logging**:
   - Comprehensive activity logging
   - Tamper-evident audit trails
   - Retention policies for compliance

## 6. Integration Architecture

### Module Integration Framework

1. **Integration Toggles**:
   - Configuration-driven integration between modules
   - Company-level toggle settings
   - Project-level override capabilities

2. **Event-Driven Architecture**:
   - Event bus for inter-module communication
   - Publish-subscribe pattern for loose coupling
   - Event sourcing for critical workflows

3. **Workflow Engine**:
   - Configurable workflow definitions
   - State machine for status transitions
   - Approval routing based on rules

### External Integrations

1. **API-First Approach**:
   - Well-documented public APIs
   - Webhook support for real-time integration
   - OAuth 2.0 for secure third-party access

2. **Common Integration Points**:
   - Accounting systems
   - Project management tools
   - Document management systems
   - BIM platforms
   - Weather services
   - Payment processors

## 7. AI Integration Architecture

### AI Service Layer

1. **AI Orchestration**:
   - Centralized AI service for consistent experience
   - Model routing based on task requirements
   - Fallback mechanisms for reliability

2. **AI Capabilities**:
   - Natural language processing
   - Document analysis and extraction
   - Image recognition and analysis
   - Predictive analytics
   - Recommendation engines

3. **Integration Methods**:
   - REST API for synchronous requests
   - Message queue for asynchronous processing
   - WebSockets for real-time AI interactions

### CX Chatbot Architecture

1. **Chatbot Framework**:
   - Intent recognition
   - Context management
   - Conversation flow design
   - Knowledge base integration

2. **Learning Capabilities**:
   - Training on application documentation
   - Learning from user interactions
   - Continuous improvement through feedback

3. **Integration Points**:
   - Floating chat interface
   - Contextual help within modules
   - Guided tutorials and walkthroughs

## 8. Scalability and Performance

### Horizontal Scalability

1. **Stateless Services**:
   - Services designed to scale horizontally
   - No session state in application servers
   - Shared nothing architecture

2. **Load Balancing**:
   - Application-level load balancing
   - Database connection pooling
   - Read replicas for database scaling

3. **Caching Strategy**:
   - Multi-level caching (client, API, database)
   - Redis for distributed caching
   - Cache invalidation patterns

### Performance Optimization

1. **Database Optimization**:
   - Proper indexing strategy
   - Query optimization
   - Connection pooling

2. **Frontend Performance**:
   - Code splitting and lazy loading
   - Asset optimization
   - Client-side caching

3. **API Performance**:
   - Response compression
   - Pagination for large datasets
   - Efficient batch operations

## 9. Deployment Architecture

### Environment Strategy

1. **Multiple Environments**:
   - Development
   - Testing/QA
   - Staging
   - Production

2. **Infrastructure as Code**:
   - Terraform for infrastructure provisioning
   - Docker for containerization
   - Kubernetes for orchestration (optional)

3. **CI/CD Pipeline**:
   - Automated testing
   - Continuous integration
   - Continuous deployment with approval gates

### Monitoring and Observability

1. **Application Monitoring**:
   - Real-time performance metrics
   - Error tracking and alerting
   - User experience monitoring

2. **Infrastructure Monitoring**:
   - Resource utilization
   - Availability monitoring
   - Cost optimization

3. **Business Metrics**:
   - User engagement
   - Feature usage
   - Subscription analytics

## 10. Subscription and Payment Architecture

### Subscription Management

1. **Plan Tiers**:
   - Feature-based differentiation
   - User and project limits
   - Storage quotas

2. **Billing System**:
   - Recurring billing automation
   - Usage-based billing components
   - Proration for plan changes

3. **Payment Processing**:
   - Integration with payment gateways
   - Secure payment information handling
   - Invoice generation and management

### Company and Project Onboarding

1. **Company Registration**:
   - Multi-step registration process
   - Verification workflows
   - Initial admin user setup

2. **User Onboarding**:
   - Invitation system
   - Role assignment
   - Guided onboarding experience

3. **Project Creation**:
   - Template-based project setup
   - Plan-based project limits
   - Project configuration wizard
