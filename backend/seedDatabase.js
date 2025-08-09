const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/adminSchema');
const Student = require('./models/studentSchema');
const Teacher = require('./models/teacherSchema');
const Sclass = require('./models/sclassSchema');
const Subject = require('./models/subjectSchema');

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/schoolDB';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

async function seedDatabase() {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Sclass.deleteMany({});
        await Subject.deleteMany({});
        
        // Get admin school reference
        const admin = await Admin.findOne({});
        if (!admin) {
            console.log('Admin not found. Please run seedAdmin.js first.');
            process.exit(1);
        }

        console.log('Creating school classes...');
        
        // Create Classes
        const classes = [
            { sclassName: 'Form 1', school: admin._id, feeDetails: [
                { description: 'Tuition Fee', amount: 15000 },
                { description: 'Library Fee', amount: 2000 },
                { description: 'Sports Fee', amount: 1500 },
                { description: 'Computer Lab Fee', amount: 3000 }
            ], totalFee: 21500 },
            { sclassName: 'Form 2', school: admin._id, feeDetails: [
                { description: 'Tuition Fee', amount: 15000 },
                { description: 'Library Fee', amount: 2000 },
                { description: 'Sports Fee', amount: 1500 },
                { description: 'Computer Lab Fee', amount: 3000 }
            ], totalFee: 21500 },
            { sclassName: 'Form 3', school: admin._id, feeDetails: [
                { description: 'Tuition Fee', amount: 16000 },
                { description: 'Library Fee', amount: 2000 },
                { description: 'Sports Fee', amount: 1500 },
                { description: 'Computer Lab Fee', amount: 3000 },
                { description: 'Science Lab Fee', amount: 2500 }
            ], totalFee: 23000 },
            { sclassName: 'Form 4', school: admin._id, feeDetails: [
                { description: 'Tuition Fee', amount: 17000 },
                { description: 'Library Fee', amount: 2000 },
                { description: 'Sports Fee', amount: 1500 },
                { description: 'Computer Lab Fee', amount: 3000 },
                { description: 'Science Lab Fee', amount: 2500 },
                { description: 'Exam Fee', amount: 3000 }
            ], totalFee: 29000 }
        ];

        const createdClasses = await Sclass.insertMany(classes);
        console.log(`Created ${createdClasses.length} classes`);

        console.log('Creating subjects...');
        
        // Create Subjects for each class
        const subjects = [];
        const subjectNames = [
            'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 
            'Physics', 'History', 'Geography', 'CRE', 'Agriculture', 
            'Business Studies', 'Computer Studies'
        ];

        createdClasses.forEach(cls => {
            subjectNames.forEach(subjectName => {
                subjects.push({
                    subName: subjectName,
                    subCode: `${subjectName.substring(0, 3).toUpperCase()}${cls.sclassName.replace('Form ', '')}`,
                    sessions: subjectName === 'Mathematics' || subjectName === 'English' ? '8' : '4',
                    sclassName: cls._id,
                    school: admin._id
                });
            });
        });

        const createdSubjects = await Subject.insertMany(subjects);
        console.log(`Created ${createdSubjects.length} subjects`);

        console.log('Creating teachers...');
        
        // Create Teachers
        const teachers = [
            { name: 'John Kiprop', email: 'john.kiprop@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[0]._id },
            { name: 'Mary Wanjiru', email: 'mary.wanjiru@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[1]._id },
            { name: 'Peter Mwangi', email: 'peter.mwangi@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[2]._id },
            { name: 'Sarah Kimani', email: 'sarah.kimani@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[3]._id },
            { name: 'David Otieno', email: 'david.otieno@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[0]._id },
            { name: 'Grace Mutua', email: 'grace.mutua@gundua.ac.ke', password: 'teacher123', school: admin._id, teachSclass: createdClasses[1]._id }
        ];

        // Hash teacher passwords
        for (let teacher of teachers) {
            const salt = await bcrypt.genSalt(10);
            teacher.password = await bcrypt.hash(teacher.password, salt);
        }

        const createdTeachers = await Teacher.insertMany(teachers);
        console.log(`Created ${createdTeachers.length} teachers`);

        // Assign subjects to teachers
        const mathSubjects = createdSubjects.filter(s => s.subName === 'Mathematics');
        const englishSubjects = createdSubjects.filter(s => s.subName === 'English');
        const kiswahiliSubjects = createdSubjects.filter(s => s.subName === 'Kiswahili');
        
        // Assign Mathematics to John Kiprop
        for (let subject of mathSubjects) {
            await Subject.findByIdAndUpdate(subject._id, { teacher: createdTeachers[0]._id });
        }
        
        // Assign English to Mary Wanjiru
        for (let subject of englishSubjects) {
            await Subject.findByIdAndUpdate(subject._id, { teacher: createdTeachers[1]._id });
        }
        
        // Assign Kiswahili to Peter Mwangi
        for (let subject of kiswahiliSubjects) {
            await Subject.findByIdAndUpdate(subject._id, { teacher: createdTeachers[2]._id });
        }

        console.log('Creating students...');
        
        // Create Students
        const students = [];
        let admissionNum = 1000;

        createdClasses.forEach(cls => {
            // Create 5 students per class
            for (let i = 1; i <= 5; i++) {
                admissionNum++;
                students.push({
                    name: `Student ${i} ${cls.sclassName}`,
                    admissionNum: admissionNum,
                    password: 'student123',
                    sclassName: cls._id,
                    school: admin._id
                });
            }
        });

        // Hash student passwords
        for (let student of students) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(student.password, salt);
        }

        const createdStudents = await Student.insertMany(students);
        console.log(`Created ${createdStudents.length} students`);

        console.log('Database seeding completed successfully!');
        console.log('\nSummary:');
        console.log(`- Classes: ${createdClasses.length}`);
        console.log(`- Subjects: ${createdSubjects.length}`);
        console.log(`- Teachers: ${createdTeachers.length}`);
        console.log(`- Students: ${createdStudents.length}`);
        console.log('\nDefault Login Credentials:');
        console.log('Admin: gunduasecschools@gmail.com / gunduasec2025');
        console.log('Teachers: Use email addresses ending with @gundua.ac.ke / teacher123');
        console.log('Students: Use admission numbers as username / student123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
