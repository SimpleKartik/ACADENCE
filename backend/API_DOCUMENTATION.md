# Acadence Authentication API Documentation

## Base URL

```
http://localhost:5000/api/auth
```

## Authentication

All protected routes require JWT token in:
- **Cookie**: `acadence_token` (preferred)
- **Header**: `Authorization: Bearer <token>`

---

## Endpoints

### 1. Student Login

**POST** `/student/login`

Login as a student using email OR roll number.

#### Request Body

```json
{
  "email": "student@university.edu",  // OR
  "rollNumber": "STU001",
  "password": "password123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Student",
      "email": "student@university.edu",
      "rollNumber": "STU001",
      "role": "student",
      "department": "Computer Science",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

**400 - Validation Error**
```json
{
  "success": false,
  "message": "Password is required",
  "errors": {
    "password": "Password field cannot be empty"
  }
}
```

**401 - Invalid Credentials**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": {
    "credentials": "Email/Roll Number or password is incorrect"
  }
}
```

**500 - Server Error**
```json
{
  "success": false,
  "message": "Server error during login"
}
```

---

### 2. Teacher Login

**POST** `/teacher/login`

Login as a teacher using email.

#### Request Body

```json
{
  "email": "teacher@university.edu",
  "password": "password123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Dr. Jane Teacher",
      "email": "teacher@university.edu",
      "role": "teacher",
      "department": "Computer Science",
      "cabinStatus": "Available",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

Same as Student Login (400, 401, 500)

---

### 3. Admin Login

**POST** `/admin/login`

Login as an admin using email.

#### Request Body

```json
{
  "email": "admin@university.edu",
  "password": "password123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Admin User",
      "email": "admin@university.edu",
      "role": "admin",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

Same as Student Login (400, 401, 500)

---

### 4. Get Current User

**GET** `/me`

Get current authenticated user information.

#### Headers

```
Authorization: Bearer <token>
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Student",
      "email": "student@university.edu",
      "role": "student",
      "department": "Computer Science",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

**401 - Not Authorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**404 - User Not Found**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials or token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Security Features

✅ **Password Hashing**: bcrypt with 10 salt rounds  
✅ **JWT Tokens**: Signed with secret key  
✅ **Token Expiration**: Configurable (default: 7 days)  
✅ **Input Validation**: Email format, password length  
✅ **Error Handling**: Centralized, secure error messages  
✅ **No Password Exposure**: Passwords never returned in responses  

---

## Example Usage

### cURL

```bash
# Student Login
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@university.edu","password":"student123"}'

# Teacher Login
curl -X POST http://localhost:5000/api/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@university.edu","password":"teacher123"}'

# Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### JavaScript (Fetch)

```javascript
// Student Login
const response = await fetch('http://localhost:5000/api/auth/student/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'student@university.edu',
    password: 'student123',
  }),
});

const data = await response.json();

if (data.success) {
  // Store token
  localStorage.setItem('acadence_token', data.data.token);
  // Or set cookie
  document.cookie = `acadence_token=${data.data.token}; path=/; secure; samesite=strict`;
}
```

---

## JWT Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "student",
  "iat": 1705315200,
  "exp": 1705920000
}
```

---

## Notes

- All passwords must be at least 6 characters
- Email format is validated
- Tokens expire based on `JWT_EXPIRE` environment variable
- Only active users (`isActive: true`) can login
- Passwords are never returned in API responses
