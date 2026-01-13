# Quick Setup Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Configure Environment

Create a `.env` file in the `backend` folder:

```bash
# Copy the example file
cp env.example .env
```

Then edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/acadence
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a strong random string (at least 32 characters).

## 3. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod

# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 4. Create Test Users (Optional)

```bash
node scripts/createTestUsers.js
```

This creates:
- Student: `student@university.edu` / `student123`
- Teacher: `teacher@university.edu` / `teacher123`
- Admin: `ADMIN001` / `admin123`

## 5. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 6. Test the API

### Student Login
```bash
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@university.edu","password":"student123"}'
```

### Teacher Login
```bash
curl -X POST http://localhost:5000/api/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@university.edu","password":"teacher123"}'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"adminId":"ADMIN001","password":"admin123"}'
```

## API Base URL

All endpoints are prefixed with `/api/auth`:
- `POST /api/auth/student/login`
- `POST /api/auth/teacher/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me` (protected)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is accessible on the specified port (default: 27017)

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random secret (minimum 32 characters)
