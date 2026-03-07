const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Atlas DB');

        const User = mongoose.connection.collection('users');
        const adminEmail = 'admin@nexusstore.com';

        // Check for exact match
        const admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('--- Admin User Found ---');
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('ID:', admin._id);
        } else {
            console.log('Admin user NOT found with exactly "admin@nexusstore.com"');

            // Check for case-insensitive match or similar emails
            const allAdmins = await User.find({ role: 'admin' }).toArray();
            console.log('Other users with admin role:', allAdmins.map(u => u.email));

            const caseMatch = await User.findOne({ email: { $regex: new RegExp(`^${adminEmail}$`, 'i') } });
            if (caseMatch) {
                console.log('Found a case-insensitive match:', caseMatch.email);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
