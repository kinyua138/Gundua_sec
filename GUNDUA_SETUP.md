# Gundua Secondary School Management System Setup

## Overview
This system has been converted from a multi-school management system to a single school system for **Gundua Secondary School** with only one admin account.

## Admin Account Details
- **Email**: gunduasecschools@gmail.com
- **Password**: gunduasec2025
- **School Name**: Gundua Secondary School

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Database Setup
1. Ensure MongoDB is running on your system
2. Run the seed script to create the admin account:
```bash
node seedAdmin.js
```

#### Start Backend Server
```bash
npm start
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
Create a `.env` file in the frontend directory:
```
REACT_APP_BASE_URL=http://localhost:5000
```

#### Start Frontend Server
```bash
npm start
```

### 3. Accessing the System

#### Admin Login
- Navigate to the homepage
- Click "Login"
- Select "Admin"
- Use credentials:
  - Email: gunduasecschools@gmail.com
  - Password: gunduasec2025

#### Student/Teacher Login
- Students and teachers can still be added by the admin
- Students login with Roll Number and Name
- Teachers login with Email and Password

### 4. Key Changes Made

1. **Single Admin System**: Only one admin account exists (gunduasecschools@gmail.com)
2. **Fixed School Name**: All references now show "Gundua Secondary School"
3. **Registration Disabled**: Admin registration is no longer available
4. **Guest Mode Removed**: No guest login option
5. **Branding Updated**: All UI elements reflect Gundua Secondary School

### 5. Important Notes

- The admin account is created automatically when running the seed script
- No additional admin accounts can be created
- All data will be associated with "Gundua Secondary School"
- Existing multi-school functionality has been disabled

### 6. Troubleshooting

If you encounter issues:
1. Ensure MongoDB is running
2. Check that the seed script completed successfully
3. Verify the backend server is running on port 5000
4. Check browser console for any frontend errors
