const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Import local User model if possible, or just define a quick test version
// Since we want to test the REAL logic, let's use the DB and bcrypt directly

mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected to DB');
    const User = mongoose.connection.collection('users');
    const adminEmail = 'admin@nexusstore.com';
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
        console.log('Admin user NOT found in DB');
        process.exit(1);
    }

    console.log('Admin user found. Role:', admin.role);
    const passwordToTest = 'Admin@123';

    const isMatch = await bcrypt.compare(passwordToTest, admin.password);
    console.log(`Bcrypt comparison for "${passwordToTest}":`, isMatch ? 'PASSED ✅' : 'FAILED ❌');

    if (!isMatch) {
        console.log('Stored Hashed Password:', admin.password);
    }

    process.exit(0);
}).catch(err => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
});
