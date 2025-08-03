# DevBlog Deployment Guide

This guide explains how to deploy your DevBlog application with the frontend connected to the backend API.

## Overview

Your DevBlog application consists of:
- **Frontend**: Next.js application (currently deployed at https://dev-blog-three-blue.vercel.app/)
- **Backend**: NestJS API with PostgreSQL database

## Backend Deployment

### 1. Deploy Backend to Render/Railway/Heroku

First, you need to deploy your backend. Here are the steps for popular platforms:

#### Option A: Render (Recommended)
1. Push your backend code to GitHub
2. Connect your GitHub repo to Render
3. Create a new Web Service
4. Set build command: `npm install && npm run build`
5. Set start command: `npm run start:prod`
6. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`

#### Option B: Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. In your backend directory: `railway init`
4. Deploy: `railway up`
5. Add PostgreSQL: `railway add postgresql`
6. Set environment variables in Railway dashboard

### 2. Backend Environment Variables

Make sure your backend has these environment variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3000
```

### 3. Update Backend for Production

Ensure your backend allows CORS for your frontend domain. In your `main.ts`:

```typescript
app.enableCors({
  origin: ['https://dev-blog-three-blue.vercel.app', 'http://localhost:3000'],
  credentials: true,
});
```

## Frontend Deployment

### 1. Update Environment Variables

In your Vercel dashboard, add the environment variable:
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)

### 2. Redeploy Frontend

After setting the environment variable, trigger a new deployment in Vercel.

## Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Set up your .env file with DATABASE_URL and JWT_SECRET
npm run start:dev
```

### 2. Frontend Setup
```bash
# In root directory
npm install
# Make sure .env.local has NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

## API Endpoints

Your backend should expose these endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/me` - Get current user profile
- `GET /users/me/articles` - Get current user's articles
- `GET /users/:username` - Get user by username

### Articles
- `GET /articles` - Get all published articles
- `GET /articles/:id` - Get article by ID
- `POST /articles` - Create new article (authenticated)
- `PUT /articles/:id` - Update article (authenticated)
- `DELETE /articles/:id` - Delete article (authenticated)

### Analytics
- `GET /analytics` - Get analytics data (authenticated)

## Database Schema

Make sure your Prisma schema matches the expected structure:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  password  String
  avatar    String?
  bio       String?
  website   String?
  location  String?
  username  String?   @unique
  createdAt DateTime  @default(now())
  articles  Article[]
}

model Article {
  id          Int       @id @default(autoincrement())
  title       String
  excerpt     String?
  content     String?
  status      String    @default("draft")
  publishedAt DateTime?
  views       Int       @default(0)
  likes       Int       @default(0)
  comments    Int       @default(0)
  readTime    Int?
  authorId    Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  author      User      @relation(fields: [authorId], references: [id])
}
```

## Testing the Integration

### 1. Test Authentication
1. Visit your deployed frontend
2. Try registering a new account
3. Try logging in with the account
4. Check if the dashboard loads with user data

### 2. Test Article Features
1. Create a new article in the editor
2. Check if it appears in your dashboard
3. Verify articles appear on the home page

### 3. Common Issues

#### CORS Errors
- Make sure your backend allows your frontend domain in CORS settings
- Check that credentials are properly configured

#### 401 Unauthorized Errors
- Verify JWT tokens are being sent correctly
- Check that JWT_SECRET matches between requests

#### Database Connection Issues
- Verify DATABASE_URL is correct
- Run `npx prisma migrate deploy` in production
- Run `npx prisma generate` after schema changes

## Environment Variables Summary

### Frontend (.env.local or Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

## Next Steps

1. Deploy your backend to your preferred platform
2. Update the `NEXT_PUBLIC_API_URL` in Vercel
3. Test all functionality
4. Monitor logs for any issues

Your DevBlog application should now be fully connected and functional!