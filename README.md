# Acadence

**The Rhythm of Smart Campus Life**

A comprehensive campus management platform for attendance, scheduling, communication, and academic operations.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Architecture**: MERN-ready (frontend prepared for MongoDB, Express, React, Node.js backend)

## Features

- ✅ Role-Based Secure Access (Student, Teacher, Admin)
- ✅ QR-Based Attendance
- ✅ Attendance Analytics
- ✅ Broadcast Announcements (In-App + Email)
- ✅ Live Timetable Management
- ✅ Library Services (Issued/Returned + Due Counter)
- ✅ Student–Teacher Messaging
- ✅ Faculty Cabin Status (Available / Busy / Offline)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
acadence/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard routes (role-based)
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── ...
├── lib/                   # Utilities and modules
│   ├── auth/             # Authentication logic
│   ├── modules/          # Feature modules (microservice-ready)
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## Dashboard Architecture

The platform supports three roles:

- **Student**: View attendance, timetable, library, messaging
- **Teacher**: Manage attendance, timetable, messaging, cabin status
- **Admin**: Full system access, user management, broadcasts

Each feature is designed as an independent module for microservice architecture:

- Attendance Module
- Broadcast Module
- Timetable Module
- Library Module
- Messaging Module
- Faculty Presence Module

## Authentication

Currently, authentication is a placeholder. The login page routes to `/login` but does not perform actual authentication. This will be implemented with JWT/session-based authentication in the backend.

## Design System

- **Colors**: Navy/Indigo primary, Ivory/Off-white background, Muted teal accents
- **Typography**: Clean, academic, professional
- **Style**: Minimal, elegant, institutional

## License

Private - All rights reserved
