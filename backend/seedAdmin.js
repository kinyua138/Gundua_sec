const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/adminSchema');

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/schoolDB';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    seedAdmin();
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

async function seedAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({});
        
        if (existingAdmin) {
            console.log('Admin account already exists:', existingAdmin.email);
            console.log('Skipping seed...');
            process.exit(0);
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("gunduasec2025", salt);

        // Create the single admin account
        const admin = new Admin({
            name: "Gundua Admin",
            email: "gunduasecschools@gmail.com",
            password: hashedPassword,
            schoolName: "Gundua Secondary School"
        });

        await admin.save();
        console.log('Single admin account created successfully!');
        console.log('Email: gunduasecschools@gmail.com');
        console.log('Password: gunduasec2025');
        console.log('School: Gundua Secondary School');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}
