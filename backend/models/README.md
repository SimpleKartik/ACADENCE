# MongoDB Schemas Documentation

## Overview

Acadence uses **separate collections** for each user role to maintain clear separation and allow role-specific fields.

## Collections

### 1. Students Collection

**Model:** `Student`  
**Collection:** `students`

#### Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `name` | String | Yes | No | Student's full name (2-100 chars) |
| `rollNumber` | String | Yes | Yes | Unique roll number (uppercase) |
| `email` | String | Yes | Yes | Student's email address |
| `password` | String | Yes | No | Hashed password (min 6 chars) |
| `role` | String | Yes | No | Always "student" (immutable) |
| `department` | String | Yes | No | Student's department |
| `isActive` | Boolean | No | No | Account status (default: true) |
| `createdAt` | Date | Auto | No | Creation timestamp |
| `updatedAt` | Date | Auto | No | Update timestamp |

#### Indexes

- `email` (single)
- `rollNumber` (single)
- `department` (single)
- `isActive` (single)
- `email + isActive` (compound)
- `rollNumber + isActive` (compound)

#### Login Methods

- Email + Password
- Roll Number + Password

---

### 2. Teachers Collection

**Model:** `Teacher`  
**Collection:** `teachers`

#### Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `name` | String | Yes | No | Teacher's full name (2-100 chars) |
| `email` | String | Yes | Yes | Teacher's email address |
| `password` | String | Yes | No | Hashed password (min 6 chars) |
| `role` | String | Yes | No | Always "teacher" (immutable) |
| `department` | String | Yes | No | Teacher's department |
| `cabinStatus` | String | No | No | Status: "Available", "Busy", "Offline" (default: "Offline") |
| `isActive` | Boolean | No | No | Account status (default: true) |
| `createdAt` | Date | Auto | No | Creation timestamp |
| `updatedAt` | Date | Auto | No | Update timestamp |

#### Indexes

- `email` (single)
- `department` (single)
- `cabinStatus` (single)
- `isActive` (single)
- `email + isActive` (compound)

#### Login Methods

- Email + Password

---

### 3. Admins Collection

**Model:** `Admin`  
**Collection:** `admins`

#### Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `name` | String | Yes | No | Admin's full name (2-100 chars) |
| `email` | String | Yes | Yes | Admin's email address |
| `password` | String | Yes | No | Hashed password (min 6 chars) |
| `role` | String | Yes | No | Always "admin" (immutable) |
| `isActive` | Boolean | No | No | Account status (default: true) |
| `createdAt` | Date | Auto | No | Creation timestamp |
| `updatedAt` | Date | Auto | No | Update timestamp |

#### Indexes

- `email` (single)
- `isActive` (single)
- `email + isActive` (compound)

#### Login Methods

- Email + Password

---

## Security Features

### Password Hashing

- All passwords are hashed using **bcrypt** with **10 salt rounds**
- Hashing occurs automatically via Mongoose `pre('save')` hook
- Passwords are never returned in queries (using `select: false`)

### Password Comparison

Each model includes a `comparePassword()` method:

```javascript
const isMatch = await student.comparePassword('plainPassword');
```

### JSON Serialization

All models automatically exclude passwords when converted to JSON:

```javascript
const userData = student.toJSON(); // password is excluded
```

---

## Usage Examples

### Create a Student

```javascript
const student = new Student({
  name: 'John Doe',
  rollNumber: 'STU001',
  email: 'john@university.edu',
  password: 'password123',
  department: 'Computer Science',
});

await student.save();
```

### Create a Teacher

```javascript
const teacher = new Teacher({
  name: 'Dr. Jane Smith',
  email: 'jane@university.edu',
  password: 'password123',
  department: 'Mathematics',
  cabinStatus: 'Available',
});

await teacher.save();
```

### Create an Admin

```javascript
const admin = new Admin({
  name: 'Admin User',
  email: 'admin@university.edu',
  password: 'password123',
});

await admin.save();
```

### Query Examples

```javascript
// Find student by email
const student = await Student.findOne({ email: 'john@university.edu' });

// Find student by roll number
const student = await Student.findOne({ rollNumber: 'STU001' });

// Find active teachers in a department
const teachers = await Teacher.find({
  department: 'Computer Science',
  isActive: true,
});

// Update teacher cabin status
await Teacher.findByIdAndUpdate(teacherId, {
  cabinStatus: 'Busy',
});
```

---

## Extensibility

All schemas are designed to be easily extensible:

- Add new fields to any schema
- Add new indexes for performance
- Add virtual fields for computed properties
- Add instance methods for custom logic
- Add static methods for collection-level operations

---

## Migration Notes

If migrating from a single User model:

1. Export existing users by role
2. Create separate collections
3. Import data into appropriate collections
4. Update application code to use new models
5. Remove old User model
