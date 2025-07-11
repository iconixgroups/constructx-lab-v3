# ConstructX SaaS Web Application

A comprehensive construction management SaaS platform built with React, Node.js, Express, and PostgreSQL.

## 🏗️ Overview

ConstructX is a full-featured construction management platform that provides 23+ integrated modules for managing all aspects of construction projects, from leads and contracts to inspections and facility management.

## 🚀 Features

### Core Modules
- **Dashboard** - Comprehensive project overview and analytics
- **Leads Management** - Lead tracking and conversion
- **Projects Management** - Project lifecycle management
- **Tasks Management** - Task assignment and tracking
- **Documents Management** - Document storage and version control
- **Schedule Management** - Gantt charts and timeline management
- **Resources Management** - Resource allocation and tracking
- **Financial Dashboard** - Budget and financial tracking
- **AI Assistant** - Intelligent project assistance

### Specialized Modules
- **Bids Management** - Bid creation and tracking
- **Contracts Management** - Contract lifecycle management
- **Team Management** - Team member and role management
- **RFI Management** - Request for Information tracking
- **Submittals Management** - Submittal review and approval
- **Emails Management** - Project-based email management
- **Approvals Management** - Workflow approvals
- **Payments Management** - Payment processing and tracking
- **Quotes Management** - Quote generation and management
- **Invoices Management** - Invoice creation and tracking
- **Smart Logs Management** - Mobile-optimized logging
- **Inspections Management** - Inspection checklists and tracking
- **Material Management** - Inventory and material tracking
- **Equipment Management** - Equipment and maintenance scheduling
- **Site 360 Management** - 360-degree site photo management
- **Project Archives** - Historical project data
- **Operations & Manuals** - Documentation management
- **Facility Management** - Facility maintenance tracking
- **Reports Management** - Customizable reporting

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **ShadcnUI** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd constructx
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Database Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres createdb constructx
sudo -u postgres psql -c "CREATE USER constructx_user WITH PASSWORD 'constructx_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE constructx TO constructx_user;"
```

#### Initialize Database
```bash
# Run database initialization script
node src/scripts/initDatabase.js
```

#### Start Backend Server
```bash
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend development server will start on `http://localhost:5174`

## 🔐 Default Login Credentials

After database initialization, you can log in with:

- **Email:** `info@constructx.in`
- **Password:** `Admin@2025`
- **Role:** Admin

## 🌐 Accessing the Application

1. Ensure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:5174`
3. Click "Log In" and use the default credentials above
4. You should be successfully logged into the ConstructX dashboard

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=constructx
DB_USER=constructx_user
DB_PASSWORD=constructx_password

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured via `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Network error or server unreachable"
- Ensure the backend server is running on port 5000
- Check that the proxy configuration in `vite.config.ts` is correct
- Verify that no firewall is blocking the connection

#### 2. Database Connection Issues
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in the configuration
- Ensure the database and user exist

#### 3. Frontend Build Issues
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`

#### 4. Port Already in Use
- Kill processes on ports 5000 or 5174:
  ```bash
  fuser -k 5000/tcp
  fuser -k 5174/tcp
  ```

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Database Reset**: Run the initialization script again to reset the database
3. **Logs**: Check console output for both frontend and backend for debugging information

## 📁 Project Structure

```
constructx/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   ├── scripts/
│   │   │   └── initDatabase.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── LoginPage.tsx
│   │   │   └── [23+ module components]
│   │   ├── services/
│   │   │   └── [API service files]
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── tailwind.config.js
├── crud_ux_designs/
│   └── [Module design documents]
├── todo.md
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-Based Access Control** - Different permission levels
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation for all inputs

## 🚀 Deployment

### Production Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure Production Environment**
   - Set production environment variables
   - Configure production database
   - Set up reverse proxy (nginx)

3. **Deploy Backend**
   ```bash
   cd backend
   npm install --production
   NODE_ENV=production npm start
   ```

### Docker Deployment (Optional)

Create `docker-compose.yml` for containerized deployment:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: constructx
      POSTGRES_USER: constructx_user
      POSTGRES_PASSWORD: constructx_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "info@constructx.in",
  "password": "Admin@2025"
}
```

**Response:**
```json
{
  "message": "Login successful!",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "info@constructx.in",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "company_id": 1
  }
}
```

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "company_id": 1
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@constructx.in
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## 🔄 Version History

- **v1.0.0** - Initial release with all 23 modules
- **v1.1.0** - Database integration and authentication
- **v1.2.0** - Enhanced UI/UX and performance improvements

---

**Built with ❤️ for the construction industry**

