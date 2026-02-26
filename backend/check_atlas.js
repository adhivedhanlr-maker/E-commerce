const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://adhivedhanlr_db_user:5nRIBYDZBoWqDFlk@cluster0.mmilbvc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

async function checkDB() {
    try {
        await mongoose.connect(MONGO_URI);
        const productSchema = new mongoose.Schema({}, { strict: false });
        const Product = mongoose.model('Product', productSchema, 'products');

        const count = await Product.countDocuments();
        console.log(`DATABASE_CHECK: Found ${count} products.`);

        if (count > 0) {
            const firstProduct = await Product.findOne();
            console.log(`DATABASE_CHECK: First product name: ${firstProduct ? firstProduct.get('name') : 'None'}`);
            console.log(`DATABASE_CHECK: First product category: ${firstProduct ? firstProduct.get('getCategory') || firstProduct.get('category') : 'None'}`);

        }

        process.exit(0);
    } catch (err) {
        console.error('DATABASE_CHECK_ERROR:', err.message);
        process.exit(1);
    }
}

checkDB();
