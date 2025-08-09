const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

// Disable admin registration - only allow single admin
const adminRegister = async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            return res.send({ message: 'Admin account already exists. Registration disabled.' });
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

        let result = await admin.save();
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Modified admin login for single admin with bcrypt
const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            const validated = await bcrypt.compare(req.body.password, admin.password);
            if (validated) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateAdmin = async (req, res) => {
    try {
        const { name, email, schoolName } = req.body;
        const admin = await Admin.findById(req.params.id);
        
        if (!admin) {
            return res.send({ message: "Admin not found" });
        }

        // Update fields if provided
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (schoolName) admin.schoolName = schoolName;

        const updatedAdmin = await admin.save();
        updatedAdmin.password = undefined;
        res.send(updatedAdmin);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.send({ message: "Admin not found" });
        }

        // Check if this is the last admin - prevent deletion
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 1) {
            return res.send({ message: "Cannot delete the last admin account" });
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.send({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { adminRegister, adminLogIn, getAdminDetail, updateAdmin, deleteAdmin };
