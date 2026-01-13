# Acadence Backend API

Authentication backend for Acadence academic platform.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
- `JWT_EXPIRE`: Token expiration (e.g., "7d", "24h")
- `PORT`: Server port (default: 5000)
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Run Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### Authentication

#### Student Login
```
POST /api/auth/student/login
Content-Type: application/json

{
  "email": "student@university.edu",  // OR
  "rollNumber": "ROLL123",
  "password": "password123"
}
```

#### Teacher Login
```
POST /api/auth/teacher/login
Content-Type: application/json

{
  "email": "teacher@university.edu",
  "password": "password123"
}
```

#### Admin Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "adminId": "ADMIN001",
  "password": "password123"
}
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "student"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Protected routes middleware
- ✅ Input validation
- ✅ CORS configuration

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
└── server.js        # Entry point
```

## Creating Test Users

Use MongoDB shell or a tool like MongoDB Compass to create test users:

```javascript
// Example: Create a student user
db.users.insertOne({
  email: "student@university.edu",
  rollNumber: "STU001",
  password: "$2a$10$...", // Hashed password
  role: "student",
  name: "John Doe",
  isActive: true
});
```

**Note:** Passwords must be hashed with bcrypt. Use the User model's pre-save hook or hash manually.

## Development

- Uses nodemon for auto-restart in development
- Error messages include stack traces in development mode
- Production mode hides sensitive error details
