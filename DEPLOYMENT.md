# Municipality App Deployment Guide

## Quick Fix for Connection Refused Error

The error `POST http://localhost:4000/graphql net::ERR_CONNECTION_REFUSED` occurs when the backend server is not running.

### Immediate Solution:
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. The server should now be accessible at `http://localhost:4000/graphql`

## Deployment Options

### Option 1: Docker Compose (Recommended for Local Development)

1. Make sure Docker and Docker Compose are installed
2. Run the entire stack:
   ```bash
   docker-compose up --build
   ```
3. Access:
   - Frontend: http://localhost:8080
   - Backend GraphQL: http://localhost:4000/graphql
   - MongoDB: localhost:27017

### Option 2: Manual Deployment

#### Backend:
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

#### Frontend:
1. Navigate to frontend directory:
   ```bash
   cd frontend/municipality-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build for production:
   ```bash
   npm run build --configuration=production
   ```
4. Serve the built files (using any static file server)

### Option 3: Cloud Deployment

#### For Production Deployment:

1. **Update Environment Configuration:**
   - Edit `frontend/municipality-frontend/src/environments/environment.prod.ts`
   - Change `apiUrl` to your production backend URL:
     ```typescript
     export const environment = {
       production: true,
       apiUrl: 'https://municipality-app-backend.onrender.com' // Your production backend URL
     };
     ```

2. **Backend Environment Variables:**
   - Update `backend/.env` with production values:
     ```
     PORT=4000
     MONGO_URI=mongodb://your-production-mongo-url
     JWT_SECRET=your-production-secret-key
     CLOUDINARY_CLOUD_NAME=your-cloudinary-name
     CLOUDINARY_API_KEY=your-cloudinary-key
     CLOUDINARY_API_SECRET=your-cloudinary-secret
     ```

3. **Deploy Backend:**
   - Use the provided Dockerfile or deploy to your preferred platform
   - Ensure MongoDB is accessible from your backend

4. **Deploy Frontend:**
   - Build with production configuration
   - Deploy to your static hosting service (Netlify, Vercel, etc.)
   - Ensure `_redirects` file is included for SPA routing (already configured)

## Environment Configuration

### Development:
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:4200` (Angular dev server)

### Production:
- Update `environment.prod.ts` with your production backend URL
- Ensure CORS is properly configured in backend for your frontend domain

## Troubleshooting

### Connection Refused Error:
1. Check if backend server is running
2. Verify the port (default: 4000)
3. Check firewall settings
4. Ensure no other service is using port 4000

### CORS Issues:
- Backend has CORS enabled for all origins in development
- For production, update CORS configuration in `backend/src/server.js`

### MongoDB Connection:
- Ensure MongoDB is running
- Check connection string in `.env` file
- For production, use a managed MongoDB service (MongoDB Atlas, etc.)

### SPA Routing Issues (404 errors):
- Angular is a Single Page Application (SPA)
- Direct URL access (like `/signup`) returns 404 because the server looks for a physical file
- Solution: `_redirects` file redirects all routes to `index.html` (already configured)
- The file is located at `frontend/municipality-frontend/public/_redirects`

## File Structure
```
municipality-app/
├── backend/                 # Node.js/Express backend
│   ├── src/server.js       # Main server file
│   ├── .env               # Environment variables
│   └── Dockerfile         # Backend Docker configuration
├── frontend/municipality-frontend/  # Angular frontend
│   ├── src/environments/  # Environment configurations
│   └── Dockerfile         # Frontend Docker configuration
└── docker-compose.yml     # Full stack deployment
```
