const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to DB');
    const User = mongoose.connection.collection('users');
    const adminEmail = 'admin@nexusstore.com';
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
        console.log('Admin user found:', JSON.stringify({
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            name: admin.name
        }, null, 2));
    } else {
        console.log('Admin user not found');
    }

    // Also list all roles in the system to see what's available
    const roles = await User.distinct('role');
    console.log('Available roles in DB:', roles);

    process.exit(0);
}).catch(err => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
});
