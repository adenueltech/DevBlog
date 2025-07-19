# DevBlog - Full-Stack Blogging Platform

A modern, feature-rich blogging platform built with Next.js, NestJS, PostgreSQL, and Prisma. Designed for developers to share knowledge, insights, and engage with the community.

![DevBlog Banner](./public/placeholder.svg)

## 🚀 Features

### Frontend (Next.js 14)
- **Modern UI/UX**: Clean, responsive design with dark/light mode support
- **Article Editor**: Rich markdown editor with live preview and formatting tools
- **User Authentication**: Secure login/register with JWT tokens
- **User Dashboard**: Personal analytics, article management, and profile settings
- **Article Reading**: Optimized reading experience with comments and engagement
- **Explore & Discovery**: Advanced search, filtering, and topic-based browsing
- **Analytics Dashboard**: Comprehensive insights into content performance
- **Responsive Design**: Mobile-first approach with seamless cross-device experience

### Backend (NestJS)
- **RESTful API**: Well-structured API endpoints following REST principles
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Database Integration**: TypeORM with PostgreSQL for robust data management
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: CORS, rate limiting, and input sanitization

### Database (PostgreSQL + Prisma)
- **Relational Data Model**: Optimized schema for users, articles, comments, and analytics
- **Data Integrity**: Foreign key constraints and proper indexing
- **Performance**: Query optimization and connection pooling
- **Migrations**: Version-controlled database schema changes

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **Authentication**: JWT tokens with secure storage
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Security**: bcryptjs for password hashing

### Database
- **Primary Database**: PostgreSQL
- **ORM**: TypeORM
- **Schema Management**: TypeORM migrations

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Heroku
- **Database Hosting**: Supabase/Railway
- **Version Control**: Git + GitHub

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/devblog.git
cd devblog
\`\`\`

### 2. Frontend Setup

\`\`\`bash
# Navigate to frontend directory (if separate)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create environment file
cp .env.example .env

# Configure environment variables (see Environment Variables section)
\`\`\`

### 4. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb devblog_db

# Run database migrations
npm run migration:run

# Seed database (optional)
npm run seed
\`\`\`

### 5. Run the Application

\`\`\`bash
# Terminal 1: Start backend server
cd backend
npm run start:dev

# Terminal 2: Start frontend server
cd frontend
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application running!

## 🔧 Environment Variables

### Frontend (.env.local)
\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### Backend (.env)
\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=devblog_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
\`\`\`

## 📊 Database Schema

### Core Entities

#### Users
\`\`\`sql
- id (UUID, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- name (String)
- bio (Text, Optional)
- avatar (String, Optional)
- website (String, Optional)
- location (String, Optional)
- followersCount (Integer, Default: 0)
- followingCount (Integer, Default: 0)
- createdAt (Timestamp)
- updatedAt (Timestamp)
\`\`\`

#### Articles
\`\`\`sql
- id (UUID, Primary Key)
- title (String)
- slug (String, Unique)
- content (Text)
- excerpt (Text, Optional)
- coverImage (String, Optional)
- status (Enum: draft, published, archived)
- tags (Array of Strings)
- views (Integer, Default: 0)
- likes (Integer, Default: 0)
- commentsCount (Integer, Default: 0)
- readTime (Integer, Optional)
- publishedAt (Timestamp, Optional)
- authorId (UUID, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)
\`\`\`

#### Comments
\`\`\`sql
- id (UUID, Primary Key)
- content (Text)
- likes (Integer, Default: 0)
- authorId (UUID, Foreign Key)
- articleId (UUID, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)
\`\`\`

## 🎯 API Endpoints

### Authentication
\`\`\`
POST   /auth/register     - User registration
POST   /auth/login        - User login
POST   /auth/logout       - User logout
GET    /auth/profile      - Get current user profile
PUT    /auth/profile      - Update user profile
\`\`\`

### Articles
\`\`\`
GET    /articles          - Get all articles (with pagination)
GET    /articles/:slug    - Get article by slug
POST   /articles          - Create new article (auth required)
PUT    /articles/:id      - Update article (auth required)
DELETE /articles/:id      - Delete article (auth required)
GET    /articles/user/:id - Get articles by user
\`\`\`

### Comments
\`\`\`
GET    /comments/article/:id  - Get comments for article
POST   /comments              - Create comment (auth required)
PUT    /comments/:id          - Update comment (auth required)
DELETE /comments/:id          - Delete comment (auth required)
\`\`\`

### Analytics
\`\`\`
GET    /analytics/overview    - Get user analytics overview
GET    /analytics/articles    - Get article performance data
GET    /analytics/audience    - Get audience demographics
\`\`\`

## 🎨 UI Components

### Core Components
- **Navbar**: Responsive navigation with user menu
- **Hero Section**: Landing page hero with call-to-action
- **Article Card**: Reusable article preview component
- **Comment Section**: Nested comments with replies
- **Editor**: Rich markdown editor with toolbar
- **Analytics Dashboard**: Charts and metrics visualization

### UI Library (shadcn/ui)
- Button, Input, Textarea, Select
- Card, Badge, Avatar, Separator
- Dialog, Dropdown Menu, Tabs
- Toast notifications, Loading states
- Form components with validation

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with featured articles
- `/explore` - Discover articles with search and filters
- `/topics` - Browse articles by topics
- `/article/[slug]` - Individual article reading page
- `/login` - User authentication
- `/register` - User registration

### Protected Pages
- `/dashboard` - User dashboard with analytics
- `/editor` - Article creation and editing
- `/settings` - User profile and account settings
- `/analytics` - Detailed analytics dashboard

## 🔒 Security Features

### Frontend Security
- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: JWT tokens in httpOnly cookies
- **Route Protection**: Authentication guards for protected routes

### Backend Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Controlled cross-origin requests

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Static generation and incremental static regeneration
- **Bundle Analysis**: Webpack bundle analyzer integration

### Backend
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: Redis integration for frequently accessed data
- **Compression**: Gzip compression for API responses

## 🧪 Testing

### Frontend Testing
\`\`\`bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
\`\`\`

### Backend Testing
\`\`\`bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
\`\`\`

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create new app on Railway/Heroku
2. Connect GitHub repository
3. Configure environment variables
4. Set up PostgreSQL addon
5. Deploy with automatic builds

### Database (Supabase/Railway)
1. Create PostgreSQL instance
2. Run migrations in production
3. Configure connection pooling
4. Set up backups and monitoring

## 📚 Development Workflow

### Git Workflow
\`\`\`bash
# Create feature branch
git checkout -b feature/article-editor

# Make changes and commit
git add .
git commit -m "feat: add article editor with markdown support"

# Push and create PR
git push origin feature/article-editor
\`\`\`

### Database Migrations
\`\`\`bash
# Generate migration
npm run migration:generate -- -n AddUserProfile

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [PostgreSQL](https://postgresql.org/) - Database
- [TypeORM](https://typeorm.io/) - ORM
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/devblog/issues) page
2. Create a new issue with detailed description
3. Join our [Discord community](https://discord.gg/devblog)
4. Email us at support@devblog.com

---

**Built with ❤️ by the DevBlog Team**

[Live Demo](https://devblog-demo.vercel.app) | [Documentation](https://docs.devblog.com) | [API Reference](https://api.devblog.com/docs)
