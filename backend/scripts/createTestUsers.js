/**
 * Script to create test users for development
 * Run: node scripts/createTestUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestUsers = async () => {
  try {
    await connectDB();

    // Clear existing test users (optional)
    await Student.deleteMany({ email: 'student@university.edu' });
    await Teacher.deleteMany({ email: 'teacher@university.edu' });
    await Admin.deleteMany({ email: 'admin@university.edu' });

    // Create Student
    const student = new Student({
      name: 'John Student',
      rollNumber: 'STU001',
      email: 'student@university.edu',
      password: 'student123',
      department: 'Computer Science',
      isActive: true,
    });
    await student.save();
    console.log('✓ Created Student: student@university.edu / student123');

    // Create Teacher
    const teacher = new Teacher({
      name: 'Dr. Jane Teacher',
      email: 'teacher@university.edu',
      password: 'teacher123',
      department: 'Computer Science',
      cabinStatus: 'Available',
      isActive: true,
    });
    await teacher.save();
    console.log('✓ Created Teacher: teacher@university.edu / teacher123');

    // Create Admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'admin123',
      isActive: true,
    });
    await admin.save();
    console.log('✓ Created Admin: admin@university.edu / admin123');

    console.log('\n✓ Test users created successfully!');
    console.log('\nLogin credentials:');
    console.log('Student: student@university.edu or STU001 / student123');
    console.log('Teacher: teacher@university.edu / teacher123');
    console.log('Admin: admin@university.edu / admin123');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
