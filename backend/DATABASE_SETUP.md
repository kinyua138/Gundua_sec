# Database Setup Guide

This guide will help you set up the complete school database with all necessary entries for full functionality.

## Prerequisites
- MongoDB running locally or MongoDB Atlas connection
- Node.js installed
- Backend dependencies installed (`npm install`)

## Setup Steps

### 1. Initial Setup
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory:
```
MONGO_URL=mongodb://localhost:27017/schoolDB
PORT=5000
```

### 3. Database Seeding

#### Step 1: Create Admin Account
```bash
npm run seed-admin
```
This creates the main admin account:
- Email: gunduasecschools@gmail.com
- Password: gunduasec2025
- School: Gundua Secondary School

#### Step 2: Complete Database Population
```bash
npm run seed-database
```
This populates the database with:
- **4 Classes**: Form 1, Form 2, Form 3, Form 4
- **48 Subjects**: 12 subjects per class (Mathematics, English, Kiswahili, Sciences, etc.)
- **6 Teachers**: Each assigned to specific classes and subjects
- **20 Students**: 5 students per class with unique admission numbers

### 4. Default Login Credentials

#### Admin
- **Email**: gunduasecschools@gmail.com
- **Password**: gunduasec2025

#### Teachers
- **John Kiprop**: john.kiprop@gundua.ac.ke / teacher123
- **Mary Wanjiru**: mary.wanjiru@gundua.ac.ke / teacher123
- **Peter Mwangi**: peter.mwangi@gundua.ac.ke / teacher123
- **Sarah Kimani**: sarah.kimani@gundua.ac.ke / teacher123
- **David Otieno**: david.otieno@gundua.ac.ke / teacher123
- **Grace Mutua**: grace.mutua@gundua.ac.ke / teacher123

#### Students
- **Username**: Use admission number (1001-1020)
- **Password**: student123

### 5. Database Structure

#### Collections
- **admins**: School management accounts
- **students**: Student records with attendance and exam results
- **teachers**: Teacher records with subject assignments
- **sclasses**: School classes with fee structures
- **subjects**: Subjects linked to classes and teachers
- **notices**: School announcements
- **complains**: Student complaints/feedback
- **feestructures**: Fee configurations

#### Relationships
- Students → Classes → School
- Teachers → Classes → School
- Subjects → Classes → School
- Teachers → Subjects (assignment)
- Students → Subjects (exam results, attendance)

### 6. Verification

After seeding, verify the setup:
1. Check MongoDB collections for populated data
2. Test login with admin credentials
3. Verify teacher and student logins
4. Check class-subject-teacher assignments

### 7. Customization

To add more data:
- Modify `seedDatabase.js` for additional entries
- Run `npm run seed-database` again to repopulate
- Use the admin dashboard to add more entries

### 8. Troubleshooting

**Connection Issues**:
- Ensure MongoDB is running
- Check MONGO_URL in .env file
- Verify network connectivity

**Duplicate Data**:
- Run `npm run seed-database` to clear and repopulate
- Check for existing entries before seeding

**Missing Data**:
- Verify all models are properly imported
- Check console logs for error messages
